var CONTEXT_HASH = {
  "google-cache":     "http://webcache.googleusercontent.com/search?q=cache:",
  "wayback-machine":  "http://web.archive.org/web/",
  "archive-is":       "http://archive.is/newest/",
  "coral-cdn":        ".nyud.net"
};

function formUrl(context, url) {
  var contextUrl = CONTEXT_HASH[context];
  var isHTTPS    = url.substring(0, 6) === "https:";

  // Google, Wayback Machine, and Archive is
  if(context !== "coral-cdn") {
    return contextUrl + (isHTTPS ? url.substr(8) : url.substr(7));
  } else { // Coral CDN
    if(url.slice(-1) === "/") {
      return url.substring(0, url.length - 1) + contextUrl;
    } else {
      return url + contextUrl;
    }
  }
}

function redirectToCachedUrl(info, tab) {
  chrome.tabs.update(tab.id, { url: formUrl(info.menuItemId, info.pageUrl) });
}

// Create context menu caches
function createContextMenu(cache) {
  var saveObj = {};
  var create_properties = {
    id: cache,
    title: "Open page with " + cache.split("-").join(" "),
    contexts: ["page"]
  };
  saveObj[cache] = true;

  chrome.contextMenus.create(create_properties);
  chrome.storage.sync.set(saveObj);
}

// Load Context Menus on Startup
chrome.storage.sync.get(Object.keys(CONTEXT_HASH), function(results) {
  Object.keys(results).forEach(function(cache) {
    if(!!results[cache]) {
      createContextMenu(cache);
    }
  });
});

chrome.contextMenus.onClicked.addListener(redirectToCachedUrl);

