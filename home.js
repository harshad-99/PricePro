document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let fileInput = document.getElementById("fileInput");
    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        let response = await fetch("http://127.0.0.1:8000/upload/", {
            method: "POST",
            body: formData,
        });

        let result = await response.json();

        if (!result || !result.predictions || !Array.isArray(result.predictions) || result.predictions.length === 0) {
            console.error("Unexpected response format:", result);
            document.getElementById("output").innerHTML = "<p style='color:red;'>Invalid response from server.</p>";
            return;
        }

        // Extract and Display Predicted Net Profit
        let predictedNetProfit = parseFloat(result.predictions[0].Predicted_Net_Profit);
        document.getElementById("predictedNetProfit").innerHTML = `<h3>Predicted Net Profit: ₹${predictedNetProfit.toFixed(2)}</h3>`;

        // Display Prediction Accuracy
        let accuracyText = result.accuracy !== null ? `<h3>Prediction Accuracy: ${result.accuracy.toFixed(2)}%</h3>` : "<h3>Accuracy could not be calculated.</h3>";
        document.getElementById("accuracy").innerHTML = accuracyText;

        // Populate Table with Predictions
        let tableRows = result.predictions.map(row => `
            <tr>
                <td>${row["Net profit"] !== undefined ? row["Net profit"].toFixed(2) : "N/A"}</td>  
                <td>${row.Predicted_Net_Profit !== undefined ? row.Predicted_Net_Profit.toFixed(2) : "N/A"}</td>
                <td>${row.Difference !== undefined ? row.Difference.toFixed(2) : "N/A"}</td>
            </tr>
        `).join("");

        document.getElementById("resultsTableBody").innerHTML = tableRows;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("output").innerHTML = "<p style='color:red;'>An error occurred while processing the file.</p>";
    }
    
});
document.getElementById("signOutButton").addEventListener('click', (event) => {
    window.location.href ="login.html";
});

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
