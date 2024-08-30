const express = require('express');
// cors cho phép truy cập http local server
const cors = require('cors');
const app = express();

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

});

