module.exports = function wrapError(error) {
  error = error || {};

  const __mqError = {};

  const keysToPersist = [
    'type',
    'name',
    'message',
    'code',
    'className',
    'errors',
    'data', // Other keys that are not supported can be placed here.
  ];

  keysToPersist.forEach((key) => {
    __mqError[key] = error[key];
  });

  error.__mqError = __mqError;

  return error;
};
