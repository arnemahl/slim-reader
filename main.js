function slimUnknownPage() {
    var script = `
        (function() {
            let style;
            function addHoverStyles() {
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
            function removeHoverStyles() {
                document.head.removeChild(style);
            }

            function tryToRememberElementForCurrentDomain(element) {
                const uniqueCssSelector =
                    document.getElementById(element.id) === element && ('#' + element.id)
                    || document.getElementsByClassName(element.className)[0] === element && ('.' + element.className)
                    || false
                ;

                if (uniqueCssSelector === false) {
                    return;
                }

                const remember = confirm('Remember which element to minimize on the current page?');

                if (remember) {
                    chrome.runtime.sendMessage({
                        type: 'REMEMBER_ELEMENT',
                        uniqueCssSelector
                    });
                }
            }

            function onClick(event) {
                window.removeEventListener('click', onClick);
                removeHoverStyles();

                event.target.style.maxWidth = '800px';
                event.target.style.margin = 'auto';

                window.setTimeout(() => tryToRememberElementForCurrentDomain(event.target), 0);
            }

            addHoverStyles();
            window.addEventListener('click', onClick);
        })();
    `;

    chrome.tabs.executeScript({
        code: script
    });
}

function slimBySelector(uniqueCssSelector) {
    var script = `
        (function() {
            function addNarrowStyle() {
                const style = document.createElement('style');

                style.innerHTML = \`
                    ${uniqueCssSelector} {
                        max-width: 800px;
                        margin: auto;
                    }
                \`;

                document.head.appendChild(style);
            }

            addNarrowStyle();
        })();
    `;

    chrome.tabs.executeScript({
        code: script
    });
}

chrome.browserAction.onClicked.addListener(() => {
    chrome.runtime.onMessage.addListener((message, sender) => {
        const host = new URL(sender.url).host;

        if (message.type === 'REMEMBER_ELEMENT') {
            chrome.storage.sync.set({
                [host]: message.uniqueCssSelector
            });
        }
    });

    chrome.tabs.getSelected(null, (tab) => {
        const host = new URL(tab.url).host;

        chrome.storage.sync.get(host, (val) => {
            const uniqueCssSelector = val[host];

            if (uniqueCssSelector) {
                slimBySelector(uniqueCssSelector);
            } else {
                slimUnknownPage();
            }
        });
    })
});
