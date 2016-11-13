import alt from '../alt';
import AddTransactionActions from '../actions/AddTransactionActions';

class AddTransactionStore {
    constructor() {
        this.bindActions(AddTransactionActions);
        this.name = '';
        this.description = '';
        this.raiseTime;
        this.sharePercentage;
        this.cycleTime;
        this.helpBlock = '';
        this.txValidationState = '';
    }

    onAddTransactionSuccess(successMessage) {
        this.txValidationState = 'has-success';
        this.helpBlock = successMessage;
    }

    onAddTransactionFail(errorMessage) {
        this.txValidationState = 'has-error';
        this.helpBlock = errorMessage;
    }

    onUpdateName(event) {
        this.name = event.target.value;
        this.txValidationState = '';
        this.helpBlock = '';
    }

    onUpdateDescription(event) {
        this.description = event.target.value;
        this.txValidationState = '';
        this.helpBlock = '';
    }

    onUpdateRaiseTime(event) {
        this.raiseTime = event.target.value;
        this.txValidationState = '';
        this.helpBlock = '';
    }

    onUpdateSharePercentage(event) {
        this.sharePercentage = event.target.value;
        this.txValidationState = '';
        this.helpBlock = '';
    }

    onUpdateCycleTime(event) {
        this.cycleTime = event.target.value;
        this.txValidationState = '';
        this.helpBlock = '';
    }

    onInvalidTx() {
        this.txValidationState = 'has-error';
        this.helpBlock = 'Please enter a valid transaction.';
    }

    onInvalidPercentage() {
        this.txValidationState = 'has-error';
        this.helpBlock = "Percentage must be an integer greater than 1";
    }

    onInvalidPayload() {
        this.txValidationState = 'has-error';
        this.helpBlock = 'Transaction is not in proper format.'
    }

}

export default alt.createStore(AddTransactionStore);