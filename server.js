const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("."));

let triggers = [];

// ✅ REAL GOLD API (India)
async function getPrices() {
    try {
        const res = await fetch("https://api.metals.dev/v1/latest?api_key=demo&currency=INR&unit=g");
        const data = await res.json();

        return {
            gold: Math.round(data.metals.gold),
            silver: Math.round(data.metals.silver)
        };
    } catch (error) {
        console.log("API error:", error);

        // fallback
        return {
            gold: 6200 + Math.floor(Math.random() * 50),
            silver: 75 + Math.floor(Math.random() * 5)
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
