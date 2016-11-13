import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import AppStore from '../stores/AppStore'
import AppActions from '../actions/AppActions';
import { withRouter } from 'react-router';
import Web3 from 'web3';

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = AppStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        AppStore.listen(this.onChange);
        //AppActions.getPeers();
        //AppActions.getChain();
    }

    componentWillUnmount() {
        AppStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    setActiveKey(activeKey) {
        AppActions.setActiveKey(activeKey);
    }

    goHome() {
        AppActions.goHome({router:this.props.router, history:this.props.history});
    }

    searchSubmit (searchQuery) {
        AppActions.searchSubmit({searchQuery:searchQuery, router:this.props.router, history:this.props.history});
    }

    handleNewProposal(payload) {
        console.log(payload);
        console.log(web3);
        AppActions.newProposal(payload, web3, this.state.contractSource);
    }


    render() {
        console.log(web3);

        return (
            <div>
                <Navbar history={this.props.history} blocks={this.state.blocks} searchSubmit={this.searchSubmit.bind(this)} goHome={this.goHome.bind(this)} />
                <div>{React.cloneElement(this.props.children, { blocks: this.state.blocks, treeData:this.state.treeData, setActiveKey:this.setActiveKey, web3:web3, contractSource:this.state.contractSource,parentSource:this.state.parentSource, activeKey:this.state.activeKey, handleNewProposal:this.handleNewProposal.bind(this), searchSubmit:this.searchSubmit.bind(this)})}</div>
                <Footer peers={this.state.peers} />
            </div>
        );
    }
}

export default withRouter(App);