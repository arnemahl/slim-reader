function runTheScript() {
    var script = `
        (function() {
            var style;
            function addStyles() {
                style = document.createElement('style');

                style.innerHTML = \`
                    * {
                        cursor: pointer !important;
                    }
                    *:hover {
                        border: 2px dotted coral !important;
                        background-color: peachpuff !important;
                    }
                \`;

                document.head.appendChild(style);
            }
            function removeStyles() {
                document.head.removeChild(style);
            }

            function onClick(event) {
                window.removeEventListener('click', onClick);
                removeStyles();

                event.target.style.maxWidth = '800px';
                event.target.style.margin = 'auto';

                return;

                var maxWidth = prompt('Max width (px)?', 800);

                if (maxWidth !== null) {
                    var prev = {
                        maxWidth: event.target.style.maxWidth,
                        margin: event.target.style.margin
                    };
                    event.target.style.maxWidth = maxWidth + 'px';
                    event.target.style.margin = 'auto';

                    setTimeout(() => {
                        var ok = confirm('Keep adjustment?');

                        if (!ok) {
                            event.target.style.maxWidth = prev.maxWidth;
                            event.target.style.margin = prev.margin;
                        }
                    }, 0);
                }
            }

            addStyles();
            window.addEventListener('click', onClick);
        })();
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
