pragma solidity ^0.4.2;
contract token {function transfer(address receiver, uint amount) { }}

contract Chainge {

  struct Share {
    uint public costInEther,
    address winner;
  }

  struct Ballot {
    bytes32 name,
    bytes32 desc,
    bool satisfied,
    Share[] shares,
    uint jackpot;
  }

  mapping(address => uint256) public userSpace;
  uint principle;
  address initialInvestor;
  uint public deadline;
  Ballot ballot;

  function Chainge(address _initialInvestor, uint _principle, uint _lengthInDays, bytes32 _name, bytes32 _desc) {
    principle = _principle;
    ballot.jackpot = _principle;
    ballot.name = _name;
    ballot.desc = _desc;
    initialInvestor = _initialInvestor;
    deadline = now + _lengthInDays * 1 days;
  }

  modifier ballotSatisfied() { if(!ballot.satisfied) _; }
  modifier deadlinePassed() { if(now >= deadline) _; }

  function returnPrinciple() deadlinePassed {


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
