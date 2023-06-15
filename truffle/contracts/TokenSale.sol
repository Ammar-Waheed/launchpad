// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private token;
    uint256 public tokenPrice;
    uint256 public totalTokens;
    uint256 public tokensSold;

    mapping(address => uint256) private presaleBalances;
    uint256 public totalPresaleTokens;
    uint256 public presaleTokensClaimed;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event TokensClaimed(address indexed buyer, uint256 amount);

    constructor(
        address _token,
        uint256 _tokenPrice,
        uint256 _totalTokens
    ) {
        token = IERC20(_token);
        tokenPrice = _tokenPrice;
        totalTokens = _totalTokens;
        tokensSold = 0;
        totalPresaleTokens = 0;
        presaleTokensClaimed = 0;
    }

    function buyTokens(uint256 _amount) external payable {
        require(_amount > 0, "Amount should be greater than zero");
        require(msg.value == tokenPrice.mul(_amount), "Invalid amount");
        require(tokensSold.add(_amount) <= totalTokens, "Insufficient tokens");
        token.safeTransfer(msg.sender, _amount);
        tokensSold = tokensSold.add(_amount);
        emit TokensPurchased(msg.sender, _amount);
    }

    function addToPresale(address[] calldata _participants, uint256[] calldata _amounts) external onlyOwner {
        require(_participants.length == _amounts.length, "Invalid input length");
        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            uint256 amount = _amounts[i];
            require(amount > 0, "Amount should be greater than zero");
            presaleBalances[participant] = presaleBalances[participant].add(amount);
            totalPresaleTokens = totalPresaleTokens.add(amount);
        }
    }

    function claimPresaleTokens() external {
        uint256 amount = presaleBalances[msg.sender];
        require(amount > 0, "No presale tokens to claim");
        presaleBalances[msg.sender] = 0;
        presaleTokensClaimed = presaleTokensClaimed.add(amount);
        token.safeTransfer(msg.sender, amount);
        emit TokensClaimed(msg.sender, amount);
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(_amount <= token.balanceOf(address(this)), "Insufficient contract balance");
        token.safeTransfer(owner(), _amount);
    }

    function updateTokenPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price should be greater than zero");
        tokenPrice = _newPrice;
    }
}
