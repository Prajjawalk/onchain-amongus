import * as fs from "fs"

async function main() {
    const contractArtifactsPath = "apps/contracts/build/contracts/contracts/"
    const webAppArtifactsPath = "apps/web-app/contract-artifacts"

    await fs.promises.copyFile(
        `${contractArtifactsPath}/Feedback.sol/Feedback.json`,
        `${webAppArtifactsPath}/Feedback.json`
    )
    await fs.promises.copyFile(
        `${contractArtifactsPath}/CrewVerifier.sol/CrewVerifier.json`,
        `${webAppArtifactsPath}/CrewVerifier.json`
    )
    await fs.promises.copyFile(
        `${contractArtifactsPath}/KillerVerifier.sol/KillerVerifier.json`,
        `${webAppArtifactsPath}/KillerVerifier.json`
    )
    await fs.promises.copyFile(`${contractArtifactsPath}/Game.sol/Game.json`, `${webAppArtifactsPath}/Game.json`)
    await fs.promises.copyFile(
        `${contractArtifactsPath}/GameFactory.sol/GameFactory.json`,
        `${webAppArtifactsPath}/GameFactory.json`
    )
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
