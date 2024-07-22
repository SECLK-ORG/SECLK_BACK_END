const express = require('express');
import logger from './utils/logger';
import { connect } from './database/database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swaggerConfig';
import 'dotenv/config';
const app = express();
const PORT = process.env.PORT || "3000";
// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  // console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
  connect();
});
