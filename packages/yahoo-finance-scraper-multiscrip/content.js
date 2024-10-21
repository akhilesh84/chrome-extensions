//TODO: Instead of using global variable, we can use chrome.storage API to store the state of the extension

function extractScripCode(text) {
    // Find the index of the first "."
    const startIndex = text.indexOf("(") + 1;
    
    // Find the index of the first "."
    const numOfChars = text.indexOf(".") - startIndex + 1;
    
    // Extract the substring from index 0 to the index of the first "."
    return text.substring(startIndex, numOfChars);
}

if (!window.isListenerAdded) {
    window.isListenerAdded = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "scrape") {
            const scrip = extractScripCode(document.querySelector("h1.yf-xxbei9").childNodes[2].nodeValue);
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
                sendResponse({scrip: scrip, content: tableContent });
            } else {
                sendResponse({ content: "Table not found" });
            }
        }
    });
}