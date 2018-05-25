/**
 * This file is part of the Crypto Trader JavaScript starter bot
 *
 * @author Niko van Meurs <niko@riddles.io>
 * @author Dino Hensen <dino@riddles.io>
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */
'use strict';

const promiseTimeout = require('./promiseTimeout');

const log = console.error; // eslint-disable-line no-console

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
    }

    async step(timebank, round) {
        return promiseTimeout(
            this.gameSettings.time_per_move,
            new Promise(resolve => {
                log('Round: ' + round);
                log('Timebank left: ' + timebank);
                let symbol = 'BTC/USDT';
                let UsdtBalance = this.exchange.fetchBalance().then(balance => balance.USDT.free);
                let BtcUsdtPrice = this.exchange
                    .fetchOHLCV(symbol, '30m', undefined, 1)
                    .then(ohlcvs => ohlcvs[0][4]);

                let promise = Promise.all([UsdtBalance, BtcUsdtPrice]).then(values => {
                    const [UsdtBalance, BtcUsdtPrice] = values;
                    let amountToBuy = UsdtBalance / BtcUsdtPrice;
                    if (amountToBuy > 0.001) {
                        return this.exchange.createOrder(symbol, 'market', 'buy', amountToBuy);
                    }
                });

                resolve(promise);
            })
        );
    }

    stepErrorHandler(err) {
        // implement your error handler
        log(`STEP ERROR: ${err}`);
    }
};
