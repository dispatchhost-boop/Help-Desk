const { mySqlQury } = require("../middleware/db");

// Helper function to update wallet and record transaction
async function updateWalletAndTransaction(clientId, totalRate, po_no, lr_no, originZone, destinationZone, description, Totalweight, unitweight) {
  try {
    console.log("clientId",totalRate,po_no,lr_no,originZone,destinationZone,description,Totalweight,unitweight)
    // Fetch current wallet amount
    const wallet = await mySqlQury("SELECT total_amount FROM tbl_wallet WHERE user_id = ?", [clientId]);

    if (wallet.length === 0) {
      throw new Error("Wallet not found for the given clientId.");
    }

      const currentAmount = wallet[0].total_amount;
    console.log("currentAmount",currentAmount)

    // Check for sufficient funds
    if (currentAmount < totalRate) {
      throw new Error("Insufficient funds in wallet.");
    }

    // Update wallet amount
        const newAmount = currentAmount - totalRate;
        await mySqlQury("UPDATE tbl_wallet SET total_amount = ? WHERE user_id = ?", [newAmount, clientId]);

    // Generate transaction details
    const transactionID = `T${Date.now()}`;
    const weight = `${Totalweight} ${unitweight}`;
    const zone = `${originZone} to ${destinationZone}`;

    // Record transaction
    await mySqlQury(
      "INSERT INTO tbl_lr_wallet_tnx (user_id, TransactionID, po_id, lr_no, weight, zone, description, transaction_type, created_at, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [clientId, transactionID, po_no, lr_no, weight, zone, description, 'debit', totalRate]
    );

    return {
      success: true,
      message: "Wallet updated successfully.",
      new_amount: newAmount
    };

  } catch (error) {
    throw error;
  }
}
module.exports = updateWalletAndTransaction