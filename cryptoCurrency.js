/* This program transforms code from blockchain.js to create a simple cryptocurrency.
 * Created by Abhijeet Singh on 13 April 2018
 */

 // import library for hash function
const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    /* We modify the Block class so that it supports multiple transactions.
     * We remove the index since in an actual blockchain, the order of blocks is determined by
     * their position in the array and not an index that we pass here.
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
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
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        /* The mining algorithm makes sure that a Block is created every 10 minutes.
         * Hence, the blocks that are created between transactions are stored temporarily in a 
         * pending transactions array.
         */
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            // quick trick to create a string of zeroes that is exactly the length of difficulty
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];

        // below property decides how long it will take to mine a Block
        this.difficulty = 4;
        
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
        
    // First block of a blockchain is called Genesis block and should be added manually
    createGenesisBlock() {
        return new Block("01/01/2018", "Genesis Block", "0");
    }

    // returns the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock is replaced with minePendingTransactions
    minePendingTransactions(miningRewardAddress) {
        /* In real-life cryptocurrency such as Bitcoin, all the pending transactions can't be
         * included in a Block since there are way too many pending transactions. So, miners
         * get to choose which transactions they want to include. But we're not worrying about
         * that in our simple implementation.
         */
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        /* We've to reset the pendingTransactions array.
         * And create a new transaction to give the miner his reward.
         * You can change this code to give yourself more mining reward but cryptocurrencies
         * are monitored by a peer-to-peer network. And other nodes in the network won't accept your 
         * attempts of fooling them. Instead, they'll just ignore you.
         */
        /* Mining reward is added as a new transaction to pendingTransactions so the mining reward
         * is sent when the next block is mined.
         */

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    /* This method checks the balance of an address. Many people think that if you send some Bitcoins
     * around, they move away from your wallet's balance to someone else's balance. But in reality, you
     * don't really have a balance. The transaction is just stored on the blockchain and if you ask for your 
     * balance, you have to go through all the transactions that involve your address and calculate it that way.
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        // We'll loop over all the blocks of our blockchain
        for(const block of this.chain) {
            // blocks contains multiple transactions, so we loop over all transactions of this block
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

// create some transactions
// In reality, address1 and address2 would be the public key of someone's wallet
myCoin.createTransaction(new Transaction('address1', 'address2', 100));
myCoin.createTransaction(new Transaction('address2', 'address1', 50));
// Now these transactions will be in the pendingTransactions array

console.log('\nStarting the miner...');
myCoin.minePendingTransactions('abhijeet-address');

// check our balance
console.log('\nBalance of Abhijeet is', myCoin.getBalanceOfAddress('abhijeet-address'));

// Reward for previous mining is sent in this transaction
console.log('\nStarting the miner again...');
myCoin.minePendingTransactions('abhijeet-address');

// check our balance
console.log('\nBalance of Abhijeet is', myCoin.getBalanceOfAddress('abhijeet-address'));