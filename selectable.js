var caches = new Array("Google Cache", "Bing Cache","Yahoo Cache","Wayback Machine", "Coral CDN", "Gigablast", "WebCite");
// Selection function and saves the selection
$(function() {
	$( "#selectable" ).selectable({
		stop: function() {
			var result = $( "#select-result" ).empty();
			var index;
			$( ".ui-selected", this ).each(function() {
				index = $( "#selectable li" ).index( this );
				result.append( "Your default cache database is: " + caches[index] );
			});
			// Now save to local storage
			localStorage["chosen_cache"] = index;
		}
	});
});
// Limits the selection to one selectable
$(function() {
	$("#selectable").selectable({
		selecting: function(event, ui){
            if( $(".ui-selected, .ui-selecting").length > 1){
                  $(ui.selecting).removeClass("ui-selecting");
            }
      	}
	});
});

// Set the selectable to the stored cache when the page loads

$(function() {
	index = localStorage["chosen_cache"];
	if(!~index)
		localStorage["chose_cache"] = 0;
	$("#selectable li").eq(index).addClass("ui-selected");
	var result = $( "#select-result" ).empty();
	result.append( "Your default cache database is: " + caches[index] );
});

