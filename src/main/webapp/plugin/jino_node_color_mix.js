/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

NodeColorMix = (function () {	
	var indexColor = 0;
	var iColor = ["#c4a0b3","#829ddb","#8ee583","#b99688","#87bdf9","#f2c398","#9287c2","#d886bf","#a88490","#bcf3b0"];
	var rootColor = "#660000",
		rootTextColor = "#ffffff";
	//var iColor = ["#fbcd32","#3174bd","#88c0a5","#dc345d","#f99c0a","#f9793f","#f64944","#aa4f73","#775d95","#83b243","#d8e037","#fdf446"];
	var fadeFactor = 0.1,	// 단계마다 색상이 옅어지는 정도
		darkFactor = 0.25,	// 색상이 짙어지는 정도: 마디의 외곽선을 그릴 때 사용
		randFactor = 30;  // 형제끼리 서로 다른 색상을 random 화하게되는 정도
	
	function NodeColorMix(node){
		if(!jMap.isAllowNodeEdit(node)) {
			return false;
		}
		
		dressColor(node);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
		(typeof DWR_sendForceRefresh != "undefined")&& DWR_sendForceRefresh(jMap.cfg.userId);
	}
	
	// 노드에 색상 입히기
	function dressColor(node){
		//var fontSize = '10';
		var fontWeight = 400;
		if (node.isRootNode()) {		// 루트
			node.setBackgroundColor(rootColor);
			node.setTextColor(rootTextColor);
			
			node.fontSize = jMap.cfg.nodeFontSizes[0];
			fontWeight = 'bold';
		} else if (node.getParent().isRootNode()) {		// 깊이 1
			jMap.indexColor = jMap.indexColor % iColor.length;
			color = iColor[jMap.indexColor];
			jMap.indexColor++;			
			node.setBackgroundColor(color);
			node.setEdgeColor(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 1);
			node.setBranchColor(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 8);
			
			node.fontSize = jMap.cfg.nodeFontSizes[1];
			fontWeight = 'bold';
		}
		else {		// 나머지
			var parentColor = Raphael.getRGB(node.getParent().background_color);
			var color = NodeColorUtil.randomer(Raphael.getRGB(NodeColorUtil.brighter(parentColor, fadeFactor)), randFactor);
			node.setBackgroundColor(color);
			node.setEdgeColor(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 1);
			node.setBranchColor(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 2);
			
			node.fontSize = jMap.cfg.nodeFontSizes[2];
			fontWeight = 'normal';
		}
		
		node.text.attr({'font-size': node.fontSize, "font-weight": fontWeight});
		node.CalcBodySize();
		
		if(node.getChildren().length > 0) {
			var children = node.getChildren();
			for(var i = 0; i < children.length; i++) {
				dressColor(children[i]);			
			}
		}
	}
	
	
	NodeColorMix.rawDressColor = function(node) {
		if (node.isRootNode()) {
			node.setBackgroundColorExecute(rootColor);
			node.setTextColorExecute(rootTextColor);
		} else if (node.getParent().isRootNode()) {
			indexColor = indexColor % iColor.length;
			color = iColor[indexColor];
			indexColor++;			
			node.setBackgroundColorExecute(color);
			node.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 1);
			node.setBranchColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 8);
		}
		else {
			var parentColor = Raphael.getRGB(node.getParent().background_color);
			var color = NodeColorUtil.randomer(Raphael.getRGB(NodeColorUtil.brighter(parentColor, fadeFactor)), randFactor);
			node.setBackgroundColorExecute(color);
			node.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 1);
			node.setBranchColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 2);
		}
	}
	
	return NodeColorMix;
})();
