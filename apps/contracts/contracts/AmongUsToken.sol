// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AMONGUS is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor() ERC20("AMONGUS", "Among Us Token") {}

    // Function to mint new tokens (only callable by the owner)
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    // Function to pause the contract (only callable by the owner)
    function pause() public onlyOwner {
        _pause();
    }

    // Function to unpause the contract (only callable by the owner)
    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function decimals() public view override returns (uint8) {
        return 18;
    }

    function transferWithMetadata(address to, uint256 amount, bytes memory metadata) public {
        _transfer(msg.sender, to, amount);

        emit TransferWithMetadata(msg.sender, to, amount, metadata);
    }

    // Event to include metadata
    event TransferWithMetadata(address indexed from, address indexed to, uint256 value, bytes metadata);
}
