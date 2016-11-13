import alt from '../alt';

class AppActions {
    constructor() {
        this.generateActions(
            'initializeLocalState',
            'getPeersSuccess',
            'getPeersFail',
            'getChainSuccess',
            'getChainFail',
            'goHome',
            'searchSubmit',
            'setActiveKey',
        );
    }

    getPeers() {
        $.ajax({ url: '/peers' })
            .done((data) => {
                this.actions.getPeersSuccess(data)
            })
            .fail((jqXhr) => {
                this.actions.getPeersFail(jqXhr)
            });
    }

    getChain() {

        $.ajax({ url: '/chain' })
            .done((data) => {
                this.actions.getChainSuccess(data)
            })
            .fail((jqXhr) => {
                this.actions.getChainFail(jqXhr)
            });
    }

    newProposal(payload, web3, contractSource) {
        var _name = payload.name ;
        var _desc = payload.description ;
        var _ratioToShares = payload.sharePercentage ;
        var _cycleLength = payload.cycleTime;
        var _initWait = payload.raiseTime;

        var compiled = web3.eth.compile.solidity(contractSource);
        console.log(compiled);
        var code = compiled.code;
        var abi = compiled.info.abiDefinition;

        var blockchangeContract = web3.eth.contract(abi);
        var blockchange = blockchangeContract.new(
           _name,
           _desc,
           _ratioToShares,
           _cycleLength,
           _initWait,
           {
             from: web3.eth.accounts[0], 
             data: code, 
             gas: 3000000
           }, function(e, contract){
            console.log(e, contract);
            if (typeof contract.address != 'undefined') {
                 console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
            }
         })

    }

}

export default alt.createActions(AppActions);
