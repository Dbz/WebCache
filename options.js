var order = [];

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

$('.context-menu-label').click(function(event) { // Add/Remove context menu caches
  var id = $(event.target).attr('for');
  var checkbox = $('#' + id);
  var saveObj = {};
  saveObj[id] = !checkbox.is(':checked');

  chrome.storage.sync.set(saveObj, function() {
    console.log('Saved context menu preferences for ' + id);
  });
});

$('#sortable').disableSelection();
