const express = require("express");
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('./app/public'));




require("./app/router/router")(app);

app.listen(5000, () => console.log('running on http://localhost:5000'));
