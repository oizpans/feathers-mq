const { logger } = require('../../../../lib');

module.exports = {
  after: {
    all: [logger()],
  },
};
