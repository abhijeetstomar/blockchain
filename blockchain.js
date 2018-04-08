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
    }

    /* calculate the hash function of this block with the properties of this block
     * We use the SHA 256 function. It's not available by default in JavaScript.
     * We can install the library crypto-js with "npm install --save crypto-js"
     */
    calculateHash() {
        // SHA256 returns a hash object which is then converted to string with toString()
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    // This constructor is responsible for initialising our blockchain
    constructor() {
        // array of blocks
        this.chain = [this.createGenesisBlock()];
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
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

// testing our blockchain
let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, "08/04/2018", { amount: 4 }));
myCoin.addBlock(new Block(2, "10/04/2018", { amount: 10 }));

// print the blockchain and use 4 spaces to format it
console.log(JSON.stringify(myCoin, null, 4));