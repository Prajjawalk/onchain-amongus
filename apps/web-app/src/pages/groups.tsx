import { Identity } from "@semaphore-protocol/identity"
import getNextConfig from "next/config"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import { createPublicClient, createWalletClient, custom, getContract, http } from "viem"
import { scrollSepolia } from "viem/chains"
import Feedback from "../../contract-artifacts/Feedback.json"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import deployedContracts from "../../contracts/deployedContracts"
import { useAccount } from "wagmi"

const { publicRuntimeConfig: env } = getNextConfig()

export default function GroupsPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _users, refreshUsers, addUser } = useContext(SemaphoreContext)
    const [_loading, setLoading] = useState(false)
    const [_identity, setIdentity] = useState<Identity>()
    const [games, setGames] = useState<any>()
    const [joinedGame, setJoinedGame] = useState<string>()
    const [walletClient, setWalletClient] = useState<any>()

    const account = useAccount()

    useEffect(() => {
        setWalletClient(
            createWalletClient({
                chain: scrollSepolia,
                transport: custom(window.ethereum as any)
            })
        )
    }, [])

    const publicClient = createPublicClient({
        chain: scrollSepolia,
        transport: http("https://sepolia-rpc.scroll.io")
    })

    const gameFactoryContract = getContract({
        address: deployedContracts[534351].GameFactory.address,
        abi: deployedContracts[534351].GameFactory.abi,
        // 1b. Or public and/or wallet clients
        client: { public: publicClient, wallet: walletClient }
    })

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (!identityString) {
            router.push("/")
            return
        }

        setIdentity(new Identity(identityString))
    }, [])

    useEffect(() => {
        if (_users.length > 0) {
            setLogs(`${_users.length} user${_users.length > 1 ? "s" : ""} retrieved from the group 🤙🏽`)
        }
    }, [_users])

    useEffect(() => {
        async function getGames() {
            const _games = await gameFactoryContract.read.getAllGames()
            setGames(_games)
        }

        getGames()
    }, [setGames, gameFactoryContract])

    const createGame = useCallback(async () => {
        if (!_identity) {
            return
        }

        setLoading(true)
        setLogs(`Creating a new game...`)

        try {
            const response = await gameFactoryContract.write.createNewGame([account.address as `0x${string}`], {
                account: account.address as `0x${string}`
            })

            setLogs(`You created a new game 🎉 Tx: ${response}`)
            const gamesArray = await gameFactoryContract.read.getAllGames()
            setGames(gamesArray)
        } catch (e) {
            console.log(e)
            setLogs("Some error occurred, please try again!")
        }

        setLoading(false)
    }, [_identity])

    const joinGame = useCallback(
        async (game: `0x${string}`) => {
            setJoinedGame(game)

            const gameContract = getContract({
                address: game,
                abi: deployedContracts[534351].Game.abi,
                // 1b. Or public and/or wallet clients
                client: { public: publicClient, wallet: walletClient }
            })
            console.log(_identity)
            await gameContract.write.addPlayer([_identity?.commitment], {
                account: account.address
            })
        },
        [setJoinedGame, joinedGame, publicClient, walletClient, _identity, account]
    )

    const refreshGames = useCallback(async () => {
        if (!_identity) {
            return
        }

        const gamesArray = await gameFactoryContract.read.getAllGames()
        setGames(gamesArray)
    }, [_identity, setGames, gameFactoryContract])

    const userHasJoined = () => joinedGame?.length > 1

    return (
        <>
            <h2>Active games</h2>

            <p>
                The following is the list of active games. Each games have maximum allowed players upto 10 so once the
                game is full you cannot join them. You can either join existing game or create an new one.
            </p>

            <div className="divider"></div>

            <div className="text-top">
                <h3>Feedback users ({_users.length})</h3>
                <button className="button-link" onClick={refreshGames}>
                    Refresh
                </button>
            </div>

            {games?.length > 0 && (
                <div>
                    {games.map((game: `0x${string}`, i: number) => (
                        <div key={i} className="flex flex-row">
                            <p className="box box-text">{game}</p>
                            <button onClick={() => joinGame(game)}>Join</button>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <button className="button" onClick={createGame} disabled={_loading || !_identity || userHasJoined()}>
                    <span>Create new game</span>
                    {_loading && <div className="loader"></div>}
                </button>
            </div>

            <div className="divider"></div>

            <Stepper
                step={2}
                onPrevClick={() => router.push("/")}
                onNextClick={_identity && userHasJoined() ? () => router.push(`/game/${joinedGame}`) : undefined}
            />
        </>
    )
}
