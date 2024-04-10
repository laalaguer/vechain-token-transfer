# VeChain Tokens

This web program ONLY runs in the Sync 1 environment.

## Demo
[https://laalaguer.github.io/vechain-token-transfer/](https://laalaguer.github.io/vechain-token-transfer/)

<img src="./interface.png" style="max-width:500px;"/>

## Token Viewer/Transfer on Sync
1. Runs in [VeChain-Sync-Browser](https://github.com/vechain/thor-sync.electron)
2. Depends on web page environment [Connex](https://github.com/vechain/connex)

## Add New Tokens

```bash
src/test_contracts.json # add test tokens
src/main_contracts.json # add main tokens
src/assets/?.png # add some pngs as icons
```

## Project setup

Uses Node Version 12 (`nvm use v12`)

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Prepare for publish (move to gh pages folder)
```
npm run publish
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
