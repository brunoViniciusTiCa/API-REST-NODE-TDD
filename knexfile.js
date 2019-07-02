module.exports = {
  test: {
    client: 'pg',
    version: '11',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'bvvr1212',
      database: 'ApiRestNode',
    },
    migration: {
      directory: 'src/migration',
    },
  },
};
