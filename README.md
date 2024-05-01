# Among Us

This project is an onchain version of the popular game "Among Us".

Among us is a very popular mobile game where there are a group of crew members and there is a killer among them. We have created an onchain version of Among Us where every player stake 10 $AMONGUS tokens to enter the game. The crew members and killer each gets one turn each to perform their actions -

-   Killer: kills one of the crew members every turn and gets his staked tokens
-   Crew members: decide and vote on every turn on who is the killer and the highest voted member gets kicked out
-   If killer gets identified and voted out then the remaining staked tokens gets redistributed among all the remaining crew members, killer loses his staked tokens but still gets the staked tokens of his kills
-   If the killer manages to kill most of the crew members and only one crew member is left in the end, the killer gets all the staked tokens.

## Contracts

Amongus Token - [0x01a9c16CaaE846A13d4Bd262dA24Cbb47175804e](https://sepolia.scrollscan.com/address/0x01a9c16CaaE846A13d4Bd262dA24Cbb47175804e)
Crew Verifier - [0xBef5d0f51d8019A999a1AfA72FEb5e0bFE0c071E](https://sepolia.scrollscan.com/address/0xBef5d0f51d8019A999a1AfA72FEb5e0bFE0c071E)
Killer Verifier - [0x91de4D34EcB20CFBA526afE5a199fAa79F92ba51](https://sepolia.scrollscan.com/address/0x91de4D34EcB20CFBA526afE5a199fAa79F92ba51)
Game - ["0xBe02DCd19FC7AE9b509bDfFEA08c6612C1a4deDF"](https://sepolia.scrollscan.com/address/0xBe02DCd19FC7AE9b509bDfFEA08c6612C1a4deDF)
GameFactory - ["0xe7343Df475F8D890B13C09085CC65617386F2cE7"](https://sepolia.scrollscan.com/address/0xe7343Df475F8D890B13C09085CC65617386F2cE7)

## 📜 Usage

Copy the `.env.example` file as `.env`:

```bash
cp .env.example .env
```

and add your environment variables or run the app in a local network.

### Local server

You can start your app locally with:

```bash
yarn dev
```

### Deploy the contract

1. Go to the `apps/contracts` directory and deploy your contract:

```bash
yarn deploy --network scrollSepolia
```

2. Update your `.env` file with your new contract address, the group id and the semaphore contract address.

3. Copy your contract artifacts from `apps/contracts/build/contracts/contracts` folder to `apps/web-app/contract-artifacts` folders manually. Or run `yarn copy:contract-artifacts` in the project root to do it automatically.
