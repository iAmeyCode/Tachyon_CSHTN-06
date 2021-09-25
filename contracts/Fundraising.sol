pragma solidity^0.8.1;

import "./Pitch.sol";

contract Fundraising{
    
   
    mapping(address => uint) public contributors;
    address public admin;
    uint public totalContributors;
    uint public minimumAcceptingContribution;
    uint public deadline; //getting a timestamp//
    uint public goal;
    uint public amountRaised;
    string public name;
    uint public totalVotes;
    
    Pitch parentContract;
    
    
    constructor (Pitch _parentContract, string memory _identifier,  uint _goal, uint _deadline, uint _minimumAcceptingContribution, address _owner){
        name = _identifier;
        goal = _goal;
        deadline = (block.timestamp + _deadline);
        minimumAcceptingContribution = _minimumAcceptingContribution;
        admin = _owner;
        parentContract = _parentContract;
        
    }
 
    
    modifier onlyOwner(){
        require(msg.sender == admin);
        _;
        
    }
    
    
    struct Request{
        string description;
        address payable receipient;
        uint value;
        uint noOfVoters;
        bool completed;
        mapping(address => bool) voters;
    }
    
    uint newrequests;
    mapping(uint => Request) public requests;
    Request [] public requestlist;
    
    event ContributeEvent(address sender, uint value);
    event CreateRequestEvent(string _description, address _recipient, uint _value);
    event MakePaymentEvent(address recipient, uint value);
    
    
    function acceptsUntil() public view returns(uint){
         require(deadline - block.timestamp > 0, "This Contract is expired");
         return deadline - block.timestamp;
    }
    
    function contribute() public payable{
        require(block.timestamp < deadline, "This fundraiser has expired");
        require(msg.value >= minimumAcceptingContribution,"Contribution amount is too less ");
        
        if(contributors[msg.sender] == 0){
            totalContributors++;
        }
        
        contributors[msg.sender] += msg.value;
        amountRaised += msg.value;
        
        emit ContributeEvent(msg.sender, msg.value);
    }
    
    function currentBalance()public view returns(uint){
        uint bal = address(this).balance;
        return bal;
    } 
    
    function getRefund()  public {
        require(block.timestamp > deadline,"The project is still on going");
        require(goal > amountRaised);
        require(contributors[msg.sender] > 0);
        
        address payable recipient = payable(msg.sender);
        uint value = contributors[msg.sender];
        recipient.transfer(value);
        contributors[msg.sender] = 0;
        
        
    }
    
    function createRequest(string memory _description,address payable _recipient ,uint _value) public onlyOwner{
        Request storage newRequest = requests[newrequests++];
        newRequest.description = _description;
        newRequest.receipient = _recipient;
        newRequest.value = _value;
        newRequest.noOfVoters = 0;
        newRequest.completed = false;
    
        emit CreateRequestEvent(_description, _recipient ,_value);
      }
      
    function voteRequest(uint _index)public{
        Request storage thisRequest = requests[_index];
        require(contributors[msg.sender] > 0  ,"Not a contributor");
        require(thisRequest.voters[msg.sender] == false);
        
        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
        totalVotes++;
        
    }
    
    function makePayment(uint _index)payable public onlyOwner{
        Request storage thisRequest = requests[_index];
        require(thisRequest.completed == false);
        require(thisRequest.noOfVoters > totalContributors / 2,"This request doesnt have a majority");
        require(thisRequest.value < address(this).balance,"Insufficient funds");
        thisRequest.receipient.transfer(thisRequest.value);
        thisRequest.completed = true;
        
        emit MakePaymentEvent(thisRequest.receipient, thisRequest.value);
    }
    
    function Viewprojectname() public view returns(string memory){
        return name;
    }
    
     function thegoal() public view returns(uint){
        return goal;
    }
    
     function minimumAccepting() public view returns(uint){
        return minimumAcceptingContribution;
    }
    
     function seeowner() public view returns(address){
        return admin;
    }
    
      function amounttill() public view returns(uint){
        return amountRaised;
    }
}