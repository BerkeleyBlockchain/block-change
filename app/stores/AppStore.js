import alt from '../alt';
import AppActions from '../actions/AppActions';
import {clone, map, find} from 'underscore';


class AppStore {
    constructor() {
        this.bindActions(AppActions);
        this.peers = [];
        this.blocks = [];
        this.treeData;
        this.activeKey;
        this.contractSource = "pragma solidity ^0.4.4;  contract BlockChange {    address public owner;    bytes32 public name;   bytes32 public desc;   uint public jackpot;   uint public sharesSold = 0;   uint public cycleLength;   uint public deadline;   uint public initWait;   uint public ratioOfTotalShareValueToJackpot;   uint public shareLimit = 1000;   bool public satisfied = false;    uint public shareholderCount = 0;   mapping(uint => address) shareholderIndex;   mapping(address => uint256) public shareholderToSharesOwned;    function BlockChange(       bytes32 _name,       bytes32 _desc,       uint _ratioOfTotalShareValueToJackpot,       uint _cycleLength,       uint _initWait   ) {     name = _name;     desc = _desc;     cycleLength = _cycleLength;     deadline = now + cycleLength * 1 days;     initWait = now + _initWait * 1 days;     ratioOfTotalShareValueToJackpot = _ratioOfTotalShareValueToJackpot;   }    /* returns the cost of each share based on ratioOfTotalShareValueToJackpot   and jackpot */   function costOfShare() returns (uint) {     uint cost = jackpot * ratioOfTotalShareValueToJackpot / (100 * shareLimit);     return cost;   }    modifier initialPeriod() { if (now >= initWait) _; }    /* add money to initial amount */   function fundraise() initialPeriod payable {     jackpot += msg.value;   }    /* purchase a share */   function purchase() require(now >= initWait) payable {     uint cost = costOfShare();     if (msg.value < cost) throw;     uint orderSize = msg.value / cost;          /* Cannot buy more than the number of shares that are left */     uint sharesLeft = shareLimit - sharesSold;     if (orderSize > (sharesLeft - 1)) {       orderSize = (sharesLeft - 1);     }     /* 0 is default value for a nonexistent key, and a shareholder       cannot own 0 shares, so this is a new shareholder. */     if (shareholderToSharesOwned[msg.sender] == 0) {       shareholderIndex[shareholderCount] = msg.sender;       shareholderToSharesOwned[msg.sender] = orderSize;       shareholderCount += 1;     } else {       shareholderToSharesOwned[msg.sender] += orderSize;     }     sharesSold += orderSize;      /* Add change funds to the jackpot */     if (!msg.sender.send(msg.value - (orderSize * cost))) throw;     jackpot += msg.value - (orderSize * cost);   }    /* release all current shares */   function releaseShares() require(now >= deadline) {     sharesSold = 0;     deadline = now + cycleLength * 1 days;   }    function payOut() require(satisfied) {     /* Iterate through shareholders and make txs */     for(uint i = 0; i < shareholderCount; i++) {         if (shareholderToSharesOwned[shareholderIndex[i]] > 0) {           uint numShares = shareholderToSharesOwned[shareholderIndex[i]];           shareholderToSharesOwned[shareholderIndex[i]] = 0;           uint payment = numShares * jackpot / shareLimit;           if (!shareholderIndex[i].send(payment)) throw;           jackpot -= payment;         }     }      /* Leftover change goes to the creator of the contract */     if (jackpot > 0) {       if (!owner.send(jackpot)) throw;       jackpot = 0;     }   }    modifier require(bool _cond) {     if (!_cond) throw;     _;   } } ";
    }

    formatTreeData(data) {

        data = map(data, function(item){
            var i = clone(item);
            i.parentHash = i.parent;
            return i;
        });

        console.log(data);

        // create a name: node map
        var dataMap = data.reduce(function(map, node) {
            map[node.hash] = node;
            return map;
        }, {});

        console.log(dataMap);

        // create the tree array
        var treeData = [];
        data.forEach(function(node) {
            // add to parent
            var parent = dataMap[node.parent];
            if (parent === "GENESIS") {
                parent = null;
            }
            if (parent) {
                // create child array if it doesn't exist
                (parent.children || (parent.children = []))
                // add node to child array
                    .push(node);
            } else {
                // parent is  or missing
                treeData.push(node);
            }
        });

        console.log(treeData);

        return treeData;
    }

    onSetActiveKey(activeKey) {
        this.activeKey = activeKey;
    }

    onGoHome(payload) {
        this.activeKey = "";
        payload.router.push('/');
        payload.history.push('/');
    }

    onSearchSubmit(payload) {
        var selectedBlock = find(this.blocks, function(block){ return block.hash == payload.searchQuery; })
        if (selectedBlock) {
            this.activeKey = selectedBlock.hash;
            payload.router.push('/blocks/' + selectedBlock.hash);
            payload.history.push('/blocks/' + selectedBlock.hash);
        }

    }


    onGetPeersSuccess(data) {
        if (data) {

            var peers = [];
            for (var i = 0; i < data.peers.length; i++) {
                peers.push({ id: i, address: data.peers[i] });
            }

            this.peers = peers;
        }
    }

    onGetPeersFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }

    onGetChainSuccess(data) {
        if (data) {

            var chain = data.chain;

            var blocks = [];
            for (var i = 0; i < chain.length; i++) {
                var block = chain[i];
                blocks.push({
                    id: i,
                    attestation: block.attestation,
                    hash: block.hash,
                    luck: block.luck,
                    parent: block.parent,
                    transactions: block.transactions,
                });
            }
            this.blocks = blocks;
            console.log(this.blocks);
            //this.treeData = blocks;
            this.treeData = this.formatTreeData(blocks);
        }
    }

    onGetChainFail(jqXhr) {
        console.log("yuep");
        // Handle multiple response formats, fallback to HTTP status code number.
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}

export default alt.createStore(AppStore);