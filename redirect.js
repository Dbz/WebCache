
document.addEventListener('DOMContentLoaded', function() {
    var x, img = document.getElementsByTagName("img");
	for(x=0;x < img.length; x++) {
		img[x].addEventListener('click',openPage, false);
		//console.log("img[x]: " + img[x]);
	}
});

function openPage(event) {
	//alert("clicked" + event.target.id);
	console.log("id: " + event.target.id);
	
	var e = event.target;	
	switch(e.id) {
	case "WayBack Machine":
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.update(tab.id, { url: "http://wayback.archive.org/web/*/" + tab.url });
		});
		break;
		
	case "Google Cache":
		chrome.tabs.getSelected(null, function(tab) {
  			if(tab.url.substring(0, 5) == "http:")
				chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(7) });
			else if(tab.url.substring(0,6) == "https:")
				chrome.tabs.update(tab.id, { url: 'http://webcache.googleusercontent.com/search?q=cache:' + tab.url.substr(8) });
		});
		break;
	
	case "Yahoo Cache":
		// Need the yahoo cache url
		break;
	
	case "Bing Cache":
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.update(tab.id, { url: "http://cc.bingj.com/cache.aspx?q=" + tab.url + "&d=4572216504747453&mkt=en-US&setlang=en-US&w=802790a9,218b61b8" });
		});
		break;
		
	case "Gigablast":
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.update(tab.id, { url: "http://www.gigablast.com/get?q=" + tab.url + "&c=main&d=70166151696&cnsp=0" });
		});
		break;
	
	case "CoralCDN":
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.update(tab.id, { url: tab.url + ".nyud.net" });
		});
		break;
		
	default: // Webcite
		// Need to send a request, this won't do
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.update(tab.id, { url: "http://webcitation.org/query" });
		});
		break;
	}
	
}
