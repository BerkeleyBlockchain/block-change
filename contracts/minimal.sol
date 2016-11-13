pragma solidity ^0.4.4;

contract BlockChange {

  address public owner;

  bytes32 name;
  uint jackpot;
  uint curShareIndex = 0;
  uint cycleLength;
  uint deadline;
  uint initWait;
  uint ratioToShares;
  bool satisfied = false;

  function BlockChange(bytes32 _name, uint _ratioToShares, uint _cycleLength, uint _initWait){
    name = _name;
    cycleLength = _cycleLength;
    deadline = now + cycleLength * 1 days;
    initWait = now + _initWait * 1 days;
    ratioToShares = _ratioToShares;
  }

  modifier require(bool _cond) {
    if(!_cond) throw;
    _;
  }
}
