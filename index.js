const express = require('express');
// cors cho phép truy cập http local server
const cors = require('cors');
const app = express();
// const brandRouter = require('./routes/brand');
// const categoriesRouter = require('./routes/Categories');
const categoriesRouter = require('./routes/Categories');
const productRouter = require('./routes/products');
const userRouter = require('./routes/user');
app.use(cors());
app.use(express.json());
// app.use('/brand', brandRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productRouter);
app.use('/user', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/categories`);
    console.log(`http://localhost:${PORT}/categories/1`);
    console.log(`http://localhost:${PORT}/products`);
    console.log(`http://localhost:${PORT}/products/10`);
    console.log(`http://localhost:${PORT}/products/category/2`);
    console.log(`http://localhost:${PORT}/products/top`);
    // console.log(`http://localhost:${PORT}/brand`);
});

