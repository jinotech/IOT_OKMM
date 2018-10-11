/**
 * 
 * @author Park Kiwon
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

function init() {
  //dwr.engine.setActiveReverseAjax(true);
	if (dwr.engine._scriptSessionId == null) {
	      setTimeout("init()", 2000);
	   } else {
	      dwr.engine.setActiveReverseAjax(true);
	   }

//  dwr.engine.setNotifyServerOnPageUnload(true);
}



function DWR_sendNodeFolding(nodeId, folded){
	JavascriptChat.sendNodeFolding(nodeId, folded);
}

function DWR_afterNodeFolding(nodeId, folded){
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode && (tempNode.folded != folded)){
		tempNode.setFoldingExecute(folded);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);				
		jMap.layoutManager.layout(true);
	}
}

function DWR_sendNodeImage(nodeId, input_url, width, height){
	JavascriptChat.sendNodeImage(nodeId, input_url, width, height);
}

function DWR_afterNodeImage(nodeId, input_url, width, height){
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode){
		if(input_url) {
			tempNode.setImageExecute( input_url, width, height );
		} else {
			tempNode.imageResizeExecute( width, height );
		}

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}

function DWR_sendNodeHyper(nodeId, input_url){
	JavascriptChat.sendNodeHyper(nodeId, input_url);
}

function DWR_afterNodeHyper(nodeId, input_url){
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode){
		tempNode.setHyperlinkExecute( input_url );

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}

function DWR_sendNodeCoordMoved(id, dx, dy){
	JavascriptChat.sendNodeCoordMove(id, dx, dy);
}

function afterDWR_sendNodeCoordMove(id, dx, dy) {
	var tempNode = jMap.getNodeById(id);
	if(tempNode){
		//KHANG: deal with padlet node's moving
		if (tempNode instanceof jPadletNode) {			
			tempNode.attributes['padlet_x'] = parseFloat('' + tempNode.attributes['padlet_x']) + parseFloat(dx);
			tempNode.attributes['padlet_y'] = parseFloat('' + tempNode.attributes['padlet_y']) + parseFloat(dy);
		} else {
			if(tempNode.isLeft && tempNode.isLeft()){ 
				dx = -dx;
			}
			
			tempNode.hgap = parseInt(tempNode.hgap) + parseInt(dx);
			tempNode.vshift = parseInt(tempNode.vshift) + parseInt(dy);
		}

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}

function DWR_sendNodeForeignObject(nodeId, html, width, height){
	JavascriptChat.sendNodeForeignObject(nodeId, html, width, height);
}

function afterDWR_sendNodeForeignObject(nodeId, html, width, height){
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode){
		if(!html && width && height) {
			tempNode.foreignObjectResizeExecute( parseInt(width), parseInt(height) );			
		} else {
			tempNode.setForeignObjectExecute(html, parseInt(width), parseInt(height));
		}

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}

function DWR_sendNodeRemove(nodeId){
	JavascriptChat.deleteNode(nodeId);
}

function afterDWR_sendNodeRemove(nodeId) {
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode){
		var parentNode = tempNode.getParent();
		var indexPos = tempNode.getIndexPos();
		tempNode.removeExecute();
		
		jMap.fireActionListener("DWR_RemoveNode", tempNode);
		
		if (parentNode) {
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
			jMap.layoutManager.layout(false);
			
			// 노드를 삭제후 적정한 노드위치로 포커싱
			if (indexPos != -1) {
				if (parentNode.getChildren().length <= 0) {
					parentNode.focus();
				} else {
					if (parentNode.getChildren().length > indexPos) {
						parentNode.getChildren()[indexPos].focus();
					} else {
						parentNode.getChildren()[parentNode.getChildren().length - 1].focus();
					}
				}
				
			}
		} else {
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
			jMap.getRootNode().screenFocus();
		}
	}
}


function DWR_sendNodePaste(targetId, data, index){
	JavascriptChat.sendNodePaste(targetId, data, index==null?"null":index);
}

 function afterDWR_sendNodePaste(targetId, data, index){
	 var tempNode = jMap.getNodeById(targetId);
	 if(tempNode){
		// lazy loading이 아직 안된 상태라면 할일이 없다. 실시간 저장 때문에..
		 if(jMap.cfg.lazyLoading && tempNode.folded && !tempNode.lazycomplete) return;
		 
		 jMap.loadManager.pasteNode(tempNode, data);
		 
		 jMap.initFoldingAll();
		 jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(tempNode);
		 jMap.layoutManager.layout(true);
	 }
}

function DWR_sendNodeMoved(parent, pasteNodes, position, targNode) {
	var parentNodeID = parent.getID();	
	var pasteNodeIDs = [];
	for (var i = 0; i < pasteNodes.length; i++) {
		pasteNodeIDs.push(pasteNodes[i].getID());
	}
	var targNodeID = (targNode)?targNode.getID() : null;
	
	JavascriptChat.sendNodeMove(parentNodeID, pasteNodeIDs, position, targNodeID);
}

function afterDWR_sendNodeMoved(parentNodeID, pasteNodeIDs, position, targNodeID) {
	var parent = jMap.getNodeById(parentNodeID);
	
	// lazy loading이 아직 안된 상태라면 할일이 없다. 실시간 저장 때문에..
	// 받는 쪽에서 옮기는 노드와 타겟 노드모두 로딩이 안되었다면 아래와 하는 것이 맞다.
	// 하지만 타켓노드가 로딩 되어 있다면..?
	//if(jMap.cfg.lazyLoading && parent.folded && !parent.lazycomplete) return;
	
	if(jMap.cfg.lazyLoading) {
//		// 강제로 lazyLoading을 한다.
//		var expandParents = function(id) {
//			$.ajax({
//				type: 'post',
//				async: false,
//				url: jMap.cfg.contextPath+'/mindmap/node/path.do',
//				data: {'mapid': mapId,
//							'id': id },
//				beforeSend: function() {},
//				success: function(data) {
//					var ids = data.split (",");
//					for(var i=0; i < ids.length; i++) {							
//						var n = jMap.getNodeById(ids[i]);
//						jMap.loadManager.lazyLoading(n);
//					}
//				},
//				error: function(data, status, err) {
//					alert("expandParent : " + status);
//				},
//				complete: function() {					
//				}
//		    });
//		}
		
		
		for (var i = 0; i < pasteNodeIDs.length; i++) {
			var srcNode = jMap.getNodeById(pasteNodeIDs[i]);
			if(srcNode) {		// 이동하는 노드가 있는 경우 (로딩된 경우)
				if(!parent || !parent.lazycomplete){	// 타겟이 없는 경우 (로딩이 안된경우)
					var pnode = srcNode.getParent();
					srcNode.removeExecute();
					jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(pnode);
					return;
				}
			} else {				// 이동하는 노드가 없는 경우 (로딩이 안된경우)
				if(parent && parent.lazycomplete){	// 타겟이 있는 겨우 (로딩된 경우)
					// 노드를 서버에서 불러와 붙인다.
					$.ajax({
						type: 'post',
						async: false,
						url: jMap.cfg.contextPath+'/mindmap/childnodes.do',
						data: {'map': mapId,
									'node': pasteNodeIDs[i] },
						beforeSend: function() {},
						success: function(data, textStatus, jqXHR) {
							var xml = jqXHR.responseText;
							xml = xml.replace(/<foreignObject([^>]*)\">/ig, "<foreignObject$1\">\n<![CDATA[\n");
							xml = xml.replace(/<\/foreignObject>/ig, "\n]]>\n</foreignObject>");
							
							if (window.DOMParser) {
								var parser = new DOMParser();
								xmlDoc = parser.parseFromString(xml,"text/xml");
							} else { // Internet Explorer
								xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
								xmlDoc.async="false";
								xmlDoc.loadXML(xml);
							}
							
							var nodeElements = xmlDoc.childNodes;
							for(var i = 0; i < nodeElements.length; i++) {
								if(nodeElements.item(i).nodeType == 1 /*NodeTypes.ELEMENT_NODE*/) {
									var element = nodeElements.item(i);	
									if(element.nodeName != "node") continue;
									
									var text = element.getAttribute("TEXT");
									var id = element.getAttribute("ID");
									var targNode = (targNodeID)? jMap.getNodeById(targNodeID) : null;
									var index = (targNode)? targNode.getIndexPos() : null;
									var param = {parent: parent,
															text: text,
															id: id,
															index: index};
									var childNode = jMap.createNodeWithCtrlExecute(param);
									jMap.loadManager.initNodeAttrs(childNode, element);	// attr 속성 설정
									
									// 부모가 폴딩되어 있거나 숨겨져 있으면 숨긴다.
									//if(node.folded || node.hided) node.hideChildren(node);
									
									if(childNode.numofchildren > 0) {							
										childNode.setFoldingExecute(true);
										if(childNode.hided)
											childNode.folderShape && childNode.folderShape.hide();
									} else {
										// 자식이 없으면 로딩이 끝났음을..
										childNode.lazycomplete = new Date().valueOf();
									}
																		
								}
							}
							
							jMap.initFoldingAll();							
							jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
							jMap.layoutManager.layout(true);
							
							
						},
						error: function(data, status, err) {
							alert("editAction : " + status);
						},
						complete: function() {
						}
				    });
					return;
				} else {
					return;	// 이동되는 노드 및 타겟 부모노드가 모두 로딩되어 있지 않으면 할일 없음.
				}
			}
		}
		
		
		
