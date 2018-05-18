# Crypto Trader CCXT Starterbot Javascript

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

