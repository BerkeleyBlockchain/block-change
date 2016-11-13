import React from 'react';
import Textarea from 'react-textarea-autosize';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import AddTransactionStore from '../stores/AddTransactionStore';
import AddTransactionActions from '../actions/AddTransactionActions';

class AddTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = AddTransactionStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        AddTransactionStore.listen(this.onChange);
    }

    componentWillUnmount() {
        AddTransactionStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        if(!this.state.name || !this.state.description || !this.state.raiseTime || !this.state.sharePercentage || !this.state.cycleTime) {
            AddTransactionActions.invalidTx();
            this.refs.nameTextField.focus();
        } else if (this.state.sharePercentage < 1) {
            AddTransactionActions.invalidPercentage();
            this.refs.sharePercentageTextField.focus();
        } else {
            var payload = {
                name: this.state.name,
                description: this.state.description,
                raiseTime: parseInt(this.state.raiseTime),
                sharePercentage: parseInt(this.state.sharePercentage),
                cycleTime: parseInt(this.state.cycleTime)
            }
            this.props.handleNewProposal(payload);
        }
    }



    render() {
        return (
            <Grid>
                <Row className='flipInX animated'>
                    <Col sm={12}>
                        <Panel header="Add Transaction">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className={'form-group ' + this.state.txValidationState}>
                                    <label className='control-label'>Proposal Name</label>
                                    <Textarea type='text' maxRows={20} className='form-control' ref='nameTextField' value={this.state.name}
                                           onChange={AddTransactionActions.updateName} autoFocus/>
                                    
                                    <label className='control-label'>Proposal Description</label>
                                    <Textarea type='text' rows={5} className='form-control' ref='descriptionTextField' value={this.state.description}
                                           onChange={AddTransactionActions.updateDescription} autoFocus/>
                                    
                                    <label className='control-label'>Days to raise donations</label>                                   
                                    <Textarea type='text' maxRows={10} className='form-control' ref='raiseTimeTextField' value={this.state.raiseTime}
                                       onChange={AddTransactionActions.updateRaiseTime} autoFocus/>

                                    <label className='control-label'>Percentage of pool to be shares (Must be whole number) </label>                                   
                                    <Textarea type='text' maxRows={10} className='form-control' ref='sharePercentageTextField' value={this.state.sharePercentage}
                                       onChange={AddTransactionActions.updateSharePercentage} autoFocus/>
                                       
                                    <label className='control-label'>Cycle Time</label>                                   
                                    <Textarea type='text' maxRows={10} className='form-control' ref='cycleTimeTextField' value={this.state.cycleTime}
                                       onChange={AddTransactionActions.updateCycleTime} autoFocus/>   

                                    <span className='help-block'>{this.state.helpBlock}</span>
                                </div>
                                <button type='submit' className='btn btn-primary'>Submit</button>
                            </form>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default AddTransaction;