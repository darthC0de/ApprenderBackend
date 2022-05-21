const connection = require('../database');

// [{"id":1,"question":"10 + 10","answer":"20","type":"options","options":"[\"10\",\"12\",\"32\",\"20\"]"},{"id":2,"question":"20 + 10","answer":"30","type":"options","options":"[\"30\",\"15\",\"23\",\"18\"]"},{"id":3,"question":"18 - 10","answer":"8","type":"options","options":"[\"40\",\"13\",\"5\",\"8\"]"},{"id":4,"question":"15 x 2","answer":"30","type":"options","options":"[\"30\",\"62\",\"25\",\"18\"]"},{"id":5,"question":"78 - 43","answer":"35","type":"options","options":"[\"35\",\"19\",\"50\",\"72\"]"},{"id":6,"question":"155 + 42","answer":"197","type":"options","options":"[\"100\",\"210\",\"175\",\"197\"]"},{"id":7,"question":"32 - 18","answer":"14","type":"options","options":"[\"10\",\"12\",\"14\",\"16\"]"}]

module.exports = {
  async index(req, res) {
    await connection('contas')
      .select('*')
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  },
  async create(req, res) {
    const { question, answer, type, options } = req.body;

    await connection('contas')
      .insert({ question, answer, type, options })
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  },
};
