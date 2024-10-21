import { yfinScripCodes } from "./scripcodes";

// Sample URL
// https://finance.yahoo.com/quote/HDFCBANK.NS/history/?period1=1571667253&period2=1729520049&frequency=1wk

async function scrapeStockData(stockCode, period1, period2) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url: `https://finance.yahoo.com/quote/${stockCode}/history/?period1=${period1}&period2=${period2}&frequency=1wk` }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve({ stockCode, data: response.content });
                        }
                        chrome.tabs.remove(tab.id); // Close the tab after scraping
                    });
                }
            });
        });
    });
}

async function scrapeAllStocks() {
    let now = new Date();
    let period2 = Math.floor(now.getTime() / 1000);
    let period1 = period2 - 5*31536000; // 1 year * 5 to get 5 years of data
    for (const stockCode of yfinScripCodes) {
        try {
            const { stockCode, data } = await scrapeStockData(stockCode, period1, period2);
            const headers = "Date,Open,High,Low,Close,Volume\n";
            const csv = data.map(row => Object.values(row).join(",")).join("\n");
            const csvContent = headers.concat(csv);

            chrome.downloads.download({
                url: `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
                filename: `${stockCode}.csv`
            });
        } catch (error) {
            console.error(`Failed to scrape data for ${stockCode}:`, error);
        }
    }
}

chrome.action.onClicked.addListener(() => {
    scrapeAllStocks();
});