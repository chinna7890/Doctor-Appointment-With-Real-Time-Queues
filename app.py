# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    prompt = f"""
    You are Medoc, a friendly AI medical assistant for college project use only. 
    Based on the symptoms provided: "{user_input}", respond with:
    - A simple, kind explanation (max 6 lines)
    - Severity (Mild / Moderate / Severe)
    - Recommend a suitable doctor or suggest rest/diet if mild
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": "Sorry, I couldn’t process that. Try again!"})

@app.route("/")
def serve_bot():
    return send_from_directory("static", "bot.html")

if __name__ == "__main__":
    app.run(debug=True)
