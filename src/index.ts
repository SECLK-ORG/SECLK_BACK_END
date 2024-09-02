const express = require('express');
import logger from './utils/logger';
import { connect } from './database/database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swaggerConfig';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import cors from 'cors';
import 'dotenv/config';
import categoryRouter from './routes/category.routes';
import positionRouter from './routes/position.routes';



const app = express();
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const PORT = process.env.PORT || "9090";
// Serve Swagger docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.listen(PORT, () => {
  connect();
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
 
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/positions', positionRouter);

