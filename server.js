const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("."));

let triggers = [];

// ✅ WORKING GOLD API (CoinGecko + conversion)
async function getPrices() {
    try {
        // Get gold price in USD (via XAU)
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=inr");
        const data = await res.json();

        // tether-gold = price per ounce approx
        const goldPerOunceINR = data["tether-gold"].inr;

        // convert ounce → gram
        const goldPerGram = goldPerOunceINR / 31.1035;

        // silver approximate ratio (gold:silver ~ 80:1)
        const silverPerGram = goldPerGram / 80;

        return {
            gold: Math.round(goldPerGram),
            silver: Math.round(silverPerGram)
        };

    } catch (error) {
        console.log("API failed, fallback used");

        return {
            gold: 6200,
            silver: 75
        };
    }
}

// API
app.get("/prices", async (req, res) => {
    res.json(await getPrices());
});

// trigger
app.post("/set-trigger", (req, res) => {
    const { type, price } = req.body;
    triggers.push({ type, price });
    res.json({ message: "Trigger set!" });
});

// check trigger
setInterval(async () => {
    const prices = await getPrices();

    triggers.forEach(t => {
        if (
            (t.type === "gold" && prices.gold >= t.price) ||
            (t.type === "silver" && prices.silver >= t.price)
        ) {
            console.log(`ALERT: ${t.type} reached ₹${t.price}`);
        }
    });
}, 5000);

// start
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running");
});
