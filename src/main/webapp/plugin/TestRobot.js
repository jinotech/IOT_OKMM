/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

TestRobot = (function () {				
	function Robot(){}
	
	var cnt = 1;
	var createTimeout = null;
	var removeTimeout = null;
	var moveTimeout = null;
	var ival = 2000;
	var userNode = null;
	
	/**
	 * node의 자식을 모아온다.
	 * 
	 * node : 자식을 모아올 node
	 * nodes : 자식들이 모일 공간 ( var nodes = new Array(); 넣어주면 됨)
	 */
	Robot.getchildrenNodes = function(node, nodes) {
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			for(var i = 0; i < children.length; i++) {
				TestRobot.getchildrenNodes(children[i], nodes);
				nodes.push(children[i]);
			}			
		}
	}
	
	
	
	
	
	/*
	 * 단순히 하나의 노드를 만든다.
	 */
	Robot.createNodeSimple = function(testID) {
		var rootNode = jMap.getRootNode();
		var childrens = rootNode.getChildren();
		var rootNodeLen = childrens.length;
		
		var random = Math.floor( Math.random()*rootNodeLen );
		var node = childrens[random];
		
		var param = {parent: node,
				text: "Test " + testID +", "+cnt++};
		jMap.createNodeWithCtrl(param);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
	}
	
	/*
	 * 이미지 링크가 걸린 노드를 만든다. 
	 */
	Robot.createNodeLink = function(testID) {
		var rootNode = jMap.getRootNode();
		var childrens = rootNode.getChildren();
		var rootNodeLen = childrens.length;
		
		var random = Math.floor( Math.random()*rootNodeLen );
		var node = childrens[random];
		
		var param = {parent: node,
				text: "Test " + testID +", "+cnt++};
		var newNode = jMap.createNodeWithCtrl(param);
		
		var randamLink = Math.floor( Math.random()*2 );
		if(randamLink == 0){
			newNode.setHyperlink("http://www.google.com/");
			newNode.setImage("http://hms1475.byus.net/public/google_logo.png");
		} else {
			newNode.setHyperlink("http://www.facebook.com/");
			newNode.setImage("http://hms1475.byus.net/public/facebook_logo.png");
		}
		
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
	}
	
	/*
	 * 랜덤한 위치에 이미지 링크가 걸린 노드를 만든다. 
	 */
	Robot.RandomCreateNodeLink = function(testID, testColor) {		
		var random = Math.floor( Math.random()*cnt );
		var node = null;		
		var index = 0;
		
		for(var iid in jMap.nodes) {			
			if( random == index++){
				node = jMap.nodes[iid];
			}
		}		
		if(node == null) return;
		
		var param = {parent: node,
				text: "Test " + testID +", "+cnt++};
		var newNode = jMap.createNodeWithCtrl(param);
//		newNode.setBackgroundColor(testColor);
		
		var randamLink = Math.floor( Math.random()*2 );
		if(randamLink == 0){
			newNode.setHyperlink("http://www.google.com/");
			newNode.setImage("http://hms1475.byus.net/public/google_logo.png");
		} else {
			newNode.setHyperlink("http://www.facebook.com/");
			newNode.setImage("http://hms1475.byus.net/public/facebook_logo.png");
		}
		
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
	}
	
	/*
	 * testID로 노드를 만들고 그노드의 자식으로 랜덤한 위치에 이미지 링크가 걸린 노드를 만든다.  
	 */
	Robot.UserCreateNodeLink = function(testID, node, testColor, count) {
		var nodes = new Array();
		TestRobot.getchildrenNodes(node, nodes);
		
		var random = Math.floor( Math.random()*nodes.length )-1;
		var pNode = nodes[random];
		if(!pNode) pNode = node;
		
		var d = new Date();
		cnt++;
		var text = testID+", "+cnt+", "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		var param = {parent: pNode,
				text: text};
		var newNode = jMap.createNodeWithCtrl(param);
		
//		newNode.setBackgroundColor(testColor);
		/*
		var randamLink = Math.floor( Math.random()*2 );
		if(randamLink == 0){
			newNode.setHyperlink("http://www.google.com/");
			newNode.setImage("http://hms1475.byus.net/public/google_logo.png");
		} else {
			newNode.setHyperlink("http://www.facebook.com/");
			newNode.setImage("http://hms1475.byus.net/public/facebook_logo.png");
		}
		*/
		
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
		
		
		nodes = new Array();
		TestRobot.getchildrenNodes(jMap.getRootNode(), nodes);
		jMap.getRootNode().setTextExecute(nodes.length);
		
		
		if(cnt == count) {
			clearTimeout(createTimeout);
			createTimeout = null;
			alert("끝");
		}
	}
	
	/*
	 * 노드 자식들중 하나를 선택해 노드의 다른 위치로 이동시킨다. 
	 */
	Robot.MoveNode = function(node) {
		var nodes = new Array();
		TestRobot.getchildrenNodes(node, nodes);
		
		var random = Math.floor( Math.random()*nodes.length );
		var selectedNode = nodes[random];
		if(!selectedNode || selectedNode == node) return;
		
		var selnode = [selectedNode];		
		jMap.controller.cutAction(selnode);
		
		// 다시 검색하여 랜덤위치에 붙여넣기
		var nodes = new Array();
		TestRobot.getchildrenNodes(node, nodes);
		
		var random = Math.floor( Math.random()*nodes.length );
		var selectedNode = nodes[random];
		if(!selectedNode) selectedNode = node;
		
		jMap.controller.pasteAction(selectedNode);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
		
		
		nodes = new Array();
		TestRobot.getchildrenNodes(jMap.getRootNode(), nodes);		
		jMap.getRootNode().setText(nodes.length);
		
	}
	
	/*
	 * 노드를 삭제한다.
	 */
	Robot.UserRemove = function(node) {
		var nodes = new Array();
		TestRobot.getchildrenNodes(node, nodes);
		
		var random = Math.floor( Math.random()*nodes.length );
		var selectedNode = nodes[random];
		if(!selectedNode || selectedNode == node) return;
		
		selectedNode.remove();
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
		
		nodes = new Array();
		TestRobot.getchildrenNodes(jMap.getRootNode(), nodes);		
		jMap.getRootNode().setText(nodes.length);
		
		if(nodes.length == 1){
			clearTimeout(removeTimeout);
			removeTimeout = null;
			alert("all clear");
		}
	}
	
	/***************************** Test 함수 ************************/
	
	Robot.createStart = function (interval, count) {
		if(createTimeout) return;
		console.log("create start");
		
		if(interval) ival = interval;		
		var testID = Math.floor( Math.random()*1024 );
		var testColor = iColor[Math.floor( Math.random()*iColor.length )];
		var param = {parent: jMap.getRootNode(),
				text: "User : " + testID};
		userNode = jMap.createNodeWithCtrl(param);
		cnt = 0;
		createTimeout = setInterval(TestRobot.UserCreateNodeLink, ival, testID, userNode, testColor, count);
	}	
	Robot.removeStart = function () {
		if(removeTimeout) return;
		
		console.log("remove start");
		
		removeTimeout = setInterval(TestRobot.UserRemove, ival, userNode);
	}	
	Robot.moveStart = function () {
		if(moveTimeout) return;
		
		console.log("move start");
		
		moveTimeout = setInterval(TestRobot.MoveNode, 5000, userNode);
	}
	
	Robot.allEnd = function () {
		if(moveTimeout){
			clearTimeout(moveTimeout);
			moveTimeout = null;
		}
		if(removeTimeout){
			clearTimeout(removeTimeout);
			removeTimeout = null;
		}
		if(createTimeout){
			clearTimeout(createTimeout);
			createTimeout = null;
		}
		
		alert("abort");
		
	}	
	Robot.createEnd = function () {
		if(!createTimeout) return;
		
		alert("create stop")
		clearTimeout(createTimeout);
		createTimeout = null;
	}
	Robot.removeEnd = function () {
		if(!removeTimeout) return;
		
		alert("remove stop")
		clearTimeout(removeTimeout);
		removeTimeout = null;
	}
	Robot.moveEnd = function () {
		if(!moveTimeout) return;
		
		alert("move stop")
		clearTimeout(moveTimeout);
		moveTimeout = null;
	}
	
	Robot.result = function () {
		var node = jMap.getSelecteds().getLastElement();		
		var nodes = new Array();
		TestRobot.getchildrenNodes(node, nodes);
		
		alert("nodes : "+nodes.length);
	}
	
	return Robot;
})();


