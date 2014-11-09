
// Saves options to localStorage.
function save_options() {
/*
  var select = $(".ui-selected");
  var cache = select.children[select.selectedIndex].value;
  localStorage["chosen_cache"] = cache;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
*/
	var radio = $(".radio-inline")
	
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var selectedCache = localStorage["chosen_cache"];
  if (!selectedCache) {
    localStorage["chosen_cache"] = "Google";
    return;
  }
  var select = document.getElementById("cache");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == selectedCache) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

console.log("hello world");