//		
//		// 이동되는 노드 및 타겟 부모노드가 모두 로딩되어 있지 않으면 할일 없음.
//		var isCancel = false;
//		
//		if(!parent.lazycomplete) {
//			for (var i = 0; i < pasteNodeIDs.length; i++) {
//				if(jMap.getNodeById(pasteNodeIDs[i])) isCancel = true;
//			}
//		}
//		console.log(isCancel);
//		if(isCancel) return;
//		
//		
//		
//		console.log("p : " + parentNodeID);
//		expandParents(parentNodeID);
//		for (var i = 0; i < pasteNodeIDs.length; i++) {			
//			console.log("n : " + pasteNodeIDs[i]);
//			expandParents(pasteNodeIDs[i]);
//		}
//		
//		return;
		
	} 
	
	var pasteNodes = [];
	
	for (var i = 0; i < pasteNodeIDs.length; i++) {
		pasteNodes.push(jMap.getNodeById(pasteNodeIDs[i]));
	}
	var targNode = (targNodeID)? jMap.getNodeById(targNodeID) : null;
	
	jMap.changePositionExecute(parent, pasteNodes, position, targNode);
	
	jMap.fireActionListener("DWR_MovedNode", parent, pasteNodes, position, targNode);
	
	jMap.initFolding(parent);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	jMap.layoutManager.layout(true);
}

