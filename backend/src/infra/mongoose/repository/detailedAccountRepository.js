const { DetailedAccount } = require('../modelos');

const create = async (action) => {
    const detailedAccount = new DetailedAccount(action);
    return detailedAccount.save();
};

const getById = async (id) => {
  return DetailedAccount.findById(id);
};

const get = async (detailedAccount={}) => {
    return DetailedAccount.find(detailedAccount);
};

module.exports = {
  create,
  getById,
  get
};