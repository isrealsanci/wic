// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

contract WICGAME is Initializable, OwnableUpgradeable {
    
    uint256 public totalAllClaims;
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant COOLDOWN_PERIOD = 6 hours;

    event ChancesClaimed(address indexed user, uint256 timestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
    }

    function claimDailyChances() external {
        address user = _msgSender();

        require(
            block.timestamp >= lastClaimTime[user] + COOLDOWN_PERIOD,
            "WICGAME: 6 hour cooldown not met"
        );

        lastClaimTime[user] = block.timestamp;
        totalAllClaims++;

        emit ChancesClaimed(user, block.timestamp);
    }
}