const { hooks: logger } = require('../../../../lib');

module.exports = {
  after: {
    all: [logger()],
  },
};
