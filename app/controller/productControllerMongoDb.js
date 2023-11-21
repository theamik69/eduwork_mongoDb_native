const Product = require('../models/product');

module.exports = {
    getProducts: async (req, res) => {
        try {
            const response = await Product.findAll();
            res.json(response);
        } catch (error) {
            console.log(error.message);
        }
    },
    getProductById: async (req, res) => {
        try {
            const response = await Product.findOne({
                where: {
                    id: req.params.id,
                },
            });
            res.json(response);
        } catch (error) {
            console.log(error.message);
        }
    },
    saveProduct: async (req, res) => {
        const { category, description, name, price } = req.body;

        try {
            const newProduct = new Product({
                category,
                description,
                name,
                price,
            });

            const savedProduct = await newProduct.save();

            res.status(200).send({
                auth: true,
                message: "Produk sukses di buat",
                product: savedProduct,
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
        try {
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

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: updatedFields },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ msg: "Produk tidak ditemukan" });
            }

            res.status(200).send({
                auth: true,
                message: "Produk berhasil diperbarui",
                product: updatedProduct,
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
        try {
            const productId = req.params.id;
    
            const deletedProduct = await Product.findByIdAndDelete(productId);
    
            if (!deletedProduct) {
                return res.status(404).json({ msg: "Produk tidak ditemukan" });
            }
    
            res.status(200).json({ msg: "Produk berhasil dihapus" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: "Gagal menghapus produk" });
        }
    },
};
