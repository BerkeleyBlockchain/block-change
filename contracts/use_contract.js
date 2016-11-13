var Web3 = require('web3');
var web3 = new Web3();

var provider = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(provider);

var GreeterContract = require('./Greeter.sol.js');
GreeterContract.setProvider(provider);
GreeterContract.defaults({from:web3.eth.accounts[1]});

if(process.argv.length < 3) {
    console.log('needs the contract address as argument!');
    process.exit(1);
}
var contractAddress = process.argv[2];
//var contractAddress = '0x4c8111ef6ed8a678c6ffd4f2bcb798a657aad19f';
var contractInstance = GreeterContract.at(contractAddress);

contractInstance.greet.call().then(function(result) {
    console.log('contract greeter: '+result);
}).catch(function(err) {
    console.log("Error creating contract!");
    console.log(err.stack);
});