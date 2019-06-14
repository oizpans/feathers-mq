module.exports = function wrapError(error) {
  const newError = {};

  const __mqError = {};

  Object.getOwnPropertyNames(error).forEach((key) => {
    newError[key] = error[key]; // For older versions
    __mqError[key] = error[key];
  });

  newError.__mqError = __mqError;
  return newError;
};
