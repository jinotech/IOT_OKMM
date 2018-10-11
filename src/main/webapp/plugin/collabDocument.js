
/**
 *  
 *  
 * @author Hahm Myung Sun (hms1475@gmail.com)
 * @created 2011-07-30
 * 
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */
	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////// collabDocument ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

collabDocument = function(map, node){
	if(map.cfg.lazyLoading) return;		// lazy loading시 사용 불가
	if(node.collabDocElement) {
		this.destroy(node);
		return;
	}
	
	this.map = map;
	this.collabDocNode = node;
	this.prevSelectedElement = null;
	
	this.addListener();
	this.showDocument();
	
	this.updateDocument();
	
	this.map.work.focus();
}

collabDocument.prototype.type= "collabDocument";

collabDocument.prototype.cfg = {
};

collabDocument.prototype.destroy = function(node) {
	// 리스너 삭제
	this.removeListener();
	
	// 노드에 있는 collabDoc 정보 삭제
//	// 필요없음. 노드 삭제되면서 같이 삭제됨.
//	var that = this;
//	var recursionNodes = function(node) {
//		if(node.getChildren().length > 0) {
//			var children = node.getChildren();
//			for(var i = 0; i < children.length; i++) {
//				children[i].collabDocElement.remove();
//				children[i].collabDocElement = null;
//				delete children[i].collabDocElement;
//				recursionNodes(children[i]);
//			}
//		}
//	}	
//	recursionNodes(this.collabDocNode);
	node.setImageExecute();
	node.collabDocElement.remove();
	node.collabDocElement = null;
	delete node.collabDocElement;
	
}

/**
 * 협업 문서창 보이기
 */
collabDocument.prototype.showDocument = function() {	
	if(!this.collabDocNode.collabDocElement) {
		// 문서창 레이아웃 생성
		var left = 15;
		var top = 50;
		var pos = "left: "+left+"px; top: "+top+"px;";
		this.collabDocNode.collabDocElement = $('<div id="collabDoc_editor" style="position:absolute; '+pos+' width: 250px; height: 80%; border:1px solid; background-color: #fff; padding:5px; overflow-y:scroll;"></div>').appendTo('#main');
		this.collabDocNode.isCollabDocRoot = true;
	} else {
		// 이미 만들어져 있으면 show로 보이기
		this.collabDocNode.collabDocElement.show();
	}
	
	// 협업 노드 표시
	this.collabDocNode.setImageExecute(jMap.cfg.contextPath + '/images/Transfer_Document.png', 36, 36);
	
}

/**
 * 협업 문서창 숨기기
 */
collabDocument.prototype.hideDocument = function() {
	this.collabDocNode.collabDocElement.hide();
	this.collabDocNode.setImageExecute();
}

collabDocument.prototype.updateDocument = function() {
	if(!this.collabDocNode.collabDocElement) return;
	
	this.collabDocNode.collabDocElement.empty();
	
	var that = this;
	var recursionNodes = function(node) {
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			for(var i = 0; i < children.length; i++) {
				children[i].collabDocElement = $('<a>' + children[i].getText() + ' </a>').appendTo(that.collabDocNode.collabDocElement);
				recursionNodes(children[i]);
			}
		}
	}
	
	recursionNodes(this.collabDocNode);
}



/**
 * 리스너 등록
 */
collabDocument.prototype.addListener = function() {
	this.listeners = [];	
	var that = this;
	
	// 노드 편집시
	this.listeners.push(this.map.addActionListener(ACTIONS.ACTION_NODE_EDITED, function(){
		//editNodeAction(arguments[0]);
		that.updateDocument();
	}));
	
	// 노드 삭제시
	this.listeners.push(this.map.addActionListener(ACTIONS.ACTION_NODE_REMOVE, function(){
		var node = arguments[0];
		if(node == that.collabDocNode){
			that.destroy(node);
			return;
		}
		
		//removeNodeAction(arguments[0]);
		that.updateDocument();
	}));
	
	// 노드 이동시
	this.listeners.push(this.map.addActionListener(ACTIONS.ACTION_NODE_MOVED, function(){
		that.updateDocument();
	}));
	
	// 노드 붙여넣기시
	this.listeners.push(this.map.addActionListener(ACTIONS.ACTION_NODE_PASTE, function(){
		that.updateDocument();
	}));
	
	// 노드 선택시
	this.listeners.push(this.map.addActionListener(ACTIONS.ACTION_NODE_SELECTED, function(){
		var node = arguments[0];
		this.prevSelectedElement && this.prevSelectedElement.css('background-color', '');
		if(node.collabDocElement) {			
			node.collabDocElement.css('background-color', '#DFDFDF');
			this.prevSelectedElement = node.collabDocElement;
		}
		 
	}));
	
//	// 협업 // 새로운 노드 생성시
//	this.listeners.push(this.map.addActionListener("DWR_InsertNode", function(){
//		newNodeAction(arguments[0], arguments[1]);	
//	}));
	
	// 협업 // 노드 편집시
	this.listeners.push(this.map.addActionListener("DWR_EditNode", function(){
		//editNodeAction(arguments[0]);
		that.updateDocument();
	}));
	
	// 협업 // 노드 삭제시
	this.listeners.push(this.map.addActionListener("DWR_RemoveNode", function(){
		var node = arguments[0];
		if(node == that.collabDocNode){
			that.destroy(node);
			return;
		}
		
		//removeNodeAction(arguments[0]);
		that.updateDocument();
	}));
	
	// 협업 // 노드 이동시
	this.listeners.push(this.map.addActionListener("DWR_MovedNode", function(){
		that.updateDocument();
	}));
	
	
	/////////////////// ACTION ///////////////////////
	//// 기능상 만들었다 현재 안씀. //
	
	var newNodeAction = function(node, index) {
		if(node.getParent().collabDocElement) {
			var isSibling = false;
			if(index) isSibling = true;
						
			//node.prevSibling
			if(isSibling) {
				node.collabDocElement = $('<p>' + node.getText() + '</p>').insertAfter(node.prevSibling().collabDocElement);
			} else {
				if(node.getParent().isCollabDocRoot) {
					node.collabDocElement = $('<p>' + node.getText() + '</p>').appendTo(node.getParent().collabDocElement);
				} else {
					if(node.prevSibling())
						node.collabDocElement = $('<p>' + node.getText() + '</p>').insertAfter(node.prevSibling().collabDocElement);
					else
						node.collabDocElement = $('<p>' + node.getText() + '</p>').insertAfter(node.getParent().collabDocElement);
				}				
			}
			
		}
	}
	
	var editNodeAction = function(node) {
		if(node.collabDocElement) {
			node.collabDocElement.html(node.getText());
		}
	}
	
	var removeNodeAction = function(node) {
		node.collabDocElement.remove();
		node.collabDocElement = null;
	}
	
}

collabDocument.prototype.removeListener = function() {
	var l = null;
	if(!this.listeners) return;
	while (l = this.listeners.pop()){		
		this.map.removeActionListener(l);
	}
}



