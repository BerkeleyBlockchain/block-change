pragma solidity ^0.4.4;

contract BlockChange {

  address public owner;

  bytes32 public name;
  bytes32 public desc;
  uint public jackpot;
  uint public cycleLength;
  uint public deadline;
  uint public initWait;
  uint public ratioOfTotalShareValueToJackpot;
  uint public shareLimit = 1000;
  bool public satisfied = false;

  uint public sharesSold = 0;
  uint public shareholderCount = 0;
  mapping(uint => address) shareholderIndex;
  mapping(address => uint256) public shareholderToSharesOwned;

  function BlockChange(
      bytes32 _name,
      bytes32 _desc,
      uint _ratioOfTotalShareValueToJackpot,
      uint _cycleLength,
      uint _initWait
  ) {
    name = _name;
    desc = _desc;
    cycleLength = _cycleLength;
    deadline = now + cycleLength * 1 days;
    initWait = now + _initWait * 1 days;
    ratioOfTotalShareValueToJackpot = _ratioOfTotalShareValueToJackpot;
  }

  /* returns the cost of each share based on ratioOfTotalShareValueToJackpot
  and jackpot */
  function costOfShare() returns (uint) {
    uint cost = jackpot * ratioOfTotalShareValueToJackpot / (100 * shareLimit);
    return cost;
  }

  modifier initialPeriod() { if (now <= initWait) _; }

  /* add money to initial amount */
  function fundraise() initialPeriod payable {
    jackpot = jackpot + msg.value;
  }

  /* purchase a share */
  function purchase() require(now >= initWait) payable {
    uint cost = costOfShare();
    if (msg.value < cost) throw;
    uint orderSize = msg.value / cost;
    
    /* Cannot buy more than the number of shares that are left */
    uint sharesLeft = shareLimit - sharesSold;
    if (orderSize > (sharesLeft - 1)) {
      orderSize = (sharesLeft - 1);
    }

   /* 0 is default value for a nonexistent key, and a shareholder
      cannot own 0 shares, so this is a new shareholder. */
    if (shareholderToSharesOwned[msg.sender] == 0) {
      shareholderIndex[shareholderCount] = msg.sender;
      shareholderToSharesOwned[msg.sender] = orderSize;
      shareholderCount = shareholderCount + 1;
    } else {
      shareholderToSharesOwned[msg.sender] += orderSize;
    }
    sharesSold += orderSize;

    /* Add change funds to the jackpot */
    if (!msg.sender.send(msg.value - (orderSize * cost))) throw;
    jackpot += msg.value - (orderSize * cost);
  }

  function eventSuccess() require(now >= deadline) {
    if (msg.sender != owner) throw;

    /* Iterate through shareholders and pay out rewards */
    for(uint i = 0; i < shareholderCount; i++) {
        if (shareholderToSharesOwned[shareholderIndex[i]] > 0) {
          uint numShares = shareholderToSharesOwned[shareholderIndex[i]];
          shareholderToSharesOwned[shareholderIndex[i]] = 0;
          uint payment = numShares * jackpot / shareLimit;
          shareholderIndex[i].send(payment);
          jackpot -= payment;
        }
    }

    /* Leftover change goes to the creator of the contract */
    if (jackpot > 0) {
      owner.send(jackpot);
      jackpot = 0;
    }

    satisfied = true;
  }

  function eventFail() require(now >= deadline) {
    if (msg.sender != owner) throw;

    /* Reset everything */
    for(uint i = 0; i < shareholderCount; i++) {
        delete shareholderToSharesOwned[shareholderIndex[i]];
        delete shareholderIndex[i];
    }
    sharesSold = 0;
    shareholderCount = 0;
    deadline = now + cycleLength * 1 days;

    satisfied = false;
  }

  modifier require(bool _cond) {
    if (!_cond) throw;
    _;
  }
}
