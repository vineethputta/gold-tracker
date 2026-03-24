let triggers = [];

// update UI
function updateUI(gold, silver) {
    document.getElementById("gold").innerText = gold;
    document.getElementById("silver").innerText = silver;
}

// REAL WORKING API (no block)
async function fetchPrices() {
    try {
        const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=XAU");
        const data = await res.json();

        // gold price in USD (1 XAU)
        const usdPerGold = 1 / data.data.rates.USD;

        // convert USD → INR
        const usdToInr = 83;

        // ounce → gram
        let gold = (usdPerGold * usdToInr) / 31.1035;

        // Indian adjustment (GST + margin)
        gold = Math.round(gold * 1.05);

        // silver approximate ratio (gold:silver ≈ 80:1)
        let silver = Math.round(gold / 80);

        updateUI(gold, silver);
        checkTrigger({ gold, silver });

    } catch (err) {
        console.log("API failed");
    }
}

function setTrigger() {
    const type = document.getElementById("type").value;
    const price = document.getElementById("price").value;

    triggers.push({ type, price });

    alert("✅ Alert set!");
}

function checkTrigger(data) {
    triggers.forEach(t => {
        if (
            (t.type === "gold" && data.gold >= t.price) ||
            (t.type === "silver" && data.silver >= t.price)
        ) {
            alert(`🚨 ${t.type} reached ₹${t.price}`);
        }
    });
}

// refresh every 5 sec
setInterval(fetchPrices, 5000);
fetchPrices();
