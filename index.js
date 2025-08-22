import express from 'express';
import axios from 'axios';
const app = express();
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
