var index = "0";
function openPage() {
	index = localStorage["chosen_cache"];
	console.log("Index is: " + index);
	switch(index) {
		case "0": // Google
			chrome.tabs.getSelected(null, function(tab) {
				if(tab.url.substring(7, 15) == "webcache") // Return if already viewing cached webpage
					return;
  				else if(tab.url.substring(0, 5) == "http:")
					chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(7) });
				else if(tab.url.substring(0,6) == "https:")
					chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(8) });
			});
			break;
		case "1": // Wayback Machine
			chrome.tabs.getSelected(null, function(tab) {
				if(tab.url.substring(7, 18) == "web.archive") // Return if already viewing cached webpage
					return;
  				else if(tab.url.substring(0, 5) == "http:")
					chrome.tabs.update(tab.id, { url: 'http://web.archive.org/web/*/' + tab.url.substr(7) });
				else if(tab.url.substring(0,6) == "https:")
					chrome.tabs.update(tab.id, { url: 'http://web.archive.org/web/*/' + tab.url.substr(8) });
			});
			break;
		case "2": // Coral CDN
			chrome.tabs.getSelected(null, function(tab) {
				if(tab.url.slice(-9) == ".nyud.net") // Return if already viewing cached webpage
					return;
				else if(tab.url.slice(-1) == "/")
					chrome.tabs.update(tab.id, { url: tab.url.substring(0, tab.url.length -1) + '.nyud.net' });
  				else
  					chrome.tabs.update(tab.id, { url: tab.url + '.nyud.net' });
			});
			break;
		case "3": // Bing
			break;
		case "4": // Yahoo
			break;
		case "5": // Gigablast
			break;
		case "6": // Webcite
			break;
		default: // Google
			chrome.tabs.getSelected(null, function(tab) {
				if(tab.url.substring(7, 15) == "webcache") // Return if already viewing cached webpage
					return;
  				else if(tab.url.substring(0, 5) == "http:")
					chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(7) });
				else if(tab.url.substring(0,6) == "https:")
					chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(8) });
			});
	}
}

chrome.browserAction.onClicked.addListener(openPage);
