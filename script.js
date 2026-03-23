async function fetchPrices() {
    const res = await fetch("/prices");
    const data = await res.json();

    document.getElementById("gold").innerText = data.gold;
    document.getElementById("silver").innerText = data.silver;
}

setInterval(fetchPrices, 5000);
fetchPrices();
