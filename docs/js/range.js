var Range = {
	cursorSrc: '/docs/images/cursor.gif',
	currentFocus: null,
	_getSelection: function() {
		// get users selection
		var userSelection;
		if (window.getSelection) {
			userSelection = window.getSelection();
		}
		else if (document.selection) { // should come last; Opera!
			userSelection = document.selection.createRange();
		}
		
		return userSelection;
	},
	
	_getSelectionText: function() {
		// get inner text
		var selectedText = this.getSelection();
		if (userSelection.text) selectedText = userSelection.text;
		
		return selectedText;
	},
	
	_getRangeObject: function() {
		var selectionObject = this._getSelection();
		if (selectionObject.getRangeAt)
				return selectionObject.getRangeAt(0);
			else { // Safari!
				var range = document.createRange();
				range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
				range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
				return range;
			}
		
	},
	
	_createNewSelection: function(selection, startOffset, endOffset) {
		var newSelection = document.createRange();
		console.debug("start: " + (selection.startOffset + startOffset));
		console.debug("end: " + (selection.endOffset + endOffset));
		// get selectionObject
		var selectionObject = this._getSelection();
		newSelection.setStart(selection.startContainer, selection.startOffset + startOffset);
		newSelection.setEnd(selection.startContainer, selection.endOffset + endOffset);
		
		return newSelection;
	},
	
	focusArea: function(element) {
		this.currentFocus = element;
	},
	
	unfocusArea: function() {
		var currentCursor = document.getElementById("cursor");
		if(currentCursor) currentCursor.parentNode.removeChild(currentCursor);
		this.currentFocus = null;
	},
	
	getRangeObjectOffsets: function() {
		var selection = this._getRangeObject();
		return { 
			start: selection.startOffset,
			end: selection.endOffset
		}
	},
	
	insertCursor: function() {
		var currentCursor = document.getElementById("cursor");
		if(currentCursor) currentCursor.parentNode.removeChild(currentCursor);
		var selection = (arguments[0]) ? arguments[0] : this._getRangeObject();
		var cursor = document.createElement("img");
		cursor.setAttribute("src", this.cursorSrc);
		cursor.setAttribute("id", "cursor");
		selection.insertNode(cursor);
	},
	
	insertBefore: function(str) {
		var selection = this._getRangeObject();
		var str = document.createTextNode(str);
		selection.insertNode(str);
		selection.setStartAfter(str);
	},
	
	backwardsDelete: function() {
		var selection = this._getRangeObject();
		// create new selection directly behind the current selection
		var newSelection = this._createNewSelection(selection, -1, 0);
		
		if(selection.startOffset == selection.endOffset) {
			newSelection.deleteContents();
			selection.setStart(newSelection.startContainer, newSelection.startOffset - 1);
			selection.setStart(newSelection.startContainer, newSelection.endOffset);
		} else {
			selection.deleteContents();
			this.insertCursor(newSelection);
		}
	},
	
	wrapStrong: function() {
		var selection = this._getRangeObject();
		selection.surroundContents(document.createElement("strong"));
	},
	
	wrapEm: function() {
		var selection = this._getRangeObject();
		selection.surroundContents(document.createElement("em"));
	},
	
	moveCursorLeft: function() {
		var selection = this._getRangeObject();
		// create new selection directly behind the current selection
		var newSelection = this._createNewSelection(selection, -1, -1);
		
		this.insertCursor(newSelection);
	},
	
	moveCursorRight: function() {
		var selection = this._getRangeObject();
		this.insertCursor(selection);
	}
}