//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "./Game.sol";

contract GameFactory {
    address amongUsToken;
    address semaphore;
    CrewVerifier crewVerifier;
    KillerVerifier killerVerifier;
    uint256 totalGames;

    Game[] public gamesArray;

    constructor(
        address semaphoreAddress,
        address _amongUsToken,
        KillerVerifier _killerVerifier,
        CrewVerifier _crewVerifier
    ) {
        semaphore = semaphoreAddress;
        amongUsToken = _amongUsToken;
        killerVerifier = _killerVerifier;
        crewVerifier = _crewVerifier;
    }

    function createNewGame(address admin) public {
        uint256 newGameId = totalGames + 1000;
        Game game = new Game(semaphore, newGameId, amongUsToken, killerVerifier, crewVerifier, admin);
        gamesArray.push(game);
    }

    function getAllGames() public view returns (Game[] memory) {
        return gamesArray;
    }
}
