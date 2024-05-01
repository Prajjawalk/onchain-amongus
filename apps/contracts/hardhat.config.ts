import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@semaphore-protocol/hardhat"
import "@typechain/hardhat"
import { config as dotenvConfig } from "dotenv"
import "hardhat-gas-reporter"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import "solidity-coverage"
import { config } from "./package.json"
import "hardhat-deploy"
import "hardhat-deploy-ethers"

dotenvConfig({ path: resolve(__dirname, "../../.env") })

function getNetworks(): NetworksUserConfig {
    if (!process.env.INFURA_API_KEY || !process.env.ETHEREUM_PRIVATE_KEY) {
        return {}
    }

    const accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`]
    const infuraApiKey = process.env.INFURA_API_KEY

    return {
        goerli: {
            url: `https://goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 5,
            accounts
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
            chainId: 11155111,
            accounts
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${infuraApiKey}`,
            chainId: 80001,
            accounts
        },
        "optimism-goerli": {
            url: `https://optimism-goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 420,
            accounts
        },
        "arbitrum-goerli": {
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: 421613,
            accounts
        },
        arbitrum: {
            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
            accounts
        }
    }
}

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    namedAccounts: {
        deployer: {
            // By default, it will take the first Hardhat account as the deployer
            default: 0
        }
    },
    networks: {
        hardhat: {
            chainId: 1337
        },
        scrollSepolia: {
            url: "https://sepolia-rpc.scroll.io",
            chainId: 534351,
            accounts: [`0x${process.env.ETHEREUM_PRIVATE_KEY}`]
        },
        ...getNetworks()
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        outDir: config.paths.build.typechain,
        target: "ethers-v6"
    },
    etherscan: {
        apiKey: {
            "scroll-sepolia": String(process.env.SCROLLSCAN_API_KEY) // make yours at scrollscan.com
        },
        customChains: [
            {
                network: "scroll-sepolia",
                chainId: 534351,
                urls: {
                    apiURL: "https://api-sepolia.scrollscan.com/api",
                    browserURL: "https://sepolia.scrollscan.com/"
                }
            }
        ]
    }
}

export default hardhatConfig
