/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

Presentation = (function () {
	
	var cfg = {
		effect: 'jmpress',
		style: 'style',
		zIndex: 1000,
		opacity: 1,		
		overlayspeed: 'slow'
	};

	var $box = null;
	var $content = null;
	var $content_fade = null;
	var $buttonBox = null;
	var $naviContainer = null;
	
	var $toolsForm = null;
	
	var startCode = '';
	var orignalHref = '';
	var ie6 = ($.browser.msie && $.browser.version < 7);
	
	function Presentation(){};
	
	
	var positionPT = function(){
		$box.css({
			position: (ie6) ? "absolute" : "fixed",
			height: "100%",
			width: "100%",
			top: (ie6)? $(window).scrollTop() : 0,
			left: 0,
			right: 0,
			bottom: 0
		});
		$content_fade.css({
			position: "absolute",
			height: "100%",
			width: "100%",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		});
		$content.css({
			position: "absolute",
			top: "50%",
			left: "50%"
		});
	};

	var stylePT = function(){
		$content_fade.css({
			zIndex: cfg.zIndex,
			display: "none",
			opacity: cfg.opacity
		});
		$box.css({
			zIndex: cfg.zIndex
		});
		$content.css({
			zIndex: cfg.zIndex+1
		});		
	};

//	var createMenu = function() {
//		$menu = $('<div class="menu"></div>');
//		$menuTag = $('<div class="menuTag">X</div>');
//		$menu.append($menuTag);
//		$menuContent = $('<div class="menuContent"></div>');
//		$menu.append($menuContent);
//		
//		var $closeButton = $('<div class="closeButton">닫기</div>');
//		$menuContent.append($closeButton);
//		
//		$menuTag.toggle(
//			function() {
//				$menu.animate({
//					left:0
//				}, 1000 );
//			},
//			function() {
//				var w = -(parseFloat($menuContent.css('width')));				
//				$menu.animate({
//					left: w
//				}, 1000 );
//			}
//		);
//		
//		$closeButton.click(Presentation.close);		
//		$box.append($menu);
//	}
	
	var createToolsForm = function() {
		$toolsForm = $('<div id="presentation-toolsform" class="presentation-toolsform"></div>');
		$toolsForm.css({
			position: "absolute",
			zIndex: cfg.zIndex+5,
			border: '5px dashed #faecd5',
			display: "none"
		});
		
//		var $frameTool = $('<div id="frame-tool" class="frame-tool"></div>');
//		$frameTool.css({
//			zIndex: cfg.zIndex+6,
//			border: '5px dashed #faecd5',
//			margin: '30px',
//			width: '100%',
//			height: '100%'
//		});
//		$toolsForm.append($frameTool);
		
		var $rotateTool = $('<div id="rotate-tool" class="rotate-tool"></div>');
		$rotateTool.css({
			position: "relative",
			zIndex: cfg.zIndex+6,
			'border-radius': '50%',
			left: '20px',
			top: '-20px',
			width: '10px',
			height: '10px',
			background: '#faecd5',
			float: 'right'
		});		
		$toolsForm.append($rotateTool);
		
		var drx = 0;
		var dry = 0;
		var isSlideDrag = false;
		var isRotateDrag = false;
		var toolsFormDown = function(e) {
			e.preventDefault();
			if( e.target.id == 'presentation-toolsform' || e.target.className.indexOf("slide") != -1) {
				drx = e.clientX;
				dry = e.clientY;
				isSlideDrag = true;
			}
			if( e.target.id == 'rotate-tool' ) {
				drx = e.clientX;
				dry = e.clientY;
				isRotateDrag = true;
			}
		}
		var toolsFormMove = function(e) {
			e.preventDefault();
			if(isSlideDrag){
//				var $toolsForm = $(e.target);
				
				var $slide = $toolsForm.data('slide');				
				// scale
				var scale = parseFloat($('#design').attr('data-scale'));
				var slideScale = $slide.getScale();
				
				var gsize = getSize();
				
				var x = e.clientX - drx;
				var y = e.clientY - dry;
				drx = e.clientX;
				dry = e.clientY;				
				var tx = parseFloat($toolsForm.css('left'));
				var ty = parseFloat($toolsForm.css('top'));
				
				// 화면 밖으로 못나가게 막기
				if(tx+x < 0 || tx+x+(($slide.outerWidth(true) / scale) * slideScale.scaleX) > gsize.width || ty+y < 0 || ty+y+(($slide.outerHeight(true) / scale) * slideScale.scaleY) > gsize.height) return;
				
				$toolsForm.css({
					left: tx+x,
					top: ty+y
				});
				
				var sx = x * scale;
				var sy = y * scale;
				var local = $slide.getTransform();
				$slide.setTransform(local.x+sx, local.y+sy);
			}
			if(isRotateDrag){
//				var $toolsForm = $(e.target);
				var x = e.clientX - drx;
				var y = e.clientY - dry;
				drx = e.clientX;
				dry = e.clientY;
				
				// scale
				var scale = 1;//parseFloat($('#design').attr('data-scale'));
				var sx = (x * scale)/3;
				var sy = (y * scale)/3;
				
				var $slide = $toolsForm.data('slide');
				
				var r = $slide.getRotate();
				var testR = r % 360;				
				if(0 < testR && testR < 180) sx = -sx;
				if(130 < testR && testR < 310) sy = -sy;
				
				var radian = r+sy+sx;
				$slide.setRotate(radian);
				
				$toolsForm.css({
					'transform': 'rotate('+radian+'deg)',
					'-ms-transform': 'rotate('+radian+'deg)',
					'-webkit-transform': 'rotate('+radian+'deg)',
					'-o-transform': 'rotate('+radian+'deg)',
					'-moz-transform': 'rotate('+radian+'deg)'
				});
				
			}
		}
		var toolsFormUp = function(e) {
			isSlideDrag = false;
			isRotateDrag = false;
		}
		var toolsFormResizeStop = function(event, ui) {
			var $slide = $toolsForm.data('slide');
			
			var widthPer = ui.size.width / ui.originalSize.width;
			var heightPer = ui.size.height / ui.originalSize.height;
			
			var slideScale = $slide.getScale();
			var newXScale = slideScale.scaleX * widthPer; 
			var newYScale = slideScale.scaleY * heightPer;			
			$slide.setScale(newXScale, newYScale);
			
			var scale = parseFloat($('#design').attr('data-scale'));
			var local = $slide.getTransform();
			var diffWidth = ((ui.size.width - ui.originalSize.width)*scale)/2;
			var diffHeight = ((ui.size.height - ui.originalSize.height)*scale)/2;
			$slide.setTransform(local.x+diffWidth, local.y+diffHeight);
		}
		
		// 회전된 상태에서 사이즈가 변경되면 toolform 이 어긋나서
		// 사이즈 변경시 위치를 재조정
		var toolsFormResize = function(event, ui) {
			var $slide = $toolsForm.data('slide');
			
			var scale = parseFloat($('#design').attr('data-scale'));
			var p = $slide.position();
			var o = $slide.offset();
			
			var slideScale = $slide.getScale();
			var radian = $slide.getRotate();
			
			var tf = $slide.css('-webkit-transform').split(",");
			
			var tfX = 0;
			var tfY = 0;				
			if(tf[0].indexOf("matrix3d") != -1) {
				tfX = parseFloat(tf[12]);
				tfY = parseFloat(tf[13]);
			} else {
				tfX = parseFloat(tf[4]);
				tfY = parseFloat(tf[5]);
			}
			
			$toolsForm.css({
				left: ( ( tfX + $slide.outerWidth(true) * (1 - slideScale.scaleX) / 2 ) / scale) + (o.left - p.left) - 4,
				top: ( ( tfY + $slide.outerHeight(true) * (1 - slideScale.scaleY) / 2 )  / scale) + (o.top - p.top) - 5
			});
		}
		
		$(document.body).bind('mousedown.toolsFormDown', toolsFormDown);
		$(document.body).bind('mousemove.toolsFormMove', toolsFormMove);
		$(document.body).bind('mouseup.toolsFormUp', toolsFormUp);
		
		$toolsForm.resizable({
			stop: toolsFormResizeStop,
			resize: toolsFormResize
		});
		
		$toolsForm.appendTo($(document.body));
//		$content.children('#jmpress').append($toolsForm);
	}
	
	var createButtons = function(isDesign) {
		var btn = function(id, name) {
			return '<a id="'+id+'" class="gh-btn">' +     
					'<span id="'+id+'-text" class="gh-text">'+name+'</span>' +
					'</a>';					
		}
		
		$buttonBox = $('<span id="jmpress-btn-box" class="jmpress-btn"></span>');
		
//		var $closebtn = $('<a id="jmpress-close-btn"></a>');
//		$closebtn.click(Presentation.close);
//		$buttonBox.append($closebtn);
		
		if(isDesign) {
//			var $test = $(btn('jmpress-test-btn', 'test'));
//			$test.click(Presentation.test);
//			$buttonBox.append($test);
//			
//			var $test = $(btn('jmpress-test-btn', 'test'));
//			$test.click(Presentation.test);
//			$buttonBox.append($test);
//			
//			var $zoomin = $(btn('jmpress-test-btn', 'ZoomIn'));
//			$zoomin.click(canvasZoomIn);
//			$buttonBox.append($zoomin);
//			var $zoomout = $(btn('jmpress-test-btn', 'ZoomOut'));
//			$zoomout.click(canvasZoomOut);
//			$buttonBox.append($zoomout);
//			
//			var $exporthtmlbtn = $(btn('jmpress-exporthtml-btn', 'Expot Html'));
//			$exporthtmlbtn.click(Presentation.exportHtml);
//			$buttonBox.append($exporthtmlbtn);
			
			var $designmodbtnclose = $(btn('jmpress-design-end-btn', 'Play'));
			$designmodbtnclose.click({mode: false}, Presentation.designMod);
			$buttonBox.append($designmodbtnclose);
			
			var $designmodbtn = $(btn('jmpress-design-btn', 'Edit'));
			$designmodbtn.click({mode: true}, Presentation.designMod);
			$buttonBox.append($designmodbtn);
			
		}
		
		var $closebtn = $(btn('jmpress-close0-btn', 'Close'));
		$closebtn.click(Presentation.close);
		$buttonBox.append($closebtn);
		
		$buttonBox.appendTo($(document.body));
	}
	
	var createNavigation = function() {
		$naviContainer = $('<div class="pt-navi-container"></div>');
		var $nextArea = $('<div class="pt-next-area"></div>');
		var $prevArea = $('<div class="pt-prev-area"></div>');
		var $naviNext = $('<span class="pt-arrows-next" title="Next"></span>');
		var $naviPrev = $('<span class="pt-arrows-prev" title="Prev"></span>');
		
		
		$prevArea.mouseover(function() {			
			$naviPrev.fadeIn('slow');
		}).mouseout(function() {
			$naviPrev.fadeOut('slow');
		}).click(function() {
			$("#jmpress").jmpress('prev');
		});
		
		$nextArea.mouseover(function() {			
			$naviNext.fadeIn('slow');
		}).mouseout(function() {
			$naviNext.fadeOut('slow');
		}).click(function() {
			$("#jmpress").jmpress('next');
		});
		
		$naviContainer.append($nextArea);
		$naviContainer.append($prevArea);
		$naviContainer.append($naviNext);
		$naviContainer.append($naviPrev);
		$box.append($naviContainer);
	}
	
	var selectFont = function () {		
		$box.webfont( 'NanumBrushWeb', {
			subset: 'moderate',
			loading: function( data ) {},
			loaded: function( data ) {
				$('.slide').css('font-family', 'NanumBrushWeb');				
			},
			error: function( data ) {}
		});
	}
	
	var canvasZoomIn = function() {
		var scale = parseFloat($('#design').attr('data-scale')) - 1;
		
		$('#design').data("stepData").scale = scale;
		$("#jmpress").jmpress("reapply", $('#design'));
		$('#design').attr('data-scale', scale);
		
		$('#jmpress').jmpress('select', '#design');
	}
	
	var canvasZoomOut = function() {
		var scale = parseFloat($('#design').attr('data-scale')) + 1;
		
		$('#design').data("stepData").scale = scale;
		$("#jmpress").jmpress("reapply", $('#design'));
		$('#design').attr('data-scale', scale);
		
		$('#jmpress').jmpress('select', '#design');
	}

	
	//////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// public 함수 /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	
	Presentation.start = function (auto_start) {
		orignalHref = window.location.href;
		
		var prefix = cfg.style;
		
		var msgbox = '<div class="'+ prefix +'box' +'" id="'+ prefix +'box">';
		if(ie6) {
			$('select').css('visibility','hidden');
		}
		msgbox +='<div class="'+ prefix +'fade" id="'+ prefix +'fade"></div>';
		msgbox += '<div class="'+ prefix +'" id="'+ prefix +'">';
		msgbox += '</div></div>';
		
		$box = $(msgbox).appendTo($(document.body));
		$content = $box.children('#'+ prefix);
		$content_fade = $box.children('#'+ prefix +'fade');
		
		// 로딩이 될때 까지 화면을 잠시 숨긴다.
		$box.hide();
		JinoUtil.waitingDialog('Prepare Presentation');
		
		var isDesign = false;
		if(cfg.effect == "Dynamic") {
			isDesign = true;
		}
				
		if(isDesign) {
			createToolsForm();			
		}		
		createButtons(isDesign);
		createNavigation();
				
		var ie6scroll = function(){
			$box.css({ top: $(window).scrollTop() });
		};
		
		positionPT();
		stylePT();
		
		if(ie6) {
			$(window).scroll(ie6scroll);
		}
		
		$(window).resize(positionPT);
		
		// 슬라이드 생성
		Presentation[cfg.effect+'Patten']();
		
		JinoUtil.importCSS('http://fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|PT+Sans:400,700,400italic,700italic|PT+Serif:400,700,400italic,700italic');
		
		// fadein이된 상태로 저장하기 위해서
		$content_fade.fadeIn(cfg.overlayspeed, function() {
			startCode = $box.html();
			
			if(cfg.effect == "Dynamic") {
				Presentation.designMod(!auto_start);
			} else {
				$('#jmpress').jmpress({
					mouse: {clickSelects: false}
				});
			}
			
			// PT 시작. 화면을 보인다.
			JinoUtil.waitingDialogClose();
			$box.show();
		});
		
		_gaq.push(['_trackEvent', 'Presentation', 'Start', "Type=" + cfg.effect + ", Style="+cfg.style]);
	};
	
	Presentation.close = function () {
		// jQuery의 메모리 삭제를 못해서 결국 리로딩하는 걸로..
		//window.location.reload(true);
		//KHANG
		//Change from show mode to ordinary mode
		orignalHref = orignalHref.replace('/show/map/', '/map/');
		//KHANG
//		window.location.replace(orignalHref);
		window.location.href = window.location.href.split('#')[0];
		
		///////////////////////////////////////////////////////////
		/*
		jMap.work.focus();
		
		if(ie6) {
			$(document.body).unbind('scroll',ie6scroll);
		}
		
		$(window).unbind('resize',positionPT);
		
		$content_fade.fadeOut(cfg.overlayspeed,function(){
			Presentation.saveSlide();
			
			$(document.body).unbind('mousedown.toolsFormDown');
			$(document.body).unbind('mousemove.toolsFormMove');
			$(document.body).unbind('mouseup.toolsFormUp');
			
			$('#jmpress').jmpress('afterDeinit', function( element, eventData ) {
				$content_fade.remove();
				$buttonBox.remove();
				$toolsForm.remove();
				$content.remove();
				$box.remove();
			});
			$('#jmpress').jmpress("deinit");
						
		});
		*/
	}
	
	Presentation.setEffect = function (effect) {
		cfg.effect = effect;		
	}
	
	Presentation.setStyle = function (style) {
		cfg.style = style;
		JinoUtil.importCSSNoCache(jMap.cfg.contextPath+'/plugin/presentation/theme/'+style+'/default.css');
	}
	
	Presentation.setSequence = function (sequence) {
		
	}
	
	Presentation.exportHtml = function () {	
		var text = '<html><head>';
		text += '<meta http-equiv="content-type" content="text/html; charset=utf-8">';
		text += '<link rel="stylesheet" href="http://www.okmindmap.com/plugin/presentation/presentation.css" type="text/css" media="screen">';
		text += '<link rel="stylesheet" href="http://www.okmindmap.com/plugin/presentation/theme/'+cfg.style+'/default.css" type="text/css" media="screen">';
		text += '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript" charset="utf-8"></script>';
		text += '<script src="http://www.okmindmap.com/plugin/presentation/jmpress/jmpress.all.js" type="text/javascript" charset="utf-8"></script>';
		text += '</head><body>';
		text += startCode;
		text += '<script type="text/javascript">$(function() {	$("#jmpress").jmpress();});</script>';
		text += '</body></html>';
			
		var frm = document.getElementById("text_export");
		frm.id.value = mapId,
		frm.ext.value = "html",
		frm.text.value = Base64.encode( escape(text) );
		frm.submit();
	}
	
	
//////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// 편집 관련 /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * jQuery Extend
	 */
	
	$.fn.getTransform = function() {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		return {
			x: parseFloat(pt.position.x),
			y: parseFloat(pt.position.y),
			z: parseInt(pt.position.z)
		};
	}
	$.fn.setTransform = function(x, y, z) {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		if(x) {
			this.data("stepData").x = x;
			$("#jmpress").jmpress("reapply", this);
//			this.attr('data-x', x);
			pt.position.x = x;
		}
		
		if(y) {
			this.data("stepData").y = y;
			$("#jmpress").jmpress("reapply", this);
//			this.attr('data-y', y);
			pt.position.y = y;
		}
		
		if(z) {
			this.data("stepData").z = z;
			$("#jmpress").jmpress("reapply", this);
//			this.attr('data-z', z);
			pt.position.z = z;
		}
	}
	
	$.fn.getScale = function() {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		return {
			scaleX: parseFloat(pt.scale.scaleX),
			scaleY: parseFloat(pt.scale.scaleY)
		};
	}
	$.fn.setScale = function(scaleX, scaleY) {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		if(scaleX) {
			this.data("stepData").scaleX = scaleX;
			$("#jmpress").jmpress("reapply", this);
			pt.scale.scaleX = scaleX;
		}
		if(scaleY) {
			this.data("stepData").scaleY = scaleY;
			$("#jmpress").jmpress("reapply", this);
			pt.scale.scaleY = scaleY;
		}
	}
	
	$.fn.getRotate = function() {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		return parseFloat(pt.rotate);
	}
	$.fn.setRotate = function(radian) {
		var pt = EditorManager.getPresentationElementById(this.data('ptid'));
		this.data("stepData").rotate = radian;
		$("#jmpress").jmpress("reapply", this);
		pt.rotate = radian;
	}
	
	Presentation.designMod = function (e) {
		var gZ = 1;
		
		var mode = null;		
		if( typeof (e) == "boolean" ) {
			mode = e;
		} else {
			mode = e.data.mode;
		}
		
		if(mode) {
			$('#jmpress').jmpress("deinit");			
			$('#jmpress').remove();
			
			Presentation[cfg.effect+'Patten']();
			$content.children('#jmpress').append($('<div id="design" class="step" data-x="1400" data-y="800" data-scale="4"></div>'));
			
			$('#jmpress').jmpress({
				start: '#design',				
				keyboard: {use: false},
				mouse: {clickSelects: false}
//				,
//				viewPort: {
//					height: 2100,
//					width: 2100
//				}
			});
			
			$('#jmpress').jmpress('select', '#design');
			$naviContainer.hide();
			$('.pt-indicate').show();
			
//			$box.find('.slidecontent').attr('contenteditable', true);
//			$box.find('img').resizable();
//			
//			$box.find('.slidecontent').css('border', '3px coral dashed');
//			$box.find('img').css('border', '3px coral dashed');
			
//			$('.slide').bind('mousedown', slidedown);
//			$('.slide').bind('mousemove', slidemove);
//			$('.slide').bind('mouseup', slideup);
			var slidedown = function(e) {
				var scale = parseFloat($('#design').attr('data-scale'));
				var p = $(this).position();
				var o = $(this).offset();
				
				var slideScale = $(this).getScale();
				var radian = $(this).getRotate();
				
				var tf = $(this).css('-webkit-transform').split(",");
				
				var tfX = 0;
				var tfY = 0;				
				if(tf[0].indexOf("matrix3d") != -1) {
					tfX = parseFloat(tf[12]);
					tfY = parseFloat(tf[13]);
				} else {
					tfX = parseFloat(tf[4]);
					tfY = parseFloat(tf[5]);
				}
				
				$toolsForm.css({
					left: ( ( tfX + $(this).outerWidth(true) * (1 - slideScale.scaleX) / 2 ) / scale) + (o.left - p.left) - 4,
					top: ( ( tfY + $(this).outerHeight(true) * (1 - slideScale.scaleY) / 2 )  / scale) + (o.top - p.top) - 5,
					width: ($(this).outerWidth(true) / scale) * slideScale.scaleX,
					height: ($(this).outerHeight(true) / scale) * slideScale.scaleY,
					'transform': 'rotate('+radian+'deg)',
					'-ms-transform': 'rotate('+radian+'deg)',
					'-webkit-transform': 'rotate('+radian+'deg)',
					'-o-transform': 'rotate('+radian+'deg)',
					'-moz-transform': 'rotate('+radian+'deg)'
				});
				$toolsForm.data('slide', $(this));
				$toolsForm.show();
				$(this).setTransform(null, null, gZ++);
			}
			$('.slide').bind('mousedown.slidedown', slidedown);
		} else {
			Presentation.saveSlide();
			
			$toolsForm.hide();
			$naviContainer.show();
			$('.pt-indicate').hide();
			
			$('.slide').unbind('click.slidedown');
			
			$('#jmpress').jmpress("deinit");
			$('#jmpress').remove();
			
			Presentation[cfg.effect+'Patten']();			
			$('#jmpress').jmpress({
				mouse: {clickSelects: false}
			});
		}
		
	}
	
	Presentation.saveSlide = function() {
		var elements = EditorManager.getPresentationElements();
		var data = Array();
		for(var id in elements) {
			var el = elements[id];
			var d = { nodeid: el.id,
					x: el.position.x,
					y: el.position.y,
					scalex: el.scale.scaleX,
					scaley: el.scale.scaleY,
					rotate: el.rotate,
					showdepths: el.showDepths
					}
			data.push(d);
		} 
		var json = JSON.stringify(data);
		$.ajax({
			type: 'post',
			async: false,
			url: parent.jMap.cfg.contextPath+'/presentation/slide.do',
			data: {'method': 'set',
						'mapid': jMap.cfg.mapId,
						'data': json
						},
			error: function(data, status, err) {
				alert("Slides save error: " + status);
			}
		});
		
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// Patten ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	
	Presentation.DynamicPatten = function () {
		var $jmpressBox = $('<div id="jmpress"></div>');
		$content.append($jmpressBox);
		
		EditorManager.show();
		EditorManager.hide();
		
		var appendSlide = function(id, content, title, ptid) {
			var sindex = 0;
			var selectionId = id+'_'+sindex;
			var $s = $('#'+selectionId);
			
//			var safe = 0;
//			while($s.data('isfull')) {
//				sindex++;
//				selectionId = id+'_'+sindex;
//				$s = $('#'+selectionId);
//				
//				safe++;
//				if(safe == 5) return false;
//			}
			
			if(!$s || $s.length == 0) {
				if(!title) title = ' ';
				$s = $('<div class="title" style="height:60px">' + title + '</div><div id="'+selectionId+'" class="slidecontent"></div>');
				
				var $el = $('<div class="step slide" data-template="'+ptid+'"></div>');
				$el.css('opacity', 1);
				$el.data('ptid', ptid);
				$el.append($s);
				
				// 순서 표시
				var $indicate = $('<div class="pt-indicate">'+(pos+1)+'</div>');
				$el.prepend($indicate);
				$indicate.hide();
				
				$content.children('#jmpress').append($el);
			}
			
			var $con = null;
			if(content && content != '') {
				$con = $(content);
				$s.append($con);
//				if(content.indexOf('slide_foreignobj') == -1)
//					$s.append('<br/>');
				
//				var h = $con.height();
//				// 강제...
//				h = 40;
//				if(content.indexOf('slide_image') != -1) h = 300;
//				if(content.indexOf('slide_foreignobj') != -1) h = 300;
//				$s.height($s.height() + h);
			}
			
//			if($s.height() > 350) {
//				$s.data('isfull', true);
//				$con.remove();
//				appendSlide(id, content, title);
//			}
			
		}
		
		var getForeignObjContent = function(node){
			var foreignObjEl = node.foreignObjEl.plainHtml;
			var iframe = $('<div/>').html(foreignObjEl).find('iframe');
			if(iframe.length){
				foreignObjEl = '<iframe src="'+iframe.attr('src')+'" frameborder="0" allowtransparency="true" scrolling="'+iframe.attr('scrolling')+'"></iframe>';
			}else{
				var str = $(foreignObjEl).html();
//				str = str.replace(new RegExp('class=', 'g'), 'class-disabled=');
//				str = str.replace(new RegExp('style=', 'g'), 'style-disabled=');
				foreignObjEl = '<div style="">'+str+'</div>';
			}
			return foreignObjEl;
		};
		
		//appendSlide('start-page', '<div class="slide-start">'+jMap.getRootNode().getText().replace(/\n/g, '<br>')+'</div>');		
		for(var pos = 0; pos < EditorManager.getSequenceSize(); pos++) {
			var pt = EditorManager.getPresentationElement(pos);
			var node = pt.node;
			var showDepths = pt.showDepths + 1;
			var text = node.getText();
			if(node.hyperlink != null) text = '<a target="_blank" href="'+node.hyperlink.attr().href+'">'+text+'</a>';
			
			if(showDepths < 2) {
				appendSlide('ss'+pos, '<div class="slide_sentence_1">' + text + '</div>', '', node.getID());
				if(node.img){
					appendSlide('ss'+pos, '<img class="slide_image_1" src="' + node.imgInfo.href + '" />', '', node.getID());
				}
				if(node.foreignObjEl) {
					appendSlide('ss'+pos, '<div class="slide_foreignobj_1 foreignobjfix">'+node.foreignObjEl.plainHtml+'</div>', text, node.getID());
				}
			} else {
				appendSlide('ss'+pos, null, text, node.getID());
				var contentChildren = function(n, currentDepth) {
					currentDepth++;
					var children = n.getChildren();
					for(var i = 0; i < children.length; i++) {
						var child = children[i];
						if(child.getText() != ''){
							var childText = child.getText();
							if(child.hyperlink != null) childText = '<a target="_blank" href="'+child.hyperlink.attr().href+'">'+childText+'</a>';
							appendSlide('ss'+pos, '<div class="slide_sentence_'+currentDepth+'">' + childText + '</div>', text, node.getID());
						}													
						if(child.img){
							//appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" width="'+ 600 + 'px" height="' + 400 + 'px" />', text);						
							appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" />', text, node.getID());
						}
						if(child.foreignObjEl) {
							//appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix" width="'+ 600 + 'px" height="' + 400 + 'px">'+child.foreignObjEl.plainHtml+'</div>', text);
							appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix">'+getForeignObjContent(child)+'</div>', text, node.getID());
						}
						
						if(showDepths > currentDepth){
							contentChildren(child, currentDepth);
						}
					}
				}
				contentChildren(node, 1);
			}
		}
		//appendSlide('end-page', '<div class="slide-end">THE END</div>');
		
		var initX = 0;
		var initY = 0;
		for(var pos = 0; pos < EditorManager.getSequenceSize(); pos++) {
			var pt = EditorManager.getPresentationElement(pos);
			var n = pt.node;
			
			// 초기 위치
			if(pt.position.x == 0 && pt.position.y == 0) {
				pt.position.x = initX;
				pt.position.y = initY;
				initX = initX+1000;
				if(initX % 4000 == 0){
					initY = initY+800;
					initX = 0;
				}
			}
			pt.position.z = 0;
			
			$.jmpress("template", n.getID(), {
				x: pt.position.x, y: pt.position.y,
				scaleX: pt.scale.scaleX, scaleY: pt.scale.scaleY,
				rotate: pt.rotate
			});
			
		}
		
		$('.slidecontent').slimScroll({
			height: '550px',
		    size : '3px',
		    alwaysVisible: false
		});
	}

	
	Presentation.BoxPatten = function () {
		var $jmpressBox = $('<div id="jmpress"></div>');
		$content.append($jmpressBox);
		
		// nvhoang
		if(jMap.cfg.mapBackgroundColor != '' && jMap.cfg.mapBackgroundColor != '#ffffff'){
			$content_fade.css({
				background: jMap.cfg.mapBackgroundColor
			});
		}
		
		var dataX = [0, 450, 0, -450];
		var dataZ = [0, -450, -900, -450];
		var rotateYper = 90;
		
		var cntX = 0;
		var cntZ = 0;
		var cntRY = 0;
		
		EditorManager.show();
		EditorManager.hide();
		
		var appendSlide = function(id, content, title) {
			var sindex = 0;
			var selectionId = id+'_'+sindex;
			var $s = $('#'+selectionId);
			
//			var safe = 0;
			while($s.data('isfull')) {
				sindex++;
				selectionId = id+'_'+sindex;
				$s = $('#'+selectionId);
				
//				safe++;
//				if(safe == 5) return false;
			}
			
			if(!$s || $s.length == 0) {
				$s = $('<div id="'+selectionId+'" class="slidecontent" style="height: 60px;"></div>');
				if(!title) title = '';
				$s.append('<div class="title">' + title + '</div>');
				
				var $el = $('<div class="step slide" data-x="'+ dataX[cntX%4]  +'" data-y="0" data-z="'+ dataZ[cntZ%4]  +'" data-rotate-y="'+ rotateYper*cntRY +'"></div>');
				$el.append($s);
				
				cntX++;
				cntZ++;
				cntRY++;
				
				$content.children('#jmpress').append($el);
			}
			
			var $con = null;
			if(content && content != '') {
				$con = $(content);
				$s.append($con);
//				if(content.indexOf('slide_foreignobj') == -1)
//					$s.append('<br/>');
				
				// var h = $con.height();
				var h = Math.max(Math.round($con.text().length * 20 / 785), 1)*43;
				// 강제...
				// h = 40;
				if(content.indexOf('slide_sentence_2') != -1) h += 20;
				if(content.indexOf('slide_image') != -1) h = 400;
				if(content.indexOf('slide_foreignobj') != -1) h = 400;
				$s.height($s.height() + h);
			}
			
			if($s.height() > 630) {
				$s.data('isfull', true);
				$con.remove();
				appendSlide(id, content, title);
			}
			
		}
		
		var getForeignObjContent = function(node){
			var foreignObjEl = node.foreignObjEl.plainHtml;
			var iframe = $('<div/>').html(foreignObjEl).find('iframe');
			if(iframe.length){
				foreignObjEl = '<iframe src="'+iframe.attr('src')+'" frameborder="0" allowtransparency="true" scrolling="'+iframe.attr('scrolling')+'"></iframe>';
			}else{
				var str = $(foreignObjEl).html();
//				str = str.replace(new RegExp('class=', 'g'), 'class-disabled=');
//				str = str.replace(new RegExp('style=', 'g'), 'style-disabled=');
				foreignObjEl = '<div style="">'+str+'</div>';
			}
			return foreignObjEl;
		};
		
		appendSlide('start-page', '<div class="slide-start">'+jMap.getRootNode().getText().replace(/\n/g, '<br>')+'</div>');		
		for(var pos = 0; pos < EditorManager.getSequenceSize(); pos++) {
			var pt = EditorManager.getPresentationElement(pos);
			var node = pt.node;
			var showDepths = pt.showDepths + 1;
			
			var text = node.getText();
			if(node.hyperlink != null) text = '<a target="_blank" href="'+node.hyperlink.attr().href+'">'+text+'</a>';
			
			if(showDepths < 2) {
				appendSlide('ss'+pos, '<div class="slide_sentence_1">' + text + '</div>', '');
				if(node.img){
					appendSlide('ss'+pos, '<img class="slide_image_1" src="' + node.imgInfo.href + '" />', '');
				}
				if(node.foreignObjEl) {
					appendSlide('ss'+pos, '<div class="slide_foreignobj_1 foreignobjfix">'+node.foreignObjEl.plainHtml+'</div>', '');
				}
			} else {
				appendSlide('ss'+pos, null, text);
				var contentChildren = function(n, currentDepth) {
					currentDepth++;
					var children = n.getChildren();
					for(var i = 0; i < children.length; i++) {
						var child = children[i];
						if(child.getText() != ''){
							var _sindex = 0;
							var _$s = $('#ss'+pos+'_'+_sindex);
							while(_$s.data('isfull')) {
								_sindex++;
								_$s = $('#ss'+pos+'_'+_sindex);
							}
							if((child.img || child.foreignObjEl) && _$s.height() > 184){
								_$s.height(650);
							}
							
							var childText = child.getText();
							if(child.hyperlink != null) childText = '<a target="_blank" href="'+child.hyperlink.attr().href+'">'+childText+'</a>';
							appendSlide('ss'+pos, '<div class="slide_sentence_'+currentDepth+'">' + childText + '</div>', text);
						}													
						if(child.img){
							//appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" width="'+ 600 + 'px" height="' + 400 + 'px" />', text);						
							appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" />', text);
						}
						if(child.foreignObjEl) {
							//appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix" width="'+ 600 + 'px" height="' + 400 + 'px">'+child.foreignObjEl.plainHtml+'</div>', text);
							appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix">'+getForeignObjContent(child)+'</div>', text);
						}
						
						if(showDepths > currentDepth){
							contentChildren(child, currentDepth);
						}
					}
				}
				contentChildren(node, 1);
			}
		}
		appendSlide('end-page', '<div class="slide-end">THE END</div>');
	}
	
	
	Presentation.AeroPatten = function () {
		var $jmpressBox = $('<div id="jmpress"></div>');
		$content.append($jmpressBox);
		
		var Xper = 500;
		var Zper = -1000;
		var cnt = 0;
		
		EditorManager.show();
		EditorManager.hide();
		
		var appendSlide = function(id, content, title) {
			var sindex = 0;
			var selectionId = id+'_'+sindex;
			var $s = $('#'+selectionId);
			
//			var safe = 0;
			while($s.data('isfull')) {
				sindex++;
				selectionId = id+'_'+sindex;
				$s = $('#'+selectionId);
				
//				safe++;
//				if(safe == 5) return false;
			}
			
			if(!$s || $s.length == 0) {
				$s = $('<div id="'+selectionId+'" class="slidecontent" style="height: 60px;"></div>');
				if(!title) title = '';
				$s.append('<div class="title">' + title + '</div>');
				
				var $el = $('<div class="step slide" data-x="'+ Xper*cnt  +'" data-y="0" data-z="'+ Zper*cnt  +'"></div>');
				$el.append($s);
				
				cnt++;
				
				$content.children('#jmpress').append($el);
			}
			
			var $con = null;
			if(content && content != '') {
				$con = $(content);
				$s.append($con);
//				if(content.indexOf('slide_foreignobj') == -1)
//					$s.append('<br/>');
				
				// var h = $con.height();
				var h = Math.max(Math.round($con.text().length * 20 / 785), 1)*43;
				// 강제...
				// h = 40;
				if(content.indexOf('slide_sentence_2') != -1) h += 20;
				if(content.indexOf('slide_image') != -1) h = 400;
				if(content.indexOf('slide_foreignobj') != -1) h = 400;
				$s.height($s.height() + h);
			}
			
			if($s.height() > 630) {
				$s.data('isfull', true);
				$con.remove();
				appendSlide(id, content, title);
			}
			
		}
		
		var getForeignObjContent = function(node){
			var foreignObjEl = node.foreignObjEl.plainHtml;
			var iframe = $('<div/>').html(foreignObjEl).find('iframe');
			if(iframe.length){
				foreignObjEl = '<iframe src="'+iframe.attr('src')+'" frameborder="0" allowtransparency="true" scrolling="'+iframe.attr('scrolling')+'"></iframe>';
			}else{
				var str = $(foreignObjEl).html();
//				str = str.replace(new RegExp('class=', 'g'), 'class-disabled=');
//				str = str.replace(new RegExp('style=', 'g'), 'style-disabled=');
				foreignObjEl = '<div style="">'+str+'</div>';
			}
			return foreignObjEl;
		};
		
		appendSlide('start-page', '<div class="slide-start">'+jMap.getRootNode().getText().replace(/\n/g, '<br>')+'</div>');		
		for(var pos = 0; pos < EditorManager.getSequenceSize(); pos++) {
			var pt = EditorManager.getPresentationElement(pos);
			var node = pt.node;
			var showDepths = pt.showDepths + 1;
			
			var text = node.getText();
			if(node.hyperlink != null) text = '<a target="_blank" href="'+node.hyperlink.attr().href+'">'+text+'</a>';
			
			if(showDepths < 2) {
				appendSlide('ss'+pos, '<div class="slide_sentence_1">' + text + '</div>', '');
				if(node.img){
					appendSlide('ss'+pos, '<img class="slide_image_1" src="' + node.imgInfo.href + '" />', '');
				}
				if(node.foreignObjEl) {
					appendSlide('ss'+pos, '<div class="slide_foreignobj_1 foreignobjfix">'+node.foreignObjEl.plainHtml+'</div>', '');
				}
			} else {
				appendSlide('ss'+pos, null, text);
				var contentChildren = function(n, currentDepth) {
					currentDepth++;
					var children = n.getChildren();
					for(var i = 0; i < children.length; i++) {
						var child = children[i];
						if(child.getText() != ''){
							var _sindex = 0;
							var _$s = $('#ss'+pos+'_'+_sindex);
							while(_$s.data('isfull')) {
								_sindex++;
								_$s = $('#ss'+pos+'_'+_sindex);
							}
							if((child.img || child.foreignObjEl) && _$s.height() > 184){
								_$s.height(650);
							}

							var childText = child.getText();
							if(child.hyperlink != null) childText = '<a target="_blank" href="'+child.hyperlink.attr().href+'">'+childText+'</a>';
							appendSlide('ss'+pos, '<div class="slide_sentence_'+currentDepth+'">' + childText + '</div>', text);
						}													
						if(child.img){
							//appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" width="'+ 600 + 'px" height="' + 400 + 'px" />', text);						
							appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" />', text);
						}
						if(child.foreignObjEl) {
							//appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix" width="'+ 600 + 'px" height="' + 400 + 'px">'+child.foreignObjEl.plainHtml+'</div>', text);
							appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix">'+getForeignObjContent(child)+'</div>', text);
						}
						
						if(showDepths > currentDepth){
							contentChildren(child, currentDepth);
						}
					}
				}
				contentChildren(node, 1);
			}
		}
		appendSlide('end-page', '<div class="slide-end">THE END</div>');
	}
	
	
	Presentation.LinearPatten = function () {
		var $jmpressBox = $('<div id="jmpress"></div>');
		$content.append($jmpressBox);
		
		var Xper = 1200;
		var cnt = 0;
		
		EditorManager.show();
		EditorManager.hide();
		
		var appendSlide = function(id, content, title) {
			var sindex = 0;
			var selectionId = id+'_'+sindex;
			var $s = $('#'+selectionId);
			
//			var safe = 0;
			while($s.data('isfull')) {
				sindex++;
				selectionId = id+'_'+sindex;
				$s = $('#'+selectionId);
				
//				safe++;
//				if(safe == 5) return false;
			}
			
			if(!$s || $s.length == 0) {
				$s = $('<div id="'+selectionId+'" class="slidecontent" style="height: 60px;"></div>');
				if(!title) title = '';
				$s.append('<div class="title">' + title + '</div>');
				
				var $el = $('<div class="step slide" data-x="'+Xper*cnt+'" data-y="0"></div>');
				$el.css('opacity', 1);
				$el.append($s);
				
				cnt++;
				
				$content.children('#jmpress').append($el);
			}
			
			var $con = null;
			if(content && content != '') {
				$con = $(content);
				$s.append($con);
//				if(content.indexOf('slide_foreignobj') == -1)
//					$s.append('<br/>');
				
				// var h = $con.height();
				var h = Math.max(Math.round($con.text().length * 20 / 785), 1)*43;
				// 강제...
				// h = 40;
				if(content.indexOf('slide_sentence_2') != -1) h += 20;
				if(content.indexOf('slide_image') != -1) h = 400;
				if(content.indexOf('slide_foreignobj') != -1) h = 400;
				$s.height($s.height() + h);
			}
			
			if($s.height() > 630) {
				$s.data('isfull', true);
				$con.remove();
				appendSlide(id, content, title);
			}
			
		}
		
		var getForeignObjContent = function(node){
			var foreignObjEl = node.foreignObjEl.plainHtml;
			var iframe = $('<div/>').html(foreignObjEl).find('iframe');
			if(iframe.length){
				foreignObjEl = '<iframe src="'+iframe.attr('src')+'" frameborder="0" allowtransparency="true" scrolling="'+iframe.attr('scrolling')+'"></iframe>';
			}else{
				var str = $(foreignObjEl).html();
//				str = str.replace(new RegExp('class=', 'g'), 'class-disabled=');
//				str = str.replace(new RegExp('style=', 'g'), 'style-disabled=');
				foreignObjEl = '<div style="">'+str+'</div>';
			}
			return foreignObjEl;
		};
		
		appendSlide('start-page', '<div class="slide-start">'+jMap.getRootNode().getText().replace(/\n/g, '<br>')+'</div>');		
		for(var pos = 0; pos < EditorManager.getSequenceSize(); pos++) {
			var pt = EditorManager.getPresentationElement(pos);
			var node = pt.node;
			var showDepths = pt.showDepths + 1;
			
			var text = node.getText();
			if(node.hyperlink != null) text = '<a target="_blank" href="'+node.hyperlink.attr().href+'">'+text+'</a>';
			
			if(showDepths < 2) {
				appendSlide('ss'+pos, '<div class="slide_sentence_1">' + text + '</div>', '');
				if(node.img){
					appendSlide('ss'+pos, '<img class="slide_image_1" src="' + node.imgInfo.href + '" />', '');
				}
				if(node.foreignObjEl) {
					appendSlide('ss'+pos, '<div class="slide_foreignobj_1 foreignobjfix">'+node.foreignObjEl.plainHtml+'</div>', '');
				}
			} else {
				appendSlide('ss'+pos, null, text);
				var contentChildren = function(n, currentDepth) {
					currentDepth++;
					var children = n.getChildren();
					for(var i = 0; i < children.length; i++) {
						var child = children[i];
						if(child.getText() != ''){
							var _sindex = 0;
							var _$s = $('#ss'+pos+'_'+_sindex);
							while(_$s.data('isfull')) {
								_sindex++;
								_$s = $('#ss'+pos+'_'+_sindex);
							}
							if((child.img || child.foreignObjEl) && _$s.height() > 184){
								_$s.height(650);
							}

							var childText = child.getText();
							if(child.hyperlink != null) childText = '<a target="_blank" href="'+child.hyperlink.attr().href+'">'+childText+'</a>';
							appendSlide('ss'+pos, '<div class="slide_sentence_'+currentDepth+'">' + childText + '</div>', text);
						}													
						if(child.img){
							//appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" width="'+ 600 + 'px" height="' + 400 + 'px" />', text);						
							appendSlide('ss'+pos, '<img class="slide_image_'+currentDepth+'" src="' + child.imgInfo.href + '" />', text);
						}
						if(child.foreignObjEl) {
							//appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix" width="'+ 600 + 'px" height="' + 400 + 'px">'+child.foreignObjEl.plainHtml+'</div>', text);
							appendSlide('ss'+pos, '<div class="slide_foreignobj_'+currentDepth+' foreignobjfix">'+getForeignObjContent(child)+'</div>', text);
						}
						
						if(showDepths > currentDepth){
							contentChildren(child, currentDepth);
						}
					}
				}
				contentChildren(node, 1);
			}
		}
		appendSlide('end-page', '<div class="slide-end">THE END</div>');
	}
	
	
//	Presentation.linearPatten = function () {
//		var $jmpressBox = $('<div id="jmpress"></div>');
//		$content.append($jmpressBox);
//		
//		var xper = 0;
//		var yper = 0;
//		var $last = null;
//		
//		var slideStructure = function(n, x, y){
//			if(n.getChildren().length > 0) {
//				var children = n.getChildren();
//				
//				var text = '<div class="slidecontent"><h3>' + n.getText() + '</h3>';
//				text += '<ul>';
//				for(var i = 0; i < children.length; i++) {
//					var child = children[i];
//					text += '<br />' + '<li>' + child.getText() + '</li>';
//				}
//				text += '</ul></div>'
//				
//				xper+=600;
//				var $el = $('<div class="step slide" data-x="'+xper+'" data-y="'+y+'">'+
//				        text+
//		        		'</div>');
//				$last.after($el);
//				$last = $el;
//				
//				for(var i = 0; i < children.length; i++) {
//					var child = children[i];					
//					slideStructure(child, x, y);
//				}
//			}
//		}
//		
//		var nodes = node.getChildren();
//		for(var i = 0; i < nodes.length; i++) {
//			var $depth1 = $('<div class="step slide" data-x="0" data-y="'+yper+'"><div class="slidecontent">'+
//			        '<p>'+nodes[i].getText()+'</p>'+
//	        		'</div></div>');
//			$content.children('#jmpress').append($depth1);
//			$last = $depth1;
//			xper = 0;
//			slideStructure(nodes[i], 0, yper);
//			yper+=450;
//		}
//	}
//	
//	Presentation.linearPatten2 = function () {
//		var $jmpressBox = $('<div id="jmpress"></div>');
//		$content.append($jmpressBox);
//		
//		var xper = 0;
//		var yper = 0;
//		var $last = null;
//		
//		var slideStructure = function(n, x, y){
//			if(n.getChildren().length > 0) {
//				var children = n.getChildren();
//				for(var i = 0; i < children.length; i++) {
//					var child = children[i];
//					xper+=600;
//					var $el = $('<div class="step slide" data-x="'+xper+'" data-y="'+y+'">'+
//					        '<p>'+child.getText()+'</p>'+
//			        		'</div>');
//					$last.after($el);
//					$last = $el;
//					slideStructure(child, x, y);
//				}
//			}
//		}
//		
//		var nodes = node.getChildren();
//		for(var i = 0; i < nodes.length; i++) {
//			var $depth1 = $('<div class="step slide" data-x="0" data-y="'+yper+'">'+
//			        '<p>'+nodes[i].getText()+'</p>'+
//	        		'</div>');
//			$content.children('#jmpress').append($depth1);
//			$last = $depth1;
//			xper = 0;
//			slideStructure(nodes[i], 0, yper);
//			yper+=450;
//		}
//	}
	
	
	return Presentation;
})();



