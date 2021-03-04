const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(
   new Web3.providers.HttpProvider("http://localhost:8545"));
var assert = require('assert');

const source = fs.readFileSync(
   '../contracts/P2PLending.sol', 'utf8');
const compiledContract = solc.compile(source, 1);
const abi = compiledContract.contracts[':P2PLending'].interface;
const bytecode = '0x' + compiledContract.contracts[':P2PLending'].bytecode;
const gasEstimate = web3.eth.estimateGas({ data: bytecode }) + 100000;

const P2PLendingContractFactory = web3.eth.contract(JSON.parse(abi));

describe('P2PLending', function() {
  this.timeout(5000);
  describe('P2PLending constructor', function() {
    it('Contract owner is sender', function(done) {
        let sender = web3.eth.accounts[1]; 
        let initialSupply = 10000; 
        let P2PLendingInstance = P2PLendingContractFactory.new(initialSupply, {
            from: sender, data: bytecode, gas: gasEstimate}, 
            function (e, contract){ 
            if (typeof contract.address !== 'undefined') {
                    //assert
                    assert.equal(contract.owner(), sender);
                    done();
            }
        });
    });
 });
});

it('User is already registered', function(done) {
    //arrange 
    let sender = web3.eth.accounts[1];
    let initialSupply = 10000;

    //act
    let P2PLendingInstance = P2PLendingContractFactory.new(registerUser, {
        from: sender, data: bytecode, gas: gasEstimate},
        function (e, contract){
            if (typeof contract.address !== 'undefined') {
                //assert
                assert.equal(
                  contract.registerUser(contract.owner()), 
                  registerUser);
                done();
                }
     });
});
