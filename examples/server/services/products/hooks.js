module.exports = {
  before: {
    remove: [
      function remove(context) {
        // console.log(Object.keys(context.params));
        return Promise.resolve(context);
      },
    ],
    patch: [
      function patch(context) {
        // console.log(Object.keys(context.params));
        return Promise.resolve(context);
      },
    ],
  },
};
