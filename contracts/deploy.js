var blockchangeSource = "pragma solidity ^0.4.4; contract BlockChange { address public owner; bytes32 name; bytes32 desc; uint jackpot; uint sharesSold = 0; uint cycleLength; uint deadline; uint initWait; uint totalShareValueToJackpotRatio; uint shareLimit = 1000; bool satisfied = false; uint shareholderCount = 0; mapping(uint => address) shareholderIndex; mapping(address => uint256) shareholderToSharesOwned; function BlockChange( bytes32 _name, bytes32 _desc, uint _totalShareValueToJackpotRatio, uint _cycleLength, uint _initWait ){ name = _name; desc = _desc; cycleLength = _cycleLength; deadline = now + cycleLength * 1 days; initWait = now + _initWait * 1 days; if (totalShareValueToJackpotRatio > 100) throw; if (totalShareValueToJackpotRatio < 1) throw; totalShareValueToJackpotRatio = _totalShareValueToJackpotRatio; } /* returns the cost of each share based on totalShareValueToJackpotRatio and jackpot */ function costOfShare() returns (uint) { uint cost = jackpot * totalShareValueToJackpotRatio / (100 * shareLimit); return cost; } modifier initialPeriod() { if (now >= initWait) _; } /* add money to initial amount */ function fundraise() initialPeriod { jackpot += msg.value; } /* purchase a share */ function purchase() require(now >= initWait) { uint cost = costOfShare(); if (msg.value < cost) throw; uint orderSize = msg.value / cost; /* Cannot buy more than the number of shares that are left */ uint sharesLeft = shareLimit - sharesSold; if (orderSize > (sharesLeft - 1)) { orderSize = (sharesLeft - 1); } /* 0 is default value for a nonexistent key, and a shareholder cannot own 0 shares, so this is a new shareholder. */ if (shareholderToSharesOwned[msg.sender] == 0) { shareholderIndex[shareholderCount] = msg.sender; shareholderToSharesOwned[msg.sender] = orderSize; shareholderCount += 1; } else { shareholderToSharesOwned[msg.sender] += orderSize; } sharesSold += orderSize; /* Add change funds to the jackpot */ if (!msg.sender.send(msg.value - (orderSize * cost))) throw; jackpot += msg.value - (orderSize * cost); } /* release all current shares */ function releaseShares() require(now >= deadline) { sharesSold = 0; deadline = now + cycleLength * 1 days; } function payOut() require(satisfied) { /* Iterate through shareholders and make txs */ for(uint i = 0; i < shareholderCount; i++) { if (shareholderToSharesOwned[shareholderIndex[i]] > 0) { uint numShares = shareholderToSharesOwned[shareholderIndex[i]]; shareholderToSharesOwned[shareholderIndex[i]] = 0; uint payment = numShares * jackpot / shareLimit; if (!shareholderIndex[i].send(payment)) throw; jackpot -= payment; } } /* Leftover change goes to the creator of the contract */ if (jackpot > 0) { if (!owner.send(jackpot)) throw; jackpot = 0; } } modifier require(bool _cond) { if (!_cond) throw; _; } } ";


var blockchangeCompiled = web3.eth.compile.solidity(blockchangeSource);
var blockchangeContract = web3.eth.contract(blockchangeCompiled.BlockChange.info.abiDefinition);
var blockchangeBytecode = blockchangeCompiled.BlockChange.code;

var gasEstimate = web3.eth.estimateGas({data: blockchangeBytecode});
var blockchange = blockchangeContract.new(
    "Name", "Desc", 1, 10, 10,
    {
        from: web3.eth.accounts[0],
        data: blockchangeBytecode,
        gas: 700000
    }, function(e, contract){
      if(!e) {
          if(!contract.address) {
              console.log("Contract transaction send: TransactionHash: "
                  + contract.transactionHash
                  + " waiting to be mined...");

          } else {
              console.log("Contract mined! Address: " + contract.address);
              console.log(contract);
          }

      } else {
          console.log("Error: ");
          console.log(e);
      }
});
