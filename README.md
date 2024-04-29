# Among Us

This project is an onchain version of the popular game "Among Us".

Among us is a very popular mobile game where there are a group of crew members and there is a killer among them. We have created an onchain version of Among Us where every player stake 10 $AMONGUS tokens to enter the game. The crew members and killer each gets one turn each to perform their actions -

-   Killer: kills one of the crew members every turn and gets his staked tokens
-   Crew members: decide and vote on every turn on who is the killer and the highest voted member gets kicked out
-   If killer gets identified and voted out then the remaining staked tokens gets redistributed among all the remaining crew members, killer loses his staked tokens but still gets the staked tokens of his kills
-   If the killer manages to kill most of the crew members and only one crew member is left in the end, the killer gets all the staked tokens.

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
