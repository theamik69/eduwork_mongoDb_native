const { MongoClient, ObjectId } = require('mongodb');


async function connectToDatabase() {
    const client = new MongoClient('mongodb://localhost:27017/latihan', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        return client.db('latihan').collection('product');
    } catch (error) {
        console.error('Koneksi ke database gagal:', error);
    }
}

module.exports = {
   
    getProducts: async (req, res) => {
        try {
            const collection = await connectToDatabase();
            const response = await collection.find().toArray();
            res.json(response);
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                auth: false,
                message: "Gagal mendapatkan produk",
            });
        }
    },
    
    getProductById: async (req, res) => {
        try {
            const collection = await connectToDatabase();
            const response = await collection.findOne({ _id: ObjectId(req.params.id) });
            res.json(response);
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                auth: false,
                message: "Gagal mendapatkan produk",
            });
        }
    },
    
    saveProduct: async (req, res) => {
        const { category, description, name, price } = req.body;

        try {
            const collection = await connectToDatabase();
            const result = await collection.insertOne({ category, description, name, price });
            res.status(200).send({
                auth: true,
                message: "Produk sukses dibuat",
                product: result.ops[0],
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                auth: false,
                message: "Gagal menyimpan produk",
            });
        }
    },
    
    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const updatedFields = {};

        if (req.body.category !== undefined) {
            updatedFields.category = req.body.category;
        }
        if (req.body.description !== undefined) {
            updatedFields.description = req.body.description;
        }
        if (req.body.name !== undefined) {
            updatedFields.name = req.body.name;
        }
        if (req.body.price !== undefined) {
            updatedFields.price = req.body.price;
        }

        try {
            const collection = await connectToDatabase();
            const result = await collection.findOneAndUpdate(
                { _id: ObjectId(productId) },
                { $set: updatedFields },
                { returnOriginal: false }
            );
            if (!result.value) {
                return res.status(404).json({ msg: "Produk tidak ditemukan" });
            }
            res.status(200).send({
                auth: true,
                message: "Produk berhasil diperbarui",
                product: result.value,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                auth: false,
                message: "Gagal memperbarui produk",
            });
        }
    },
    
    deleteProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const collection = await connectToDatabase();
            const result = await collection.findOneAndDelete({ _id: ObjectId(productId) });
            if (!result.value) {
                return res.status(404).json({ msg: "Produk tidak ditemukan" });
            }
            res.status(200).json({ msg: "Produk berhasil dihapus" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: "Gagal menghapus produk" });
        }
    },
};
