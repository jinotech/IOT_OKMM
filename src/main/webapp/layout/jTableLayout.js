/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jTableLayout = function (map){
	this.map = map;
	this.HGAP = 0;
	this.VGAP = 0;
	
	this.xSize = 0;
	this.ySize = 0;
	
	// 가운데가 보이게...
	var work = this.map.work;
	work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
	work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
	
	this.map.cfg.nodeFontSizes = ['14', '14', '14'];		//<---글씨크기설정
}

jTableLayout.prototype.type= "jTableLayout";

jTableLayout.prototype.layoutNode = function(/*jNode*/ node) {
	var x = 0;
	var wgap = node.wgap;
	if (isNaN(wgap)) wgap = 0;
	if(node.isRootNode()) {
		y = 0;
	} else {
		y = parseFloat(node.parent.body.getBBox().width) ;
	}

	this.placeNode(node,x , node.vshift);
	
	// ArrowLink Update
	node.connectArrowLink();
	//나를 가르키는 arrowlink들에 대해 connect를 다시 한다.
	var alinks = jMap.getArrowLinks(node);
	for(var i = 0; i < alinks.length; i++) {
		alinks[i].draw();
	}
	
	// 선 숨기기????
	// 여기서????
	
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

jTableLayout.prototype.layout = function(/*boolean*/ holdSelected) {
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
		oldRootX = selected.getLocation().x;
	}
	
	this.resizeMap(rootNode.treeWidth, rootNode.treeHeight);
	this.layoutNode(this.getRoot());
}

jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(/*jNode*/ node) {
//	this.updateTreeHeightsAndRelativeYOfDescendants(node);
//	if (! node.isRootNode()) {
//       this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
//	}
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jTableLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(/*jNode*/ node) {
//	this.updateTreeGeometry(node);
//	if (!node.isRootNode()) {
//		this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
//	}
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jTableLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
	
//	var updataHeight = function(node) {					
//		if(node.getChildren().length > 0) {
//			var children = node.getChildren();
//			for(var i = 0; i < children.length; i++) {
//				updataHeight(children[i]);						
//			}
//		}		
//	}
}

jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(/*jNode*/ node) {
	var children = node.getUnChildren();
	if(children != null && children.length > 0){
		for(var i=0; i<children.length; i++) {
			this.updateTreeHeightsAndRelativeYOfDescendants(children[i]);
		}
	}
	
	this.updateTreeGeometry(node);
}
/***************************위에는 붙여넣은거라 잘 모르겠어요;;*************************/
//////////////////////////////////////
//var parent=this.getRoot();
jTableLayout.prototype.maxDepth = function(node) {         //<---가장 큰 depth 값 구함
	var children = node.getUnChildren();
	if(children == null || children.length == 0) {
		return node.getDepth();
	}	
	var mDepth = 0;
	for(var i = 0; i < children.length; i++) {
		mDepth = Math.max(mDepth,
						this.maxDepth(children[i])
			);
	}

	return mDepth;
}

jTableLayout.prototype.makeNode = function(node,maxDepth) { //<---빈 부분 노드로 채움//문제있음
	var children = node.getUnChildren();
	if(children == null || children.length == 0) {
		if (node.getDepth()<maxDepth){
			var param = {parent: node,
					text: ""};
			this.map.createNodeWithCtrl(param);
		}
	}
	for(var i = 0; i < children.length; i++) {
		this.makeNode(children[i],maxDepth);
	}
}

/////////////////////////////////////

jTableLayout.prototype.updateTreeGeometry = function(/*jNode*/ node) {
	if (node == null || node == undefined || node.removed) return false;

	var children = node.getUnChildren();
	var depth=node.getDepth();
	
	// width
	var treeWidth = this.calcTreeWidth(node, children);
	node.setTreeWidth(treeWidth);

	// height
	var treeHeight = this.calcTreeHeight(node, children);
	node.setTreeHeight(treeHeight);	
	
//	// node height
//	var treeWidth1 = this.calcTreeWidth1(node);
//	
//	//size가장 넓은 길이에 맞추는거
//	if (node.isRootNode()) {
//		node.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height);}
//	else {node.setSize(treeWidth1,treeHeight);}
	
	var calcWidth = function(node, widths, index) {					//<---------같은깊이에서 가장 넓은것 넓이 구해서 배열 'widths' 에 넣는다.
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
	
	if (depth==0) {																	//<----------루트노드일때
		wholeTreeWidth=0;
		for (var i=1;i<maxWidth.length;i++){								//<-------전체의 넓이를 구함	
			wholeTreeWidth+=maxWidth[i];
		}
		node.setSize(wholeTreeWidth, this.getRoot().getSize().height);}//<-루트노드의 사이즈 설정
																										//<---넓이는 전체트리의 넓이
	else{
//		if (depth!=1){
//			var parentHeight=node.getParent().getSize().height;
//			if(treeHeight<parentHeight){
//				var nnn = node.getParent().getChildren().length;
//				treeHeight=parentHeight/nnn;						
//			}
//		}
//		console.log(node.getText() + ", " + maxWidth[depth] + ", " + treeHeight)
//		console.log(Math.max(treeHeight, node.getParent().getTreeHeight()));
		
//		var maxHeight = treeHeight;
//		if(node.getChildren().isEmpty()) {
//			maxHeight = node.getParent().getTreeHeight();
//		}		
//		if(!node.getParent().isRootNode()) {
//			maxHeight = Math.max(treeHeight, node.getParent().getTreeHeight());
//		}
		node.setSize(maxWidth[depth], treeHeight);									//<------루트노드 이외의 노드 사이즈설정
																							//넓이는 같은 depth 에서 가장큰것,높이는 자식노드들의 높이합
	}
	
	
//	//가장위에있는노드에 맞추는거(없다면 width=150)
//	var root= this.getRoot();
//	var twidth = 0;
//	var aaa="root";
//	var fd=0;
//	while(eval(aaa)){
//		aaa+=".getChildren()[0]";
//		fd++
//	}
//	
//	if (depth==0) {
//		node.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height);}
//	else if(depth>fd){node.setSize(150,treeHeight)}
//	else {
//		var root= this.getRoot();
//		var twidth = 0;
//		var aaa="root";
//		for(var i=0;i<depth;i++){
//			aaa+=".getChildren()[0]";
//		}		
//		if (eval(aaa)){
//			twidth = eval(aaa+".getSize().width");
//			;
//		}
//		else {twidth=150;}
//		node.setSize(twidth/*maxWidth[depth]*/,treeHeight);}
//	
	////////////////
	//var md = this.maxDepth(this.getRoot());							//<----빈공간 노드채우기 테스트
	//this.makeNode(this.getRoot(),md);								//<----빈공간 노드채우기 테스트
	////////////////
}

jTableLayout.prototype.calcTreeHeight = function(/*jNode*/ parent, /*array*/ children) {//<--트리의 높이를 구함
																																	  //		부모노드의 사이즈설정시 필요
	// (children의 width + hgap) + this.HGAP * (children.length - 1) 와 parent.width 비교해서 큰 값
 
	var parentHeight = parent.getSize().height;
	if(children == null || children.length == 0) {								//<---자식노드가없으면 자신의높이 반환
		return parentHeight;
	}

	var child = null;
	var treeHeight = 0;
	for(var i = 0; i < children.length; i++) {
		child = children[i];
		treeHeight += parseInt(child.getTreeHeight());						//<---자식들의 높이를 다 더함
	}
	treeHeight -= parseInt(children.length -1)*0.2;							//<---테두리선만큼 뺌?

	return Math.max(parentHeight, treeHeight);								//<---자신과 위에구한값을 비교해서 큰것 반환
}

jTableLayout.prototype.calcTreeWidth = function(/*jNode*/ parent, /*array*/ children) {//<---트리의 넓이를 구함
	// leaf 노드까지 높이를 계산한다.

	if(children == null || children.length == 0) {
		return parent.getSize().width;												//<---자식이없으면 자신의 넓이반환
	}

	var treeWidth = 0;
	for(var i = 0; i < children.length; i++) {										//<---가장 넓은값 구함
		treeWidth = Math.max(treeWidth,
						this.calcTreeWidth(children[i], children[i].getUnChildren())
			);
	}

	return treeWidth;
}

//jTableLayout.prototype.calcTreeWidth1 = function(/*jNode*/ node) {
//	// 노드 높이
//	if (node.isRootNode()) {
//		return 0;
//	}
//	else{
//		var children=node.getParent().getChildren();
//		if(children.length == 1) {
//			return node.getSize().width;
//		}
//
//		var treeWidth = 0;
//		for(var i = 0; i < children.length; i++) {
//			treeWidth = Math.max(treeWidth, children[i].getSize().width);
//		}
//		return treeWidth;
//	}
//}

jTableLayout.prototype.placeNode = function(/*jNode*/ node, /*int*/relativeX, /*int*/relativeY) {//<---노드들의 위치 설정
	
	if (node.isRootNode()) {																//<---루트노드일때
		node.setLocation(this.getRootX(), this.getRootY());					
	} else {																							//<---루트 이외의

		var x = 0;
		var y = 0;

		var prevNode = this.getPrevSibling(node);									//<---노드와 같은 깊이의 이전노드
		var parent = node.getParent();													//<---노드의 부모노드
		
		if (parent.isRootNode()){															//<---부모노드가 루트노드일때
			if(prevNode == null) {																	//<---이전 노드가 없으면
				y = parseInt(parent.getLocation().y)+this.getRoot().getSize().height;	//<---y 값은 루트노드 바로밑
			} else {																							//<---이전노드가 있으면
				y = parseInt(prevNode.getLocation().y) + parseInt(prevNode.getSize().height);//<---y 는 이전노드 바로밑
			}
			x = parseFloat(node.parent.getLocation().x);								//<---x 는 루트노드와 같은값
		}else{																						//<---부모가 루트가 아닐때
			if(prevNode == null) {
				y = parseInt(parent.getLocation().y)/* - parseInt( parent.getTreeHeight()/2 ) + parseInt( parent.getSize().height /2 )
					+ parseInt(node.getTreeHeight()/2) - parseInt(node.getSize().height/2)
					+ parseInt(relativeY)*/;
			} else {
				y = parseInt(prevNode.getLocation().y) + parseInt(prevNode.getSize().height)/* + parseInt(prevNode.getTreeHeight() / 2)  + prevNode.getSize().height/2
					+ node.getTreeHeight()/2 - node.getSize().height/2
					+ parseInt(relativeY) */;
			}
		
		x = parseFloat(node.parent.getLocation().x)+parseFloat(node.parent.getSize().width)/* + parseFloat(relativeX)*/ ;
		}
		node.setLocation(x, y);												//<-----노드들을 이동
	}
}

jTableLayout.prototype.resizeMap = function(/*int*/width, /*int*/height){
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

jTableLayout.prototype.getRootY = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.height)*0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
}

jTableLayout.prototype.getRootX = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.width)*0.5) - parseInt(this.getRoot().body.getBBox().width)/2;
}

jTableLayout.prototype.getRoot = function() {
	return this.map.rootNode;
}


jTableLayout.prototype.getPrevSibling = function(node) {
	if(node.isRootNode()) {
		return null;
	}

	var index = node.parent.children.indexOf(node);

	if(index < 1) return null;

	return node.parent.children[index - 1];
}


