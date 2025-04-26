
function calculateStockPrice() {
    let netProfitText = document.getElementById("predictedNetProfit").innerText.replace(/[^\d.-]/g, ''); // Remove unwanted text
    let netProfit = parseFloat(netProfitText) ;  // 🔹 Convert to Cr
    let sharesOutstanding = parseFloat(document.getElementById("sharesOutstanding").value);
    let peRatio = parseFloat(document.getElementById("peRatio").value);

    // Debugging: Check converted values
    console.log("Net Profit (in Cr):", netProfit);
    console.log("Shares Outstanding:", sharesOutstanding);
    console.log("PE Ratio:", peRatio);

    if (isNaN(netProfit) || isNaN(sharesOutstanding) || isNaN(peRatio) || sharesOutstanding <= 0) {
        alert("Please enter valid values.");
        return;
    }

    let eps = netProfit / sharesOutstanding;
    let stockPrice = eps * peRatio;

    document.getElementById("stockPriceOutput").innerHTML = `<h3>Stock Price: ₹${stockPrice.toFixed(2)}</h3>`;
}

