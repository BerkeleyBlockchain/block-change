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

//question to Kion and Max. Is it necessary that we must have only one initial investor? Couldn't there be several initial investors who
// willing to make donations?
contract Ballot {

  struct Share {
    uint public costInEther,
    address owner,
    uint expirationDate, //how do we determine this? - Nihar
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
    shares = new Share[principle]; //why should there be a number of shares equivalent to the principle? - Nihar
    //again we need to do something here with expiration date
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

  function intitalInvestement(address _initinv){
    require(msg.value == principle);
    initialInvestor = _initinv;

  }
  function returnPrinciple() principleMissed {
      initialInvestor.send(principle);
  }

  function buyShare(address _owner){
    Share share = findAvailableShare();
    require(msg.value == share.costInEther);
    share.assigned = true;
    share.owner = _owner;
    jackpot = jackpot + share.costInEther;
    //do something here with expiration date or maybe not
  }

  function determineCost(){
    //not sure how we intend on determining the current cost of the share
  }
  //helper function to find all available shares
  function findAllAvailableShares() returns (Share[]){
    Share[] avaShares;
    uint count = 0;
    for(int i = 0; i < shares.length; i++) {
      if(shares[i].assigned && shares[i].expirationDate >= now) {
        shares[i].assigned = false;
      }
      if(!shares[i].assigned) {
        avaShares[count] = shares[i];
        count = count + 1;
      }
    }
    return avaShares;
  }
  function changeCostOfAllAvailable(uint newCost){
    Share[] avaShares = findAllAvailableShares();
    for(int i =0; i < avaShares.length; i++){
      avaShares[i].costInEther = newCost;
    }
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
