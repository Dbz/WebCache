var CONTEXT_MENU_CACHES = [
  "google-cache",
  "wayback-machine",
  "archive-is",
  "coral-cdn"
];

var SORTABLE_CACHES = [
  "google-cache-sortable",
  "wayback-machine-sortable",
  "archive-is-sortable",
  "coral-cdn-sortable"
];


// Remove context menu caches
function removeContextMenu(cache) {
  var saveObj    = {};
  saveObj[cache] = false;

  chrome.contextMenus.remove(cache);
  chrome.storage.sync.set(saveObj);
}

// Create context menu caches
function createContextMenu(cache) {
  var saveObj           = {};
  var create_properties = {
    id: cache,
    title: "Open page with " + cache.split("-").join(" "), //$("label[for=""+ cache +""]").text()
    contexts: ["page"]
  };
  saveObj[cache] = true;

  chrome.contextMenus.create(create_properties);
  chrome.storage.sync.set(saveObj);
}

// Add/Remove context menu caches
function updateContextMenuCaches(event) {
  var cache            = $(event.target).attr("for");
  var addContextMenu = !$("#" + cache).is(":checked");
  addContextMenu ? createContextMenu(cache) : removeContextMenu(cache);
}

var order = [];
$("#sortable").sortable({
    stop: function(event, ui) { // Save settings after change
      order.splice(order.indexOf(ui.item.attr("id")), 1);
      order.splice(ui.item.index(), 0, ui.item.attr("id"));

      var saveObj = {};
      saveObj["cacheOrder4"] = order;
      chrome.storage.sync.set(saveObj, function() {
        console.log("Saved Cache Ordering Preferences");
      });
    },

    // Set up sortable, checkboxes, & toggle
    create: function(event, ui) {
      // Set up sortable
      chrome.storage.sync.get("cacheOrder4", function(result) {
        var ul = $("#sortable");
        var li = ul.children("li").get();
        order  = result["cacheOrder4"] || SORTABLE_CACHES

        if(order.length < SORTABLE_CACHES.length) { // We have just updated, so add the new caches and then save them
          order = order.concat($(SORTABLE_CACHES).not(order).get());
          var saveObj = {};
          saveObj["cacheOrder4"] = order;
          chrome.storage.sync.set(saveObj, function() {
            console.log("Saved Cache Ordering Preferences");
          });
        }

        // Order the caches
        li.sort(function(a, b) {
          return order.indexOf($(a).attr("id")) - order.indexOf($(b).attr("id"));
        });

        ul.append(li);
      });

      // Set up auto-detect toggle
      chrome.storage.sync.get("auto-detect", function(result) {
        var toggle = $("#myonoffswitch");
        toggle.prop("checked", result["auto-detect"]);
      });

      // Set up context menu caches
      chrome.storage.sync.get(CONTEXT_MENU_CACHES, function(results) {
        Object.keys(results).forEach(function(key) {
          $("#" + key).prop("checked", !!results[key]);
        });
      });
    }
});

// Save auto-detect settings
$("#myonoffswitch").click(function(event) {
  chrome.storage.sync.set({"auto-detect": $("#myonoffswitch").is(":checked")}, function() {
    console.log("Saved Auto-Detect Preferences");
  });
});

// Add/Remove context menu caches
$(".context-menu-label").click(updateContextMenuCaches);

$("#sortable").disableSelection();

