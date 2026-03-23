const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("."));

// Store triggers
let triggers = [];

// ✅ Get Gold & Silver Prices
async function getPrices() {
    try {
        const res = await fetch("https://api.metals.live/v1/spot");
        const data = await res.json();

        let gold = 0;
        let silver = 0;

        data.forEach(item => {
            if (item.gold) gold = item.gold;
            if (item.silver) silver = item.silver;
        });

        // Convert USD → INR approx
        return {
            gold: Math.round(gold * 83),
            silver: Math.round(silver * 83)
        };
    } catch (error) {
        console.log("Error fetching prices:", error);
        return { gold: 0, silver: 0 };
    }
}

// ✅ API to send prices
app.get("/prices", async (req, res) => {
    const prices = await getPrices();
    res.json(prices);
});

// ✅ Save trigger
app.post("/set-trigger", (req, res) => {
    const { type, price } = req.body;

    triggers.push({ type, price });
    console.log("Trigger added:", triggers);

    res.json({ message: "Trigger set successfully" });
});

// ✅ Check trigger every 5 seconds
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

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});
