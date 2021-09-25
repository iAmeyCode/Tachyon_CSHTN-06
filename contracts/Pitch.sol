pragma solidity^0.8.1;

import "./Fundraising.sol";
import "./Tachyontoken.sol";

contract Pitch {
    
    string public name;
  
    uint  public currentFee;
    uint  public EligibleHold;
    uint  public balance;
    address public admin;
    IERC20  public tac;
    
    address [] projectlist;
    
    event PhaseStart(uint _projectindex, uint deadline, address _address);
    
    struct Project{
    Fundraising _fundraiser;
    string identifier;
    uint   goal;
    uint   deadline;
    uint   minimumAcceptingContribution;
    address  _owner;
        
    }
    
    mapping(uint => Project) public projects;
    uint index;
    
    // ,address tacAddress
    constructor(address adminaddress ) { 
        admin = adminaddress;
        // tac = IERC20(tacAddress);
    }
    
    modifier onlyOwner(){
        require(msg.sender == admin);
        _;
        
    }
    
    function Pay(string memory _identifier ,uint _goal, uint _deadline , uint _minimumAcceptingContribution, address _owner) public payable  {
        // require(tac.balanceOf(msg.sender) >= EligibleHold, "Insufficeint TAC");
        Fundraising fundraiser = new Fundraising(this, _identifier, _goal, _deadline, _minimumAcceptingContribution, _owner);
        projects[index].identifier = _identifier;
        projects[index]._fundraiser = fundraiser;
        projects[index].goal = _goal;
        projects[index].deadline = block.timestamp + _deadline;
        projects[index].minimumAcceptingContribution = _minimumAcceptingContribution;
        emit PhaseStart(index, uint(projects[index].deadline), address(fundraiser));
        address newProject = address(fundraiser);
        projectlist.push(newProject);
        index++;
        
      
        
        _owner = msg.sender;
    }
    
    function Eligibility(uint tokens)public onlyOwner{
        EligibleHold = tokens;
    }
    
    function balanceTAC(address caller) public view returns(uint){
      return tac.balanceOf(caller);
    }
    
    
    function seeAdmin() public view returns(address){
        return admin;
        
    }
    
    function BoostedProjects() public view returns(address [] memory){
        return projectlist;
    }

    
}