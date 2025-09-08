const DetailedAccountModel = require("../../models/DetailedAccount")

const getTransaction = async ({
  filter, repository
}) => {
  const result = await repository.get(filter)
  return result?.map(transaction => new DetailedAccountModel(transaction))
}

module.exports = getTransaction 