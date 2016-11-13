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
        var contractCompiled = web3.eth.compile.solidity(contractSource);


        var blocChangeContract = web3.eth.contract(contractCompiled.BlockChange.info.abiDefinition);
        var BlockChange = blockChangeContract.new({from:web3.eth.accounts[0], data: contractCompiled.BlockChange.code, gas: 1000000}, 
          function(e, contract) {
            if (!e) {
              if(!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + 
                  contract.transactionHash + " waiting to be mined...");
              } else {
                console.log("Contract mined! Address: " + contract.address);
                console.log(contract);
              }
            }
          }
        )
    }

}

export default alt.createActions(AppActions);
