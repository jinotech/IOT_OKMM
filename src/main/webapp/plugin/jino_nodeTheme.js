/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

var theme1 = {
	rootcolor: {bg: '#f0f2eb', edge: '#cccccc', edge_width: 3, text:'#000000', nodes: [
		{bg: '#e0a01c', edge: '#f1790c', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 8, nodes:[
			{bg: '#ffbd3e', edge: '#ffa410', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
				{bg: '#ffd68d', edge: '#ffc353', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
					{bg: '#ffe7af', edge: '#ffd381', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2}
				]}
			]}
		]},
		{bg: '#afca66', edge: '#759d0c', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 8, nodes:[
			{bg: '#c2d951', edge: '#adc04b', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
				{bg: '#dce68f', edge: '#bed04d', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
					{bg: '#d8eaab', edge: '#c8d26d', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2}
				]}
			]}
		]},
		{bg: '#f1cf32', edge: '#f3b917', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 8, nodes:[
			{bg: '#ffe440', edge: '#ffd418', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
				{bg: '#ffeba2', edge: '#ffda40', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2, nodes:[
					{bg: '#fff5cb', edge: '#ffe592', edge_width: 2, text:'#000000', branch: '#cccccc', branch_width: 2}
				]}
			]}
		]},
		
	]}		
}

NodeTheme = (function () {
	
	var cfg = {
		
	};

	var _theme = false;
	
	function NodeTheme(){	};
	
//	var getColorByDepth = function(depth) {
//		var themeChildren = _theme && _theme.rootcolor;		
//		var depthIndex = 0;
//		while(themeChildren) {
//			if(depth == depthIndex) break;
//			themeChildren = themeChildren.nodes;
//			depthIndex++;
//		}
//		return themeChildren;
//	}
	
	var _wear = function(node) {
		if(!_theme) return;
		
		node.theme = null;
		
		if(node.isRootNode()){
			node.theme = _theme.rootcolor;
		} else {
			var themeNodes = node.getParent().theme && node.getParent().theme.nodes;
			if(themeNodes){
				var indexPos = node.getIndexPos();
				var indexColor = indexPos % themeNodes.length;
				node.theme = themeNodes[indexColor];
			}			
		}
		
		if(node.theme) {
			node.theme.bg && node.setBackgroundColorExecute(node.theme.bg);
			node.theme.edge && node.setEdgeColorExecute(node.theme.edge, node.theme.edge_width);
			node.theme.text && node.setTextColorExecute(node.theme.text);
			node.theme.branch && node.setBranchColorExecute(node.theme.branch, node.theme.branch_width);
		} else {
			var parentBg = NodeColorUtil.brighter( Raphael.getRGB(node.getParent().getBackgroundColor()), 0.5 );
			parentBg = NodeColorUtil.brighter( Raphael.getRGB(parentBg), 0.5 );
			var parentEdge = NodeColorUtil.brighter( Raphael.getRGB(node.getParent().getEdgeColor()), 0.5 );
			parentEdge = NodeColorUtil.brighter( Raphael.getRGB(parentEdge), 0.5 );
			
			node.setBackgroundColorExecute( parentBg );
			node.setEdgeColorExecute( node.getParent().getEdgeColor(), jMap.cfg.edgeDefalutWidth);
			node.setTextColorExecute(node.getParent().getTextColor());
			node.setBranchColorExecute(node.getParent().getBranchColor(), jMap.cfg.branchDefalutWidth);
		}
	}
	
	NodeTheme.setTheme = function(theme, root) {		
		_theme = theme;
		var travel = function(node){
			node.theme = null;
			if(node.isRootNode()){
				node.theme = _theme.rootcolor;
			} else {
				var themeNodes = node.getParent().theme && node.getParent().theme.nodes;
				if(themeNodes){
					var indexPos = node.getIndexPos();
					var indexColor = indexPos % themeNodes.length;
					node.theme = themeNodes[indexColor];
				}			
			}
			
			if(node.getChildren().length > 0) {
				var children = node.getChildren();
				for(var i = 0; i < children.length; i++) {
					travel(children[i]);			
				}
			}
		}
		travel(root);
	}
	
	NodeTheme.wear = function(node) {
		_wear(node);
	}
	
//	NodeTheme.secretlyWear = function(node) {
//		_wear(node);
//	}
//	
	NodeTheme.cover = function(root) {
		
		var travel = function(node){			
			_wear(node);
			if(node.getChildren().length > 0) {
				var children = node.getChildren();
				for(var i = 0; i < children.length; i++) {					
					travel(children[i]);
				}
			}
		}
		
		travel(root);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
	}
	
	return NodeTheme;
})();
