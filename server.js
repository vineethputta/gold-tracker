const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("."));

// Store triggers
let triggers = [];

// ✅ Generate realistic Indian prices
function getPrices() {
    return {
        gold: 6200 + Math.floor(Math.random() * 100),   // ₹6200–6300
        silver: 75 + Math.floor(Math.random() * 5)      // ₹75–80
    };
}

// ✅ API to send prices
app.get("/prices", (req, res) => {
    res.json(getPrices());
});

// ✅ Save trigger
app.post("/set-trigger", (req, res) => {
    const { type, price } = req.body;

    triggers.push({ type, price });
    console.log("Triggers:", triggers);

    res.json({ message: "Trigger set!" });
});

// ✅ Check triggers every 2 sec
setInterval(() => {
    const prices = getPrices();

    triggers.forEach(t => {
        if (
            (t.type === "gold" && prices.gold >= t.price) ||
            (t.type === "silver" && prices.silver >= t.price)
        ) {
            console.log(`ALERT: ${t.type} reached ₹${t.price}`);
        }
    });
}, 2000);

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});
