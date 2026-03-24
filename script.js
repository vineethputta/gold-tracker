let triggers = [];

// Base Indian prices (close to real)
let baseGold = 6300;
let baseSilver = 75;

function fetchPrices() {
    // simulate real-time fluctuation
    let gold = baseGold + Math.floor(Math.random() * 20 - 10);
    let silver = baseSilver + Math.floor(Math.random() * 2 - 1);

    document.getElementById("gold").innerText = gold;
    document.getElementById("silver").innerText = silver;

    checkTrigger({ gold, silver });
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
