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
    uint public costInEther,
    address owner;
  }



    bytes32 name,
    bytes32 desc,
    bool satisfied,
    Share[] shares,
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
  function returnPrinciple() principleMissed {
    for(int i = 0; i <shares.length; i++) {
      address user = shares[i].owner;
      user.send(sha)
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
