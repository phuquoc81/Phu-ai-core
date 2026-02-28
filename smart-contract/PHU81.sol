// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PHU81 — PhuAI Nexus Utility Token
/// @notice ERC-20 token used for Web3 payment fallback on PhuAI Nexus
contract PHU81 is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 81_000_000 * 10 ** 18;

    constructor(address initialOwner)
        ERC20("PhuAI Nexus Token", "PHU81")
        Ownable(initialOwner)
    {
        _mint(initialOwner, MAX_SUPPLY);
    }

    /// @notice Burn tokens (deflationary mechanism)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
