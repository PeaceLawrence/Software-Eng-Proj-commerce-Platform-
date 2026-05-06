require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./src/routes/aiRoutes');
const productRoutes = require('./src/routes/productRoutes');
const { createProductTable } = require('./src/models/Product');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const start = async () => {
  await createProductTable();
  console.log('Database ready');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();