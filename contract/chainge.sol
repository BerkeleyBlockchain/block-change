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

contract Ballot {

  struct Share {
    uint public costInEther,
    address owner,
    uint expirationDate,
    bool assigned;
  }

    mapping(address => uint256) public sharesOwned;
    bytes32 name,
    bytes32 desc,
    bool satisfied,
    Share[] shares,
    uint jackpot,
    bool isReturnable;
    uint principle;
    address initialInvestor;
    uint public deadline;

  modifier ballotSatisfied() { if(!ballot.satisfied) _; }
  modifier pricipleMissed() {
    if(now >= deadline && jackpot <= principle && isReturnable) _;

  }

  function Ballot(bytes32 _name, bytes32 _desc,bool _isReturnable, uint _principle, uint _deadline){
    name = _name;
    desc = _desc;
    isReturnable = _isReturnable;
    principle = _principle;
    deadline = _deadline;
    jackpot = 0;
    satisfied = false;
    shares = new Share[principle];
  }

  function findAvailableShare() returns (Share) {
    for(int i = 0; i < shares.length; i++) {
      if(shares[i].assigned && shares[i].expirationDate >= now) {
        shares[i].assigned = false;
      }
      if(!shares[i].assigned) {
        return shares[i];
      }
    }
  }

  function returnPrinciple() principleMissed {
      initialInvestor.send(principle);
  }

  function payOut() ballotSatisfied {
    for(int i = 0; i < shares.length; i++) {
      if(sharesOwned[shares[i].owner] > 0) {
        uint shareCount = sharesOwned[shares[i].owner];
        sharesOwned[shares[i].owner] = 0;
        shares[i].owner.send(jackpot * (shareCount / shares.length));
      }
    }
  }

  function() {
    throw;
  }
}
