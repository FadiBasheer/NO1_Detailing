import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mobile-detailing')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));


// Routes
app.get('/', (req, res) => {
  res.send('Mobile Detailing Backend is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
