import alt from '../alt';
import request from 'request';

class AddTransactionActions {
    constructor() {
        this.generateActions(
            'addTransactionSuccess',
            'addTransactionFail',
            'updateName',
            'updateDescription',
            'updateRaiseTime',
            'updateSharePercentage',
            'updateCycleTime',
            'invalidPercentage',
            'invalidTx',
            'invalidPayload'
        );
    }

    addTransaction(data) {
        let transaction = {
            tx: JSON.stringify({
                Data: data
                //timestamp: Date.now()
            })
        };



        $.ajax({
            url: "/tx",
            type: 'POST',
            data: transaction})
            .done((data) => {
                this.actions.addTransactionSuccess(response.message);
            })
            .fail((jqXhr) => {
                this.actions.addTransactionFail(jqXhr.responseText);
            });
    }

}

export default alt.createActions(AddTransactionActions);