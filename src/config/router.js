const express = require('express');

module.exports = (app) => {
  app.route('/auth', app.routes.auth);
};
