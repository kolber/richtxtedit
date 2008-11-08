$(document).ready(function() {
	// overwrite default anchor click action
	$("div.txtedit a").each(function() {
		var a = $(this);
		a.before("<span class='anchor'>" + a.text() + "</span>").remove();
	});
	
	/*$("div.txtedit").each(function() {
		$(this).after("<textarea class='txtedit-textarea'>" + $(this).text() + "</textarea>").next("textarea.txtedit-textarea").css({
			width: $(this).width() + "px",
			height: $(this).height() + "px",
			position: "absolute",
			top: $(this).offset().top + "px",
			left: $(this).offset().left + "px"
		});
	});*/
	
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
			var unicode = e.charCode ? e.charCode : e.keyCode;
			var actualKey = String.fromCharCode(unicode);
			// console.debug("actual key: " + actualKey);
			// console.debug("unicode: " + unicode);
			if(e.ctrlKey) {
				if (actualKey == "b") {
					e.preventDefault();
					Range.wrapStrong();
				}
				if (actualKey == "i") {
					e.preventDefault();
					Range.wrapEm();
				}
			} else if(unicode == 8) {
				e.preventDefault();
				Range.backwardsDelete();
			} else if(unicode == 37) {
				e.preventDefault();
				if(!e.shiftKey) Range.moveCursorLeft();
				else Range.expandSelectLeft()
			} else if(unicode == 39) {
				e.preventDefault();
				if(!e.shiftKey) Range.moveCursorRight();
				else Range.expandSelectRight();
			} else if(unicode != 16 && !e.metaKey) {
				e.preventDefault();
				// switch to lowercase if necessary
				if(!e.shiftKey) actualKey = actualKey.toLowerCase();
				Range.insertBefore(actualKey);
			} else {
				//
			}
		}
	});
});