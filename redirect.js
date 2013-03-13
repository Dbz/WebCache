
function openPage() {
	//alert("clicked" + event.target.id);
	//console.log("id: " + event.target.id);
	//var e = event.target;
	//if(e.id == "Google Cache") {
		chrome.tabs.getSelected(null, function(tab) {
		console.log("url is: " + tab.url);
			if(tab.url.substring(7, 15) == "webcache")
				return;
  			else if(tab.url.substring(0, 5) == "http:")
				chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(7) });
			else if(tab.url.substring(0,6) == "https:")
				chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(8) });
		});
	//}	
}

chrome.browserAction.onClicked.addListener(openPage);
