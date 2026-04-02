import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# Ключ будет браться из переменной окружения OPENAI_API_KEY
client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY'), 
    base_url="https://routerai.ru/api/v1"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({"error": "Пожалуйста, введите вопрос."}), 400

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o",
            messages=[{"role": "user", "content": question}]
        )
        answer = response.choices[0].message.content
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"Ошибка сервера: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
