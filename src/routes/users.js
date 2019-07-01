/** Esse module está exportando está aero function */
module.exports = () => {
  /** É uma função para achar tudo. */
  const findAll = (req, res) => {
    const users = [{
      name: 'Bruno Vinicius',
      mail: 'brunoviniciustica@gmail.com'
    }];
    res.status(200).json(users);
  };

  /** Para criar o usuario */
  const create = (req, res) => {
    res.status(201).json(req.body);
  };

  return {
    findAll,
    create
  };
};
