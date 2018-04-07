/* Simple implementation of a blockchain in javascript
 * Created by Abhijeet Singh on 8 April 2018
 */

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

        this.hash = '';
    }
}