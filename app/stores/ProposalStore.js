import alt from '../alt';
import ProposalActions from '../actions/ProposalActions';

class ProposalStore {
    constructor() {
        this.bindActions(ProposalActions);
        this.proposalAddress;
        this.proposalName;
        this.proposalDescription;
        this.proposalJackpot;
        this.proposalDeadline;
        this.proposalInitWait;
        this.proposalCycleLength;
        this.proposalShareLimit;
        this.proposalSharesSold;
        this.proposalSatisfied;
        this.proposalShareValueToJackpotRatio;
        this.proposalShareholderCount;
        this.proposalCostOfShare;

        this.block;

        this.donationAddress;
        this.donationAmount;

        this.buyAddress;
        this.buyAmount;

        this.donateValidationState;
        this.buyValidationState;
    }

    onSetProposalState(proposalAddress) {
        this.proposalAddress = proposalAddress;
    }

    onUpdateDonationAddress() {
    	this.donationAddress = event.target.value;
        this.donateValidationState = '';
    }

    onUpdateDonationAmount() {
    	this.donationAmount = event.target.value;
        this.donateValidationState = '';
    }

    onUpdateBuyAddress() {
    	this.buyAddress = event.target.value;
        this.buyValidationState = '';
    }

    onUpdateBuyAmount() {
    	this.buyAmount = event.target.value;
        this.buyValidationState = '';
    }

    onGotContract(payload) {
		this.proposalAddress = payload.proposalAddress;
		this.proposalName = payload.name;
        this.block = payload.block;
		this.proposalDescription = payload.description;
		this.proposalJackpot = payload.block.jackpot().toNumber();
		this.proposalDeadline = payload.block.deadline().toNumber();
		this.proposalInitWait = payload.block.initWait().toNumber();
        this.proposalCycleLength = payload.block.cycleLength().toNumber();
        this.proposalShareLimit = payload.block.shareLimit().toNumber();
        this.proposalSharesSold = payload.block.sharesSold().toNumber();
        this.proposalSatisfied = payload.block.satisfied();
        this.proposalShareValueToJackpotRatio = payload.block.ratioOfTotalShareValueToJackpot().toNumber();
        this.proposalShareholderCount = payload.block.shareholderCount().toNumber();
        this.proposalCostOfShare = this.proposalJackpot * this.proposalShareValueToJackpotRatio / (100 * 1000);
        console.log(this);
    }
}

export default alt.createStore(ProposalStore);