import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // You can also use 'swagger: "2.0"' here
  info: {
    title: 'SE Consultant APIs',
    version: '1.0.0',
    description: 'SE Consultant APIs',
  },
  servers: [
    {
      url: 'http://localhost:3003', // Change to your server URL
      description: 'Development server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
