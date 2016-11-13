var solc = require('solc');
var fs = require('fs');
var Pudding = require('ether-pudding');

//var contractName = 'Greeter';
if(process.argv.length < 3) {
    console.log('needs the contract Name as argument!');
    process.exit(1);
}
var contractName = process.argv[2];
var source = fs.readFileSync(__dirname+'/'+contractName+'.sol',{encoding: 'utf8'}).toString().replace(/\n/g,' ');

var compiled = solc.compile(source, 1);

if(!compiled.contracts[contractName]) {
    console.log('Contract must have same name as file!');
    process.exit(1);
}
var bytecode = compiled.contracts[contractName].bytecode;
var interface = compiled.contracts[contractName].interface;

var contract_data = {
    abi: JSON.parse(interface),
    binary: bytecode
};
//console.log(contract_data);
Pudding.save(contract_data, './'+contractName+'.sol.js').then(function() {
    console.log('File '+'./'+contractName+'.sol.js'+' was created with the JS contract!' );
});