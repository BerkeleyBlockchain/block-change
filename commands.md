Starting a new node
```
geth --dev --maxpeers 10 --gasprice 0 --port 30301 --rpcport 8101 --datadir ./data --rpcaddr "0.0.0.0"
geth --dev --maxpeers 10 --gasprice 0 --port 30302 --rpcport 8102 --datadir ./data2
```

With expensive saudi gas:
```
geth --dev --maxpeers 10 --port 30301 --rpcport 8101 --datadir ./data --rpcaddr "0.0.0.0"
```

WIth console:
```
geth --dev --maxpeers 10 --gasprice 0 --rpcport 8101 --datadir ./data console
```

Attaching to a node with a client
Node 1:
```
geth --dev --port 30301 attach ipc:/Users/fang/github/blockchange/data/geth.ipc
```
Note 2: 
```
geth --dev --port 30302 attach ipc:/Users/fang/github/blockchange/data2/geth.ipc
```

Networking
```
admin.nodeInfo.enode
admin.addPeer(“output-of-the-above”)
```

Actions
Create account
```
personal.newAccount("password")
```

Unlock account
```
personal.unlockAccount(web3.eth.accounts[0], "password")
```

Mining
```
miner.start()
miner.stop()
```

See Ether balance
```
web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
web3.toWei(10, “ether”)
```

Deploy
```
loadScript('contracts/deploy.js')
```
(make sure you mine the contract)

Paying our contract:
```
blockchange.fundraise({from: web3.eth.accounts[0], value: web3.toWei(10, "ether")})
```
(make sure you mine the transaction)

See pending transactions
```
eth.getBlock("pending", true).transactions
```
