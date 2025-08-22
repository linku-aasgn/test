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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
