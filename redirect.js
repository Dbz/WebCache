var currentURL = "";
var isHTTPS = true;
var index = 0;
var numberOfRedirects = 0;
var redirecting = false;

var cacheURL = [
	"http://webcache.googleusercontent.com/search?q=cache:",
	"http://web.archive.org/web/*/",
	".nyud.net"
];
var cacheNames = ["Google Cache", "WayBack Machine", "Coral CDN"];

var URL_HASH = [
	{name: "Google Cache", URL: "http://webcache.googleusercontent.com/search?q=cache:"},
	{name: "WayBack Machine", URL: "http://web.archive.org/web/*/"},
	{name: "Coral CDN", URL: ".nyud.net"}
];

function getURL() {
	++numberOfRedirects;
	if(cacheURL[index]  == cacheURL.length)
		index = 0
	if(cacheURL[index] != ".nyud.net") { // Google and Wayback Machine
		if(isHTTPS)
			return cacheURL[index] + currentURL.substr(8);
		else
			return cacheURL[index] + currentURL.substr(7);
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
	if(numberOfRedirects > cacheURL.length) { // There is no cache available
		chrome.webRequest.onHeadersReceived.removeListener(handler);
		redirecting = false;
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
		redirecting = false;
		return{cancel: false};
	}
}

function openPage() {
	redirecting = true;
	chrome.storage.sync.get('caches', function(result) {
        var cacheOrder = result.caches.split(":");
        
        URL_HASH.sort(function(a, b) {
        	return cacheOrder.indexOf(a.name) - cacheOrder.indexOf(b.name);
        });
        
        for (var i = 0; i< 3; i++) {
        	cacheURL[i] = URL_HASH[i].URL;
        	cacheNames[i] = URL_HASH[i].name;
        }
        
        index = 0
        numberOfRedirects = 0;
				
		chrome.webRequest.onHeadersReceived.addListener(
			handler,
			{
				urls: ["<all_urls>"],
				types: ["main_frame"]
			},
			["blocking"]
		);

		chrome.tabs.getSelected(null, function(tab) {
			currentURL = tab.url;
			if(currentURL.substring(0, 5) == "http:")
				isHTTPS = false;
			else
				isHTTPS = true;
			chrome.tabs.update(tab.id, { url: getURL(index) });
		});
        
	});
}

function autoRedirect(details) {
	if(redirecting) {
		return;
	}
	console.log("details ", details.statusLine);
	if(~details.statusLine.indexOf("408")) {
		console.log("408 redirect");
	} else if(~details.statusLine.indexOf("503")) {
		console.log("503 redirect");
		openPage();
	}
}

chrome.storage.sync.get('auto-detect', function(result) {
	if(result['auto-detect'] == 'on') {
		chrome.webRequest.onHeadersReceived.addListener(
			autoRedirect,
			{
				urls: ["<all_urls>"]
			}
		);
	}
});

chrome.browserAction.onClicked.addListener(openPage);
