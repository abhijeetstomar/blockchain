/* Simple implementation of a blockchain in javascript
 * Created by Abhijeet Singh on 8 April 2018
 */

// import library for hash function
const SHA256 = require('crypto-js/sha256');

class Block {
    /* index is optional and tells us where the block sits on the chain
     * timestamp tells us when the block was created
     * data might contain any type of data that you want to associated with this block
     * previousHash is a string that contains the hash of the block before this block. 
     * This insures the integrity of our blockchain.
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        // contains the hash of our block
        this.hash = this.calculateHash();
        // the hash of our block won't change unless we change a value
        // nonce is provided for this purpose
        this.nonce = 0;
    }

    /* calculate the hash function of this block with the properties of this block
     * We use the SHA 256 function. It's not available by default in JavaScript.
     * We can install the library crypto-js with "npm install --save crypto-js"
     */
    calculateHash() {
        // SHA256 returns a hash object which is then converted to string with toString()
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // proof-of-work is also called mining and requires a lot of computing power
    // mining is required so someone can't spam our blokchain
    // difficulty represents how much computing power it takes to mine a new block
    // Using this mechanism, we can control how fast new blocks are added to our blockchain
    mineBlock(difficulty) {
        // below loop will keep calculating hash until it contains a specified number of 
        // zeroes acoording to difficulty value specified in properties of class Blockchain
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            // quick trick to create a string of zeroes that is exactly the length of difficulty
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    // This constructor is responsible for initialising our blockchain
    constructor() {
        // array of blocks
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }
        
    // First block of a blockchain is called Genesis block and should be added manually
    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis Block", "0");
    }

    // returns the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // in reality you can't add a new block so easily since there are numerous checks in place
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // the below commented method to create a block doesn't implement proof-of-work
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        // we don't start from zero because that's our Genesis block
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

// testing our blockchain
let myCoin = new Blockchain();

console.log('Mining block 1...');
myCoin.addBlock(new Block(1, "08/04/2018", { amount: 4 }));

console.log('Mining block 2...');
myCoin.addBlock(new Block(2, "10/04/2018", { amount: 10 }));

// print the blockchain and use 4 spaces to format it
// console.log(JSON.stringify(myCoin, null, 4));

// // check if blockchain is valid
// console.log('Is blockchain valid? ' + myCoin.isChainValid());
// // try to tamper with the chain
// myCoin.chain[1].data = { amount: 100 };
// console.log('Is blockchain valid? ' + myCoin.isChainValid());
// // we try to be smarter and calculate the hash
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
// // chain will still be invalid since the previousHash of next block doesn't match the new one
// console.log('Is blockchain valid? ' + myCoin.isChainValid());