/**
 * This file is part of the Crypto Trader JavaScript starter bot
 *
 * @author Niko van Meurs <niko@riddles.io>
 * @author Dino Hensen <dino@riddles.io>
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */
'use strict';

const talib = require('talib');

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = class Bot {
    constructor(exchange) {
        this.exchange = exchange;
        this.gameSettings = {
            timebank: null,
            time_per_move: null,
            player_names: null,
            your_bot: null,
            candle_interval: null,
            candle_format: null,
            candles_total: null,
            candles_given: null,
            initial_stack: null,
            transaction_fee_percent: 0.0,
        };

        console.error('Using talib version: ' + talib.version);
        // for (var i in talib.functions) {
        //     console.error(talib.functions[i].name);
        // }
    }

    async step(timebank) {
        // await this.exchange.fetchOHLCV('ETH/BTC', '30m').then(data => {
        //     console.error(data);
        // });

        // loading markets is not necessary
        let closeData = [
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            2,
            1.1,
            1.1,
            1.1,
        ];

        return this.talibExecute({
            name: 'SMA',
            startIdx: 0,
            endIdx: closeData.length - 1,
            inReal: closeData,
            optInTimePeriod: 5,
        }).then(console.error);

        // return this.exchange.createOrder('BTC/USDT', 'market', 'buy', 0.06);
        // be sure to either await or return the createOrder, else the order will not be flushed in time
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
        console.error(err);
    }
};
