import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options= {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping Cart API',
            version: '1.0.0',
            description: 'Shopping Cart API documentation'
        },
        servers: [{
            url: 'http://localhost:3000'
        }]
    },
    apis: ['./docs/*.ts','./src/route/*.ts']
}