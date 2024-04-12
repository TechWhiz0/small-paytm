const express = require('express');
const { authMiddleware } = require('../middleware.js');
const { Account } = require('../db/db.js');
const { default: mongoose } = require('mongoose');
const router = express.Router();


// An endpoint for user to get their balance.
router.get("/balance", authMiddleware, async function (req, res) {
    try{
        const account = await Account.findOne({
            userId: req.userId
        });
        console.log(account);
        if(account.balance)
       { res.json({
            balance: account?.balance
        });}
    }catch(err){
    console.log(err)}
   

 
});


// An endpoint for user to transfer money to another account
router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    try {
        // Find sender's account
        const senderAccount = await Account.findOne({ userId: req.userId });

        if (!senderAccount || senderAccount.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance",
                status: "-1"
            });
        }

        // Find recipient's account
        const recipientAccount = await Account.findOne({ userId: to });

        if (!recipientAccount) {
            return res.status(400).json({
                message: "Invalid recipient account",
                status: "-1"
            });
        }

        // Perform atomic balance update
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

        res.status(200).json({
            message: "Transfer successful",
            status: "1"
        });
    } catch (error) {
        console.error("Transfer failed:", error);
        res.status(500).json({
            message: "Transfer failed",
            status: "-1"
        });
    }
});




module.exports = {
    accountRouter: router
}