pragma solidity ^0.4.4;

contract BlockChange {

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

  function BlockChange(bytes32 _name, bytes32 _desc, uint _ratioToShares, uint _cycleLength, uint _initWait){
    name = _name;
    desc = _desc;
    cycleLength = _cycleLength;
    deadline = now + cycleLength * 1 days;
    initWait = now + _initWait * 1 days;
    ratioToShares = _ratioToShares;
    shares = new address[](1000);
  }

}
