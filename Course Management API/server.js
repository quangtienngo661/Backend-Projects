const app = require('./app');
require('dotenv').config();
const ENV = require('./configs/env');

const PORT = ENV.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${ENV.NODE_ENV} on ${PORT}....`);
});
