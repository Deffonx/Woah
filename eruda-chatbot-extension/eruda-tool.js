(function () {
    if (!window.eruda) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        script.onload = function () {
            eruda.init();
            createChatbotTool();
        };
        document.body.appendChild(script);
    } else {
        createChatbotTool();
    }

    function createChatbotTool() {
        var tool = eruda.Tool.extend({
            name: 'chatbot',
            init: function () {
                this.callSuper('init', arguments);
                this._$el = this._$el || $('<div class="eruda-chatbot"></div>');
                this._render();
            },
            _render: function () {
                this._$el.html(`
                    <div class="chatbot-header">Chatbot Interface</div>
                    <div id="chatOutput" class="chat-output"></div>
                    <input type="text" id="userInput" class="chat-input" placeholder="Type your message...">
                    <button id="sendBtn" class="send-btn">Send</button>
                    <button id="customizeBtn" class="customize-btn">🎨 Customize</button>
                `);
                this._bindEvents();
            },
            _bindEvents: function () {
                var self = this;
                document.getElementById('sendBtn').addEventListener('click', function() {
                    var userInput = document.getElementById('userInput').value;
                    self._processUserInput(userInput);
                });
                document.getElementById('customizeBtn').addEventListener('click', function() {
                    openColorCustomizationPanel();
                });
            },
            openColorCustomizationPanel: function() {
                // Logic to open and handle color customization
            },
            _processUserInput: function (input) {
                let model = 'default-model';
                if (input.includes('debug')) {
                    model = 'microsoft/codebert-base';
                }
                this._queryHuggingFaceAPI(model, input)
                    .then(response => this._displayChatbotResponse(response))
                    .catch(error => console.error('Error:', error));
            },
            _queryHuggingFaceAPI: function (model, input) {
                const url = `https://api-inference.huggingface.co/models/${model}`;
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_HUGGINGFACE_API_KEY',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: input })
                }).then(response => response.json());
            },
            _displayChatbotResponse: function (response) {
                const chatOutput = document.getElementById('chatOutput');
                const messageElement = document.createElement('div');
                messageElement.className = 'ai-message';
                messageElement.innerHTML = `
                    <div class="ai-icon">🤖</div>
                    <div class="message-content">${this.formatResponse(response)}</div>
                `;
                chatOutput.appendChild(messageElement);
            },
            formatResponse: function(response) {
                return JSON.stringify(response, null, 2).replace(/```(.*?)```/gs, '<div class="code-block"><span class="code-icon">📃</span><button class="copy-btn">⏬️</button><pre><code>$1</code></pre><button class="copy-btn">⏬️</button></div>');
            },
        });

        eruda.add(tool);
    }
})();
