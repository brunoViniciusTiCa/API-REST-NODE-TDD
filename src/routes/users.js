/** Esse module está exportando está aero function
 * para ser usado no arquivo routes.js com o findAll
 * e create.
 */
module.exports = (app) => {
  /** É uma função para achar tudo.
   *  Como se fosse um select no usuario.
   */
  const findAll = (req, res) => {
    app.db('users').select()
      .then(result => res.status(200).json(result));
  };

  /** Para criar o usuario */
  const create = async (req, res) => {
    const result = await app.db('users').insert(req.body, '*');
    res.status(201).json(result[0]);
  };

  return {
    findAll,
    create
  };
};
