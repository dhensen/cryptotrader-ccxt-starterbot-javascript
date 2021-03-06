/**
 * This file is part of the Crypto Trader JavaScript starter bot
 *
 * @author Dino Hensen <dino@riddles.io>
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */
'use strict';

const utils = require('./utils');
const sem = require('semaphore')(1);

module.exports = class CommandDelegator {
    constructor(bot, dataProxy) {
        this.bot = bot;
        this.dataProxy = dataProxy;
        this.round = 1; // round counter is one-based
    }

    handleLine(data) {
        sem.take(
            function () {
                // stop if line doesn't contain anything
                if (data.length === 0) {
                    return;
                }

                const lines = data.trim().split('\n');

                while (0 < lines.length) {
                    const line = lines.shift().trim();
                    const lineParts = line.split(' ');

                    // stop if lineParts doesn't contain anything
                    if (lineParts.length === 0) {
                        return;
                    }

                    // get the input command and convert to camel case
                    const command = utils.toCamelCase(lineParts.shift());

                    // invoke command if function exists and pass the data along
                    // then return response if exists
                    if (this[command] instanceof Function) {
                        const response = this[command](lineParts);

                        if (response instanceof Promise) {
                            response.then(() => {
                                sem.leave();
                            });
                        } else {
                            sem.leave();
                        }
                    } else {
                        process.stderr.write(
                            `Unable to execute command: ${command}, with data: ${lineParts}\n`
                        );
                    }
                }
            }.bind(this)
        );
    }

    /**
     *
     * @param {Array} data
     * @returns {String | null}
     */
    action(data) {
        if (data[0] === 'order') {
            const timebank = parseInt(data[1], 10);
            return this.bot
                .step(timebank, this.round++)
                .catch(this.bot.stepErrorHandler)
                .then(() => {
                    this.dataProxy.flushOrders();
                });
        }
    }

    /**
     * Writes a setting to ...
     * @param {Array} data
     */
    settings(data) {
        // acts on self? or bot?
        const key = data[0];
        const value = data[1];

        // set key to value
        switch (key) {
            case 'candle_format':
                this.bot.gameSettings[key] = value;
                this.dataProxy.setCandleFormat(value);
                break;
            case 'timebank':
            case 'time_per_move':
            case 'candle_interval':
            case 'candles_total':
            case 'candles_given':
            case 'initial_stack':
                this.bot.gameSettings[key] = Number.parseInt(value);
                break;
            default:
                this.bot.gameSettings[key] = value;
        }
    }
    /**
     * Called when the engine sends an `update` message.
     * This function either updates the game data (field or round) or
     * the player data.
     *
     * @param {Array} data
     */
    update(data) {
        const command = data.shift();

        if (command === 'game') {
            this.updateGame(data);
            return;
        }
    }

    /**
     * Updates the game state with data provided by the engine
     *
     * @param {Array} data
     */
    updateGame(data) {
        switch (data[0]) {
            case 'next_candles':
                this.dataProxy.addCandleByString(data[1], this.dataProxy.getMarkets().length == 0);
                break;
            case 'stacks':
                this.dataProxy.updateStacks(data[1]);
                break;
            default:
                console.error(`Cannot parse game data input with key ${data[0]}`);
        }
    }
};
