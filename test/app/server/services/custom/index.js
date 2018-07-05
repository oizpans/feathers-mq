const customService = {
  create(data) {
    return Promise.resolve({ customServiceResult: data });
  },
};

module.exports = function custom(app) {
  app.use('/custom', customService);
};
