pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public owner;

    event MintEvent(address indexed to, uint256 amount);
    event BurnEvent(address indexed from, uint256 amount);

    constructor() ERC20("InterBlockchain Token", "IBT") {
        owner = msg.sender;
    }

    function mint(uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(msg.sender, amount);
        emit MintEvent(msg.sender, amount);
    }

    function burn(uint256 amount) external {
        require(msg.sender == owner, "Only owner can burn");
        _burn(msg.sender, amount);
        emit BurnEvent(msg.sender, amount);
    }
}
