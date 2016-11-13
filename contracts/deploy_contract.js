var Web3 = require('web3');
var web3 = new Web3();

var provider = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(provider);

if(process.argv.length < 3) {
    console.log('needs the contract Name as argument!');
    process.exit(1);
}
var contractName = process.argv[2];
var GreeterContract = require('./'+contractName+'.sol.js');
GreeterContract.setProvider(provider);
GreeterContract.defaults({from:web3.eth.accounts[0]});


var params = process.argv.slice(3,5);
GreeterContract.new.apply(GreeterContract,params).then(function(greeter) {
    console.log('contract address: '+greeter.address);
}).catch(function(err) {
    console.log("Error creating contract!");
    console.log(err.stack);
});