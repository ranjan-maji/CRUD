const express = require('express');
require('./db/conn.js');
const employeeRouter = require('./routers/allApi');


const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())

app.use(employeeRouter);




app.listen(port, () => {
    console.log(`connecting is setup at ${port}`);
})
