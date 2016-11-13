import alt from '../alt';

class ProposalActions {
    constructor() {
        this.generateActions(
        	'gotContract',
        	'updateDonationAddress',
        	'updateDonationAmount',
        	'updateBuyAddress',
        	'updateBuyAmount',
            'setProposalAddress',
        );
    }

    getContract(proposalAddress, web3, source) {
    	var compiled = web3.eth.compile.solidity(source);
		var BlockChange = web3.eth.contract(compiled.info.abiDefinition);

		var block = BlockChange.at(proposalAddress);

		var payload = {block:block, proposalAddress:proposalAddress, name:web3.toAscii(block.name()), description:web3.toAscii(block.desc())};

		this.actions.gotContract(payload);
    }

    donateToProposal(donationAddress, donationAmount, proposalAddress, web3, source) {
    	var compiled = web3.eth.compile.solidity(source);
		var BlockChange = web3.eth.contract(compiled.info.abiDefinition);

		var block = BlockChange.at(proposalAddress);

		block.fundraise.sendTransaction({'from':donationAddress, 'value':web3.toWei(parseInt(donationAmount), 'ether')});
    }

    buyShares(buyAddress, buyAmount, proposalAddress, web3, source) {
    	var compiled = web3.eth.compile.solidity(source);
		var BlockChange = web3.eth.contract(compiled.info.abiDefinition);

		var block = BlockChange.at(proposalAddress);

		block.purchase.sendTransaction({'from':buyAddress, 'to':proposalAddress, 'value':web3.toWei(parseInt(buyAmount), 'ether')});
    }

}

export default alt.createActions(ProposalActions);
