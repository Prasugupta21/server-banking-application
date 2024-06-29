const Transaction = require('../models/transaction');
const User = require('../models/user');
const {userVerification} =require('../middleware/user')
// Deposit money
exports.deposit = async (req, res) => {
  

  // console.log(user);
  try {
    const { amount, bankName, accountNumber } = req.body;
  
    const user=await User.findOne({accountNumber});
  
   
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
  
   
   
    user.balance +=parseFloat(amount);

    

    const newTransaction = await Transaction.create({
      fromUser:user._id,
      toUser:user._id,
      amount,
      bankName,
      type:'deposit',
    
    
      accountNumber,
      
    });
   
    user.transactions.push(newTransaction);
    await user.save();
  

   return res.status(201).json({ success: true, message: 'Deposit successful' ,newTransaction,user});
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Withdraw money
exports.withdraw = async (req, res) => {
    try {
        const {  amount, bankName,accountNumber } = req.body;
    
        const user = await User.findOne({accountNumber});

   
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
        console.log("id is ",user._id)
    
        if (user.balance < amount) {
          return res.status(400).json({ success: false, message: 'Insufficient balance.' });
        }
    
        user.balance -= amount;
       
   
        const transaction = new Transaction({
          fromUser:user._id,
          toUser:user._id,
          amount,
          type: 'withdraw',
          bankName,
      
          accountNumber
        });
        await transaction.save();
        user.transactions.push(transaction);
        await user.save();
      return  res.status(201).json({ success: true, message: 'Withdrawal successful.',transaction,user });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
      }
};

// Send money
exports.transfer = async (req, res) => {
  const { senderAccount,amount ,BeneficiaryAccount } = req.body;
   
  if (!senderAccount || !amount || !BeneficiaryAccount) {
    return res.status(400).json({ success: false, message: 'Something went wrong' });
  }

  try {
    const sender=await User.findOne({accountNumber:senderAccount});
if(!sender)   
  return res.status(404).json({ success: false, message: 'User not found.' });
    const beneficiary=await User.findOne({accountNumber:BeneficiaryAccount});


    if(!beneficiary)return res.status(404).json({ success: false, message: 'benificiary not found' });
    const toUser = beneficiary._id
    const fromUser=sender._id
;   

    if (!fromUser || !toUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (sender.balance < parseFloat(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    sender.balance -= parseFloat(amount);
    beneficiary.balance += parseFloat(amount);

   
  
    const transaction = new Transaction({
      fromUser:sender._id,
      toUser: beneficiary._id,
      amount: parseFloat(amount),
      type: 'transfer',

    
    
    });
    await transaction.save();
    sender.transactions.push(transaction);
    beneficiary.transactions.push(transaction);
    await sender.save();
    await beneficiary.save();

    res.status(201).json({ success: true, message: 'Transfer successful.',transaction,sender,beneficiary });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get transaction history
exports.getHistory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Populate the transactions array with detailed transaction objects
    const populatedUser = await User.populate(user, {
      path: 'transactions',
      populate: {
        path: 'fromUser toUser',
        model: 'User',
        select: 'name email'
      }
    });
    const transactions = populatedUser.transactions.map(transaction => {
      return {
        _id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        fromUser: transaction.fromUser.name,
        toUser: transaction.toUser.name
      };
    });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }

};