const Joi = require('joi');
const { Schema, model } = require('mongoose');
// const Joi = require('joi');
const categories = require('../categories.json');
const allCategories = [...categories.expense, ...categories.income];

const transactionSchema = Schema(
  {
    date: {
      type: Date,
      required: [true, 'Set date of transaction'],
    },
    type: {
      type: Boolean,
      default: false,
      // true - deposite, false - withdraw
    },
    category: {
      type: String,
      required: [true, 'Should be a category'],
      enum: allCategories,
    },
    comment: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount should be at least 0.01'],
      min: 0.01,
    },
    balance: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const joiAddSchema = Joi.object({
  date: Joi.date().required(),
  type: Joi.boolean(),
  category: Joi.string().valid(...allCategories),
  comment: Joi.string(),
  amount: Joi.number().min(0.01).required(),
});

const Transaction = model('transaction', transactionSchema);

module.exports = {
  Transaction,

  schemas: {
    add: joiAddSchema,
  },
};
