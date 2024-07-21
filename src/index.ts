const express = require('express');
import logger from './utils/logger';

const app = express();





app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
