var CACHES = ["WayBack Machine", "Coral CDN", "Google Cache"];
var HTML = ["Google Cache", "WayBack Machine", "Coral CDN"];
var order = [];

//order = CACHES;

$("#sortable").sortable({
    stop: function(event, ui) {
    	//console.log("Old Position: " + order.indexOf(ui.item.attr('id')));
        //console.log("New position: " + ui.item.index());
        
        order.splice(order.indexOf(ui.item.attr('id')), 1);
        order.splice(ui.item.index(), 0, ui.item.attr('id'));

        chrome.storage.sync.set({'cacheOrder': order}, function() {
        	console.log("Saved Settings: " + order.split(":"));
        });
    },
    create: function(event, ui) { // Set up sortable and also radio buttons
        chrome.storage.sync.get('cacheOrder', function(result) {
        	order = result.cacheOrder;

	        var ul = $('#sortable');
	        var li = ul.children('li').get();
    	    li.sort(function(a,b) {
    		    return order.indexOf($(a).attr('id')) - order.indexOf($(b).attr('id'))
		    });
		    ul.append(li);
        });
        // Set up radio buttons
        chrome.storage.sync.get('auto-detect', function(result) {
        	if(result['auto-detect'] == 'on') {
        		$('#on').prop('checked', true);
        	} else {
        		$('#off').prop('checked', true);
        	}
        });
    }
});

$("#myonoffswitch").click(function(button) { // Save auto-detect settings
  chrome.storage.sync.set({'auto-detect': button.target.id}, function() {
    console.log("Saved Auto-Detect Preferences");
  });
});
});

$("#sortable").disableSelection();
