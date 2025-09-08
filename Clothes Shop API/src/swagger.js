const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "Clothes Shop API", 
            version: "1.0.0", 
            description: "API docs for my project"
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUI }