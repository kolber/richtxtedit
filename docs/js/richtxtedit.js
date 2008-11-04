$(document).ready(function() {
	// overwrite default anchor click action
	$("div.txtedit a").each(function() {
		var a = $(this);
		a.before("<span class='anchor'>" + a.text() + "</span>").remove();
	});
	
	$("div.txtedit").mouseup(function(e) {
		$("img#cursor").remove();
		Range.focusArea(this);
		var selectionOffsets = Range.getRangeObjectOffsets();
		if(selectionOffsets.start == selectionOffsets.end) Range.insertCursor();
		e.stopPropagation();
	});
	
	$(document).mouseup(function(e) {
		Range.unfocusArea();
	});
	
	$(document).keypress(function(e) {
		if(Range.currentFocus) {
			e.preventDefault();
			var unicode = e.charCode ? e.charCode : e.keyCode;
			var actualKey = String.fromCharCode(unicode);
			console.debug("actual key: " + actualKey);
			console.debug("unicode: " + unicode);
			if(e.ctrlKey) {
				if (actualKey == "b") Range.wrapStrong();
				if (actualKey == "i") Range.wrapEm();
			} else if(unicode == 8) {
				Range.backwardsDelete();
			} else if(unicode == 37) {
				Range.moveCursorLeft();
			} else if(unicode == 39) {
				//Range.moveCursorRight();
			} else if(unicode != 16) {
				// switch to lowercase if necessary
				if(!e.shiftKey) actualKey = actualKey.toLowerCase();
				Range.insertBefore(actualKey);
			} else {
				//
			}
		}
	});
});