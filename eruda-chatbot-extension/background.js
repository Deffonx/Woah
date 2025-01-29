chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "queryAI") {
        fetch(`https://api-inference.huggingface.co/models/${request.model}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer YOUR_HUGGINGFACE_API_KEY`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: request.input })
        })
        .then(response => response.json())
        .then(data => sendResponse({ response: data }))
        .catch(error => sendResponse({ error: error.message }));

        return true; // Keeps the message channel open
    }
});
