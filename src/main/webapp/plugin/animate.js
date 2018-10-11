
/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

ScaleAnimate = (function () {
	function ScaleAnimate(){}
	
	var GAP = 0;	// 테두리 여백. 0으로 하면 화면에 꽉찬다!
	var FPS = 30;	// Frames Per Second
	
	var oldController = null;
	
	var showStyle = null;
	
	var beforeX = 0;
	var beforeY = 0;
	var beforeW = 5000;
	var beforeH = 3000;
	var beforeR = 0;
	var globalR = 0;
	var beforeRotateX = 0;
	var beforeRotateY = 0;
	var showmode = false;
	var editmode = false;
	var showing = false;
	var currentShow = 0;

	var $buttonBox = null;
	var $naviContainer = null;
	
	/**
	 * transform 속성을 분리하는 함수
	 * 
	 * @param {String} trans : transform 속성
	 * @returns {Object} : return.rotate, return.translate 이런식으로 사용한다. 값이 없으면 null
	 */
	var getTransformations = function(trans){
		var transformations = {};
		var attrs = "rotate matrix translate scale skewX skewY".split(" ");
		
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
	
	var createNavigation = function() {
		$naviContainer = $('<div class="pt-navi-container"></div>');
		$nextArea = $('<div class="pt-next-area"></div>');
		$prevArea = $('<div class="pt-prev-area"></div>');
		$naviNext = $('<span class="pt-arrows-next" title="Next"></span>');
		$naviPrev = $('<span class="pt-arrows-prev" title="Prev"></span>');
		
		
		$prevArea.mouseover(function() {			
			$naviPrev.fadeIn('slow');
		}).mouseout(function() {
			$naviPrev.fadeOut('slow');
		}).click(function() {
			ScaleAnimate.prevShow(30);
		});
		
		$nextArea.mouseover(function() {			
			$naviNext.fadeIn('slow');
		}).mouseout(function() {
			$naviNext.fadeOut('slow');
		}).click(function() {
			ScaleAnimate.nextShow(30);
		});
		
		$naviContainer.append($nextArea);
		$naviContainer.append($prevArea);
		$naviContainer.append($naviNext);
		$naviContainer.append($naviPrev);
		$(document.body).append($naviContainer);
	}
	
	var createButtons = function(isDesign) {
		var btn = function(id, name) {
			return '<a id="'+id+'" class="gh-btn">' +     
					'<span id="'+id+'-text" class="gh-text">'+name+'</span>' +
					'</a>';					
		}
		
		$buttonBox = $('<span id="jmpress-btn-box" class="jmpress-btn"></span>');
		
		var $closebtn = $(btn('jmpress-close0-btn', 'Close'));
		$closebtn.click(function() {
			ScaleAnimate.endShowMode();
		});
		$buttonBox.append($closebtn);
		
		$buttonBox.appendTo($(document.body));
	}
	
	////////////////////////////////////////////////////////////////////////
	//////////////////////////// Functions /////////////////////////////////
	////////////////////////////////////////////////////////////////////////
	
//	/**
//	 * 에디터모드 시작
//	 */
//	ScaleAnimate.startEditMode = function(){
//		editmode = true;
//		
//		EditorManager.show();
//		EditorManager.triggerListener();
//	}
//	
//	/**
//	 * 에디터모드 끝
//	 */
//	ScaleAnimate.endEditMode = function() {
//		editmode = false;
//		
//		EditorManager.hide();
//		EditorManager.destroyListener();
//	}
	
	
	/**
	 * 쇼모드 시작
	 * 
	 * @param {int} fps : Frames Per Second
	 * @param {int} gap : 테두리 여백. 0으로 하면 화면에 꽉찬다!
	 * @param {boolean} isContinue : 이젠 끝낸 노드에서 이어서 계속 시작 할것인가
	 */
	ScaleAnimate.startShowMode = function(fps, gap, isContinue){
		EditorManager.hide();
		
		createNavigation();
		createButtons();
		
//		if(EditorManager.getSequenceSize() == 0) {
//			EditorManager.show();
//			EditorManager.hide();
//		}
		
		if(gap) GAP = gap;
		if(fps) FPS = fps;
		
		// 맵을 0,0으로
		jMap.work.scrollTop = 0;
		jMap.work.scrollLeft = 0;
		
		jMap.enableDragPaper(false);		
		showmode = true;
		if(!isContinue) currentShow = 0;
		
		// 시작 노드로 옮기기
		var node = EditorManager.getPresentationElement(currentShow).node;
		
		if(!ScaleAnimate.showStyle) ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFit;
		ScaleAnimate.showStyle(node);
		
		// Controller 변경
		//jMap.controller = new AnimateController();
		
		
		// Test. 돌려보기!
//		var tempNode = jMap.getNodeById("ID_325437778");
//		var cx = tempNode.getLocation().x + (tempNode.getTreeWidth() / 2);
//		var cy = tempNode.getLocation().y + (tempNode.getTreeHeight() / 2);
//		ScaleAnimate.rotate(tempNode, 90, cx, cy);
//		
//		var tempNode = jMap.getNodeById("ID_916078335");
//		var cx = tempNode.getLocation().x + (tempNode.getTreeWidth() / 2);
//		var cy = tempNode.getLocation().y + (tempNode.getTreeHeight() / 2);
//		ScaleAnimate.rotate(tempNode, -90, cx, cy);
		// Test end.
		
	}
	
	/**
	 * 쇼모드 끝
	 */
	ScaleAnimate.endShowMode = function() {
		//KHANG
		//Change from show mode to ordinary mode
		var orignalHref = window.location.href;
		if (orignalHref.indexOf("/show/map/") > 0) {
			orignalHref = orignalHref.replace('/show/map/', '/map/');
			window.location.replace(orignalHref);
			return;
		}
		//KHANG

		$buttonBox.remove();
		$naviContainer.remove();
		
		jMap.enableDragPaper(true);
		
		// 맵을 가운데로
		var work = jMap.work;
		work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
		work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
		
		// viewBox 원래대로
		RAPHAEL.canvas.removeAttribute("viewBox");
		
		//jMap.controller = jMap.mode? new JinoController(jMap) : new JinoControllerGuest(jMap);
		
		showmode = false;
		
		jMap.work.focus();
	}
	
	/**
	 * 쇼모드인지 판단
	 * 
	 * @returns : true / false
	 */
	ScaleAnimate.isShowMode = function() {
		return showmode; 
	}
	
	/**
	 * 쇼모드에서 다음 노드로 이동 시킴
	 */
	ScaleAnimate.nextShow = function(frames){
		if(!showmode || showing ||  EditorManager.getSequenceSize() <= currentShow+1) return;
		
		currentShow++;
		var node = EditorManager.getPresentationElement(currentShow).node;
		ScaleAnimate.showStyle(node, frames);		
	}
	
	/**
	 * 쇼모드에서 이전 노드로 이동 시킴
	 */
	ScaleAnimate.prevShow = function(frames){
		if(!showmode || showing || 0 >= currentShow) return;
		
		currentShow--;
		var node = EditorManager.getPresentationElement(currentShow).node;
		ScaleAnimate.showStyle(node, frames);		
	}
	
	/**
	 * node를 화면에 맞게 마추는 함수
	 * {내부 함수}
	 * 
	 * @param {jNode} node : 화면에 맞출 노드
	 * @param {int} frames : 프레임수. 속도.
	 */
	ScaleAnimate.scaleToScreenFit = function(node, frames){
		if (Raphael.svg && !showing && showmode) {
			if(!node) node = jMap.getRootNode();	// node가 없으면 기본으로 루트
			if(!frames) frames = 1;	// frames는 기본으로 1
			
			var canvasSize = RAPHAEL.getSize();
			var scale = 1;
			var wscale = (node.getTreeWidth()+GAP) / jMap.work.clientWidth;
			var hscale = (node.getTreeHeight()+GAP) / jMap.work.clientHeight;
			var WidthFit = true;
			
			if(wscale > hscale){
				WidthFit = true;
				scale = wscale;
			} else {
				WidthFit = false;
				scale = hscale;
			}
			
			/////// new 좌표 ////////
			var w = canvasSize.width*scale;
			var h = canvasSize.height*scale;
			var x = node.getLocation().x;
			var y = node.getLocation().y;
			
			if(node.isLeft && node.isLeft()){
				x = x - node.getTreeWidth();
				x = x + node.getSize().width;
				x = x - (GAP/2);
			} else {
				x = x - (GAP/2);
			}
			
			if(WidthFit){
				y = y - (jMap.work.clientHeight/2) * scale;
				y = y + (node.getSize().height/2) * scale;
				//y = y - (GAP/2);
			} else {
				var minY = function(_n, _y) {					
					
					_y = Math.min(_n.getLocation().y, _y);
					if(_n.getChildren().length > 0){						
						_y = minY(_n.getChildren()[0], _y);
					}
					return _y;
				}
				
				y = minY(node, y);
				y = y - (GAP/2);
			}
			
			
			/////// Tic //////
			var xTic = (x - beforeX) / frames;
			var rx = beforeX;
			beforeX = x;
			
			var yTic = (y - beforeY) / frames;
			var ry = beforeY;
			beforeY = y;
			
			var wTic = (w - beforeW) / frames;
			var rw = beforeW;
			beforeW = w;
			
			var hTic = (h - beforeH) / frames;
			var rh = beforeH;
			beforeH = h;
			
			
			//////// is Rotate?? //////
			var rotate = 0;
			var cx = node.getLocation().x + (node.getTreeWidth() / 2);
			var cy = node.getLocation().y + (node.getTreeHeight() / 2);
			
			var transNode = node.groupEl.getAttribute("transform");		
			transformations = getTransformations(transNode);
			var rotateAttr = null;			
			if(transformations.rotate){				
				rotateAttr = transformations.rotate.split(",");
				rotate = rotateAttr[0];
			}
			var relr = 0-rotate-globalR;
			var rTic = relr / frames;
			
			var cxTic = (cx - beforeRotateX) / frames;
			var rcx = beforeRotateX;
			beforeRotateX = cx;
			
			var cyTic = (cy - beforeRotateY) / frames;
			var rcy = beforeRotateY;
			beforeRotateY = cy;
			

			////////// TimeLine
			var o = new TimeLine(FPS, frames);
			o.onframe = function(){
				
				rx = rx + xTic;
				ry = ry + yTic;				
				rw = rw + wTic;
				rh = rh + hTic;
				
				var viewbox = rx+" "+ry+" "+rw+" "+rh;
				RAPHAEL.canvas.setAttribute("viewBox", viewbox);
				
				if(rTic){
					globalR = globalR + rTic;
					rcx = rcx + cxTic;
					rcy = rcy + cyTic;
					ScaleAnimate.globalRotate(Math.floor(globalR), rcx, rcy);					
				}
			};
			o.onstart = function(){
				showing = true;
			};
			o.onstop = function(){
				showing = false;
				node.focus(true);
			};
			
			o.start();
				
		}	
	}
	
	/**
	 * node를 화면에 맞게 마추는 함수 + 줌인줌아웃
	 * {내부 함수}
	 * 
	 * @param {jNode} node : 화면에 맞출 노드
	 * @param {int} frames : 프레임수. 속도.
	 */
	ScaleAnimate.scaleToScreenFitWithZoomInOut = function(node, frames){
		if (Raphael.svg && !showing && showmode) {
			if(!node) node = jMap.getRootNode();	// node가 없으면 기본으로 루트
			if(!frames) frames = 1;	// frames는 기본으로 1
			
			var canvasSize = RAPHAEL.getSize();
			var scale = 1;
			var wscale = (node.getTreeWidth()+GAP) / jMap.work.clientWidth;
			var hscale = (node.getTreeHeight()+GAP) / jMap.work.clientHeight;
			var WidthFit = true;
			
			if(wscale > hscale){
				WidthFit = true;
				scale = wscale;
			} else {
				WidthFit = false;
				scale = hscale;
			}
			
			/////// new 좌표 ////////
			var w = canvasSize.width*scale;
			var h = canvasSize.height*scale;
			var x = node.getLocation().x;
			var y = node.getLocation().y;
			
			if(node.isLeft && node.isLeft()){
				x = x - node.getTreeWidth();
				x = x + node.getSize().width;
				x = x - (GAP/2);
			} else {
				x = x - (GAP/2);
			}
			
			if(WidthFit){
				y = y - (jMap.work.clientHeight/2) * scale;
				y = y + (node.getSize().height/2) * scale;
				//y = y - (GAP/2);
			} else {
				var minY = function(_n, _y) {					
					
					_y = Math.min(_n.getLocation().y, _y);
					if(_n.getChildren().length > 0){						
						_y = minY(_n.getChildren()[0], _y);
					}
					return _y;
				}
				
				y = minY(node, y);
				y = y - (GAP/2);
			}
			
			
			/////// Tic //////
/*			var xTic = (x - beforeX) / frames;
			var rx = beforeX;
			beforeX = x;
			
			var yTic = (y - beforeY) / frames;
			var ry = beforeY;
			beforeY = y;
			
			var wTic = (w - beforeW) / frames;
			var rw = beforeW;
			beforeW = w;
			
			var hTic = (h - beforeH) / frames;
			var rh = beforeH;
			beforeH = h;*/
			
			
			//////// is Rotate?? //////
			var rotate = 0;
			if(node.isLeft && node.isLeft()){
				var cx = node.getLocation().x - (node.getTreeWidth() / 2);
				var cy = node.getLocation().y - (node.getTreeHeight() / 2);
			} else {
				var cx = node.getLocation().x + (node.getTreeWidth() / 2);
				var cy = node.getLocation().y + (node.getTreeHeight() / 2);
			}
			
			
			var transNode = node.groupEl.getAttribute("transform");		
			transformations = getTransformations(transNode);
			var rotateAttr = null;			
			if(transformations.rotate){				
				rotateAttr = transformations.rotate.split(",");
				rotate = rotateAttr[0];
			}
			var relr = 0-rotate-globalR;
			var rTic = relr / frames;
			
			var cxTic = (cx - beforeRotateX) / frames;
			var rcx = beforeRotateX;
			beforeRotateX = cx;
			
			var cyTic = (cy - beforeRotateY) / frames;
			var rcy = beforeRotateY;
			beforeRotateY = cy;
			

			////////// TimeLine
			var o = new TimeLine(FPS, frames);
			var TLCount =1;
			var Amp = 1;  //orginal 2로 세팅하세여~
			var coA = 1;
			var AA=1;
			var BB=1;
			o.onframe = function(){
				//coA=(((1.0-15.*frames)/frames)*TLCount*TLCount+15.*frames*TLCount);
				//coA=(-6./(frames*frames))*TLCount*TLCount+(7.*TLCount/frames);//움직임 제어 알고리즘 피크치 2배로 최종으로 1이되는 이차 방정식 Ax*x+Bx 형태			
				coA=AA*TLCount*TLCount+BB*TLCount;//움직임 제어 알고리즘 피크치 2배로 최종으로 1이되는 이차 방정식 Ax*x+Bx 형태	http://office.jinotech.com/MSV2/api/get_file_api.php?sid=34f7fd3c00de347e5155d54d1c11edf5&f=L0ppbm90ZWNoL0ltYWdlRG9jdW1lbnQv7ZSE66Gc6re4656oIOyEpOuqhS9TQU1fMjE3My5KUEc-3D&Count=509702
				var tt = TLCount/frames;
				rw = beforeW+(w-beforeW)*coA;
				//rh = rh + hTic;
				rh = beforeH+(h-beforeH)*coA;	
				rx = (1-tt)*(1-tt)*beforeX+2*(1-tt)*tt*jMap.work.clientWidth/2.+x*tt*tt;//베지어 방식 점 (beforeX,x)를 이으면서 화면 중심 x 좌표로 꼴리는 곡선	
				ry = (1-tt)*(1-tt)*beforeY+2*(1-tt)*tt*jMap.work.clientHeight/2.+y*tt*tt;//베지어 방식 점 (beforeY,Y)를 이으면서 화면 중심 y 좌표로 꼴리는 곡선	
				rw=(rw>=0)?rw:0;rh=(rh>=0)?rh:0;rx=(rx>=0)?rx:0;ry=(ry>=0)?ry:0;
		//		alert(coA+" "+TLCount);
				var viewbox = rx+" "+ry+" "+rw+" "+rh;
				RAPHAEL.canvas.setAttribute("viewBox", viewbox);
				
				if(rTic){
					globalR = globalR + rTic;
					rcx = rcx + cxTic;
					rcy = rcy + cyTic;
					ScaleAnimate.globalRotate(Math.floor(globalR), rcx, rcy);					
				}
			TLCount++;
			};
			o.onstart = function(){
				
				showing = true;
				CC = Math.min(beforeW,w);
				Amp = 3.*jMap.work.clientWidth/(w-beforeW);
//				Amp = (w>beforeW)?Amp:-1*Amp;
				BB = (4.*Amp-1.)/frames;
				AA = (4.0*Amp-2.0*BB*frames)/(frames*frames);
				//alert("bW:"+beforeW+"CW"+jMap.work.clientWidth+"w:"+w+"Amp:"+Amp+"x:"+x+"bX:"+beforeX);
				
			};
			o.onstop = function(){
				showing = false;
				node.focus(true);
				beforeX = x+0.1;
				beforeY = y+0.1;
				beforeW = w+0.1;
				beforeH = h+0.1;
			};
			
			o.start();
				
		}
	}
	
	/**
	 * 노드를 포함한 자식 노드들을 회전
	 */
	ScaleAnimate.rotate = function(node, angle, cx, cy){
		_rotate(node, angle, cx, cy);
	}
	
	/**
	 * 맵 전체를 회전
	 * 
	 * @param {int} angle : 회전각
	 * @param {int} cx : 회전축 x
	 * @param {int} cy : 회전축 y
	 */
	ScaleAnimate.globalRotate = function(angle, cx, cy){
		var r = angle+","+cx+","+cy;
		var transformations = null;
		var values = [];
		
		var transNode = jMap.groupEl.getAttribute("transform");		
		transformations = getTransformations(transNode);
		transformations.rotate = r;
		values = [];
		for(var attr in transformations){
			if(transformations[attr]){				
				values.push(attr+"("+transformations[attr]+")");
			}			
		}
		 
		jMap.groupEl.setAttribute("transform", values.join(" "));		
	}
	
	
	/**
	 * 테스트를 위한 함수
	 */
	ScaleAnimate.tempRotate = function(node){		
		var frames = 30;
		var rotate = 360;
		if(node.isLeft && node.isLeft()){
			var cx = node.getLocation().x - (node.getTreeWidth() / 2)+node.getSize().width;
			var cy = node.getLocation().y + (node.getTreeHeight() / 2);
		} 
		else{
			if ((node.getLocation().x==jMap.getRootNode().getLocation().x)&(node.getLocation().y==jMap.getRootNode().getLocation().y)){
				var cx = node.getLocation().x + (node.getSize().width / 2);
				var cy = node.getLocation().y + (node.getSize().height / 2);
			}
			else{
				var cx = node.getLocation().x + (node.getTreeWidth() / 2);
				var cy = node.getLocation().y + (node.getTreeHeight() / 2);
			}
		} 
	
		var relr = 0;
		var rTic = rotate / frames;
		
		////////// TimeLine
		var o = new TimeLine(FPS, frames);
		o.onframe = function(){
			relr = relr + rTic;
			ScaleAnimate.rotate(node, Math.floor(relr), cx, cy);					
		};
		o.onstart = function(){
		};
		o.onstop = function(){
		};
		
		o.start();
	}
	
	
//	ScaleAnimate.scaleToScreenFit2 = function(node, frames){
//		if (Raphael.svg) {
//			if(!node) node = jMap.getRootNode();
//			if(!frames) frames = 1;
//			
//			///////// time
////			var times = jMap.work.clientWidth / (node.getTreeWidth() + GAP);	// 넓이를 기준
//			//var times = jMap.work.clientHeight / this.getRootNode().getTreeHeight();	// 높이를 기준
//			var times = jMap.work.clientHeight / (node.getTreeHeight());	// 넓이를 기준
//	
//			
//			var oldTimes = jMap.scaleTimes;
//			var newTimes = times;
//			
//			var tic = (newTimes - oldTimes) / frames;	
//			var rt = oldTimes;
//			
//			jMap.scaleTimes = times;
//			
//			
//			///////// x
//			var ax = (5000/2) - ((RAPHAEL.getSize().width / newTimes)/2);				// 화면의 중심으로
//			if(node.isLeft()){
//				ax = ax - jMap.work.clientWidth/2/newTimes; // 화면의 왼쪽끝으로
//				ax = ax - jMap.getRootNode().getSize().width/2;	// 루트노드가 다 보이게
//				ax = ax - (jMap.getRootNode().getLocation().x - node.getLocation().x);	// 선택한 노드를 루트노드 자리에
//				ax = ax + (node.getSize().width);	// 선택한 노드를 루트노드 자리에
//				ax = ax + GAP / 2;
//			} else {
//				var ax = (5000/2) - ((RAPHAEL.getSize().width / newTimes)/2);				// 화면의 중심으로
//				ax = ax + jMap.work.clientWidth/2/newTimes; // 화면의 왼쪽끝으로
//				ax = ax - jMap.getRootNode().getSize().width/2;	// 루트노드가 다 보이게
//				ax = ax + node.getLocation().x - jMap.getRootNode().getLocation().x;	// 선택한 노드를 루트노드 자리에
//				ax = ax - GAP / 2;
//			}
//			
//			
//			
//			
//			var dx = ax - beforeX;
//			var dxTic = dx / frames;			
//			var x = beforeX;
//			
//			beforeX = ax;
//			
//			//////// y
//			var ay = (3000/2) - ((RAPHAEL.getSize().height / newTimes)/2);
//			ay = ay + node.getLocation().y - jMap.getRootNode().getLocation().y;
//			
//			var dy = ay - beforeY;
//			var dyTic = dy / frames;			
//			var y = beforeY;
//			
//			beforeY = ay;
//			
//			////////// r
//			var r = 0;
//			var rTic = 360 / frames;
//			// 루트를 중심으로 회전한다
//			var cx = node.getLocation().x;
//			var cy = node.getLocation().y;
//			
//			////////// TimeLine
//			var o = new TimeLine(30, frames);
//			o.onframe = function(){
//				rt = rt + tic;
//				
//				
//				var canvasSize = RAPHAEL.getSize();
//				
//				var w = canvasSize.width / rt;
//				var h = canvasSize.height / rt;
//				x = x + dxTic;
//				y = y + dyTic;
//				
//				
//				var viewbox = x+" "+y+" "+w+" "+h;
//				RAPHAEL.canvas.setAttribute("viewBox", viewbox);
//				
//				
//				r = r + rTic;
//				ScaleAnimate.rotate(node, r, cx, cy);
//				
//				//RAPHAEL.canvas.setAttribute("preserveAspectRatio", "none");
//			};
//			o.onstart = function(){
//			};
//			o.onstop = function(){
//			};
//			
//			o.start();
//		}	
//	}
	
	
	
	
	
	/**
	 * 애니메이션 모드에서 사용하는 Controller
	 */
	AnimateController = function(){
		// 키 이벤트 제어
		document.onkeydown = function(evt){
			evt = evt || window.event;		
			if(jMap.work.hasFocus())
				return false;		
			return true;
		};
		
		
		// 마우스 이벤트
//		jMap.mousemove(this.mousemove);
//		jMap.mousedown(this.mousedown);
//		jMap.mouseup(this.mouseup);
		jMap.work.onkeydown = this.keyDown;
		
		// 노드 이외의 공간에 드래그앤 드롭 이벤트.. 모두 막기
		jMap.work.ondragenter = function(e){
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue= false;
		};
		jMap.work.ondragover = function(e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue= false;
		};
		jMap.work.ondrop = function(e){
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue= false;		
		};
	}

	AnimateController.prototype.type= "AnimateController";

	AnimateController.prototype.keyDown = function(evt) {
		evt = evt || window.event;
		
		// ctrl 및 meta 키
		var ctrl = null; 
	    if (evt) ctrl = evt.ctrlKey; 
	    else if (evt && document.getElementById) ctrl=(Event.META_MASK || Event.CTRL_MASK)
	    else if (evt && document.layers) ctrl=(evt.metaKey || evt.ctrlKey);
	    // alt 키
	    var alt = evt.altKey
		
		var code = evt.keyCode;
		switch( code ) {
			case 8:	// BackSpace
				ScaleAnimate.prevShow(30);
			break;
			case 13:	// ENTER
				ScaleAnimate.nextShow(30);
			break;
			
			case 37:	// LEFT
				var selected = jMap.getSelecteds().getLastElement();
				switch(jMap.layoutManager.type) {
					case "jMindMapLayout" :
						if(selected.isRootNode()) {
							var children = selected.getChildren();
							for(var i=0; i < children.length; i++){
								if (children[i].position == "left") {
									children[i].focus(true);
									break;
								}											
							}
						} else if(selected.isLeft()) {
							jMap.controller.childNodeFocusAction(selected);
						} else {
							jMap.controller.parentNodeFocusAction(selected);
						}
						break;
					case "jTreeLayout" :
						jMap.controller.prevSiblingNodeFocusAction(selected);					
						break;
					default :
				}
			break;
			case 38:	// UP
				var selected = jMap.getSelecteds().getLastElement();
				switch(jMap.layoutManager.type) {
					case "jMindMapLayout" :
						if (selected.isRootNode()) {
							
						} else {
							jMap.controller.prevSiblingNodeFocusAction(selected);
						}
						break;
					case "jTreeLayout" :
						jMap.controller.parentNodeFocusAction(selected);
						break;
					default :
				}
			break;
			case 39:	// RIGHT
				var selected = jMap.getSelecteds().getLastElement();
				switch(jMap.layoutManager.type) {
					case "jMindMapLayout" :
						if(selected.isRootNode()) {
							var children = selected.getChildren();
							for(var i=0; i < children.length; i++){
								if (children[i].position == "right") {
									children[i].focus(true);
									break;
								}											
							}
						} else if(selected.isLeft()) {
							jMap.controller.parentNodeFocusAction(selected);				
						} else {
							jMap.controller.childNodeFocusAction(selected);
						}
						break;
					case "jTreeLayout" :
						jMap.controller.nextSiblingNodefocusAction(selected);
						break;
					default :
				}
			break;
			case 40:	// DOWN
				var selected = jMap.getSelecteds().getLastElement();
				switch(jMap.layoutManager.type) {
					case "jMindMapLayout" :
						if (selected.isRootNode()) {
							
						} else {
							jMap.controller.nextSiblingNodefocusAction(selected);
						}
						break;
					case "jTreeLayout" :
						jMap.controller.childNodeFocusAction(selected);
						break;
					default :
				}
			break;
		}
		
		return false;
	}
		
	
	
	return ScaleAnimate;
})();