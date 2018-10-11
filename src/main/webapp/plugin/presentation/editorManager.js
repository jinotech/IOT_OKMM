/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */


PresentationElement = function(node, $el){
	this.$el =  $el;
	this.node = node;	
	this.id = node.getID();
	
	// 속성
	this.position = {x: 0, y: 0, z: 0};
	this.scale = {scaleX: 1, scaleY: 1};
	this.rotate = 0;	
	this.showDepths = 3;
}

//PresentationElement.prototype.type= "PresentationElement";
//
//PresentationElement.prototype.getPosition = function() {
//	return this.position;	
//}
//
//PresentationElement.prototype.setPosition = function() {
//	return this.position;	
//}



EditorManager = (function () {
	
	var editor = null;					// editor 레이아웃
	var editorContainer = null;					// editor에 요소를 담는곳
	var nodeRemovedListener = null;	// 노드 삭제 리스너
	var nodeEditedListener = null;	// 노드 편집 리스너
	
	var Elements = {};
	var Sequence = Array();
	
	var themes = 'BlackLabel Basic Sunshine Sky BlueLabel'.split(' ');
	var Types = {Slide: 'slide', Mindmap: 'mindmap', Dynamic: 'Dynamic'}; 
	
	var cfg = {
			editorID : 'presentation_editor'
	};

	function EditorManager(){};
	
	
	var updateSequence = function(){
		var children = editorContainer.children();
		
		Sequence = [];
		for(var i = 0; i < children.length; i++) {
			Sequence.push($(children[i]).data('ptid'));
		}
		
		var sequence = Sequence.join(' ');
		$.ajax({
			type: 'post',
			async: false,
			url: parent.jMap.cfg.contextPath+'/mindmap/changeMap.do',
			data: {'mapId': parent.mapId,
						'pt_sequence': sequence },
			error: function(data, status, err) {
				alert("pt_sequence : " + status);
			}
		});
		
		updateEditor();
	}
	
	var setEllipsisText = function(text, width) {
		var line = $('<span style="white-space:nowrap">'+text+'</span>');
		editor.append(line);
		
		var ellipsis = false;
		width = width - 10;
		while(line.width() > width) {
			var t = line.text();
			t = t.substring(0, t.length-1);
			line.text(t);
			ellipsis = true;
		}
		if(ellipsis) {
			text = line.text()+'...';
		}
		line.remove();
		
		return text;
	} 
	
	var updateNode = function(node) {
		if(node) {
			var pt = EditorManager.getPresentationElementById(node.getID());
			var $el = pt.$el;
			$el.find('.editor_text_content').text(setEllipsisText(node.getText(), 150));
			var textColor = node.getBackgroundColor();
			$el.find('.editor_text_content').css('background', textColor);
			$el.find('.editor_depths_content').text(pt.showDepths);
		}
	}
	var updateEditor = function(){
		var children = editorContainer.children();
		for(var i = 0; i < children.length; i++) {
			var id = $(children[i]).data('ptid');
			var node = jMap.getNodeById(id);
			if(node) {
				$(children[i]).find('.editor_order_content').text(i+1);				
			} else {
				delete Elements[id];
				$(children[i]).remove();
			}
		}
	}
	
	var insertNode = function(node) {
		var nodeid = node.getID();
		// div를 생성해 마지막에 붙인다.
		var $el = $('<div class="pt-element"></div>');
		
		var $order = $('<div class="editor_order"><div class="editor_order_content">0</div></div>');		
		$el.append($order);
		
		var $text = $('<div class="editor_text"><div class="editor_text_content"></div></div>');
		$el.append($text);
		
		var $depths = $('<div class="editor_depths"><div class="editor_depths_content">0</div></div>');
		$depths.click(function(){
			var pt = Elements[$(this).parent().data('ptid')];
			pt.showDepths = (pt.showDepths % 3) + 1;
			$(this).find('.editor_depths_content').text(pt.showDepths);
			Presentation.saveSlide();
		});
		$el.append($depths);
				
		var $remove = $('<div class="editor_remove"><div class="editor_remove_content"></div></div>');
		$remove.click(function(){	// 삭제 클릭시 지워지도록			
			delete Elements[$(this).parent().data('ptid')];
			$(this).parent().remove();
			updateSequence();
		});
		$el.append($remove);
		
		
		$el.data('ptid', nodeid);
		editorContainer.append($el);
		Sequence.push(nodeid);
		
		var element = new PresentationElement(node, $el);
		// 서버에서 해당 노드가 갖고 있는 슬라이드 정보를 가져온다.
		$.ajax({
			type: 'post',
			async: false,
			url: parent.jMap.cfg.contextPath+'/presentation/slide.do',
			data: {'method': 'get',
						'mapid': jMap.cfg.mapId,
						'nodeid': element.id
						},
			success: function(data, textStatus, jqXHR) {
				if(jqXHR.responseText != "") {
					var slide = JSON.parse(jqXHR.responseText);				
					element.position = {x: slide.x, y: slide.y};
					element.scale = {scaleX: slide.scalex, scaleY: slide.scaley};
					element.rotate = slide.rotate;
					if(slide.showdepths) element.showDepths = slide.showdepths;
				}
			},
			error: function(data, status, err) {
				alert("Slides load error: " + status);
			}
		});
		
		Elements[nodeid] = element;
		
		updateNode(node);

		// 스크롤 가장 아래로..
		var bottom = editorContainer[0].scrollHeight - editorContainer.outerHeight();
		editorContainer.scrollTop(bottom);
		$('.slimScrollBar').css({ top: bottom + 'px' });
		
	}
	
	/**
	 * editor 생성 함수
	 */
	var createEditor = function() {
		var left = 0;
		var top = 0;
		
		var slideBoxResize = function() {
			var width = 354;
			var height = 0;			
			var mapDiv = document.getElementById("main");
			height = mapDiv.offsetHeight - 68;
			editor.height(height);
			
			if(editorContainer) {
				var h = height - 330;
				editorContainer.height(h);
				editorContainer.parent().height(h);
			} 
			
		}
		
		var topDiv = document.getElementById("top");
		if(!topDiv) topDiv = 0;
		top = topDiv.offsetHeight;
		var pos = "left: "+left+"px; top: "+top+"px;";
		editor = $('<div id="'+cfg.editorID+'" class="presentation-editor" style="position:absolute; '+pos+'"></div>').appendTo($(jMap.work).parent());
		
		slideBoxResize();
		$(window).bind('resize', slideBoxResize);
		
		// Bar
		editor.append('<div class="pt-editor-bar"><div id="pt-editor-bar-title">Presentation</div><div id="pt-editor-bar-close"></div></div>');
		
		// Slide Box
		var slideBox = $('<div class="pt-editor-box"><div class="pt-editor-box-title">Slide</div></div>');
		editor.append(slideBox);
		editorContainer = $('<div div id="'+cfg.editorID+'-container" class="presentation-editor-container"></div>');		
		slideBox.append(editorContainer);
		
		// 노드가 들어왔을때 하일라이트
		var orgBackgroundColor = null;
		slideBox.bind('mouseenter', function() {
			jMap.movingNode.hide();
			
			if(jMap.movingNode && !jMap.movingNode.removed){
				orgBackgroundColor = $(this).css('background-color');
				$(this).animate({
					'background-color': '#D0DCEB'
				}, 500);
			}
		});
		slideBox.bind('mouseleave', function() {
			jMap.movingNode.show();
			
			if(orgBackgroundColor) {
				$(this).animate({
					'background-color': '#EDEDED'
				}, 500);
				orgBackgroundColor = null;
			}			
		}).bind('mouseup', function(e) {
			if(orgBackgroundColor) {
				$(this).animate({
					'background-color': '#EDEDED'
				}, 500);
				orgBackgroundColor = null;
			}
			
			jMap.DragPaper = false;
			jMap.positionChangeNodes = false;

			if(jMap.movingNode && !jMap.movingNode.removed) {
			    jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
				jMap.movingNode.remove();
				delete jMap.movingNode;
				
				jMap.dragEl._drag = null;
				delete jMap.dragEl._drag;
				
				EditorManager.addNode(jMap.dragEl.node);
				
				jMap.dragEl = null;
				delete jMap.dragEl;
			} else {
				if(jMap.dragEl) {
					jMap.dragEl._drag = null;
					delete jMap.dragEl._drag;
				}
				jMap.dragEl = null;
				delete jMap.dragEl;
			}
			
		});
		
		var mapDiv = document.getElementById("main");
		height = mapDiv.offsetHeight - 68;
		editorContainer.slimScroll({
			height: height-330,
			alwaysVisible: true
		});
		
		
		var selectedType = null;
		var selectedTheme = null;
		var typeBox = null;
		var styleBox = null;
		var ptTypeSelecter = null;		
		var ptStyleSelecter = null;
		
		// Presentation Type Box
		typeBox = $('<div class="pt-editor-box"><div class="pt-editor-box-title">Presentation Type</div><div class="pt-frame"><div id="pttype-selected"></div><div class="pt-buttons"><span id="pttype-selecter-img"></span><span id="pttype-selecter-arrow"><div id="pttype-selecter" class="pt-selecter"></div></span></div></div></div>');
		editor.append(typeBox);
		ptTypeSelecter = typeBox.find('#pttype-selecter');
		var selectedTypeName = typeBox.find('#pttype-selected').text();
		var addType = function(type, typeName, previewUrl, select) {
			var ptelement = $('<div class="pt-preview-container"><div class="pt-preview-name">'+typeName+'</div><div class="pt-preview"><img width="120px" height="95px" /></div></div>');
			ptelement.find('img').attr('src', previewUrl);
			ptelement.data('type', type);
			ptelement.data('typeName', typeName);
			ptTypeSelecter.append(ptelement);
			
			ptelement.bind('click', function() {
				var el = $(this);
				typeBox.find('#pttype-selected').text(el.data('typeName'));
				selectedType.removeClass('selected');
				el.addClass('selected');
				selectedType = el;				
			});
			
			if(select) {
				typeBox.find('#pttype-selected').text(ptelement.data('typeName'));
				ptelement.addClass('selected');
				selectedType = ptelement;
			}
		}
		
		addType(Types.Dynamic, 'Dynamic', jMap.cfg.contextPath+'/plugin/presentation/images/types/prezilike.png', true);
		addType(Types.Slide, 'Box', jMap.cfg.contextPath+'/plugin/presentation/images/types/box.png');
		addType(Types.Slide, 'Aero', jMap.cfg.contextPath+'/plugin/presentation/images/types/aero.png');
		addType(Types.Slide, 'Linear', jMap.cfg.contextPath+'/plugin/presentation/images/types/linear.png');
		addType(Types.Mindmap, 'Mindmap - Basic', jMap.cfg.contextPath+'/plugin/presentation/images/types/mindmap_basic.png');
		addType(Types.Mindmap, 'Mindmap - Zoom', jMap.cfg.contextPath+'/plugin/presentation/images/types/mindmap_zoom.png');		
		
		typeBox.find('.pt-buttons').bind('click', function() {
			if(ptTypeSelecter.css('display') == 'none') {
				ptStyleSelecter.fadeOut("slow");
				ptTypeSelecter.fadeIn("slow");
			}else {
				ptTypeSelecter.fadeOut("slow");
			}
		}); 
		
		// Presentation Style Box
		styleBox = $('<div class="pt-editor-box"><div class="pt-editor-box-title">Presentation Style</div><div class="pt-frame"><div id="ptstyle-selected"></div><div class="pt-buttons"><span id="ptstyle-selecter-img"></span><span id="ptstyle-selecter-arrow"><div id="ptstyle-selecter" class="pt-selecter"></div></span></div></div></div>');
		editor.append(styleBox);
		ptStyleSelecter = styleBox.find('#ptstyle-selecter');
		for(var t = 0; t < themes.length; t++) {
			var theme = themes[t];			
			var ptelement = $('<div class="pt-preview-container"><div class="pt-preview-name">'+theme+'</div><div class="pt-preview"><img width="120px" height="95px" /></div></div>');

			var previewUrl = jMap.cfg.contextPath+'/plugin/presentation/theme/'+theme+'/preview.jpg';			
			ptelement.find('img').attr('src', previewUrl);
			ptelement.data('themeName', theme);
			ptStyleSelecter.append(ptelement);
			
			ptelement.bind('click', function() {
				var el = $(this);
				styleBox.find('#ptstyle-selected').text(el.data('themeName'));
				selectedTheme.removeClass('selected');
				el.addClass('selected');
				selectedTheme = el;
			});
			
			if(t == 0) {
				styleBox.find('#ptstyle-selected').text(ptelement.data('themeName'));
				ptelement.addClass('selected');
				selectedTheme = ptelement;
			}
		}
		
		styleBox.find('.pt-buttons').bind('click', function() {
			if(ptStyleSelecter.css('display') == 'none'){				
				if(Types.Slide == selectedType.data('type') ||
						Types.Dynamic == selectedType.data('type')) {
					ptTypeSelecter.fadeOut("slow");
					ptStyleSelecter.fadeIn("slow");
				}
			} else {
				ptStyleSelecter.fadeOut("slow");
			}
		});
		
		// Start Box
		var startBox = $('<div class="pt-start">Start Presentation</div>');
		editor.append(startBox);
		startBox.click(function() {
			var theme = selectedTheme.data('themeName');
			var typeName = selectedType.data('typeName');
			var type = selectedType.data('type');
			
			if(type == Types.Mindmap) {
				if(typeName == 'Mindmap - Zoom') {
					ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFitWithZoomInOut;
					ScaleAnimate.startShowMode(30, 20, true);
				} else {
					ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFit;
					ScaleAnimate.startShowMode(30, 20, true);
				}
			} else {
				Presentation.setEffect(typeName);
				Presentation.setStyle(theme);
				Presentation.start();
			}			
		});
		
		editor.find('#pt-editor-bar-close').click(function() {
			EditorManager.hide();
		})
		
		editorContainer.sortable({
			   update: function(event, ui) {
				   updateSequence();
			   }
		});
		editorContainer.disableSelection();
		return editor;
	}
	
	/**
	 * 편집창에 깊이1인 자식들을 자동으로 추가한다.
	 */
	var createGeneralEditor = function(){
		editor = $('#'+cfg.editorID);
		if(!editor[0]){
			createEditor();
		}
		
		$.ajax({
			type: 'post',
			dataType: 'json',
			async: false,
			url: jMap.cfg.contextPath+'/mindmap/mappreference.do',
			data: {	'mapid': jMap.cfg.mapId,
						'returntype': 'json'
			},
			success: function(data) {
				var configs = data[0];
				var pt_sequence = configs.pt_sequence;
				
				if(pt_sequence == null || pt_sequence == "") {
					var children = jMap.getRootNode().getChildren();
					for(var i = 0; i < children.length; i++){
						var node = children[i];						
						if(node.position == 'right') insertNode(node);
					}
					for(var i = 0; i < children.length; i++){
						var node = children[i];						
						if(node.position == 'left') insertNode(node);
					}
					
					updateSequence();					
				} else {
					var sequence = pt_sequence.split(' ');
					for(var i = 0; i < sequence.length; i++) {
						var id = sequence[i];					
						if(id != null && id != '') {
							var node = jMap.getNodeById(id);
							if(node) insertNode(node);						
						}						
					}
					
				}
				
				updateEditor();
				editorContainer.sortable( "refresh" );
				
				EditorManager.triggerListener();
			},
			error: function(data, status, err) {
				alert("pt sequence : " + status);
			}
		});
	}
	
	EditorManager.start = function(){
		Presentation.setEffect("Box");
		Presentation.setStyle("BlackLabel");
		Presentation.start();
	}
	
	EditorManager.show = function () {
		editor = $('#'+cfg.editorID);
		if(editor[0]){
			// 이미 생성되어 있으면 보이기
			editor.show();
		} else {
			// 에디터 생성						
			createGeneralEditor();
		}
	}
	
	EditorManager.hide = function () {		
		editor && editor.hide();
	}
	
	EditorManager.getConfig = function () {
		return cfg;
	}
	
	EditorManager.getPresentationElements = function () {
		return Elements;
	}
	
	EditorManager.getPresentationElement = function (pos) {
		if(pos > EditorManager.getSequenceSize()) return null;
		var id = Sequence[pos];
		return EditorManager.getPresentationElementById(id); 
	}
	
	EditorManager.getPresentationElementById = function (id) {
		return Elements[id];
	}
	
	EditorManager.getPresentationElementSize = function () {
		return Object.keys(Elements).length;
	}
	
	EditorManager.getSequenceSize = function () {
		return Sequence.length;		
	}
	
	EditorManager.addNode = function (node) {
		insertNode(node);
		editorContainer.sortable( "refresh" );
		updateSequence();
	}
	
	
	EditorManager.triggerListener = function () {
		nodeRemovedListener = jMap.addActionListener(ACTIONS.ACTION_NODE_REMOVE, function(){
			var node = arguments[0];
			editorContainer.sortable( "refresh" );
//			updateEditor();
			updateNode(node);
			updateSequence();
		});
		nodeEditedListener = jMap.addActionListener(ACTIONS.ACTION_NODE_EDITED, function(){
			var node = arguments[0];
//			updateEditor();
			updateNode(node);
		});
	}
	
	EditorManager.destroyListener = function () {
		jMap.removeActionListener(nodeRemovedListener);	// 노드 삭제 리스너 해제
		nodeRemovedListener = null;
		jMap.removeActionListener(nodeEditedListener);	// 노드 편집 리스너 해제
		nodeEditedListener = null;
	}
	
	EditorManager.temporarily = function () {
		Presentation.setEffect("Dynamic");
		Presentation.setStyle("BlackLabel");
		Presentation.start();
	}
	
	return EditorManager;
})();



