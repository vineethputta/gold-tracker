const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.static("."));

async function getPrices() {
    try {
        const res = await fetch("https://api.metals.live/v1/spot");
        const data = await res.json();

        let gold = data.find(d => d.gold)?.gold;
        let silver = data.find(d => d.silver)?.silver;

        return { gold, silver };
    } catch {
        return { gold: 0, silver: 0 };
    }
}

app.get("/prices", async (req, res) => {
    const prices = await getPrices();
    res.json(prices);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running");
});
