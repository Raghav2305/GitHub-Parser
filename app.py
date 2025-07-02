from flask import Flask, request, jsonify
from repo_scanner.cloneRepo import clone_repo
from repo_scanner.categorizer import get_categorized_files
from repo_scanner.summarizer import generate_summary_with_gemini
from flask_cors import CORS
import ssl # Import the ssl module

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/summarize", methods=["POST"])
def summarize_repo():
    data = request.get_json()
    repo_url = data.get("repo_url")

    if not repo_url:
        return jsonify({"error": "Missing 'repo_url' in request body"}), 400

    try:
        # Step 1: Clone repo
        local_path = clone_repo(repo_url)

        # Step 2: Categorize files
        categorized_files = get_categorized_files(local_path)

        # Step 3: Generate summary
        summary = generate_summary_with_gemini(categorized_files)

        return jsonify({
            "summary": summary,
            "structure": categorized_files
        })

    except Exception as e:
        # It's good practice to log the full exception details in a real app
        print(f"Error in summarize_repo: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Define the paths to your generated SSL certificate and key
    CERT_FILE = 'cert.pem'
    KEY_FILE = 'key.pem'

    try:
        # Create an SSL context
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(CERT_FILE, KEY_FILE)
        print(f"Flask server will run on HTTPS: https://0.0.0.0:5000/")
        print("Remember to update your frontend (Chrome extension) to use 'https://' for the endpoint.")
        print("During development, you may encounter browser warnings about the self-signed certificate.")
        print("If you change the IP address your content.js uses, you'll need to regenerate the certificate with the correct Common Name.")
        app.run(host='0.0.0.0', port=5000, debug=True, ssl_context=context)
    except FileNotFoundError:
        print(f"ERROR: SSL certificates ({CERT_FILE} and {KEY_FILE}) not found.")
        print("Please generate them using OpenSSL in this directory first.")
        print("Example commands: `openssl genrsa -out key.pem 2048` and `openssl req -new -x509 -key key.pem -out cert.pem -days 365`")
        print("For 'Common Name', enter the IP address your extension will connect to (e.g., 192.168.96.170).")
        print("Exiting...")
        # Optionally, run without SSL for debugging if you want, but it won't solve the mixed content error
        # app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"An unexpected error occurred while starting Flask server with SSL: {e}")
        print("Falling back to HTTP (this will not solve the mixed content error).")
        app.run(host='0.0.0.0', port=5000, debug=True)