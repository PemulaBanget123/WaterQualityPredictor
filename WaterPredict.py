from flask import Flask, render_template, request, jsonify, flash
import joblib
import numpy as np
import pandas as pd
import os

import sys
print("Python executable:", sys.executable)
print("Python version:", sys.version)
import ipykernel
print("Kernel is running in:", ipykernel.__file__)

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a more secure key

# Load model, scaler, and threshold

# Define a static path (e.g., inside a "models" directory)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the absolute path of the current file
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")  # Static path for the model file

# Load the model
try:
    model_data = joblib.load(MODEL_PATH)
    clf_loaded = model_data["model"]       # Trained model
    scaler_loaded = model_data["scaler"]   # Scaler for normalization
    best_threshold_loaded = model_data["best_threshold"]  # Best threshold

    print(f"Loaded model with threshold: {best_threshold_loaded}")
except Exception as e:
    print(f"Error loading model: {e}")
    clf_loaded = None
    scaler_loaded = None
    best_threshold_loaded = None

# Route for Home
@app.route('/')
def home():
    return render_template('index.html')

# Route for About Us
@app.route('/AboutUs')
def AboutUs():
    return render_template('AboutUs.html')

# Route for Prediction Page
@app.route("/predict", methods=["GET"])
def predict_page():
    return render_template("predict.html")

# Route for Handling Predictions
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Extract form data
        input_features = [
            float(request.form["pH"]),
            float(request.form["Iron"]),
            float(request.form["Nitrate"]),
            float(request.form["Chloride"]),
            float(request.form["Turbidity"]),
            float(request.form["Fluoride"]),
            float(request.form["Copper"]),
            float(request.form["Odor"]),
            float(request.form["Chlorine"]),
            float(request.form["Manganese"]),
            float(request.form["Total Dissolved Solids"]),
        ]

        feature_names = ['pH', 'Iron', 'Nitrate', 'Chloride', 'Turbidity', 'Fluoride', 'Copper',
                         'Odor', 'Chlorine', 'Manganese', 'Total Dissolved Solids']

        # Convert input to DataFrame
        df = pd.DataFrame([input_features], columns=feature_names)

        # Ensure model & scaler are loaded
        if clf_loaded is None or scaler_loaded is None or best_threshold_loaded is None:
            return jsonify({"status": "error", "message": "Model or scaler is not loaded. Please check your model file."})

        # Normalize input data
        df_scaled = scaler_loaded.transform(df)

        # Get probability prediction
        proba = clf_loaded.predict_proba(df_scaled)[:, 1]  # Get probability for "safe"

        # Determine the result based on the threshold
        prediction = "safe" if proba[0] >= best_threshold_loaded else "not safe"

        return jsonify({"status": "success", "prediction": prediction})

    except ValueError as e:
        return jsonify({"status": "error", "message": f"Invalid input data: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)