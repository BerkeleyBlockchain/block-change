pragma solidity ^0.4.4;

import "blockchange.sol";

contract contractGenerator {

  uint contractCount = 0;
  mapping(uint => BlockChange) public blockchangeIndex;

  function contractGenerator(){}

  function createNewBlockchange(
        bytes32 _name,
        bytes32 _desc,
        uint _ratioOfTotalShareValueToJackpot,
        uint _cycleLength,
        uint _initWait
    ) {
      blockchangeIndex[contractCount++] = new BlockChange(_name, _desc,
        _ratioOfTotalShareValueToJackpot, _cycleLength, _initWait);
  }

}
