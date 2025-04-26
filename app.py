import pandas as pd
import joblib
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io
import numpy as np

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("random_forest_model.pkl")  # Ensure the model exists

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read Excel file
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        if hasattr(model, "feature_names_in_"):
            FEATURE_COLUMNS = model.feature_names_in_.tolist()  # Extract feature names from the model
        else:
            return {"error": "The model does not contain feature names. Please specify them manually."}

# Filter the DataFrame to include only the required columns
        df_filtered = df[FEATURE_COLUMNS]
        # Make predictions
        df["Predicted_Net_Profit"] = model.predict(df_filtered)

        # If "Net_profit" column exists, calculate difference
        if "Net profit" in df.columns:
            df["Difference"] = abs(df["Net profit"] - df["Predicted_Net_Profit"])
            df["Percentage_Error"] = (df["Difference"] / df["Net profit"]) * 100
            mape = df["Percentage_Error"].mean()
            accuracy = round(100 - mape, 2)
        else:
            df["Net profit"] = None  # Add this line to prevent KeyError
            df["Difference"] = None
            accuracy = None
        

        # Convert to JSON format
        return {
            "accuracy": accuracy,
            "predictions": df[["Net profit", "Predicted_Net_Profit", "Difference"]].to_dict(orient="records")
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
