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
        this.contractSource = "contract BlockChange {    address public owner;    bytes32 name;   bytes32 desc;   uint jackpot;   address[] shares;   uint curShareIndex = 0;   uint cycleLength;   uint deadline;   uint initWait;   uint ratioToShares;   bool satisfied = false;     mapping(address => uint256) public sharesOwned;    function BlockChange(bytes32 _name, bytes32 _desc, uint _ratioToShares, uint _cycleLength, uint _initWait){     name = _name;     desc = _desc;     cycleLength = _cycleLength;     deadline = now + cycleLength * 1 days;     initWait = now + _initWait * 1 days;     ratioToShares = _ratioToShares;     shares = new address[](1000);   }    // returns cost of share based on ratioToShares and jackpot   function costOfShare() returns (uint) {     uint cost = jackpot;     cost = cost * ratioToShares / (100 * 1000);     return cost;   }    modifier initalPeriod() { if(now >= initWait) _; }    // add money to initial amount   function fundraise() initalPeriod {     jackpot += msg.value;   }    // purchase a share   function purchase() require(now >= initWait) {     uint cost = costOfShare();     if (msg.value < cost) throw;     uint numShares = msg.value / cost;     if(numShares > (1000 - (curShareIndex + 1))) {       numShares = (1000 - (curShareIndex + 1));     }     for(uint i = curShareIndex; i < numShares; i++) {       shares[i] = msg.sender;     }     curShareIndex += numShares;     sharesOwned[msg.sender] += numShares;     if(!msg.sender.send(msg.value - (numShares * cost))) throw;     jackpot += msg.value - (numShares * cost);   }    // release all current shares   function releaseShares() require(now >= deadline) {     curShareIndex = 0;     deadline = now + cycleLength * 1 days;   }    function payOut() require(satisfied) {     for(uint i = 0; i < curShareIndex; i++) {         if(sharesOwned[shares[i]] > 0) {           uint numShares = sharesOwned[shares[i]];           sharesOwned[shares[i]] = 0;           uint payment = numShares * jackpot / 1000;           if(!shares[i].send(payment)) throw;           jackpot -= payment;         }     }     if(jackpot > 0) {       if(!owner.send(jackpot)) throw;       jackpot = 0;     }   }    modifier require(bool _cond) {     if(!_cond) throw;     _;   } }";
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