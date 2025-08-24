import express from 'express';
import axios from 'axios';
import cors from 'cors';
import connectDB from "./db.js";
import dotenv from 'dotenv';
import Resend from 'resend';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from './helpers/sendVerificationEmail.ts';
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_TTL_SECONDS = process.env.OTP_TTL_SECONDS;
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

dotenv.config({
  path: './.env'
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true,
}))
const port = 5000;




app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/step1', async (req, res) => {
  try {
    const response = await axios.get("http://interview.surya-digital.in/get-electronics");
    const products = response.data;
    const cleanedProducts = products.map(item => ({
      product_id: item?.productId ?? null,
      product_name: item?.productName ?? null,
      brand_name: item?.brandName ?? null,
      category_name: item?.category ?? null,
      description_text: item?.description ?? null,
      price: item?.price ?? null,
      currency: item?.currency ?? null,
      processor: item?.processor ?? null,
      memory: item?.memory ?? null,
      release_date: item?.releaseDate ?? null,
      average_rating: item?.averageRating ?? null,
      rating_count: item?.ratingCount ?? null,
    }));
    const validProducts = cleanedProducts.filter(
      p => p.product_id !== null && p.product_name !== null
    );

    res.json(validProducts);


  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

app.get("/step2", async (req, res) => {
  try {
    const response = await axios.get("http://interview.surya-digital.in/get-electronics");
    const products = response.data;

    const { release_date_start, release_date_end } = req.params;
    let startDate = release_date_start ? new Date(release_date_start) : null;
    let endDate = release_date_end ? new Date(release_date_end) : null;
    if ((release_date_start && isNaN(startDate)) || (release_date_end && isNaN(endDate))) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }
    if (startDate) {
      products = products.filter(p => new Date(p.releaseDate) >= startDate);
    }
    if (endDate) {
      products = products.filter(p => new Date(p.releaseDate) <= endDate);
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/send-otp", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const otp = generateOtp();
  const token = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_TTL_SECONDS });

  sendVerificationEmail(name, email, otp).then(() => {
    res.json({ message: "OTP sent successfully", token });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP email" });
  });


});


app.post("/verify-otp", (req, res) => {
  const { email, token, otp } = req.body;
  if (!token || !otp || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email || decoded.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});



connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    }
    );
  }).catch(err => {
    console.error("Failed to connect to the database", err);
  });





