import React from 'react';
import {Grid, Row, Col, Panel, PanelGroup, Glyphicon} from 'react-bootstrap';
import { withRouter } from 'react-router';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';



class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
        this.props.setActiveKey(this.props.params.blockHash);
    }

    componentDidMount() {
        HomeStore.listen(this.onChange);
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    flipOrder(event) {
        event.preventDefault();
        HomeActions.flipOrder();
    }

    handleSelect(activeKey) {

        if(activeKey === this.props.activeKey) {
            this.props.router.push('/');
            this.props.setActiveKey(null);
        } else {
            this.props.router.push('/blocks/' + activeKey);
            this.props.setActiveKey(activeKey);
        }
    }
    

    render() {
        var blocks = this.props.blocks;
        if (!this.state.sortDown){
            blocks = blocks.slice().reverse();
        }
        return (
            <Grid>
                <Row className='flipInX animated'>
                    <Col sm={12}>
                        <Panel header={(<span>Why BlockChange? <Glyphicon glyph="sort" className='pull-right' style={{cursor:'pointer'}} onClick={this.flipOrder.bind(this)} />  </span>)}>
                            <h2>Problems:</h2>
                            <p>Corporate lobbying for unpopular policies, big money in politics, centralized and elitist government control.</p>
                            <h2>Description:</h2>
                            <p>BlockChange is a decentralized web app using Ethereum smart contracts. Crowd funded lobbying for social change. Allows the average person to have a voice in the political process and makes activism and non-corporate lobbying profitable, speeding up the process. More proportional and market-based funding for genuinely popular policy positions.</p>
                            <h2>Process:</h2>
                            <p>Person (OP) submits proposal to the BlockChange app. Users who want to see this proposal through make non-refundable donations to it, up until a deadline set by the OP. At this point, a number of equal-value shares, the total value of which is a fraction of the value of the entire pool of donations (fraction and number of shares set by OP), are released for sale. Lobbyists and bettors buy these shares, assuming they (or someone else) will complete the proposal.</p>
                            <p>If the proposal is complete (by, presumably, the lobbyists who bought the shares) by a second deadline (also set by OP), the share-buyers receive their money back, as well as the entire donation pool (distributed per share) therefore profiting from successfully lobbying for a popular policy.</p>
                            <p>If the proposal is not complete by the second deadline, the share-buyers lose money from their now-useless shares, and the money they spent is added to the donation pool. At this point, a second cycle begins with the new, larger donation pool being split up into shares for sale (the same fraction-of-total value and number of shares, and time period to complete proposal are applied). The potential profits are now much larger, and the incentive to fulfill the proposal increases as more and more failed cycles pass. Users without intention to lobby can also “donate” by buying shares and increasing the pool, especially during dead cycles.</p>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default withRouter(Home);