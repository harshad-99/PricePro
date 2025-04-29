document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("fileInput");
    formData.append("file", fileInput.files[0]);

    try {
        let response = await fetch("http://127.0.0.1:8000/upload/", {
            method: "POST",
            body: formData,
        });

        let result = await response.json();

        if (!result || !result.predictions || !Array.isArray(result.predictions)) {
            console.error("Unexpected response format:", result);
            document.getElementById("output").innerHTML = "<p style='color:red;'>Invalid response from server.</p>";
            return;
        }

        // Extract Predicted Net Profit
// Display Predicted Net Profit without textbox
    const netProfit = parseFloat(result.predictions[0].Predicted_Net_Profit);
    document.getElementById("predictedNetProfit").innerHTML = `<h3>Predicted Net Profit: ${netProfit.toFixed(2)}</h3>`;


        // Display prediction accuracy
        let accuracyText = result.accuracy !== null ? `<h3>Prediction Accuracy: ${result.accuracy}%</h3>` : "<h3>Accuracy could not be calculated.</h3>";
        document.getElementById("accuracy").innerHTML = accuracyText;

        // Create table rows
        let tableRows = "";
        result.predictions.forEach(row => {
            tableRows += `
            <tr>
                <td>${row["Net profit"] || "N/A"}</td>  
                <td>${parseFloat(row.Predicted_Net_Profit).toFixed(2)}</td>
                <td>${row.Difference !== null ? row.Difference.toFixed(2) : "N/A"}</td>
            </tr>
        `;
    });

        document.getElementById("resultsTableBody").innerHTML = tableRows;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("output").innerHTML = "<p style='color:red;'>An error occurred while processing the file.</p>";
    }
});
    fetch("/predict", {
        method: "POST",
        body: new FormData(document.getElementById("predictionForm"))
    })
    .then(response => response.json())
    .then(data => {
        if (data.predictions.length > 0) {
            let predictedNetProfit = data.predictions[0].Predicted_Net_Profit;
            document.getElementById("netProfitOutput").innerText = predictedNetProfit;
        } else {
            document.getElementById("netProfitOutput").innerText = "Error: No prediction";
        }
    })
    .catch(error => console.error("Error fetching prediction:", error));

function calculateStockPrice() {
    let netProfitText = document.getElementById("netProfitOutput").innerText.trim();
    let netProfit = parseFloat(netProfitText);
    let sharesOutstanding = parseFloat(document.getElementById("sharesOutstanding").value);
    let peRatio = parseFloat(document.getElementById("peRatio").value);

    // Debugging: Check what values are being retrieved
    console.log("Net Profit:", netProfitText, "Parsed:", netProfit);
    console.log("Shares Outstanding:", sharesOutstanding);
    console.log("PE Ratio:", peRatio);

    if (isNaN(netProfit) || isNaN(sharesOutstanding) || isNaN(peRatio) || sharesOutstanding <= 0) {
        alert("Please enter valid values.");
        return;
    }

    let eps = netProfit / sharesOutstanding;
    let stockPrice = eps * peRatio;

    document.getElementById("stockPriceOutput").innerText = "₹" + stockPrice.toFixed(2);
}