function DWR_sendNodeAttrs(xml){
	JavascriptChat.sendNodeAttrs(xml);
}

function afterDWR_sendNodeAttrs(xml){
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xml,"text/xml");
	} else { // Internet Explorer
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xml);
	}
	
	if(xmlDoc) {
		var nodeEl = xmlDoc.childNodes.item(0);
		var re = /ID="([^"]*)/;
		var match = re.exec(xml);
		var node = jMap.getNodeById(match[1]);
		
		jMap.loadManager.initNodeAttrs(node, nodeEl);	// attr 속성 설정
	}
}

function DWR_sendForceRefresh(userid){
	JavascriptChat.sendForceRefresh(userid);
}

function afterDWR_sendForceRefresh(userid){
	window.location.reload(true);
}

function DWR_sendAdminNotice(notice){
	JavascriptChat.sendAdminNotice(notice);
}

function afterDWR_sendAdminNotice(notice){
	jMap.showAdminNotice(notice);
}

function DWR_sendNodeInsert(nodeId, data, index, isLeft){
	JavascriptChat.insertNode(nodeId, data, index==null?"null":index, isLeft==null?"null":isLeft);
}

function afterDWR_sendNodeInsert(nodeId, data, index2, isLeft2) {
	var tempNode = jMap.getNodeById(nodeId);
	if(tempNode){
		// lazy loading이 아직 안된 상태라면 할일이 없다. 실시간 저장 때문에..
		if(jMap.cfg.lazyLoading && tempNode.folded && !tempNode.lazycomplete) return;
		
		var index = (index2 == "null")?null:index2;
		var isLeft = (isLeft2 == "null")?null:isLeft2;
		
		var newNodes = jMap.loadManager.pasteNode(tempNode, data, index, isLeft);
		var newNode = newNodes[0];	// insetNode이기 때문에 오직 하나만의 노드가 추가되었을 것이다.
		
		jMap.fireActionListener("DWR_InsertNode", newNode, index);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}


function DWR_sendNodeEdit(id, inputText) {
  JavascriptChat.sendNodeEdit(id, inputText);
}

function receiveDWR_sendNodeEdit(id, inputText) {
	var tempNode = jMap.getNodeById(id);
	if(tempNode){
		tempNode.setTextExecute(inputText);
		
		jMap.fireActionListener("DWR_EditNode", tempNode);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(tempNode);
		jMap.layoutManager.layout(true);
	}
}


function sendMessageIfEnter(event){
	if(event.keyCode == 13)  { 
		sendChatMessage(); 
	}
}
function sendChatMessage(){    
	var message=dwr.util.byId('messageText');    
	var messageText=message.value; 
	var user_name_temp = new gadgets.Prefs().getString("user_name");
	JavascriptChat.sendChatMessage(user_name_temp, messageText);
	message.value='';
}
function afterSendChatMessage(message){
	var chatArea=dwr.util.byId('chatArea');  
	var oldMessages=chatArea.innerHTML;
	chatArea.innerHTML=(oldMessages+message);    
	var chatAreaHeight = chatArea.scrollHeight;  
	chatArea.scrollTop = chatAreaHeight;
}

function exitUserInBoard(boardId){
	JavascriptChat.exitUserInBoard(boardId);
}


function afterEnterUserInBoard(loginUserTable) {
	var userList = '';
	
	for (var i = 0; i< loginUserTable.length; i++) {
		//if(loginUserTable[i]!='undefined')
		
		userList = ("<div>" + (loginUserTable[i]) + "</div>" + userList);
	}
	//
	
	dwr.util.byId('enterUserList').innerHTML  = userList;
}

function afterAddUserInBoardEmpty(loginUserTable) {
	
}


function DWR_sendNodeUndo(nodeId, data){
	
	var jsonCopyData = JSON.stringify(data);		
	JavascriptChat.sendRecoveryNode(nodeId, jsonCopyData);
}

function DWR_sendNodeRedo(nodeId, data){
	
	var jsonCopyData = JSON.stringify(data);		
	JavascriptChat.sendRecoveryNode(nodeId, jsonCopyData);
}

function DWR_afterRecoveryNode(nodeId, data2) {
	var data = (data2 == "null")?null:data2;
	var tempNode = jMap.getNodeById(nodeId);
	
	var recoveryNode = null;
		 if(data){
			 var backToJS = JSON.parse(data);
		  recoveryNode = recoveryNodeDWR(tempNode, backToJS);
		  recoveryNode.setFoldingExecute(recoveryNode.folded)
		 } else {
		  tempNode.removeExecute();
		 }
		 jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
}

function recoveryNodeDWR (node, data){
	// 잘라낸 노드의 자식을 잘라낸경우 삭제
	//if(data.body.removed) return;
	
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
	
	// 이 for문이 도는건 삭제된 경우에만 해당하는가..?
	if(data.child && data.child.length > 0){
		for(var i=0; i < data.child.length; i++){
			recoveryNodeDWR(null, data.child[i]);
		}
	}
	return node;
}

function DWR_setRestrictEditing(restricting){
	JavascriptChat.setRestrictEditing(restricting);
}

function afterDWR_setRestrictEditing(restricting) {
	$( "#restrict_editing" ).prop('checked', restricting);
	
	 jMap.cfg.restrictEditing = restricting;
}

function sessionCreated() {
	if(typeof jMap !== "undefined") {
		if(jMap.cfg.mapOwner) {
			DWR_setRestrictEditing(jMap.cfg.restrictEditing);
		}
	} else {
		setTimeout(sessionCreated, 1000);
	}
}

function sessionDestroyed() {
	//console.log("sessionDestroyed");
}
