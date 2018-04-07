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