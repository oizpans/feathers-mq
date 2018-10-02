module.exports = {
  before: {
    remove: [
      function remove(context) {
        // console.log(Object.keys(context.params));
        return Promise.resolve(context);
      },
    ],
    create: [
      function remove(context) {
        console.log('i was called here');
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
