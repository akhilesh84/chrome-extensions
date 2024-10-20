//TODO: Instead of using global variable, we can use chrome.storage API to store the state of the extension

if (!window.isListenerAdded) {
    window.isListenerAdded = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "scrape") {
            // Read path component from active tab
            // const path = window.location.pathname;
            const table = document.getElementsByClassName("table yf-ewueuo noDl")[0];
            
            if (table) {
                // Filter out rows having dividend data
                const rows = Array.from(table.rows).filter(row => row.cells.length > 2).slice(1);
                const tableContent = rows.map(row => {
                    row.cells[0].innerText = row.cells[0].innerText.replace(/,/g, "");
                    return {
                        d: row.cells[0].innerText,
                        o: parseFloat(row.cells[1].innerText.replace(/,/g, "")),
                        h: parseFloat(row.cells[2].innerText.replace(/,/g, "")),
                        l: parseFloat(row.cells[3].innerText.replace(/,/g, "")),
                        c: parseFloat(row.cells[5].innerText.replace(/,/g, "")),
                    };
                });
                sendResponse({content: tableContent });
            } else {
                sendResponse({ content: "Table not found" });
            }
        }
    });
}