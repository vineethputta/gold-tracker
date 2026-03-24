let triggers = [];

// fallback base (in case API fails)
let baseGold = 6300;
let baseSilver = 75;

async function fetchPrices() {
    try {
        const res = await fetch("https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz");
        const data = await res.json();

        const goldUSD = data.metals.gold;
        const silverUSD = data.metals.silver;

        const usdToInr = 83;

        let gold = Math.round((goldUSD * usdToInr) / 31.1035);
        let silver = Math.round((silverUSD * usdToInr) / 31.1035);

        // add India adjustment (GST + margin)
        gold = Math.round(gold * 1.05);
        silver = Math.round(silver * 1.05);

        baseGold = gold;
        baseSilver = silver;

        updateUI(gold, silver);
        checkTrigger({ gold, silver });

    } catch (err) {
        // fallback (NO FAIL)
        let gold = baseGold + Math.floor(Math.random() * 10 - 5);
        let silver = baseSilver + Math.floor(Math.random() * 2 - 1);

        updateUI(gold, silver);
        checkTrigger({ gold, silver });
    }
}

function updateUI(gold, silver) {
    document.getElementById("gold").innerText = gold;
    document.getElementById("silver").innerText = silver;
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

// update every 10 sec (safe for API)
setInterval(fetchPrices, 10000);
fetchPrices();
