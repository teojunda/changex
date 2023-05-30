import express from "express";
const router = express.Router();
import db from "../db/conn.mjs";
// Schema.
// date - Date object, stored as ISO Date
// userId - objectId of the user adding the transaction, stored as a string
// category - string
// amount - double ( positive <=> incoming transaction, negative <=> outgoing transaction )
// description - string

const addTransaction = (req, res) => {
  const { userId } = req;
  const { date, category, description, amount } = req.body;

  db.transactions.insertOne({
    date: new Date(date),
    userId: userId,
    category: category,
    amount: amount,
    description: description
  }).then(result => {
    console.log("Transaction added successfully!");
    res.status(200).send({ message: `Transaction added successfully!` });
  }).catch(error => {
    console.log(error);
    res.status(500).send({ message: error });
  });
};

export { addTransaction };