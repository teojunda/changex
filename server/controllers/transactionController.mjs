import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
// Schema.
// date - Date object, stored as ISO Date
// userId - objectId of the user adding the transaction, stored as a string
// category - string
// amount - double ( positive <=> incoming transaction, negative <=> outgoing transaction )
// description - string

const addTransaction = async (req, res) => {
  const { date, userId, category, description, amount } = req.body;

  db.transactions
    .insertOne({
      date: new Date(date),
      userId: userId,
      category: category,
      amount: amount,
      description: description,
    })
    .then(result => {
      console.log("Transaction added successfully!");
      res.status(200).send({ message: `Transaction added successfully!` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ message: error });
    });
};

const getTransactions = async (req, res) => {
  const { userId } = req.body;

  console.log(userId);
  try {
    const cursor = db.transactions.find({ userId: userId });
    const transactions = await cursor.sort({ date: -1 }).toArray();
    console.log("Successfully retrieved transactions!");
    res.status(200).send(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const getSpendingByMonthYear = async (req, res) => {
  const { userId } = req.body;
  const { date } = req.params;
  const dateObj = new Date(date);

  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  const cursor = await db.transactions
    .aggregate([
      {
        $match: {
          $and: [{ userId: userId }, { date: { $gte: start, $lt: end } }],
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ])
    .toArray();
  if (cursor.length === 0) {
    return res.status(200).json(0);
  }
  return res.status(200).json(cursor[0].totalAmount);
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.transactions.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      console.log(`No transactions with the id ${id}`);
      res.status(404).send({ message: `No transaction found with id: ${id}` });
    } else {
      console.log("Successfully deleted transaction!");
      res
        .status(200)
        .send({ message: `Successfully deleted transaction with id: ${id}` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const getSpendingByCategoryInYear = async (req, res) => {
  const { year } = req.params;
  const { userId } = req.body;

  const start = new Date(parseInt(year), 0);
  const end = new Date(parseInt(year) + 1, 0);

  const data = await db.transactions
    .aggregate([
      {
        $match: {
          $and: [{ userId: userId }, { date: { $gte: start, $lt: end } }],
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $project: { _id: 0, name: "$_id", value: "$total" } },
    ])
    .toArray();
  if (data.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).send(data);
};

export {
  addTransaction,
  getTransactions,
  getSpendingByMonthYear,
  deleteTransaction,
  getSpendingByCategoryInYear,
};
