pragma solidity ^0.4.2;

contract Chainge {

  address public owner;

  bytes32 name;
  bytes32 desc;
  uint jackpot;
  address[] shares;
  uint curShareIndex = 0;
  uint cycleLength;
  uint deadline;
  uint initWait;
  uint ratioToShares;
  bool satisfied = false;


  mapping(address => uint256) public sharesOwned;

  function Chainge(bytes32 _name, bytes32 _desc, uint _ratioToShares, uint _cycleLength, uint _initWait){
    name = _name;
    desc = _desc;
    cycleLength = _cycleLength;
    deadline = now + cycleLength * 1 days;
    initWait = now + _initWait * 1 days;
    ratioToShares = _ratioToShares;
    shares = new address[1000];
  }

  // returns cost of share based on ratioToShares and jackpot
  function costOfShare() returns (uint) {
    uint cost = jackpot;
    cost = cost * ratioToShares / (100 * 1000);
    return cost;
  }

  modifier initalPeriod() { if(now >= initWait) _; }

  // add money to initial amount
  function fundraise() initalPeriod {
    require(msg.sender == owner);
    jackpot += msg.value;
  }

  // purchase a share
  function purchase() {
    require(now >= initWait);
    uint cost = costOfShare();
    require(msg.value >= cost);
    numShares = msg.value / cost;
    if(numShares > (1000 - (curShareIndex + 1))) {
      numShares = (1000 - (curShareIndex + 1));
    }
    for(int i = curShareIndex; i < numShares; i++) {
      shares[i] = msg.sender;
    }
    curShareIndex += numShares;
    sharesOwned[msg.sender] += numShares;
    msg.sender.send(msg.value - (numShares * cost));
    jackpot += msg.value - (numShares * cost);
  }

  // release all current shares
  function releaseShares() cycleFinished {
    require(now >= deadline);
    curShareIndex = 0;
    deadline = now + cycleLength * 1 days;
  }

  function payOut() {
    require(satisfied);
    for(int i = 0; i < curShareIndex; i++) {
        if(sharesOwned[shares[i]] > 0) {
          uint numShares = sharesOwned[shares[i]];
          sharesOwned[shares[i]] = 0;
          uint payment = numShares * jackpot / 1000;
          shares[i].send(payment);
          jackpot -= payment;
        }
    }
    if(jackpot > 0) {
      owner.send(jackpot);
      jackpot = 0;
    }
  }

  modifier require(bool _cond) {
    if(!_cond) throw;
    _;
  }
}
