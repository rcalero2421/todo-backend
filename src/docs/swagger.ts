import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              example: 200,
            },
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'User created',
            },
            data: {
              type: 'object',
              nullable: true,
              example: {
                id: 'uuid-v4',
                email: 'user@example.com',
                role: 'user',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/interfaces/controllers/*.ts'],
});
