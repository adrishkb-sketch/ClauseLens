from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.pdf_parser import extract_text_from_pdf
from services.prompt_builder import build_prompt
from services.ai_service import analyze_document

app = Flask(__name__)
CORS(app)


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        doc_type = request.form.get("docType", "other")

        file = request.files.get("file")
        text_input = request.form.get("text")

        # ✅ HANDLE BOTH INPUT TYPES
        if file and file.filename != "":
            text = extract_text_from_pdf(file)

        elif text_input and text_input.strip() != "":
            text = text_input

        else:
            return jsonify({"error": "No input provided"}), 400

        # Prevent huge input crash
        text = text[:12000]

        # Build AI prompt
        prompt = build_prompt(doc_type, text)

        # Get AI result
        result = analyze_document(prompt)

        return jsonify({
            "status": "success",
            "docType": doc_type,
            "result": result
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)