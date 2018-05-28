# Crypto Trader CCXT Starterbot Javascript

[![Build Status](https://travis-ci.org/riddlesio/cryptotrader-ccxt-starterbot-javascript.svg?branch=master)](https://travis-ci.org/riddlesio/cryptotrader-ccxt-starterbot-javascript)

Javascript ***CCXT*** starterbot for the Crypto Trader game on Riddles.io

Github repo: https://github.com:riddlesio/cryptotrader-ccxt-starterbot-javascript.git

## Prerequisites
- Unix environment
- NodeJS

## Setup

First clone the project and run yarn to install dependencies

```
git clone git@github.com:riddlesio/cryptotrader-ccxt-starterbot-javascript.git
(for HTTPS: git clone https://github.com/riddlesio/cryptotrader-ccxt-starterbot-javascript.git)
yarn
```

# Usage

1. Sign up at [Riddles.io](https://www.riddles.io)
2. Create your bot zip-file:
Out of the box this CCXT integrated startedbot implements a buy and hold (HODL) strategy.
After cloning the repository and running yarn, you can build a zip-file by running `yarn run build`.
This will output a zip-file in the `./build` folder that is created the first time you run the build command.
3. Upload your bot zip-file: Go to the [Crypto Trader](https://playground.riddles.io/competitions/crypto-trader) game and press the Upload Bot button in the upper right corner. Select your bot zip-file and wait for the game to run.
4. Implement a winning strategy: improve your bot and win!

## Running tests

To run the Jest test suite run the `test` command.

```
yarn run test
```

There is also a smoke test, this pipes test match input to your bot so that you can quickly verify
if at least your bot can run on a given match input.

```
> yarn run smoke-test
yarn run v0.23.3
$ bin/smoke_test
Smoke test OK for ./test_input/single_action
Smoke test OK for ./test_input/full_match
Done in 1.01s.
```


> Note: this does not verify the output of your bot. If you want to do that you will need to run
your game together with the game engine itself.

## Build a zip-file to upload

Run the `build` command to create a zip-file in the build folder. This command internally uses
webpack to put all sources in one file to get a smaller zip-file than when zipping your sources
plus node_modules unprocessed.

```
yarn run build
```

