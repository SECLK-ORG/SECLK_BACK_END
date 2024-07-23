const express = require('express');
import logger from './utils/logger';
import { connect } from './database/database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swaggerConfig';
import userRoutes from './routes/user.routes';

import 'dotenv/config';



const app = express();
// Middleware to parse JSON
app.use(express.json());


const PORT = process.env.PORT || "3000";
// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.listen(PORT, () => {
  connect();
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
 
});

app.use('/user', userRoutes);
