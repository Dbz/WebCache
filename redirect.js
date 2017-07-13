var currentURL        = "";
var isHTTPS           = true;
var index             = 0;
var numberOfRedirects = 0;
var redirecting       = false;

var cacheURL = [
  "http://webcache.googleusercontent.com/search?q=cache:",
  "http://web.archive.org/web/",
  ".nyud.net"
];
var cacheNames = [
  "google-cache-sortable",
  "wayback-machine-sortable",
  "coral-cdn-sortable"
];
var URL_HASH = [
  { name: "google-cache-sortable",    URL: "http://webcache.googleusercontent.com/search?q=cache:" },
  { name: "wayback-machine-sortable", URL: "http://web.archive.org/web/*/" },
  { name: "coral-cdn-sortable",       URL: ".nyud.net" }
];

function getURL() {
  ++numberOfRedirects;
  if(cacheURL[index]  == cacheURL.length) {
    index = 0;
  }

  if(cacheURL[index] != ".nyud.net") { // Google and Wayback Machine
    return cacheURL[index] + (isHTTPS ? currentURL.substr(8) : currentURL.substr(7));
  } else { // Coral CDN
    if(currentURL.slice(-1) == "/") {
      return currentURL.substring(0, currentURL.length -1) + ".nyud.net";
    } else {
      return currentURL + ".nyud.net";
    }
  }
}

function handler(details) { 
  //console.log("StatusLine is: " + details.statusLine);
  if(numberOfRedirects > cacheURL.length) { // There is no cache available
    chrome.webRequest.onHeadersReceived.removeListener(handler);
    redirecting = false;
    return { cancel: true };
  }

  if(~details.statusLine.search("404")) { // Not found
    ++index;
    return { redirectUrl:getURL() };
  } else if(~details.statusLine.search("403")) { // Forbidden
    ++index;
    return { redirectUrl:getURL() };
  } else { // Success
    chrome.webRequest.onHeadersReceived.removeListener(handler);
    redirecting = false;
    return { cancel: false };
  }
}

function openPage(currentTab) {
  chrome.storage.sync.get("cacheOrder4", function(result) {
    var cacheOrder = result["cacheOrder4"] || cacheNames;
        
    URL_HASH.sort(function(a, b) {
      return cacheOrder.indexOf(a.name) - cacheOrder.indexOf(b.name);
    });
    
    for(var i = 0; i < 3; i++) {
      cacheURL[i]   = URL_HASH[i].URL;
      cacheNames[i] = URL_HASH[i].name;
    }
    
    // console.log(cacheURL);
    
    index             = 0;
    numberOfRedirects = 0;
    redirecting       = true;
        
    chrome.webRequest.onHeadersReceived.addListener(
      handler,
      {
        urls: ["<all_urls>"],
        types: ["main_frame"]
      },
      ["blocking"]
    );
    
    currentURL = currentTab.url;

    isHTTPS = (currentURL.substring(0, 6) == "https:");

    //console.log("the tab id for the redirect is " + currentTab.id + ": The website is: " + currentURL);
      
    chrome.tabs.update(currentTab.id, { url: getURL(index) });
        
  });
}

function autoRedirect(details) {
  chrome.tabs.query({}, function(tabs) {
    // Make sure it is the current tab
    var tab = null;
    tabs.forEach(function(t) {
      if(t.url === details.url) { // What if multiple tabs open with same url?
        tab = t;
      }
    });
    // Return if no tab with url or redirecting
    if(tab == null || redirecting)
      return;
    
    if(~details.statusLine.indexOf("408")) {
      console.log("408 redirect");
    } else if(~details.statusLine.indexOf("503")) {
      console.log("503 redirect");
      openPage(tab);
    } else if(~details.statusLine.indexOf("521")) {
      console.log("521 redirect");
      openPage(tab);
    } else if(~details.statusLine.indexOf("522")) {
      console.log("522 redirect");
      openPage(tab);
    }
  });
}

chrome.storage.sync.get("auto-detect", function(result) {
  if(result["auto-detect"] == "on") {
    chrome.webRequest.onHeadersReceived.addListener(
      autoRedirect,
      { urls: ["<all_urls>"] }
    );
  }
});

// Set defaults on install or update
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.get("cacheOrder", function(result) {
    if(Object.keys(result).length == 0) {
      var saveObject = {
        "cacheOrder4": cacheNames,
        "auto-detect": "off"
      };
      chrome.storage.sync.set(saveObject);
    }
  });
});

chrome.browserAction.onClicked.addListener(openPage);
