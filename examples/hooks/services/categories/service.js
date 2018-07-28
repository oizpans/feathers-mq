module.exports = function Service() {
  return {
    find() {
      return Promise.resolve('find from categories');
    },
    create() {
      throw new Error('i cant create');
    },
  };
};
