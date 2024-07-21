const express = require('express');
import logger from './utils/logger';
import { connect } from './database/database';
import 'dotenv/config';
const app = express();
const PORT = process.env.PORT || "3000";





app.listen(PORT, () => {
  logger.info(`Server is running on port [${PORT}`);
  connect();
});
