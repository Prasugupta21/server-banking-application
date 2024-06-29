const mongoose = require('mongoose');
const {Schema}=require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromUser: { type: Schema.Types.ObjectId, ref: 'User'},
    toUser: { type: Schema.Types.ObjectId, ref: 'User' ,ref:'Usere'},
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdraw', 'transfer'] },
    bankName: { type: String },
    branchName: { type: String },
   
    createdAt: { type: Date, default: Date.now()},
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
