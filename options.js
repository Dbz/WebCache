var order = [];

// Add/Remove context menu caches
function updateContextMenu(event) {
  var saveObj = {};
  var cache = $(event.target).attr('for');
  var add_context_menu = !$('#' + cache).is(':checked');
  var create_properties = {
    id: cache,
    title: 'Open page in ' + $("label[for='"+ cache +"']").text(),
    contexts: ['page'],
    onclick: updateUrl
  };

  add_context_menu ? chrome.contextMenus.create(create_properties) : chrome.contextMenus.remove(cache);

  saveObj[cache] = add_context_menu;
  chrome.storage.sync.set(saveObj);
}
$('#sortable').sortable({
    stop: function(event, ui) { // Save settings after change
      order.splice(order.indexOf(ui.item.attr('id')), 1);
      order.splice(ui.item.index(), 0, ui.item.attr('id'));

      var saveObj = {};
      saveObj['cacheOrder4'] = order;
      chrome.storage.sync.set(saveObj, function() {
        console.log('Saved Cache Ordering Preferences');
      });
    },
    create: function(event, ui) { // Set up sortable, checkboxes, & toggle
      // Set up sortable
      chrome.storage.sync.get('cacheOrder4', function(result) {
        order = result['cacheOrder4'] || ['google-cache-sortable', 'wayback-machine-sortable', 'coral-cdn-sortable'];

        var ul = $('#sortable');
        var li = ul.children('li').get();
        li.sort(function(a, b) {
          return order.indexOf($(a).attr('id')) - order.indexOf($(b).attr('id'));
        });
        ul.append(li);
      });

      // Set up auto-detect toggle
      chrome.storage.sync.get('auto-detect', function(result) {
        toggle = $('#myonoffswitch');
        toggle.prop('checked', result['auto-detect']);
      });

      // Set up context menu caches
      chrome.storage.sync.get(['google-cache', 'wayback-machine', 'coral-cdn'], function(results) {
        Object.keys(results).forEach(function(key) {
          $('#' + key).prop('checked', results[key]);
        });
      });
    }
});

$('#myonoffswitch').click(function(event) { // Save auto-detect settings
  chrome.storage.sync.set({'auto-detect': $('#myonoffswitch').is(':checked')}, function() {
    console.log('Saved Auto-Detect Preferences');
  });
});

// Add/Remove context menu caches
$('.context-menu-label').click(updateContextMenu);

$('#sortable').disableSelection();
