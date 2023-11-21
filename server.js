const express = require("express");
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
    const client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('latihan');
        const collection = db.collection('product');

    } catch (error) {
        console.error('Koneksi ke MongoDB gagal:', error);
    }
}

main().catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./app/router/router")(app);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
