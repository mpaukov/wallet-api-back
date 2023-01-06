const { Transaction, User } = require('../../models');

const deleteUser = async (req, res) => {
  const { _id } = req.user;

  await Transaction.deleteMany({ owner: _id });
  await User.deleteOne({ _id });

  res.status(200).json({ message: 'User has been deleted' });
};

module.exports = deleteUser;
