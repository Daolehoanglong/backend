const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Bill = require('../models/Bill');
const Test = require('../models/Test');
const multer = require("multer");
const app = express();
// Cấu hình multer để lưu file vào thư mục "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Thư mục lưu file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Đổi tên file cho duy nhất
    },
});

// Tạo middleware upload với cấu hình storage
const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 10 * 1024 * 1024, // Giới hạn kích thước mỗi file là 10MB
    //     files: 5, // Giới hạn số lượng file có thể tải lên cùng lúc là 5
    // },
});

// index view
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/NewProduct', async (req, res) => {
    try {
        const newestProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(4);
        res.json(newestProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/hot', async (req, res) => {
    try {
        const hotProducts = await Product.find({ hot: 1 })
            .limit(4);
        res.json(hotProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Detail view
router.get('/hotDetail', async (req, res) => {
    try {
        const hotProducts = await Product.find({ hot: 1 })
        res.json(hotProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/latest', async (req, res) => {
    try {
        const newestProducts = await Product.find()
            .sort({ createdAt: -1 })
        res.json(newestProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/price-desc', async (req, res) => {
    try {
        const priceDescProducts = await Product.find()
            .sort({ price: -1 })
        res.json(priceDescProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/price-asc', async (req, res) => {
    try {
        const priceAscProducts = await Product.find()
            .sort({ price: 1 })
        res.json(priceAscProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//Start Cart API
router.post('/addCart', async (req, res) => {
    const lastCart = await Cart.find()
        .sort({ id: -1 })
        .limit(1);
    const id = lastCart[0] ? lastCart[0].id + 1 : 1
    const cart = new Cart({
        Name: req.body.Name,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Address: req.body.Address,
        Total: req.body.Total,
        city: req.body.city,
        district: req.body.district,
        ward: req.body.ward,
        id
    })
    try {
        const newProduct = await cart.save();
        res.status(201).json(newProduct);

    } catch (err) {
        console.error('Error occurred while creating a new photo:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/addBill', async (req, res) => {
    const lastBill = await Bill.find()
        .sort({ id: -1 })
        .limit(1);
    const id = lastBill[0] ? lastBill[0].id + 1 : 1
    const bill = new Bill({
        Name: req.body.Name,
        Price: req.body.Price,
        idCart: req.body.idCart,
        Total: req.body.Total,
        id
    })
    try {
        const newProduct = await bill.save();
        res.status(201).json(newProduct);

    } catch (err) {
        console.error('Error occurred while creating a new photo:', err);
        res.status(500).json({ message: err.message });
    }
});



// end Cart API
// Route to get products by category
router.get('/category/:category_id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.category_id);
        const products = await Product.find({ categoryID: categoryId });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//crud product routes
router.post("/addProduct", async (req, res) => {
    try {
        const lastProduct = await Product.find().sort({ id: -1 }).limit(1);
        const id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
        // Tạo đối tượng sản phẩm mới
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            categoryID: req.body.categoryID,
            img: image = req.body.imgs,
            hot: 0,
            id,
        });
        // Lưu sản phẩm mới vào CSDL
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Error occurred while creating a new product:", err);
        res.status(500).json({ message: err.message });
    }
});
router.put("/edit", async (req, res) => {
    try {
        const id = req.body.id;
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            categoryID: req.body.categoryID,
            img: req.body.imgs,
            hot: 0
        };
        // Tìm kiếm và cập nhật sản phẩm
        const updatedProduct = await Product.findOneAndUpdate(
            { id: id }, // Điều kiện tìm kiếm sản phẩm
            { $set: updateData }, // Dữ liệu cần cập nhật
            { new: true, runValidators: true } // Tùy chọn trả về tài liệu mới và kiểm tra ràng buộc
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Error occurred while updating the product:", err);
        res.status(500).json({ message: err.message });
    }
});
router.delete('/deleteProduct/:id', async (req, res) => {
    // console.log(req.params.id);
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findOneAndDelete({ id: id });
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.log(req.params.id);
        res.status(500).json({ message: err.message });
    }
});

// end crude route to post


router.get('/search/:keyword', async (req, res) => {
    try {
        const productName = req.params.keyword;

        // Kiểm tra tính hợp lệ của productName (nếu cần)
        // ...

        // Tìm kiếm các sản phẩm có tên chứa chuỗi productName
        const products = await Product.find({ name: { $regex: productName, $options: 'i' } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with this name' });
        }

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        image: req.body.image
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
