from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    # Example command to call a script in your repo
    result = subprocess.run(['python', 'path/to/your_script.py', data['input']], capture_output=True, text=True)
    return jsonify({'output': result.stdout})

if __name__ == '__main__':
    app.run(debug=True)
