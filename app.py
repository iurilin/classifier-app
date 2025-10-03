import os
import requests
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

if not HF_API_TOKEN:
    print("Erro: Token da API do Hugging Face (HF_API_TOKEN) não encontrado.")
    print("Verifique seu arquivo .env")

headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

@app.route('/')
def index():
    return render_template('index.html')

def query_hf_api(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

@app.route('/classify', methods=['POST'])
def classify_email():
    if not HF_API_TOKEN:
        return jsonify({"error": "Token da API do Hugging Face não configurado."}), 500

    email_text = ""
    text_from_form = request.form.get('email_text', '')
    file_from_form = request.files.get('email_file')

    if file_from_form:
        filename = file_from_form.filename
        if filename.endswith('.txt'):
            email_text = file_from_form.read().decode('utf-8', errors='ignore')
        elif filename.endswith('.pdf'):
            try:
                pdf_content = io.BytesIO(file_from_form.read())
                reader = PyPDF2.PdfReader(pdf_content)
                text_parts = [page.extract_text() for page in reader.pages if page.extract_text()]
                email_text = "\n".join(text_parts)
            except Exception as e:
                return jsonify({"error": f"Não foi possível ler o arquivo PDF: {e}"}), 400
        else:
            return jsonify({"error": "Formato de arquivo não suportado. Use .txt ou .pdf"}), 400
    elif text_from_form:
        email_text = text_from_form
    else:
        return jsonify({"error": "Nenhum texto ou arquivo fornecido."}), 400
    
    try:
        processed_text = ' '.join(email_text.split())

        super_labels = {
            "Este é um email de trabalho que exige uma ação, resposta ou análise.": "Produtivo",
            "Esta é uma mensagem social, um agradecimento, um spam ou um comunicado que não exige ação.": "Improdutivo"
        }

        api_payload = {
            "inputs": processed_text,
            "parameters": {
                "candidate_labels": list(super_labels.keys())
            },
        }
        
        output = query_hf_api(api_payload)

        if "error" in output:
             return jsonify({"error": f"Erro da API Hugging Face: {output['error']}"}), 500
        if "scores" not in output or "labels" not in output:
            return jsonify({"error": "Resposta inesperada da API Hugging Face.", "raw_response": output}), 500

        melhor_super_label = output['labels'][0]
        melhor_score = output['scores'][0]
        
        categoria_classificada = super_labels.get(melhor_super_label, "Indefinido")

        resposta_sugerida = ""
        if categoria_classificada == "Produtivo":
            resposta_sugerida = "Obrigado por sua mensagem. Recebemos sua solicitação e nossa equipe irá analisá-la em breve."
        else:
            resposta_sugerida = "Agradecemos o contato. Esta mensagem foi recebida."

        result_json = {
            "categoria": categoria_classificada,
            "resposta_sugerida": resposta_sugerida,
            "confianca": melhor_score
        }

        return jsonify(result_json)

    except Exception as e:
        return jsonify({"error": f"Ocorreu um erro inesperado: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)