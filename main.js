function runTheScript() {
    var script = `
        (function() {
            function addStyles() {
                var style = document.createElement('style');

                style.innerHTML = \`
                    body {
                        max-width: 800px;
                    }
                \`;

                document.head.appendChild(style);
            }

            addStyles();
        })()
    `;

    // See https://developer.chrome.com/extensions/tabs#method-executeScript.
    // chrome.tabs.executeScript allows us to programmatically inject JavaScript
    // into a page. Since we omit the optional first argument "tabId", the script
    // is inserted into the active tab of the current window, which serves as the
    // default.
    chrome.tabs.executeScript({
        code: script
    });
}

chrome.browserAction.onClicked.addListener(() => {
    runTheScript();
});
