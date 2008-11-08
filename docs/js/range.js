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
	
	_createNewSelection: function(startOffset, endOffset) {
		var newSelection = document.createRange();
		// get selectionObject
		var selectionObject = this._getSelection();
		newSelection.setStart(selectionObject.anchorNode,selectionObject.anchorOffset + startOffset);
		newSelection.setEnd(selectionObject.focusNode,selectionObject.focusOffset + endOffset);
		
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
		var currentCursor = document.getElementById("cursor");
		// remove cursor and normalize
		if(currentCursor) {
			var parent = currentCursor.parentNode;
			parent.removeChild(currentCursor);
			parent.normalize();
		}
		
		// insert new textnode
		var selection = this._getRangeObject();
		var str = document.createTextNode(str);
		selection.insertNode(str);
		str.parentNode.normalize();
		
		// create new selection
		var newSelection = document.createRange();
		newSelection.setStart(selection.startContainer, selection.startOffset + 1);
		newSelection.setEnd(selection.startContainer, selection.endOffset + 1);
		
		// move selection
		var selectionObject = this._getSelection();
		selectionObject.extend(selection.startContainer, selection.endOffset + 1);
		selectionObject.collapseToEnd();
		
		// insert cursor to new position
		var cursor = document.createElement("img");
		cursor.setAttribute("src", this.cursorSrc);
		cursor.setAttribute("id", "cursor");
		newSelection.insertNode(cursor);
	},
	
	backwardsDelete: function() {
		var selection = this._getRangeObject();
		if(selection.collapsed) {
			// create new selection directly behind the current selection
			var newSelection = this._createNewSelection(-1, 0);
			newSelection.deleteContents();
			
			selection.setStart(document.getElementById("cursor").previousSibling, document.getElementById("cursor").previousSibling.length);
			selection.setStart(document.getElementById("cursor").previousSibling, document.getElementById("cursor").previousSibling.length);
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
		var currentCursor = document.getElementById("cursor");
		if (currentCursor && currentCursor.previousSibling.length > 0) {
			if(currentCursor) {
				var parent = currentCursor.parentNode;
				parent.removeChild(currentCursor);
				parent.normalize();
			}
			//var selection = this._getRangeObject();
			var newSelection = this._createNewSelection(-1, -1);
			var cursor = document.createElement("img");
			cursor.setAttribute("src", this.cursorSrc);
			cursor.setAttribute("id", "cursor");
			newSelection.insertNode(cursor);
		}
	},
	
	moveCursorRight: function() {
		var currentCursor = document.getElementById("cursor");
		// if have not reached the end
		if (currentCursor && currentCursor.nextSibling.length > 0) {
			if(currentCursor) {
				var parent = currentCursor.parentNode;
				parent.removeChild(currentCursor);
				parent.normalize();
			}

			var selection = this._getRangeObject();
			
			// create new selection
			var newSelection = document.createRange();
			newSelection.setStart(selection.startContainer, selection.startOffset + 1);
			newSelection.setEnd(selection.startContainer, selection.endOffset + 1);

			// move selection
			var selectionObject = this._getSelection();
			selectionObject.extend(selection.startContainer, selection.endOffset + 1);
			selectionObject.collapseToEnd();

			// insert cursor to new position
			var cursor = document.createElement("img");
			cursor.setAttribute("src", this.cursorSrc);
			cursor.setAttribute("id", "cursor");
			newSelection.insertNode(cursor);
		}
	},
	expandSelectLeft: function() {
		var currentCursor = document.getElementById("cursor");
		if(currentCursor) {
			var parent = currentCursor.parentNode;
			parent.removeChild(currentCursor);
			parent.normalize();
		}
		
		var selection = this._getRangeObject();
		
		// move selection
		var selectionObject = this._getSelection();
		selectionObject.extend(selection.startContainer, selection.startOffset - 1);
	},
	expandSelectRight: function() {
		var currentCursor = document.getElementById("cursor");
		if(currentCursor) {
			var parent = currentCursor.parentNode;
			parent.removeChild(currentCursor);
			parent.normalize();
		}
		
		var selection = this._getRangeObject();
		
		// move selection
		var selectionObject = this._getSelection();
		selectionObject.extend(selection.startContainer, selection.endOffset + 1);
	}
}