from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración
CORRECT_CODE = os.getenv('SECRET_CODE')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    return render_template('game.html')

@app.route('/check-final-code', methods=['POST'])
def check_code():
    data = request.get_json()
    user_code = data.get('code')
    
    if user_code == CORRECT_CODE:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': '¡Código incorrecto! Sigue buscando...'})

if __name__ == '__main__':
    app.run(debug=True)