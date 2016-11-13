pragma solidity ^0.4.2;
contract token {function transfer(address receiver, uint amount) { }}

contract Chainge {

  
  Ballot[] ballots;

  function Chainge() {
  }

  function generateBallot(bytes32 name, bytes32 desc,bool isReturnable, uint principle, uint deadline) returns (Ballot){
      Ballot b = new Ballot(name, desc, isReturnable, principle, deadline);
      return b;
  }
 

}

contract Ballot{
  struct Share {
    uint public costInEther;
  }
  struct User{
    Share[] shares,
    address addr,
    uint donation;
  }


    bytes32 name,
    bytes32 desc,
    bool satisfied,
    User[] users,
    uint jackpot,
    bool isReturnable;
    mapping(address => uint256) public userSpace;
    uint principle;
    address initialInvestor;
    uint public deadline;

  modifier ballotSatisfied() { if(!ballot.satisfied) _; }
  modifier pricipleMissed() { if(now >= deadline && jackpot < principle); }

  function Ballot(bytes32 _name, bytes32 _desc,bool _isReturnable, uint _principle, uint _deadline){
    name = _name;
    desc = _desc;
    isReturnable = _isReturnable;
    principle = _principle;
    deadline = _deadline;
    jackpot = 0;
    satisfied = false;
  }

  function buyShare()
  function returnPrinciple() principleMissed {
    for(int i = 0; i <users.length; i++) {
      address user = users[i].addr;
      user.send(users[i].donation);
    }
  }

  function payOut() ballotSatisfied {
    for(int i = 0; i < ballot.shares.length; i++) {

    }
    userSpace[winner]
  }

  function() {
    throw;
  }
}
