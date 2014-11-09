var CACHES = ["WayBack Machine", "Coral CDN", "Google Cache"];
var HTML = ["Google Cache", "WayBack Machine", "Coral CDN"];
var order = [];
var autoDetect = false;

//order = CACHES;

$("#sortable").sortable({
    stop: function(event, ui) {
    	//console.log("Old Position: " + order.indexOf(ui.item.attr('id')));
        //console.log("New position: " + ui.item.index());
        
        order.splice(order.indexOf(ui.item.attr('id')), 1);
        order.splice(ui.item.index(), 0, ui.item.attr('id'));

        chrome.storage.sync.set({'caches': order.join(":")}, function() {
        	console.log("Saved Settings: " + order.split(":"));
        });
    },
    create: function(event, ui) { // Set up sortable and also radio buttons
        chrome.storage.sync.get('caches', function(result) {
        	order = result.caches.split(":");
        	if (order.length != 3) {
	        	order = CACHES;
        		chrome.storage.sync.set({'caches': CACHES.join(":")}, function() {
	        		console.log("Saving settings for the first time: " + CACHES.split(":"));
	    	    });
	        }
	        
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
        		autoDectect = true;
        	} else if(result['auto-detect'] == 'off') {
        		$('#off').prop('checked', true);
        		autoDetect = false;
        	}
        });
    }
});

$(":radio").click(function(button) {
	chrome.storage.sync.set({'auto-detect':button.target.id});
	if(button.target.id == 'on') {
		autoDetect = true;
	} else {
		autoDetect = false;
	}
});

$("#sortable").disableSelection();
