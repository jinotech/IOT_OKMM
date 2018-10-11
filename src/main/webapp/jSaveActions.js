
/**
 *  
 *  실시간 저장을 하기위해 필요한 Action들을 정의한 곳.
 *  
 * @author Hahm Myung Sun (hms1475@gmail.com)
 * @created 2011-07-01
 * 
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */
	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////// jSaveAction ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jSaveAction = function(map){
	this.map = map;
}

jSaveAction.prototype.type= "jSaveAction";

jSaveAction.prototype.cfg = {
		async: true,
		type:'post'
};

jSaveAction.prototype.newAction = function(node, async) {
	if(this.map.cfg.realtimeSave) {
		var xml = node.toXML();	
		var mapid = ' mapid="'+mapId+'"';	
		var parentid = '';
		if(node.getParent())
			parentid = ' parent="'+node.getParent().getID()+'"';	
		var nextid = '';
		if(node.nextSibling())
			nextid = ' next="'+node.nextSibling().getID()+'"';
		
		var action = '<new'+mapid+parentid+nextid+'>' + xml + '</new>';

		if(async == null || async == undefined) async = this.cfg.async;
		var that = this;
		$.ajax({
			type: this.cfg.type,
			async: async,
			url: this.map.cfg.contextPath+'/mindmap/save.do',
			data: {'action': action},
			beforeSend: function() {},
			success: function(data, textStatus, jqXHR) {			
				// -1이면 오류
				if(jqXHR.responseText == -1){
					// 에러처리로 노드 삭제
					if(J_NODE_CREATING){
						var node = null;	
						var parentNode = null;		
						while (node = that.map.getSelecteds().pop()) {
							parentNode = node.getParent();								
							node.remove();
						}
						J_NODE_CREATING.focus(true);
						
						that.map.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
						that.map.layoutManager.layout(true);
					}
					that.map.controller.stopNodeEdit(false);
				}
			},
			error: function(data, status, err) {
				alert("newAction : " + status);
			},			
			complete: function() {}
	    });
	}
}

jSaveAction.prototype.editAction = function(node, async) {
	if(this.map.cfg.realtimeSave) {
		if(node.removed) return;
		
		var xml = node.toXML(true);	
		var mapid = ' mapid="'+mapId+'"';	
		var action = '<edit'+mapid+'>' + xml + '</edit>';
		
		if(async == null || async == undefined) async = this.cfg.async;
		$.ajax({
			type: this.cfg.type,
			async: async,
			url: this.map.cfg.contextPath+'/mindmap/save.do',
			data: {'action': action},
			error: function(data, status, err) {
				alert("editAction : " + status);
			}
	    });
	}
}

jSaveAction.prototype.deleteAction = function(node, async) {
	if(this.map.cfg.realtimeSave) {
		if(node.removed) return;
		
		var xml = node.toXML();	
		var mapid = ' mapid="'+mapId+'"';	
		var action = '<delete'+mapid+'>' + xml + '</delete>';

		if(async == null || async == undefined) async = this.cfg.async;
		$.ajax({
			type: this.cfg.type,
			async: async,
			url: this.map.cfg.contextPath+'/mindmap/save.do',
			data: {'action': action},
			error: function(data, status, err) {
				alert("deleteAction : " + status);
			}
	    });
	}
}

jSaveAction.prototype.moveAction = function(node, parent, nextSibling, async) {
	if(this.map.cfg.realtimeSave) {
		var xml = node.toXML(true);	
		var mapid = ' mapid="'+mapId+'"';
		var parentid = ' parent="'+parent.getID()+'"';
		var nextid = (nextSibling)?' next="'+nextSibling.getID()+'"':'';
		
		var action = '<move'+mapid+parentid+nextid+'>' + xml + '</move>';

		if(async == null || async == undefined) async = this.cfg.async;
		$.ajax({
			type: this.cfg.type,
			async: async,
			url: this.map.cfg.contextPath+'/mindmap/save.do',
			data: {'action': action},
			error: function(data, status, err) {
				alert("moveAction : " + status);
			}
	    });
	}
}

jSaveAction.prototype.pasteAction = function(node, async) {
	if(this.map.cfg.realtimeSave) {
		var xml = node.toXML();
		var mapid = ' mapid="'+mapId+'"';	
		var parentid = '';
		if(node.getParent())
			parentid = ' parent="'+node.getParent().getID()+'"';	
		var nextid = '';
		
		var action = '<new'+mapid+parentid+nextid+'>' + xml + '</new>';

		if(async == null || async == undefined) async = this.cfg.async;
		$.ajax({
			type: this.cfg.type,
			async: async,
			url: this.map.cfg.contextPath+'/mindmap/save.do',
			data: {'action': action},
			error: function(data, status, err) {
				alert("pasteAction : " + status);
			}
	    });
	}
}

jSaveAction.prototype.isAlive = function() {
	return true;
	
	var ret = false;
	if(this.map.cfg.realtimeSave) {
		$.ajax({
			type: this.cfg.type,
			async: false,
			url: this.map.cfg.contextPath+'/ping',
			success: function(data) {
				ret = true;
			},
			error: function(data, status, err) {
				ret = false;
			}
	    });
	}	
	return ret;
}

jSaveAction.prototype.updateLineColorAction = function(dbid, color) {
	$.ajax({
		type: 'post',
		dataType: 'json',
		async: false,
		url: this.map.cfg.contextPath+'/mindmap/nodeLineColorUpdate.do',
		data: {'dbid': dbid , 'color' : color},
		error: function(data, status, err) {
			alert("updateLineColorAction : " + status);
		}
    });
}