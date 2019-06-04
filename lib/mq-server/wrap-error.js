module.exports = function wrapError(error) {
  error = error || {};

  const __mqError = {};

  Object.getOwnPropertyNames(error).forEach((key) => {
    __mqError[key] = error[key];
  });

  error.__mqError = __mqError;

  return error;
};
