let triggers = [];

async function fetchPrices() {
    const res = await fetch("/prices");
    const data = await res.json();

    document.getElementById("gold").innerText = data.gold;
    document.getElementById("silver").innerText = data.silver;

    checkTrigger(data);
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
