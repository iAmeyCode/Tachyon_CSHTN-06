pragma solidity^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tachyontoken is ERC20{
    
    address public admin;
    
    constructor() ERC20('TACHYON','TAC'){
        _mint(msg.sender,1000000 * 10 ** 18);
        admin = msg.sender;
        
    }
    
    function mint(address to, uint amount) external {
        require(msg.sender == admin, "Access denied");
        _mint(to,amount);
    }
    
    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }
    

    //     function approve(address spender, uint256 amount) public virtual override returns (bool) {
    //     _approve(admin, spender, amount);
    //     return true;
    // }
}