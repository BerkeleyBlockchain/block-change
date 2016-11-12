pragma solidity ^0.4.2;
contract token {function transfer(address receiver, uint amount) { }}

contract Chainge {

  struct Share {

    
  }

  uint principle;
  uint jackpot;
  address initialInvestor;
  uint public deadline;

  function Chainge(address _initialInvestor, uint _principle, uint lengthInDays) {
    principle = _principle;
    jackpot = _principle;
    initialInvestor = _initialInvestor;
    deadline = now + lengthInDays * 1 days;
  }


}
