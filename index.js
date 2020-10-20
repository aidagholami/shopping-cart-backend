const express = require('express');
const dotenv = require('dotenv');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');

dotenv.config();

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost/test';

const app = express();
app.use(bodyParser.json());

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const Product = mongoose.model('products', new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  image: String,
  title: String,
  description: String,
  price: Number,
  availableSizes: [String]
}))

app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save()
  res.send(savedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
})

const Order = mongoose.model('order', new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  email: String,
  name: String,
  address: String,
  total: Number,
  cartItems: [{
    _id: String,
    title: String,
    price: Number,
    count: Number
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }))

app.post('/api/orders', async (req, res) => {
  if (!req.body.name ||
    !req.body.email ||
    !req.body.address ||
    !req.body.total ||
    !req.body.cartItems) {
    return res.send({ message: 'Data is required.' });
  }
  const order = await Order(req.body).save();
  res.send(order);
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`serve is on at ${port}`));