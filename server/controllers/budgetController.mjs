import express from "express";
const router = express.Router();
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
// Schema.
// date - Date object, stored as ISO Date
// userId - objectId of the user who set the budget, stored as a string
// budget - number

const addBudget = async (req, res) => {
  const { date, userId, amount } = req.body;
  db.budgets
    .insertOne({
      date: new Date(date),
      userId: userId,
      amount: amount,
    })
    .then((result) => {
      console.log("Budget added successfully!");
      res.status(200).send({ message: `Budget added successfully!` });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: error });
    });
};

const updateBudget = async (req, res) => {
  const { date } = req.params;
  const { userId, newAmount } = req.body;

  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  try {
    const result = await db.budgets.updateOne(
      {
        userId: userId,
        date: {
          $gte: start,
          $lt: end,
        },
      },
      { $set: { amount: newAmount } }
    );
    console.log(result);
    if (result.modifiedCount === 0) {
      console.log(`No such budget`);
      res.status(400).send({ message: `No budget found with` });
    } else {
      console.log("Successfully updated budget!");
      res
        .status(200)
        .send({ message: `Successfully updated budget` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const getBudget = async (req, res) => {
  const { date } = req.params;
  const { userId } = req.body;

  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  db.budgets
    .findOne({
      userId: userId,
      date: {
        $gte: start,
        $lt: end,
      },
    })
    .then((budget) => {
      if (!budget) {
        console.log("Budget not found.");
        return res.status(400).send({ message: "Budget not found." });
      }
      return res.status(200).send(budget);
    });
};

export { addBudget, updateBudget, getBudget };