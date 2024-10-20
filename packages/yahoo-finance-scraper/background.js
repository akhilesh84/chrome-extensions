chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        let res = chrome.tabs.sendMessage(tab.id, { action: "scrape" });
        res.then(data => {
            // console.table(data.content);
            // Save the data to a CSV file using chrole.download API
            const csv = data.content.map(row => Object.values(row).join(",")).join("\n");
            
            // const url = URL.createObjectURL(blob);
            chrome.downloads.download({
                // url: url,
                url: `data:text/csv;${csv}`,
                filename: "stock-data.csv"
            });
        });
    });
});