"use client"

import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"

export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (identityString) {
            const identity = new Identity(identityString)

            setIdentity(identity)

            setLogs("Your Semaphore identity was retrieved from the browser cache 👌🏽")
        } else {
            setLogs("Create your Semaphore identity 👆🏽")
        }
    }, [])

    const createIdentity = useCallback(async () => {
        const identity = new Identity()

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())

        setLogs("Your new Semaphore identity was just created 🎉")
    }, [])

    return (
        <>
            <h2 className="font-size: 3rem;">Onchain Among Us</h2>

            <p>
                Among us is a very popular mobile game where there are a group of crew members and there is a killer
                among them. We have created an onchain version of Among Us where every player stake 10 $AMONGUS tokens
                to enter the game. The crew members and killer each gets one turn each to perform their actions -
            </p>
            <ol>
                <li>Killer: kills one of the crew members every turn and gets his staked tokens</li>
                <li>
                    Crew members: decide and vote on every turn on who is the killer and the highest voted member gets
                    kicked out
                </li>
                <li>
                    If killer gets identified and voted out then the remaining staked tokens gets redistributed among
                    all the remaining crew members, killer loses his staked tokens but still gets the staked tokens of
                    his kills
                </li>
                <li>
                    If the killer manages to kill most of the crew members and only one crew member is left in the end,
                    the killer gets all the staked tokens.
                </li>
            </ol>

            <p>Looks interesting? Lets start the play!</p>

            <div className="divider"></div>

            <div className="text-top">
                <h3>First create anonymous identity</h3>
                {_identity && (
                    <button className="button-link" onClick={createIdentity}>
                        New
                    </button>
                )}
            </div>

            {_identity ? (
                <div>
                    <div className="box">
                        <p className="box-text">Trapdoor: {_identity.trapdoor.toString()}</p>
                        <p className="box-text">Nullifier: {_identity.nullifier.toString()}</p>
                        <p className="box-text">Commitment: {_identity.commitment.toString()}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <button className="button" onClick={createIdentity}>
                        Create identity
                    </button>
                </div>
            )}

            <div className="divider"></div>

            <Stepper step={1} onNextClick={_identity && (() => router.push("/groups"))} />
        </>
    )
}
