fetch(chrome.runtime.getURL('eruda-tool.js'))
    .then(response => response.text())
    .then(scriptText => {
        const script = document.createElement('script');
        script.textContent = scriptText;
        document.documentElement.appendChild(script);
    })
    .catch(error => console.error('Error loading Eruda script:', error));
