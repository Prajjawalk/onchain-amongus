import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { Contract } from "ethers"

/**
 * Deploys a contract named "RelayVault" using the deployer account and
 * constructor arguments set to Ironfish token address, RelayUltraverifier address, UserUltraverifier address, and Ironfish token price, decimals, and price decimals
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGameFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
    const { deployer } = await hre.getNamedAccounts()
    const { deploy } = hre.deployments

    const semaphoreAddress = "0x4674c14e6e0B8DeEC39b9328EdC7f75A4AA3eD92" // Semaphore in scroll sepolia
    const AMONGUS = await hre.ethers.getContract<Contract>("AMONGUS", deployer)
    const crewVerifier = await hre.ethers.getContract<Contract>("CrewVerifier", deployer)
    const killerVerifier = await hre.ethers.getContract<Contract>("KillerVerifier", deployer)

    await deploy("GameFactory", {
        from: deployer,
        // Contract constructor arguments
        args: [
            semaphoreAddress,
            await AMONGUS.getAddress(),
            await killerVerifier.getAddress(),
            await crewVerifier.getAddress()
        ],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true
    })
}

module.exports = deployGameFactory

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GameFactory
deployGameFactory.tags = ["GameFactory"]
