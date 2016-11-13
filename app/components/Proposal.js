import React from 'react';
import ProposalStore from '../stores/ProposalStore'
import ProposalActions from '../actions/ProposalActions';
import Textarea from 'react-textarea-autosize';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import { withRouter } from 'react-router';

class Proposal extends React.Component {

    constructor(props) {
        super(props);
        this.state = ProposalStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        ProposalStore.listen(this.onChange);
        ProposalActions.getContract(this.props.params.proposalAddress, this.props.web3, this.props.contractSource);
    }

    componentWillUnmount() {
        ProposalStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    donate(){
        ProposalActions.donateToProposal(this.state.donationAddress, this.state.donationAmount, this.state.proposalAddress, this.props.web3, this.props.contractSource, this.state.block);
    }

    buyShares(){
        ProposalActions.buySharesOfProposal(this.state.buyAddress, this.state.buyAmount, this.state.proposalAddress, this.props.web3, this.props.contractSource, this.state.block);
    }

    render() {

        console.log(this.props);

        return (
            <Grid>
                <Row className='flipInX animated'>
                    <Col sm={12}>
                        <Panel header={this.state.proposalName}>
                            <p><strong>Name:</strong> {this.state.proposalName}</p>
                            <p><strong>Description:</strong> {this.state.proposalDescription}</p>
                            <p><strong>Pool:</strong> {this.state.proposalJackpot}</p>
                            <p><strong>Days Left:</strong> {this.state.proposalDeadline}</p>
                            <p><strong>Address:</strong> {this.state.proposalAddress}</p>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Panel header="Donate">
                            <div>
                                <form onSubmit={this.donate.bind(this)}>
                                    <div className={'form-group ' + this.state.donateValidationState}>
                                        <label className='control-label'>Address to Donate From</label>
                                        <Textarea type='text' maxRows={20} className='form-control' ref='nameTextField' value={this.state.donationAddress}
                                               onChange={ProposalActions.updateDonationAddress} autoFocus/>

                                        <label className='control-label'>Amount of Ether to Donate</label>
                                        <Textarea type='text' maxRows={20} className='form-control' ref='nameTextField' value={this.state.donationAmount}
                                               onChange={ProposalActions.updateDonationAmount} autoFocus/>

                                    </div>
                                    <button type='submit' className='btn btn-primary'>Submit</button>
                                </form>
                            </div>
                        </Panel>
                    </Col>

                    <Col sm={6}>
                        <Panel header={"Buy Share (" + this.state.proposalCostOfShare +" Eth)"}>
                            <div>
                                <form onSubmit={this.buyShares.bind(this)}>
                                    <div className={'form-group ' + this.state.buyValidationState}>
                                        <label className='control-label'>Address to Buy From</label>
                                        <Textarea type='text' maxRows={20} className='form-control' ref='nameTextField' value={this.state.buyAddress}
                                               onChange={ProposalActions.updateBuyAddress} autoFocus/>

                                        <label className='control-label'>Amount of Shares to Buy</label>
                                        <Textarea type='text' maxRows={20} className='form-control' ref='nameTextField' value={this.state.buyAmount}
                                               onChange={ProposalActions.updateBuyAmount} autoFocus/>
                                    </div>
                                    <button type='submit' className='btn btn-primary'>Submit</button>
                                </form>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default withRouter(Proposal);