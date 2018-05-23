/**
 * This file is part of the Crypto Trader JavaScript starter bot
 *
 * @author Niko van Meurs <niko@riddles.io>
 * @author Dino Hensen <dino@riddles.io>
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */
'use strict';

const talib = require('./talib');
const promiseTimeout = require('./promiseTimeout');

const log = console.error; // eslint-disable-line no-console

const SHORTER_SMA_PERIOD = 2;
const LONGER_SMA_PERIOD = 10;

module.exports = class Bot {
    constructor(exchange) {
        this.exchange = exchange;
        this.gameSettings = {
            timebank: null, // time in milliseconds
            time_per_move: null, // time in milliseconds
            player_names: null,
            your_bot: null,
            candle_interval: null, // time in seconds
            candle_format: null,
            candles_total: null,
            candles_given: null,
            initial_stack: null, // amount of USDT the bot starts with
            transaction_fee_percent: 0.0,
        };

        log('Using talib version: ' + talib.version);
        // for (var i in talib.functions) {
        //     log(talib.functions[i].name);
        // }
    }

    pluckOHLCV(data, key) {
        const ohlcvKeyMap = {
            date: 0,
            open: 1,
            high: 2,
            low: 3,
            close: 4,
            volume: 5,
        };
        return data.map(ohlcv => ohlcv[ohlcvKeyMap[key]]);
    }

    async step(timebank, round) {
        return promiseTimeout(
            this.gameSettings.time_per_move,
            new Promise(async (resolve, reject) => {
                log('Round: ' + round);
                log('Timebank left: ' + timebank);
                let symbols = ['BTC/USDT', 'ETH/BTC', 'ETH/USDT'];
                return Promise.all(symbols.map(s => this.simpleSMACrossOver(s)))
                    .then(() => resolve())
                    .catch(reject);
            })
        );
    }

    getCloseData(symbol) {
        return this.exchange
            .fetchOHLCV(symbol, '30m', undefined, LONGER_SMA_PERIOD + 1)
            .then(data => data.reverse())
            .then(data => this.pluckOHLCV(data, 'close'));
    }

    getSmaLists(closeData) {
        if (closeData.length > LONGER_SMA_PERIOD && closeData.length > SHORTER_SMA_PERIOD) {
            let shorterSMA = this.talibExecute({
                name: 'SMA',
                startIdx: 0,
                endIdx: closeData.length - 1,
                inReal: closeData,
                optInTimePeriod: SHORTER_SMA_PERIOD,
            });
            let longerSMA = this.talibExecute({
                name: 'SMA',
                startIdx: 0,
                endIdx: closeData.length - 1,
                inReal: closeData,
                optInTimePeriod: LONGER_SMA_PERIOD,
            });
            return Promise.all([shorterSMA, longerSMA]);
        } else {
            throw new Error('not yet enough data to determine SMA');
        }
    }

    async simpleSMACrossOver(symbol) {
        let closeData = this.getCloseData(symbol);
        let smaLists = closeData
            .then(closeData => this.getSmaLists(closeData))
            .then(smas => {
                return {
                    shorterSMA: smas[0].result.outReal,
                    longerSMA: smas[1].result.outReal,
                };
            })
            .catch(err => {
                throw new Error(err);
            });

        let lastClose = closeData.then(data => data.slice(-1)[0]);

        return Promise.all([lastClose, smaLists]).then(([lastClose, smaLists]) => {
            if (lastClose && smaLists) {
                const { shorterSMA, longerSMA } = smaLists;
                let lastShorterSMA = shorterSMA.slice(-1)[0];
                let lastLongerSMA = longerSMA.slice(-1)[0];
                let diff = (lastShorterSMA - lastLongerSMA) / lastClose;
                // log(diff);

                let type;
                if (diff > 0.03) {
                    type = 'sell';
                } else if (diff < -0.01) {
                    type = 'buy';
                } else {
                    return;
                }
                return this.orderMaximum(symbol, type, lastClose);
            }
        });
    }

    async orderMaximum(symbol, type, price) {
        let market = this.exchange.market(symbol);
        return this.exchange.fetchBalance().then(balance => {
            // log(market);

            let requiredCurrencybaseOrQuoteKey = type == 'buy' ? 'quote' : 'base';
            log(`type: ${type}`);
            log(`requiredCurrencybaseOrQuoteKey: ${requiredCurrencybaseOrQuoteKey}`);
            log(
                `market[requiredCurrencybaseOrQuoteKey]: ${market[requiredCurrencybaseOrQuoteKey]}`
            );
            let requiredCurrencyBalance = balance[market[requiredCurrencybaseOrQuoteKey]].free;
            log(`balance: ${JSON.stringify(balance)}`);
            log(`requiredCurrencyBalance: ${requiredCurrencyBalance}`);
            let orderAmount = requiredCurrencyBalance;
            if (type == 'buy') {
                orderAmount /= price;
            }
            if (orderAmount > 0) {
                log(`About to ${type} ${orderAmount}`);
                log(`price: ${price}`);
                return this.exchange.createOrder(symbol, 'market', type, orderAmount);
            }
        });
    }

    talibExecute(params) {
        return new Promise((resolve, reject) => {
            talib.execute(params, (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }

    async stepErrorHandler(err) {
        // implement your error handler
        log(`STEP ERROR: ${err}`);
    }
};
