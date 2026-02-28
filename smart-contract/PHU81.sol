// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PHU81
 * @notice ERC-20 utility token for PhuAI Nexus Pro — used as an alternative
 *         payment method for AI credits on Polygon network.
 */
contract PHU81 is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 81_000_000 * 10 ** 18; // 81 million tokens

    constructor(address initialOwner)
        ERC20("PhuAI Token", "PHU81")
        Ownable(initialOwner)
    {
        _mint(initialOwner, MAX_SUPPLY);
    }

    /**
     * @notice Mint additional tokens (capped to MAX_SUPPLY).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "PHU81: max supply exceeded");
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from the caller's balance.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
