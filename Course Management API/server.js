const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}....`);
})