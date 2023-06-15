// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20Capped, Ownable{
    constructor() ERC20("Doge Inu","DGI") ERC20Capped(500000*10**18) {}

    function mint(address to,uint256 amount)public onlyOwner {
        _mint(to,amount*10**18);
    }

    function burn(address account,uint ammount)public onlyOwner {
        _burn(account,ammount);
    }

    function GetBalance(address add) public view returns(uint) {
        return balanceOf(add)/(10**18);
    }
}
