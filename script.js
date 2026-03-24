let triggers = [];

async function fetchPrices() {
    try {
        // Fetch gold price from CoinGecko (works in browser)
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=inr");
        const data = await res.json();

        const goldPerOunce = data["tether-gold"].inr;

        // Convert ounce → gram
        const gold = Math.round(goldPerOunce / 31.1035);

        // Approx silver (ratio)
        const silver = Math.round(gold / 80);

        document.getElementById("gold").innerText = gold;
        document.getElementById("silver").innerText = silver;

        checkTrigger({ gold, silver });

    } catch (e) {
        console.log("Error fetching price");
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

// update every second
setInterval(fetchPrices, 1000);
fetchPrices();
