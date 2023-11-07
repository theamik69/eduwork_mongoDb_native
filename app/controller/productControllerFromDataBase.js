const { Product } = require("../models");
const path = require("path");
const fs = require("fs");

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
        if (req.file === null) return res.status(400).json({ msg: "Tidak ada file di upload" });
        const category = req.body.category;
        const description = req.body.description;
        const name = req.body.name;
        const price = req.body.price;
        const file = req.file;
        const id = `image-${+new Date()}`;
        const fileSize = file.size;
        const ext = path.extname(file.originalname);
        const fileName = file.originalname;
        const url = `${req.protocol}://${req.get("host")}/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Format gambar yang di izinkan .png .jpg .jpeg" });
        if (fileSize > 5000000)
            return res.status(422).json({ msg: "Ukuran gambar tidak lebih dari 5 MB" });

        const target = path.join('public', file.originalname);
        fs.renameSync(file.path, target);

        try {
            const product = await Product.create({
                id: id,
                category,
                description,
                name,
                price,
                image: fileName,
                url,
            });

            res.status(200).send({
                auth: true,
                message: "Produk sukses di buat",
                product,
            });
        } catch (error) {
            console.log(error.message);
        }

    },

    updateProduct: async (req, res) => {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!product) return res.status(404).json({ msg: "Tidak terdapat data" });
    const category = req.body.category !== undefined ? req.body.category : product.category;
    const description = req.body.description !== undefined ? req.body.description : product.description;
    const name = req.body.name !== undefined ? req.body.name : product.name;
    const price = req.body.price !== undefined ? req.body.price : product.price;

    let fileName = "";
    if (req.file === undefined) {
      fileName = product.image;
    } else {
      const file = req.file;
      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      fileName = `${+new Date()}${ext}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Format gambar yang di izinkan .png .jpg .jpeg" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Ukuran gambar tidak lebih dari 5 MB" });

      const targetPicture = path.join('public', file.originalname);
      fs.renameSync(file.path, targetPicture);

      const target = path.join('public', product.image);
      fs.unlinkSync(target);
    }

    const url = `${req.protocol}://${req.get("host")}/${fileName}`;

        try {
            await Product.update(
                {
                    category: category,
                    description: description,
                    name: name,
                    price: price,
                    image: fileName,
                    url: url,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).send({
                auth: true,
                message: "Produk berhasil di update",
            });
        } catch (error) {
            console.log(error.message);
        }
    },

    deleteProduct: async (req, res) => {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ada" });

        try {
            const filepath = `./app/public/images/${product.image}`;
            fs.unlinkSync(filepath);
            await Product.destroy({
                where: {
                    id: req.params.id,
                },
            });
            res.status(200).json({ msg: "Produk berhasil di delete" });
        } catch (error) {
            console.log(error.message);
        }
    },
};
