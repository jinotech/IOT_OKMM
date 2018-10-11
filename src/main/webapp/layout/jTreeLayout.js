/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jTreeLayout = function (map){
	this.map = map;
	this.HGAP = 10; 
	this.VGAP = 20;
	
	this.xSize = 0;
	this.ySize = 0;
	
	// 가운데가 보이게...
	var work = this.map.work;
	work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
	work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
	
	this.map.cfg.nodeFontSizes = ['30', '18', '12'];
	this.map.cfg.nodeStyle = "jRect";
}

jTreeLayout.prototype.type= "jTreeLayout";

jTreeLayout.prototype.layoutNode = function(/*jNode*/ node) {
	var y = 0;
	var hgap = node.hgap;
	if (isNaN(hgap)) hgap = 0;
	if(node.isRootNode()) {
		y = 0;
	} else {
		y = parseFloat(node.parent.body.getBBox().height) + parseFloat(hgap) + parseInt(this.HGAP);
	}


	this.placeNode(node, node.vshift, y);
	
	// ArrowLink Update
	node.connectArrowLink();
	//나를 가르키는 arrowlink들에 대해 connect를 다시 한다.
	var alinks = jMap.getArrowLinks(node);
	for(var i = 0; i < alinks.length; i++) {
		alinks[i].draw();
	}
	
	if(node.folded == "false" || node.folded == false) {
		//var children = node.getUnChildren();
		var children = node.getChildren();
		if (children != null && children.length > 0) {
			for (var i = 0; i < children.length; i++) {
				this.layoutNode(children[i]);
			}
		}
	}
}

jTreeLayout.prototype.layout = function(/*boolean*/ holdSelected) {
	var selected = this.map.selectedNodes.getLastElement();
	
	holdSelected = holdSelected &&
	 (selected != null &&
			 selected != undefined &&
			 !selected.removed &&
			 selected.getLocation().x != null &&
			 selected.getLocation().x != undefined &&
			 selected.getLocation().x != 0 &&
			 selected.getLocation().y != 0);
	 
	var rootNode = this.getRoot();
	var oldRootX = rootNode.getLocation().x;
	var oldRootY = rootNode.getLocation().y;
	if(holdSelected) {
		oldRootY = selected.getLocation().y;
	}
	
	this.resizeMap(rootNode.treeWidth, rootNode.treeHeight);
	this.layoutNode(this.getRoot());
}

jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(/*jNode*/ node) {

	this.updateTreeHeightsAndRelativeYOfDescendants(node);
	if (! node.isRootNode()) {
       this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(/*jNode*/ node) {
	this.updateTreeGeometry(node);

	if (!node.isRootNode()) {
		this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(/*jNode*/ node) {
	var children = node.getUnChildren();
	if(children != null && children.length > 0){
		for(var i=0; i<children.length; i++) {
			this.updateTreeHeightsAndRelativeYOfDescendants(children[i]);
		}
	}
	
	this.updateTreeGeometry(node);
}


jTreeLayout.prototype.updateTreeGeometry = function(/*jNode*/ node) {
	if (node == null || node == undefined || node.removed) return false;
	
	var children = node.getUnChildren();
	
	// width
	var treeWidth = this.calcTreeWidth(node, children);
	node.setTreeWidth(treeWidth);

	// height
	var treeHeight = this.calcTreeHeight(node, children);
	node.setTreeHeight(treeHeight);	
}

jTreeLayout.prototype.calcTreeWidth = function(/*jNode*/ parent, /*array*/ children) {
	// (children의 width + hgap) + this.HGAP * (children.length - 1) 와 parent.width 비교해서 큰 값

	var parentWidth = parent.getSize().width;
	if(children == null || children.length == 0) {
		return parentWidth;
	}

	var child = null;
	var treeWidth = 0;
	for(var i = 0; i < children.length; i++) {
		child = children[i];
		treeWidth += parseInt(child.getTreeWidth()) + parseInt(child.vshift);
	}
	treeWidth += parseInt(this.HGAP) * parseInt(children.length -1);

	return Math.max(parentWidth, treeWidth);
}

jTreeLayout.prototype.calcTreeHeight = function(/*jNode*/ parent, /*array*/ children) {
	// leaf 노드까지 높이를 계산한다.


	if(children == null || children.length == 0) {
		return parent.getSize().height;
	}

	var treeHeight = 0;
	for(var i = 0; i < children.length; i++) {
		treeHeight = Math.max(treeHeight,
						this.calcTreeHeight(children[i], children[i].getUnChildren()) + children[i].vshift
			);
	}

	return treeHeight;
}


jTreeLayout.prototype.placeNode = function(/*jNode*/ node, /*int*/relativeX, /*int*/relativeY) {
	
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {

		var x = 0;
		var y = 0;

		var prevNode = this.getPrevSibling(node);
		if(prevNode == null) {
			var parent = node.getParent();
			x = parseInt(parent.getLocation().x) - parseInt( parent.getTreeWidth()/2 ) + parseInt( parent.getSize().width /2 )
				+ parseInt(node.getTreeWidth()/2) - parseInt(node.getSize().width/2)
				+ parseInt(relativeX);
		} else {
			x = parseInt(prevNode.getLocation().x) + parseInt(prevNode.getTreeWidth() / 2)  + prevNode.getSize().width/2
				+ node.getTreeWidth()/2 - node.getSize().width/2
				+ parseInt(relativeX) + parseInt(this.HGAP);
		}
		
		y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY) + parseFloat(this.VGAP);

		node.setLocation(x, y);
	}
	
	//////////////////////////////////////////// 첫번째 시도 ////////////////////////////////////////////////
	/*
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {

		var x = 0;
		var y = 0;

		var prevNode = this.getPrevSibling(node);
		if(prevNode == null) {
			var parent = node.getParent();			
			x = parseInt(parent.getLocation().x) + parseInt( parent.getSize().width /2 )
				+ parseInt(node.getTreeWidth()/2) - parseInt(node.getSize().width)
				+ parseInt(relativeX);
		} else {
			x = parseInt(prevNode.getLocation().x) + parseInt(prevNode.getTreeWidth() / 2)  + prevNode.getSize().width/2
				+ node.getTreeWidth()/2 - node.getSize().width/2
				+ parseInt(relativeX) + parseInt(this.HGAP);
			
			var relocationPrevNode = prevNode;
			var widthSum = node.getTreeWidth();
			//console.log(relocationPrevNode.getText());
			while(relocationPrevNode){
				widthSum += relocationPrevNode.getTreeWidth();
			//	cosole.log("pass")
			//	var p_x = relocationPrevNode.getLocation().x;
			//	relocationPrevNode.setLocation(p_x - node.getSize().width/2);
				
				relocationPrevNode = this.getPrevSibling(relocationPrevNode);
			}
			
			
			console.log(node.getParent().getTreeWidth())
			console.log(widthSum2)
			
		}
		
		y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY) + parseFloat(this.VGAP);

		//console.log(node.getText() + " : " + node.getTreeWidth());
		//console.log("parent : " + node.getParent().getTreeWidth());
		//console.log("hum : " + (node.getTreeWidth()+node.getSize().width));
		
		node.setLocation(x, y);
	}	
	*/
	
	//////////////////////////////////////////// 두번째 시도 ////////////////////////////////////////////////	
	/*
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {

		var x = 0;
		var y = 0;

		var prevNode = this.getPrevSibling(node);
		var parent = node.getParent();			

//		x = parseInt(prevNode.getLocation().x) + parseInt(prevNode.getTreeWidth() / 2)  + prevNode.getSize().width/2
//				+ parseInt(node.getTreeWidth()/2) - parseInt(node.getSize().width)
//				+ parseInt(relativeX);// + parseInt(this.HGAP);
			
		var relocationPrevNode = prevNode;
		var widthSum = node.getTreeWidth();
		while(relocationPrevNode){
			widthSum += relocationPrevNode.getTreeWidth();
			relocationPrevNode = this.getPrevSibling(relocationPrevNode);
		}
			
			
//		console.log(node.getParent().getTreeWidth());
//		console.log(widthSum);
		
		
		if(prevNode == null) {
//			x = parseInt(parent.getLocation().x) - parseInt( parent.getTreeWidth()/2 ) + parseInt( parent.getSize().width /2 )
//				+ parseInt(node.getTreeWidth() / 2) - parseInt(node.getSize().width/2)
//				+ parseInt(relativeX) + parseInt(this.HGAP);
			
			x = parseInt(parent.getLocation().x) + parseInt( parent.getSize().width /2 );
				//+ parseInt(relativeX) + parseInt(this.HGAP);
			
			console.log(node.getText())
			console.log(node.getTreeWidth())
			console.log(node.getSize().width)
			
			
		} else {
			
			var firstNode = prevNode;
			while(true){
				var nullTest = this.getPrevSibling(firstNode);
				if(!nullTest) break;
				firstNode = nullTest;
			}
			
			x = parseInt(parent.getLocation().x) + node.getTreeWidth() + parseInt( parent.getTreeWidth() / 2 ) - (firstNode.getSize().width / 2) // 52는 첫번째 노드.getSize().width
				+ parseInt(relativeX) + parseInt(this.HGAP);
		}
		
		y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY) + parseFloat(this.VGAP);

		node.setLocation(x, y);
	}
	*/
	
	//////////////////////////////////////////// 세번째 시도 ////////////////////////////////////////////////	
	/*if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {

		var x = 0;
		var y = 0;

		//var prevNode = this.getPrevSibling(node);
		var parentNode = node.getParent();
		var widthSum = 0;
		
		//var widthSum = node.getTreeWidth();
		var tempPrevNode = node;
		while(tempPrevNode){
			widthSum += tempPrevNode.getTreeWidth();
			tempPrevNode = this.getPrevSibling(tempPrevNode);
		}
		
		var parentCenterPointX = parentNode.getLocation().x + (parentNode.getSize().width / 2);
		
		var firstPointX = parentCenterPointX + (widthSum / 2);
		
		
		x = firstPointX;		
		y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY) + parseFloat(this.VGAP);
		
		
		tempPrevNode = node;
		while(tempPrevNode){
			x = x - (tempPrevNode.getTreeWidth() / 2) - (tempPrevNode.getSize().width / 2);
			tempPrevNode.setLocation(x, y);
			//x = x - (parseInt(relativeX) + parseInt(this.HGAP));
			tempPrevNode = this.getPrevSibling(tempPrevNode);
		}
		
		
		
	}*/
}

jTreeLayout.prototype.resizeMap = function(/*int*/width, /*int*/height){
	var bResized = false;
	
	var oldXSize = RAPHAEL.getSize().width;
	var oldYSize = RAPHAEL.getSize().height;
	
	var newXSize = 0;
	var newYSize = 0;
	
	var locRoot = this.getRoot().getLocation();
	
	if(oldXSize < width * 2) {
		newXSize = width * 2;
		newYSize = oldYSize;
		bResized = true;
	}
	
	if(oldYSize < height * 2) {
		newXSize = oldXSize;
		newYSize = height * 2;
		bResized = true;
		
		this.placeNode(this.getRoot());
	}

	//보이는 위치를 바꿔준다.
	if(bResized) {
		RAPHAEL.setSize(newXSize, newYSize);
		this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
		
		this.map.work.scrollLeft += (newXSize - oldXSize)/2;
		this.map.work.scrollTop += (newYSize - oldYSize)/2;
	}
}

jTreeLayout.prototype.getRootY = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.height)*0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
}

jTreeLayout.prototype.getRootX = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.width)*0.5) - parseInt(this.getRoot().body.getBBox().width)/2;
}

jTreeLayout.prototype.getRoot = function() {
	return this.map.rootNode;
}


jTreeLayout.prototype.getPrevSibling = function(node) {
	if(node.isRootNode()) {
		return null;
	}

	var index = node.parent.children.indexOf(node);

	if(index < 1) return null;

	return node.parent.children[index - 1];
}
