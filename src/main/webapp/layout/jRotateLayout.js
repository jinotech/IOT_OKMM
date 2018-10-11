/**
 * 
 * @author PKL
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jRotateLayout = function (map){
	this.map = map;
	this.HGAP = 10; 
	this.VGAP = 120;
	
	this.xSize = 0;
	this.ySize = 0;
	
	// 가운데가 보이게...
	var work = this.map.work;
	work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
	work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
	
	this.map.cfg.nodeFontSizes = ['30', '18', '12'];
}

jRotateLayout.prototype.type= "jRotateLayout";

jRotateLayout.prototype.layoutNode = function(/*jNode*/ node) {
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

jRotateLayout.prototype.layout = function(/*boolean*/ holdSelected) {
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

jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(/*jNode*/ node) {

	this.updateTreeHeightsAndRelativeYOfDescendants(node);
	if (! node.isRootNode()) {
       this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(/*jNode*/ node) {
	this.updateTreeGeometry(node);

	if (!node.isRootNode()) {
		this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(/*jNode*/ node) {
	var children = node.getUnChildren();
	if(children != null && children.length > 0){
		for(var i=0; i<children.length; i++) {
			this.updateTreeHeightsAndRelativeYOfDescendants(children[i]);
		}
	}
	
	this.updateTreeGeometry(node);
}


jRotateLayout.prototype.updateTreeGeometry = function(/*jNode*/ node) {
	if (node == null || node == undefined || node.removed) return false;
	
	var children = node.getUnChildren();
	
	// width
	var treeWidth = this.calcTreeWidth(node, children);
	node.setTreeWidth(treeWidth);

	// height
	var treeHeight = this.calcTreeHeight(node, children);
	node.setTreeHeight(treeHeight);	
	
	var calcWidth = function(node, widths, index) {					
		var width = node.body.getBBox().width;
		if(!widths[index]) widths[index] = 0;
		widths[index] = (width > widths[index])? width : widths[index];
		
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			index++;
			for(var i = 0; i < children.length; i++) {
				calcWidth(children[i], widths, index);						
			}
		}
		
	}

	var maxWidth = [];
	calcWidth(jMap.getRootNode(), maxWidth, 0);
	if (node.isRootNode()) {
		node.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height);}
	else {var depth=node.getDepth();
	node.setSize(maxWidth[depth],node.getSize().height);}
}

jRotateLayout.prototype.calcTreeHeight = function(/*jNode*/ parent, /*array*/ children) {
	// (children의 width + hgap) + this.HGAP * (children.length - 1) 와 parent.width 비교해서 큰 값

	var parentHeight = parent.getSize().height;
	if(children == null || children.length == 0) {
		return parentHeight;
	}

	var child = null;
	var treeHeight = 0;
	for(var i = 0; i < children.length; i++) {
		child = children[i];
		treeHeight += parseInt(child.getTreeHeight());
	}
	return Math.max(parentHeight, treeHeight);
}

jRotateLayout.prototype.calcTreeWidth = function(/*jNode*/ parent, /*array*/ children) {
	// leaf 노드까지 높이를 계산한다.
	if(children == null || children.length == 0) {
		return parent.getSize().width;
	}

	var treeWidth = 0;
	for(var i = 0; i < children.length; i++) {
		treeWidth = Math.max(treeWidth,
						this.calcTreeWidth(children[i], children[i].getUnChildren())
			);
	}

	return treeWidth;
}

jRotateLayout.prototype.wholePrevNode=function(node){
	var index =node.getIndexPos();
	var qns1=0;
	for (var i=0;i<index;i++){
		var parent=node.getParent().getChildren();
		var children=parent[i].getChildren();
		qns1+=this.calcTreeHeight(parent[i], children);
	}

	return qns1;
}

jRotateLayout.prototype.placeNode = function(/*jNode*/ node, /*int*/relativeX, /*int*/relativeY) {
	var cx=this.getRootX()+this.getRoot().getSize().width/2;
	var cy=this.getRootY()+this.getRoot().getSize().height/2;
	var qor = this.calcTreeHeight(this.getRoot(), this.getRoot().getChildren());
	var qns = this.calcTreeHeight(node, node.getChildren());

	var getTransformations = function(trans){
		var transformations = {};
		var attrs = "matrix translate scale skewX skewY".split(" ");
		
		for (var i=0; i < attrs.length; i++) {
			var re = new RegExp(attrs[i]+'[(]([^)]*)[)]', 'ig');
			var match = re.exec(trans);
			
			transformations[attrs[i]] = match?match[1]:null;
		}
		
		return transformations;
	}
	
	/**
	 * 노드를 포함한 자식들 전체를 돌리는 재귀함수.
	 */
	var _rotate = function(node, angle, cx, cy){		
		var r = angle+","+cx+","+cy;
		var transformations = null;
		var values = [];
		
		// transform을 읽어와 rotate 적용후 다시 쓴다.
		var transNode = node.groupEl.getAttribute("transform");		
		transformations = getTransformations(transNode);
		transformations.rotate = r;
		values = [];		
		for(var attr in transformations){
			if(transformations[attr]){				
				values.push(attr+"("+transformations[attr]+")");
			}			
		}		 
		node.groupEl.setAttribute("transform", values.join(" "));
		
		// 노드가 갖는 선이 있다면 그것도 같이 돌린다.
		if(node.connection){
			var transLine = node.connection.line.node.getAttribute("transform");
			transformations = getTransformations(transLine);
			transformations.rotate = r;
			values = [];		
			for(var attr in transformations){
				if(transformations[attr]){				
					values.push(attr+"("+transformations[attr]+")");
				}			
			}
			node.connection.line.node.setAttribute("transform", values.join(" "));
		}		
		
		// 재귀
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			for(var i = 0; i < children.length; i++) {
				_rotate(children[i],angle, cx, cy);			
			}
		}
	}

	///////////////////////////////////////
	
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else if(node.getParent().isRootNode()){
		var x=this.getRoot().getSize().width+this.getRootX()+this.VGAP;
		var y=this.getRoot().getSize().height/2+this.getRootY()-node.getSize().height/2
		node.setLocation(x,y);
		var qns1=this.wholePrevNode(node);
		var angle=(qns1/qor)*360-(qns/qor)*180;
		_rotate(node,angle,cx,cy);
	} else {
		var x = 0;
		var y = 0;
		var prevNode = this.getPrevSibling(node);
		if(prevNode == null) {
			var parent = node.getParent();
			y = parseInt(parent.getLocation().y) - parseInt( parent.getTreeHeight()/2 ) - parseInt( parent.getSize().height /2 )-parseInt(this.HGAP)
				+ parseInt(node.getTreeHeight()/2) - parseInt(node.getSize().height/2)
				+ parseInt(relativeY);
		} else {
			y = parseInt(prevNode.getLocation().y) + parseInt(prevNode.getTreeHeight() / 2)  + prevNode.getSize().height/2
				+ node.getTreeHeight()/2 - node.getSize().height/2
				+ parseInt(relativeX) + parseInt(this.HGAP);
		}
		
		x = parseFloat(node.parent.getLocation().x) + parseFloat(relativeX) + parseFloat(this.VGAP)+parseFloat(node.parent.getSize().width);

		node.setLocation(x, y);
	}
}

jRotateLayout.prototype.resizeMap = function(/*int*/width, /*int*/height){
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

jRotateLayout.prototype.getRootY = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.height)*0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
}

jRotateLayout.prototype.getRootX = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.width)*0.5) - parseInt(this.getRoot().body.getBBox().width)/2;
}

jRotateLayout.prototype.getRoot = function() {
	return this.map.rootNode;
}


jRotateLayout.prototype.getPrevSibling = function(node) {
	if(node.isRootNode()) {
		return null;
	}

	var index = node.parent.children.indexOf(node);

	if(index < 1) return null;

	return node.parent.children[index - 1];
}
