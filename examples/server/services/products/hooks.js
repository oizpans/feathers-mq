module.exports = {
  before: {
    remove: [
      function(context){
        console.log(Object.keys(context.params));
        return Promise.resolve(context);
      }
    ],
    patch: [
      function(context){
        console.log(Object.keys(context.params));
        return Promise.resolve(context);
      }
    ]
  }
};
