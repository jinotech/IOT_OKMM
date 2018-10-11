/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// UndoRedoManager ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var MAX_HISTORY_LENGTH = 0;

UndoRedoManager = function(){	
	this.undoList = new Array();	
	this.redoList = new Array();
}

UndoRedoManager.prototype.type = "UndoRedoManager";

//UndoRedoManager.prototype.addToHistory = function(node, id, isChild){
//	var data = null;	 
//	data = node && this.extractNode(node, isChild);
//	
//	this.undoList.push({'id':id, 'data':data, 'isChild':isChild});		
//}

UndoRedoManager.prototype.addToHistory = function(undo, redo){	
	this.undoList.push({'undo':undo, 'redo':redo});
	
	if(this.undoList.length > MAX_HISTORY_LENGTH){
		this.undoList.splice(0,1);
	}
}

UndoRedoManager.prototype.undo = function(){
	if(this.undoList.length == 0) return false;
	
	var history = this.undoList.pop();
	var id = history.undo && history.undo.id || history.redo.id;
	var node = jMap.getNodeById(id);
	this.redoList.push(history);
	
	var recoveryNode = null;
	if(history.undo){
		recoveryNode = this.recoveryNode(node, history.undo);
		recoveryNode.setFoldingExecute(recoveryNode.folded)	
	} else {
		node.removeExecute();
	}
	
	jMap.fireActionListener(ACTIONS.ACTION_NODE_UNDO, id, history.undo);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
	return true;
}

UndoRedoManager.prototype.redo = function(){
	if(this.redoList.length == 0) return false;
	
	var history = this.redoList.pop();
	var id = history.redo && history.redo.id || history.undo.id;
	var node = jMap.getNodeById(id);
	this.undoList.push(history);
	
	var recoveryNode = null;
	if(history.redo){
		recoveryNode = this.recoveryNode(node, history.redo);
		recoveryNode.setFoldingExecute(recoveryNode.folded)	
	} else {
		node.removeExecute();
	}
	
	jMap.fireActionListener(ACTIONS.ACTION_NODE_REDO, id, history.redo);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
	return true;
}


UndoRedoManager.prototype.extractNode = function(node, isChild){
	var data = {};
	// body
	var bodyAttr = node.body.attr();
	//delete bodyAttr["fill-opacity"];	
	delete bodyAttr.gradient;
	bodyAttr.fill = node.background_color
	bodyAttr.stroke = node.edge.color;
	bodyAttr["stroke-width"] = node.edge.width;
	data.body = bodyAttr;
	// text 
	var textAttr = node.text.attr();
	data.text = textAttr;
	// folderShape;
	var folderAttr = node.folderShape.attr();
	//delete folderAttr["fill-opacity"];
	data.folderShape = folderAttr;
	// hyperlink
	data.hyperlink = node.hyperlink && node.hyperlink.attr().href;
	// img
	data.img = node.imgInfo.href && node.imgInfo.href;
	// note
	data.note = node.note;
	// FreeMind Node 속성
	data.background_color = node.background_color;
	data.color = node.color;
	data.folded = node.folded;
	data.id = node.id;
	data.plainText = node.plainText;
	data.link = node.link;
	data.position = node.position;
	data.style = node.style;
	data.created = node.created;
	data.modified = node.modified;
	data.hgap = node.hgap;
	data.vgap = node.vgap;
	data.vshift = node.vshift;
	// Layout을 위한 속성
	data.SHIFT = node.SHIFT;
	data.relYPos = node.relYPos;
	data.treeWidth = node.treeWidth;
	data.treeHeight = node.treeHeight;
	data.leftTreeWidth = node.leftTreeWidth;
	data.rightTreeWidth = node.rightTreeWidth;
	data.upperChildShift = node.upperChildShift;
	// edge 속성
	data.edge = node.edge;
	data.branch = node.branch;
	data.fontSize = node.fontSize;
	// foreignObject
	if(node.foreignObjEl){		
		data.foreignObject_plainHtml = node.foreignObjEl.plainHtml;
		data.foreignObject_width = node.foreignObjEl.getAttribute("width");
		data.foreignObject_height = node.foreignObjEl.getAttribute("height");
	}
	
	data.parentid = node.getParent() && node.getParent().id;
	data.childPosition = node.getIndexPos();
	
	if(isChild){
		data.child = new Array;
	
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			for(var i = 0; i < children.length; i++) {
				data.child.push(this.extractNode(children[i], isChild));
			}
		}		
	}	
	
	return data;
}


UndoRedoManager.prototype.recoveryNode = function(node, data){
	// 잘라낸 노드의 자식을 잘라낸경우 삭제
	if(data.body.removed) return;
	
	if(!node){
		var parentNode = jMap.getNodeById(data.parentid);
		var id = null;
		var index = null;
		if(data.id) id = data.id;
		index = data.childPosition;
		var param = {parent: parentNode,
				text: "",
				id: id,
				index: index};
		node = jMap.createNodeWithCtrlExecute(param);
		parentNode.folded && parentNode.setFoldingExecute(parentNode.folded);
		
		data.hyperlink && node.setHyperlinkExecute(data.hyperlink);
		data.img && node.setImageExecute(data.img);
	}
	
	node.body.attr(data.body);
	node.text.attr(data.text);
	node.folderShape.attr(data.folderShape);	
	
	// note
	node.note = data.note;
	// FreeMind Node 속성
	node.background_color = data.background_color;
	node.color = data.color;
	node.folded = data.folded;
	//node.id = data.id;				// 아이디는 노드 만들어 질때 만들어짐
	node.plainText = data.plainText;
	node.link = data.link;
	node.position = data.position;
	node.style = data.style;
	node.created = data.created;
	node.modified = data.modified;
	node.hgap = data.hgap;
	node.vgap = data.vgap;
	node.vshift = data.vshift;
	// Layout을 위한 속성
	node.SHIFT = data.SHIFT;
	node.relYPos = data.relYPos;
	node.treeWidth = data.treeWidth;
	node.treeHeight = data.treeHeight;
	node.leftTreeWidth = data.leftTreeWidth;
	node.rightTreeWidth = data.rightTreeWidth;
	node.upperChildShift = data.upperChildShift;
	// edge 속성
	node.edge = data.edge;
	node.branch = data.branch;
	node.fontSize = data.fontSize;
	// foreignObject
	if(data.foreignObject_plainHtml){		
		node.setForeignObjectExecute(data.foreignObject_plainHtml, 
				data.foreignObject_width, data.foreignObject_height);
	}
	
	// 이 for문이 도는건 삭제된 경우에만 해당하는가..?
	if(data.child && data.child.length > 0){
		for(var i=0; i < data.child.length; i++){
			this.recoveryNode(null, data.child[i]);
		}
	}
	
	return node;
}

