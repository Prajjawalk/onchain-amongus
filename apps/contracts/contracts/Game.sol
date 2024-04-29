//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./KillerVerifier.sol";
import "./CrewVerifier.sol";

contract Game {
    using SafeERC20 for IERC20;

    uint256 public gameId;
    ISemaphore public semaphore;
    address public amongUsToken;
    KillerVerifier killerVerifier;
    CrewVerifier crewVerifier;

    mapping(uint256 => mapping(address => uint32)) public votes;
    mapping(uint256 => mapping(address => bool)) voted;
    mapping(address => bool) public killed;
    address[] public playersList;
    uint256 public killerVault;
    uint256 public crewVault;
    mapping(address => bool) withdrew;
    uint256 public killerId;

    bool turn;
    mapping(uint256 => uint32) totalVotes;
    uint32 totalPlayers;
    bool gameStarted;
    bool gameEnded;
    address identifiedKiller;
    address public admin;

    modifier onlyKiller(bytes calldata killerProof, bytes32[] calldata killerPublicInputs) {
        require(killerVerifier.verify(killerProof, killerPublicInputs));
        _;
    }

    modifier onlyCrew(bytes calldata crewProof, bytes32[] calldata crewPublicInputs) {
        require(crewVerifier.verify(crewProof, crewPublicInputs));
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(
        address semaphoreAddress,
        uint256 _gameId,
        address _amongUsToken,
        KillerVerifier _killerVerifier,
        CrewVerifier _crewVerifier,
        address _admin
    ) {
        semaphore = ISemaphore(semaphoreAddress);
        gameId = _gameId;
        amongUsToken = _amongUsToken;
        killerVerifier = _killerVerifier;
        crewVerifier = _crewVerifier;

        semaphore.createGroup(gameId, 20, _admin);
        turn = true;
        gameEnded = false;
        gameStarted = false;
        admin = _admin;
    }

    function startGame(uint256 _killerId) onlyAdmin external {
        gameStarted = true;
        killerId = _killerId;
    }

    function addPlayer(uint256 identityCommitment) external {
        // stake tokens to enter the game
        IERC20(amongUsToken).safeApprove(address(this), 1000000000);
        IERC20(amongUsToken).safeTransferFrom(msg.sender, address(this), 1000000000);

        semaphore.addMember(gameId, identityCommitment);
        playersList.push(msg.sender);
        crewVault += 1000000000;
        totalPlayers += 1;
    }

    function voteKiller(
        uint256 round,
        address whoIsKiller,
        bytes calldata crewProof,
        bytes32[] calldata crewPublicInputs
    ) public onlyCrew(crewProof, crewPublicInputs) {
        require(voted[round][msg.sender] == false, "VOTED");
        require(killed[msg.sender] == false, "KILLED");
        require(turn == true, "KILLER's TURN");
        votes[round][whoIsKiller] += 1;
        totalVotes[round] += 1;
        voted[round][msg.sender] = true;

        if (totalVotes[round] == totalPlayers) {
            address killer;
            uint32 maxVotes;
            for (uint32 i = 0; i < playersList.length; i++) {
                if ((votes[round][playersList[i]] > maxVotes) && !killed[msg.sender]) {
                    maxVotes = votes[round][playersList[i]];
                    killer = playersList[i];
                }
            }
            kickOutPlayer(killer);
            turn = false;
        }
    }

    function killCrew(
        address crew,
        bytes calldata killerProof,
        bytes32[] calldata killerPublicInputs
    ) public onlyKiller(killerProof, killerPublicInputs) {
        require(killed[msg.sender] == false, "KILLED");
        require(turn == false, "CREW's turn");

        if (killed[msg.sender] == true) {
            gameEnded = true;
            identifiedKiller = msg.sender;
            IERC20(amongUsToken).safeTransfer(address(this), killerVault);
        } else {
            if (totalPlayers == 2) {
                gameEnded = true;
                identifiedKiller = msg.sender;
                IERC20(amongUsToken).safeTransfer(address(this), killerVault + crewVault);
            } else {
                crewVault -= 1000000000;
                killerVault += 1000000000;
                killed[crew] = true;
                totalPlayers -= 1;
            }
        }
        turn = true;
    }

    function withdraw(
        bytes calldata crewProof,
        bytes32[] calldata crewPublicInputs
    ) public onlyCrew(crewProof, crewPublicInputs) {
        require(gameEnded == true);
        require(!withdrew[msg.sender]);
        require(totalPlayers > 2);
        require(identifiedKiller != address(0) && (msg.sender != identifiedKiller));
        withdrew[msg.sender] = true;
        IERC20(amongUsToken).safeTransfer(address(this), (crewVault / (totalPlayers - 1)));
    }

    function kickOutPlayer(address player) internal {
        killed[player] = true;
        totalPlayers -= 1;
    }

    function getAllPlayers() external view returns (address[] memory) {
        return playersList;
    }
}
