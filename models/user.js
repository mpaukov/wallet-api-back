const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { SECRET_KEY } = process.env;

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    token: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    balance: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    subscription: {
      type: String,
      default: 'basic',
    },
    categories: {
      income: {
        type: Array,
        default: ['regular income', 'irregular income'],
      },
      expense: {
        type: Array,
        default: [
          'basic expenses',
          'food',
          'car',
          'personal growth',
          'self care',
          'child care',
          'household products',
          'education',
          'leisure',
          'other expenses',
        ],
      },
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return this;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setName = function (name) {
  this.name = name;
  return this;
};

userSchema.methods.setToken = function () {
  this.token = jwt.sign({ id: this._id }, SECRET_KEY, { expiresIn: '1d' });
  return this;
};

userSchema.methods.setBalance = function (balance) {
  this.balance = balance;
  return this;
};

userSchema.methods.incrementTotalTransactions = function () {
  this.totalTransactions += 1;
  return this;
};

userSchema.methods.setDefaultAvatar = function () {
  this.avatarURL =
    'https://github.com/mpaukov/wallet-api-back/blob/main/public/avatars/defaultUserAvatar.jpg?raw=true';
  console.log('this', this);
  return this;
};

const signupJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Please, enter valid email address',
  }),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).max(12).required(),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const nameJoiSchema = Joi.object({
  name: Joi.string().trim().min(1).max(12).required(),
});

const emailJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Please, enter valid email address',
  }),
});

const subscriptionJoiSchema = Joi.object({
  subscription: Joi.string().valid('basic', 'premium').required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  signupJoiSchema,
  loginJoiSchema,
  nameJoiSchema,
  emailJoiSchema,
  subscriptionJoiSchema,
};
