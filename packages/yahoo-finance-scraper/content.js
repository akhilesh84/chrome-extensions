if (!window.isListenerAdded) {
    window.isListenerAdded = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "scrape") {
            const table = document.getElementsByClassName("table yf-ewueuo noDl")[0];
            if (table) {
                const rows = Array.from(table.rows);
                const tableContent = rows.map(row => {
                    return Array.from(row.cells).map(cell => cell.innerText).join(",");
                });
                console.log("Table content:", tableContent);
                sendResponse({ content: tableContent });
            } else {
                console.log("Table not found");
                sendResponse({ content: "Table not found" });
            }
        }
    });
}