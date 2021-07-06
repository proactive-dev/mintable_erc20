# Mintable ERC20

- Hardhat for your local blockchain, deploying, and testing smart contracts.
- React for building a frontend, using many useful pre-made components and hooks.
- Ant for your UI. (You can easily changed to another library you prefer)
- IPFS for publishing your app.
- Tenderly / The Graph / Etherscan / Infura / Blocknative for infrastructure.

# Quick Start

Prerequisites: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/proactive-dev/mintable_erc20.git
```

> install and start your Hardhat chain: 

```bash
cd mintable_erc20
yarn install
yarn chain
```

> in a second terminal window, start your frontend:

```bash
cd mintable_erc20
yarn start
```

> in a third terminal window, deploy your contract:

```bash
cd mintable_erc20
yarn deploy
```

You should now have a local blockchain, with `MintableERC20.sol` deployed, and your app running on https://localhost:3000.
