let triggers = [];

// base realistic Indian prices
let goldPrice = 6350;
let silverPrice = 75;

function fetchPrices() {
    try {
        // simulate small real market movement
        goldPrice += Math.floor(Math.random() * 6 - 3);
        silverPrice += Math.floor(Math.random() * 2 - 1);

        // safety (avoid negative or NaN)
        if (!goldPrice || isNaN(goldPrice)) goldPrice = 6350;
        if (!silverPrice || isNaN(silverPrice)) silverPrice = 75;

        document.getElementById("gold").innerText = goldPrice;
        document.getElementById("silver").innerText = silverPrice;

        checkTrigger({ gold: goldPrice, silver: silverPrice });

    } catch (e) {
        console.log("Error:", e);
    }
}

function setTrigger() {
    const type = document.getElementById("type").value;
    const price = Number(document.getElementById("price").value);

    if (!price) {
        alert("❌ Enter valid price");
        return;
    }

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

// update every 3 sec (smooth)
setInterval(fetchPrices, 3000);
fetchPrices();
