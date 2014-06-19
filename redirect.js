var index = "0";
var currentURL = "";
var isHTTPS = true;
var numberOfRedirects = 0;

var URLS = [
	"http://webcache.googleusercontent.com/search?q=cache:",
	"http://web.archive.org/web/*/",
	".nyud.net"
];

function getURL() {
	++numberOfRedirects;
	if(URLS[index]  == URLS.length)
		index = 0
	if(URLS[index] != ".nyud.net") { // Google and Wayback Machine
		if(isHTTPS)
			return URLS[index] + currentURL.substr(8);
		else
			return URLS[index] + currentURL.substr(7);
	}
	else { // Coral CDN
		if(currentURL.slice(-1) == "/")
			return currentURL.substring(0, currentURL.length -1) + '.nyud.net';
		else
			return currentURL + '.nyud.net';
	}
}

function handler(details) { 
	//console.log("StatusLine is: " + details.statusLine);
	if(numberOfRedirects > URLS.length) { // There is no cache available
		chrome.webRequest.onHeadersReceived.removeListener(handler);
		return{cancel: true};
	}
	if(~details.statusLine.search("404")) { // Not found
		++index;
		return{redirectUrl:getURL()};
	}
	else if(~details.statusLine.search("403")) { // Forbidden
		++index;
		return{redirectUrl:getURL()};
	}
	else { // Success
		chrome.webRequest.onHeadersReceived.removeListener(handler);
		return{cancel: false};
	}
}

function openPage() {
	numberOfRedirects = 0;
	index = parseInt(localStorage["chosen_cache"]);
	chrome.tabs.getSelected(null, function(tab) {
		currentURL = tab.url;
		if(currentURL.substring(0, 5) == "http:")
			isHTTPS = false;
		else
			isHTTPS = true;
	});
	chrome.webRequest.onHeadersReceived.addListener(
		handler,
		{
			urls: ["<all_urls>"],
			types: ["main_frame"]
		},
		["blocking"]
	);
	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, { url: getURL(index) });
	});
	
}

chrome.browserAction.onClicked.addListener(openPage);
