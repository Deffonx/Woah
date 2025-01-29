if (!window.eruda) {
    fetch(chrome.runtime.getURL('eruda-tool.js'))
        .then(response => response.text())
        .then(scriptText => {
            const script = document.createElement('script');
            script.textContent = scriptText;
            document.documentElement.appendChild(script);
        })
        .catch(error => console.error('Error loading Eruda script:', error));
}

// Message Persistence
function saveMessage(message) {
    chrome.storage.local.get({ chatHistory: [] }, (result) => {
        const chatHistory = result.chatHistory;
        chatHistory.push(message);
        chrome.storage.local.set({ chatHistory });
    });
}

function loadMessages() {
    chrome.storage.local.get({ chatHistory: [] }, (result) => {
        const chatOutput = document.getElementById('chatOutput');
        result.chatHistory.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            chatOutput.appendChild(messageElement);
        });
    });
}

function clearMessages() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chrome.storage.local.set({ chatHistory: [] }, () => {
            const chatOutput = document.getElementById('chatOutput');
            chatOutput.innerHTML = '';
            alert('Chat history cleared.');
        });
    }
}

function extractErudaData() {
    const erudaConsole = eruda.get('console');
    const erudaNetwork = eruda.get('network');
    const erudaElements = eruda.get('elements');
    const erudaResources = eruda.get('resources');

    const erudaData = {
        consoleLogs: erudaConsole ? erudaConsole.getLogs() : [],
        networkRequests: erudaNetwork ? erudaNetwork.getRequests() : [],
        domStructure: erudaElements ? erudaElements.getDom() : '',
        resources: erudaResources ? erudaResources.getResources() : []
    };

    return erudaData;
}

function toggleContextAwareMode(enable) {
    if (enable) {
        const erudaData = extractErudaData();
        // Pass erudaData to the AI for context-aware responses
        console.log('Context-aware mode enabled:', erudaData);
    } else {
        console.log('Context-aware mode disabled');
    }
}

function selectModel() {
    const modelPath = prompt('Enter Hugging Face model path:');
    if (modelPath) {
        chrome.storage.local.set({ selectedModel: modelPath }, () => {
            console.log('Model path saved:', modelPath);
            fetchModelMetadata(modelPath);
        });
    }
}

function fetchModelMetadata(modelPath) {
    fetch(`https://huggingface.co/api/models/${modelPath}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Model not found or access denied');
            }
            return response.json();
        })
        .then(metadata => {
            console.log('Model metadata:', metadata);
            // Handle model metadata, e.g., check for third-party acceptance
        })
        .catch(error => {
            console.error('Error fetching model metadata:', error);
            alert('Failed to fetch model metadata. Please check the model path.');
        });
}

// Example toggle implementation and model selection
document.getElementById('globalToggle').addEventListener('change', (event) => {
    toggleContextAwareMode(event.target.checked);
});

document.getElementById('modelSelectBtn').addEventListener('click', selectModel);

function displayAIResponse(response) {
    const chatOutput = document.getElementById('chatOutput');
    const messageElement = document.createElement('div');
    messageElement.textContent = response.text; // Assuming response has a text property
    chatOutput.appendChild(messageElement);

    // Display confidence level
    const confidenceLevel = response.confidence; // Assuming response has a confidence property
    const confidenceIndicator = document.createElement('span');
    confidenceIndicator.textContent = `Confidence: ${confidenceLevel}`;
    confidenceIndicator.style.color = getConfidenceColor(confidenceLevel);
    messageElement.appendChild(confidenceIndicator);
}

function getConfidenceColor(confidence) {
    if (confidence > 0.75) return 'green'; // High confidence
    if (confidence > 0.5) return 'orange'; // Medium confidence
    return 'red'; // Low confidence
}

function showLoadingIndicator() {
    const chatOutput = document.getElementById('chatOutput');
    const loadingElement = document.createElement('div');
    loadingElement.textContent = '⏳ Processing...';
    loadingElement.id = 'loadingIndicator';
    chatOutput.appendChild(loadingElement);
}

function hideLoadingIndicator() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Example of using loading indicators during message sending
document.getElementById('sendBtn').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;
    if (userInput) {
        showLoadingIndicator(); // Show loading indicator
        saveMessage(userInput); // Save user message
        // Simulate AI response fetching
        setTimeout(() => {
            const aiResponse = { text: 'AI response here', confidence: 0.8 }; // Simulated response
            displayAIResponse(aiResponse); // Display AI response
            hideLoadingIndicator(); // Hide loading indicator
        }, 2000); // Simulate a delay for fetching AI response
    }
});

// Load messages on initialization and setup context toggle
document.getElementById('globalToggle').addEventListener('change', (event) => {
    toggleContextAwareMode(event.target.checked);
});

// Load messages on initialization and setup context toggle
document.addEventListener('DOMContentLoaded', loadMessages);
