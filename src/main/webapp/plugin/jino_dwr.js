/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

var DWR_LISTENERS = [];
function SET_DWR(isSet){
	
	if (isSet) {
		if(DWR_LISTENERS.length != 0) return;
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NEW_NODE, function(){
			var node = arguments[0];
			var index = arguments[1].index? arguments[1].index : null;
			var isleft = null;
			if(node.isLeft && node.getParent() && node.getParent().isRootNode()){
				isleft = node.isLeft()? "left" : "right";	
			}
			
			var data = "<paste>";			
			data += node.toXML();
			data += "</paste>";
			
			(typeof DWR_sendNodeInsert != "undefined")
				&& DWR_sendNodeInsert(node.getParent().id, data, index, isleft);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_REMOVE, function(){
			var node = arguments[0];			
			(typeof DWR_sendNodeRemove != "undefined")
				&& DWR_sendNodeRemove(node.id);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_EDITED, function(){
			var node = arguments[0];			
			(typeof DWR_sendNodeEdit != "undefined")
				&& DWR_sendNodeEdit(node.id, node.getText());			
		}));
		
		// Folding은 문제점이 많아 잠시 막아 둡니다.
//		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_FOLDING, function(){
//			var node = arguments[0];
//			(typeof DWR_sendNodeFolding != "undefined")
//				&& DWR_sendNodeFolding(node.id, node.folded);
//		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_COORDMOVED, function(){
			var node = arguments[0];
			(typeof DWR_sendNodeCoordMoved != "undefined")
				&& DWR_sendNodeCoordMoved(node.id, arguments[1], arguments[2]);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_HYPER, function(){
			var node = arguments[0];
			(typeof DWR_sendNodeHyper != "undefined")
				&& DWR_sendNodeHyper(node.id, (node.hyperlink)?node.hyperlink.attr().href:null);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGE, function(){
			var nodeid = arguments[0];
			var img_url = arguments[1];
			var width = arguments[2];
			var height = arguments[3];
			(typeof DWR_sendNodeImage != "undefined")&& DWR_sendNodeImage(nodeid, img_url, width, height);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_PASTE, function(){
			var node = arguments[0];
			(typeof DWR_sendNodePaste != "undefined")
				&& DWR_sendNodePaste(node.id, arguments[1], arguments[2]);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_MOVED, function(){
			(typeof DWR_sendNodeMoved != "undefined")
				&& DWR_sendNodeMoved(arguments[0], arguments[1], arguments[2], arguments[3]);
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_UNDO, function(){
			var id = arguments[0];
			var data = arguments[1];
			(typeof DWR_sendNodeUndo != "undefined")
				&& DWR_sendNodeUndo(id, data);			
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_REDO, function(){
			var id = arguments[0];
			var data = arguments[1];
			(typeof DWR_sendNodeRedo != "undefined")
				&& DWR_sendNodeRedo(id, data);			
		}));
		
		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, function(){
			var id = arguments[0].id;
			var html = arguments[1];
			var width = arguments[2];
			var height = arguments[3];
			(typeof DWR_sendNodeForeignObject != "undefined")&& DWR_sendNodeForeignObject(id, html, width, height);
		}));

		DWR_LISTENERS.push(jMap.addActionListener(ACTIONS.ACTION_NODE_ATTRS, function(){
			var node = arguments[0];
			var xml = node.toXML(true);
			(typeof DWR_sendNodeAttrs != "undefined")&& DWR_sendNodeAttrs(xml);
		}));
		
	}
	else {
		var l = null;
		while (l = DWR_LISTENERS.pop())
			jMap.removeActionListener(l);
	}
}
	
