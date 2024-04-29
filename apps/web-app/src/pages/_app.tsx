import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import "@rainbow-me/rainbowkit/styles.css"
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { scrollSepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import useSemaphore from "../hooks/useSemaphore"

import { Inter } from "@next/font/google"

const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: String(process.env.NEXT_PUBLIC_PROJECTID),
    chains: [scrollSepolia],
    ssr: true // If your dApp uses server side rendering (SSR)
})

const inter = Inter({ subsets: ["latin"] })
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const semaphore = useSemaphore()
    const [_logs, setLogs] = useState<string>("")

    useEffect(() => {
        semaphore.refreshUsers()
        semaphore.refreshFeedback()
    }, [])

    return (
        <div className={inter.className}>
            <Head>
                <title>Semaphore template</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ebedff" />
            </Head>

            <div>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <RainbowKitProvider>
                            <div className="header">
                                <ConnectButton />
                            </div>
                            <div className="container">
                                <div id="body">
                                    <SemaphoreContext.Provider value={semaphore}>
                                        <LogsContext.Provider
                                            value={{
                                                _logs,
                                                setLogs
                                            }}
                                        >
                                            <Component {...pageProps} />
                                        </LogsContext.Provider>
                                    </SemaphoreContext.Provider>
                                </div>
                            </div>

                            <div className="footer">
                                {_logs.endsWith("...")}
                                <p>{_logs || `Current step: ${router.route}`}</p>
                            </div>
                        </RainbowKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </div>
        </div>
    )
}
