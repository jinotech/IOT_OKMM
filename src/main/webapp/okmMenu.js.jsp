<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>

<script type="text/javascript">
	var parseCallbackParam = function(f){
		var obj =[];
		for(i=0;i<f.length;i++){
			obj[f[i]["name"]] = f[i]["value"];
		}
		return obj;	
	}
	var delMap = function () {
		deleteMap(mapId);
	};
	
	var removeIllegalFileNameChars = function(text) {
        return text.replace(/[\x00-\x1f:?\\/*"<>|]/gi, '_');
    }
	/**/
	// clip board popup
	var clipBoard = function() {
      	
		//Noed is true when the selection 
		var txt = '<div class="dialog_content" ><br />';
		if(jMap.cfg.canEdit) {
			txt += '' +
				'<div  class = "exportFile" onclick="importBookmark()"><img src="../images/icons/bookmark.png"/><br/><spring:message code="menu.plugin.bookmark"/></div>' +     
				'<div  class = "exportFile" onclick="importMap()"><img src="../images/icons/freemind.png"/><br/><spring:message code="common.freemind"/></div>';
		}
		
		if(jMap.getSelected() != null){
			txt += '<div  class = "exportFile" onclick="nodeStructureFromText()"><img src="../images/icons/texticon.png"/><br/><span><spring:message code="menu.textimportexport.import"/></span></div>' +
	      		   '<div  class = "exportFile" onclick="nodeStructureFromXml()"><img src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.import"/></span></div>';
		}else{
			txt += '<div  class = "exportFile icon-disabled"><img src="../images/icons/texticon.png"/><br/><span><spring:message code="menu.textimportexport.import"/></span></div>' +
  			   	   '<div  class = "exportFile icon-disabled"><img src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.import"/></span></div>';
		}
      	
		txt += '</div>';
		$("#dialog").append(txt);
		
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog .dialog_content").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  //buttons:[ { text: "<spring:message code='button.apply'/>", click: function() {} } ],	//Apply 버튼 누를때 코드 필요
			  });
		    //open
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","clipBoard");
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.import'/>" );
		  $("#dialog").dialog("open");
	};
	
	
	// file button popup 
	var exportFile = function() {
		//_gaq.push(['_trackEvent', "Map", "exportFile"]);	
		var node = jMap.getSelected();
		
		var txt = '<div class="dialog_content" ><br />';
		if(node != null && !node.isRootNode()){
			txt += '<div  class = "exportFile" onclick="nodeStructureToXml()"><img src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      	       '<div  class = "exportFile" onclick="nodeStructureToText()"><img src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}else{
			txt += '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      		   '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}
		if(jMap.cfg.canEdit) {
			txt += '<div  class = "exportFile" onclick="exportToFreemind()"><img src="../images/icons/exfreemind.png"/><br/><spring:message code="common.freemind"/></div>' +     
	      		   '<div  class = "exportFile" onclick="exportToHTML()"><img src="../images/icons/htmlicon.png"/><br/><spring:message code="etc.html"/></div>' +
	    		   '<div  class = "exportFile" onclick="exportToPPT()"><img src="../images/icons/ppticon.png"/><br/><spring:message code="etc.ppt"/></div>' +
	      		   '<div  class = "exportFile" onclick="exportToSVG()"><img src="../images/icons/svgicon.png"/><br/><spring:message code="etc.svg"/></div>' +
	      		   '<div  class = "exportFile" onclick="exportToPNG()"><img src="../images/icons/pngicon.png"/><br/><spring:message code="etc.png"/></div>' +
	      		   '<div  class = "exportFile" onclick="exportToText()"><img src="../images/icons/texticon.png"/><br/><spring:message code="etc.txt"/></div></div>';
		}
      	
      	
     		txt += '</div>';
			$("#dialog").append(txt);
			
		$("#dialog").dialog({
		 autoOpen:false,
		    closeOnEscape: true,	//esc키로 창을 닫는다.
		    modal:true,		//modal 창으로 설정
		    resizable:false,	//사이즈 변경
		    close: function( event, ui ) {
		  	  	$("#dialog .dialog_content").remove();
		  		$("#dialog").dialog("destroy"); 
		    	},
		 //buttons:[ { text: "<spring:message code='button.apply'/>", click: function() {} } ],	//Apply 버튼 누를때 코드 필요
		 });
		  //open
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","exportFile");
		$("#dialog").dialog( "option", "title", "<spring:message code='menu.export'/>" );
		$("#dialog").dialog("open");
		
	};
	
	var exportToFreemind = function () {
		_gaq.push(['_trackEvent', 'Export', 'Freemind']);
		
		document.location.href = "${pageContext.request.contextPath}/map/" + mapId + "/" + removeIllegalFileNameChars(mapName) + ".mm";
	};
	
	var exportToHTML = function() {
		_gaq.push(['_trackEvent', 'Export', 'HTML']);
		
		document.location.href = "${pageContext.request.contextPath}/export/html/" + mapId + "/" + removeIllegalFileNameChars(mapName) + ".zip";
	};
	/**/
	var exportToTWiki = function() {
		_gaq.push(['_trackEvent', 'Export', 'TWiki']);
		
		document.location.href = "${pageContext.request.contextPath}/export/twiki/" + mapId + "/" + removeIllegalFileNameChars(mapName) + ".twi";
	};
	/**/
	var exportToPPT = function() {
		_gaq.push(['_trackEvent', 'Export', 'PPT']);
		
		document.location.href = "${pageContext.request.contextPath}/export/ppt/" + mapId + "/" + removeIllegalFileNameChars(mapName) + ".ppt"
	};
	/**/

	var exportToSVG = function() {
		_gaq.push(['_trackEvent', 'Export', 'SVG']);
		
		toSVGString(function (svgText) {
			var frm = document.getElementById("svg_export");
			frm.id.value = mapId,
			frm.type.value = "svg",
			frm.svg.value = Base64.encode( escape(svgText) ); 
			frm.submit();
		});
				
	};
				
	var toSVGString = function(callback) {
	//				var myRe = /(<svg[^>]*[>])(.*)([<]\/svg[>])/gi;
	//				var myArray = myRe.exec(jMap.work.innerHTML);
	//				// 0 : 전체
	//				// 1 : <svg id="paper_mapview" height="3000" width="5000" version="1.1" xmlns="http://www.w3.org/2000/svg">
	//				// 2 : <svg> 태그 안에 내용
	//				// 3 : </svg>
	//				
	//				var svgText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN' 'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>";
	//				svgText += myArray[1];
	//				svgText += myArray[2];
	//				svgText += myArray[3];
	
		RAPHAEL.safari();
	
		var re = /(<svg[^]*?svg>)/gi; //[^] match everything, even line terminators

		var found = re.exec(jMap.work.innerHTML);
		
		var svgText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
		svgText += found[1];

		// 추가정보
		var re_xlink = /(xmlns=["]http[:][/]+www[.]w3[.]org[/]2000[/]svg["])/gi;
		svgText = svgText.replace(re_xlink, '$1 xmlns:xlink="http://www.w3.org/1999/xlink"');		

		// 이미지 태그의 href에 xlink
		var re_href = /( href=)/gi;
		svgText = svgText.replace(re_href, ' xlink:href=');		

		// Safari export namespace by NS1, NS2, ...
		svgText = svgText.replace(/ NS[0-9]+:(.*?=)/gi, ' xlink:$1');
		
		// closing Tag가 없는것들..
		var re_param = /(<param[^>]*)/gi;
		svgText = svgText.replace(re_param, "$1/");
		
		var re_embed = /(<embed[^>]*)/gi;
		svgText = svgText.replace(re_embed, "$1/");
		
		/*
		if (BrowserDetect.browser == "Firefox"){
			var re_image = /(<image[^>]*)/gi;
			svgText = svgText.replace(re_image, "$1/");
		}*/
		
		//var iframe_reg = /<foreignObject.*?<body.*?<iframe.*?<\/iframe><\/body><\/foreignObject>/gi;
		var iframe_reg = /<foreignObject[^]*?<\/foreignObject>/gi;
		var array_iframe = svgText.match(iframe_reg);
		
		var all_images = {};
		var all_foreigns = {};
		var all_sources = {};
		var youtubeCheck = /youtube.com\/embed\/.*?\"/g;

		if (array_iframe != null){
			for (var key = 0; key < array_iframe.length; key++ ){
				var foreign = array_iframe[key];
				//alert('found: ' + foreign);
				var if_reg = /<iframe/i;
				var imageUrl = '';
				if (if_reg.test(foreign)) {
					var src = foreign.replace(/[^]*?<iframe.*?src="(.*?)"[^]*/i, "$1");
	 				if (youtubeCheck.test(foreign)) {
	 					var youtybeUrl = foreign.match(youtubeCheck)[0]; 
	 					var youtubeId = youtybeUrl.replace(/(youtube.com\/embed\/)(.*?)\"/g, "$2");
	 					imageUrl = "http://img.youtube.com/vi/" + youtubeId + "/0.jpg";						
	 				} else {
	 					imageUrl = jMap.cfg.contextPath + "/images/iframeimage.png";
	 				}
	 				
					foreign_width = foreign.match(/<foreignObject.*?width\=".*?\"/g)[0].match(/width\=".*?\"/g)[0];
					
					foreign = foreign.replace(/(<iframe.*?)(width\=\".*?\")(.*?)/g, "$1"+foreign_width+"$3");
					
					foreign_height = foreign.match(/<foreignObject.*?height\=".*?\"/g)[0].match(/height\=".*?\"/g)[0];
					
					foreign = foreign.replace(/(<iframe.*?)(height\=\".*?\")(.*?)/g, "$1"+foreign_height+"$3");
					
					foreign = foreign.replace(/margin-left:.*?px;margin-top:.*?px;/g, '');	
					
					foreign = foreign.replace(/<body.*?>(.*?)<\/body>/g,"$1");
					
					foreign = foreign.replace(/(<iframe)(.*?<\/iframe>)/g,"$1 xmlns=\"http://www.w3.org/1999/xhtml\"$2");
					
					svgText = svgText.replace(array_iframe[key], foreign);
					
	 				all_sources[foreign] = imageUrl;
 					all_images[imageUrl] = {el: '', data: ''};
					
				} else {
					//alert('webpage:' + foreign);
					all_foreigns[foreign] = {el: '', data: ''};
				}
			} 
		}
		
		var svg = $(jMap.work).find('svg')[0];
		
		var bbox = svg.getBBox();
		//alert('after1: ' + bbox.x + ' ' + bbox.y);
		
		//FIX for SAFARI
		var bounds = {
			    minX:Number.MAX_VALUE, minY:Number.MAX_VALUE,
			    maxX:Number.MIN_VALUE, maxY:Number.MIN_VALUE,
			    expandBy: function(box) {
			    this.minX = Math.min(this.minX, box.x);
			    this.minY = Math.min(this.minY, box.y);
			    this.maxX = Math.max(this.maxX, box.x + box.width);
			    this.maxY = Math.max(this.maxY, box.y + box.height);
			    },
			    width: function() { return this.maxX - this.minX; },
			    height: function() { return this.maxY - this.minY; }
			};
		
		RAPHAEL.forEach(function(el) {
			if (el.node.style.display != "none") {
				var bb = el.getBBox();
				if (bb.width > 0 && bb.height > 0)
					bounds.expandBy(bb);
			}
		});
		
		//alert('after2: ' + bounds.minX + ' ' + bounds.minY);
		bbox.x = bounds.minX;
		bbox.y = bounds.minY;
		bbox.width = bounds.width();
		bbox.height = bounds.height();

		//END FIXED For SAFARI
		
		var margin = 10;		
		svgText = svgText.replace(/(<svg.*? width=")(.*?)(")/i, "$1" + (bbox.width + 2*margin) + "$3");
		svgText = svgText.replace(/(<svg.*? height=")(.*?)(")/i, "$1" + (bbox.height + 2*margin) + "$3");

		//remove old viewBox
		svgText = svgText.replace(/(<svg.*? )(viewBox=".*?")/i, "$1");
		
		svgText = svgText.replace(/(<svg.*?)>/i, '$1 viewBox="' + (bbox.x-margin) + " " + (bbox.y-margin) + " " + (bbox.width+2*margin) + " " + (bbox.height+2*margin) + '">');		
		
		$.each($(svg).find('image'), function(k, img) {
			var src = $(img).attr('href');
			all_images[src] = {el: '', data: ''};
		});
		
		$.each($(svg).find('img'), function(k, img) {
			var src = $(img).attr('src');
			all_images[src] = {el: '', data: ''};
		});

		var webpage_reg = /<foreignObject.*?<body.*?<div[^]*?<\/div><\/body><\/foreignObject>/gi;;
		var array_webpage = svgText.match(webpage_reg);

		//Convert image to DataURL
		
		var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		function getDataUri(url, el) {
			var dfd = $.Deferred();
			var image_url = url;
			var get_url = '';
			
		    var regex = /.*(\.bmp|\.jpeg|\.wbmp|.\gif|\.png|\.jpg)$/i;
			if (!regex.test(image_url)) { //image format is not support by Java ImageIO
				image_url = jMap.cfg.contextPath + "/images/image_broken.png";
			}			
			
			if (!image_url.startsWith("http")) {
				image_url = full + image_url;
				//alert(image_url);
			}
			
			get_url = jMap.cfg.contextPath + "/mindmap/convert.do?url=" + image_url; 

			$.get(get_url, function( data ) {
				  all_images[url].data = "data:image/png;base64," + data;
			      dfd.resolve('ok');
				});
	        return dfd.promise();
		}
		
		function getSnapshot(fobj) {
			var dfd = $.Deferred();
			//alert('get ' + fobj);
			var src = fobj;
			
			var foreign_width = fobj.replace(/<foreignObject.*?width="(.*?)"[^]*/i, "$1");				
			var foreign_height = fobj.replace(/<foreignObject.*?height="(.*?)"[^]*/i, "$1");				

			var div_scale = fobj.replace(/[^]*?<div.*?scale\((.*?)\)[^]*/gi, "$1");
			div_scale = parseFloat(div_scale);
			if (isNaN(div_scale))
				div_scale = 1.0;
			
			//remove foreignobject, body
			fobj = fobj.replace(/<foreignObject.*?>/gi, "");
			fobj = fobj.replace(/<\/foreignObject>/gi, "");

			fobj = fobj.replace(/<body.*?>/gi, "");
			fobj = fobj.replace(/<\/body>/gi, "");

			fobj = fobj.replace(/scale\(.*?\)/gi, "scale(1)");


			fobj = fobj.replace(/(<img[^]*? src=")(.*?)(")/i, function(m, p1, p2, p3) {
				if (p2.startsWith("data:"))
					return m;
				
				return p1 + all_images[p2].data + p3;
			});
			
			var div = document.createElement("div");
			div.innerHTML = fobj;
			$(div).css("width", foreign_width/div_scale);
			$(div).css("height", foreign_height/div_scale);
			document.body.appendChild(div);
			
			//alert('before render:' + fobj);

			html2canvas([div], {
				onrendered: function (canvas) {
					try {
						//alert('render ' + src);
						//alert(all_foreigns[src].data);
						
						all_foreigns[src].data = canvas.toDataURL("image/png");
						
						document.body.removeChild(div);
						
						dfd.resolve();

					} catch(e) {
						alert(e.message);
					}
			  	}
			});
			//alert('dfd');
	        return dfd.promise();
		}
		
		var defers     = [];
		for (var src in all_images) {
			if (!src.startsWith("data:"))
				defers.push(getDataUri(src, all_images[src].el));				
		}
		
		//image embeded
		var image_reg = /<image[^]*?<\/image>/gi;
			
		$.when.apply($, defers).done(function() { //all images are loaded

			//alert("imaged loaded done!");
			svgText = svgText.replace(image_reg, function (match) {
				var image = match;
				//alert('process: ' + image);
				//resolve src of image tag.
				
				image = image.replace(/(<image[^]*? xlink:href=")(.*?)("[^]*?>)/i, function(m, p1, p2, p3) {
					if (p2.startsWith("data:"))
						return m;
					
					return p1 + all_images[p2].data + p3;
				});
				
				return image;
			});
			
			var snapshot_defers = [];
			for (var fobj in all_foreigns) {
				//alert('snaphsot:' + fobj);
				snapshot_defers.push(getSnapshot(fobj));
			}
			
			$.when.apply($, snapshot_defers).done(function() { //all snaphot are taken
				svgText = svgText.replace(iframe_reg, function (match) {
					
					var foreign = match;
					var foreign_width = foreign.match(/<foreignObject.*?width\=".*?\"/gi)[0].match(/width\=".*?\"/gi)[0];				
					var foreign_height = foreign.match(/<foreignObject.*?height\=".*?\"/gi)[0].match(/height\=".*?\"/gi)[0];
					var foreign_x = foreign.match(/<foreignObject.*?x\=".*?\"/gi)[0].match(/x\=".*?\"/gi)[0];				
					var foreign_y = foreign.match(/<foreignObject.*?y\=".*?\"/gi)[0].match(/y\=".*?\"/gi)[0];				

					if (all_foreigns[match] === undefined) {
						var src = all_sources[foreign];
						if (src === undefined || all_images[src] === undefined)
							return match;
						var ifr_img = '<image ' + foreign_x + ' ' + foreign_y + ' ' + foreign_width + ' ' + foreign_height +
							' preserveAspectRatio="none" xlink:href="' + all_images[src].data + '" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;"></image>' +						
							match;
						return ifr_img;
					}
					
					img_data = all_foreigns[match].data;
					var img = '<image ' + foreign_x + ' ' + foreign_y + ' ' + foreign_width + ' ' + foreign_height +
							' preserveAspectRatio="none" xlink:href="' + img_data + '" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;"></image>';
					
					return img;
				});
			
				callback(svgText, bbox.width, bbox.height); //callback
			});
		});		
	};
	
	var exportToText = function() {
		_gaq.push(['_trackEvent', 'Export', 'Text']);
		
		var text = jMap.createTextFromNode(jMap.getRootNode(), "\t");
		
		var frm = document.getElementById("text_export");
		frm.id.value = mapId,
		frm.ext.value = "txt",
		frm.text.value = Base64.encode( escape(text) );
		frm.submit();
	};
	
	var exportToDoc = function() {
		_gaq.push(['_trackEvent', 'Export', 'DOC']);
		
		var text = jMap.createTextFromNode(jMap.getRootNode(), "\t");
		
		var frm = document.getElementById("text_export");
		frm.id.value = mapId,
		frm.ext.value = "doc",
		frm.text.value = Base64.encode( escape(text) );
		frm.submit();
	};
	
	var exportToHwp = function(node) {
		_gaq.push(['_trackEvent', 'Export', 'HWP']);
		
		var text = jMap.createTextFromNode(jMap.getRootNode(), "\t");
		
		var frm = document.getElementById("text_export");
		frm.id.value = mapId,
		frm.ext.value = "hwp",
		frm.text.value = Base64.encode( escape(text) ); 
		frm.submit();
	};
	
	var exportToLatex = function(node) {
		_gaq.push(['_trackEvent', 'Export', 'Latex']);
		
		var text = jMap.createTextFromNode(jMap.getRootNode(), "\t");
		
		var frm = document.getElementById("text_export");
		frm.id.value = mapId,
		frm.ext.value = "ltx",
		frm.text.value = Base64.encode( escape(text) ); 
		frm.submit();
	};
	
	var exportToPNG = function() {
		_gaq.push(['_trackEvent', 'Export', 'PNG']);

		function savePNG() {			
 			var cnvs = document.getElementById('svgcanvas');
 		    if(!cnvs) return;
 			var a = document.createElement("a");
 			a.download = "<c:out value="${data.map.name}"/>" + ".png";
 			a.href = cnvs.toDataURL("image/png");
 			a.click();
 		}
		
		//export to SVG and then render SVG on a canvas. Finally export to PNG.
		toSVGString(function (svgText, width, height) {
			width = width*jMap.cfg.scale;
			height = height*jMap.cfg.scale;
			
			svgText = svgText.replace(/(<svg.*? width=")(.*?)(")/i, "$1" + width + "$3");
			svgText = svgText.replace(/(<svg.*? height=")(.*?)(")/i, "$1" + height + "$3");
			
	 		canvg(document.getElementById('svgcanvas'), svgText, { 
	 			ignoreMouse: true, 
	 			ignoreAnimation: true, 
	 			offsetX: 0, 
	 			offsetY: 0, 
	 			useCORS: true, 
	 			renderCallback: savePNG,
	 			log: false
	 		});			
		});
	};

		// 			var fname = 'picture';
		 
		// 			var data = cnvs.toDataURL("image/png");
		// 			data = data.substr(data.indexOf(',') + 1).toString();
	
		// 			var svgform = document.getElementById("svg_export") ;
		// 			svgform.svg.value =  data;
		// 			svgform.type.value =  'png';
		// 			svgform.id.value =  mapId;
		// 			svgform.submit() ;

		
// 		// 추가정보
// 		var re_xlink = /(xmlns=["]http[:][/]+www[.]w3[.]org[/]2000[/]svg["])/gi;
// 		svgText = svgText.replace(re_xlink, '$1 xmlns:xlink="http://www.w3.org/1999/xlink"');		
// 		// 이미지 태그의 href에 xlink
// 		var re_href = /( href=)/gi;
// 		svgText = svgText.replace(re_href, ' xlink:href=');		
// 		// closing Tag가 없는것들..
// 		var re_param = /(<param[^>]*)/gi;
// 		svgText = svgText.replace(re_param, "$1/");
// 		var re_embed = /(<embed[^>]*)/gi;
// 		svgText = svgText.replace(re_embed, "$1/");
// 		/*
// 		if (BrowserDetect.browser == "Firefox"){
// 			var re_image = /(<image[^>]*)/gi;
// 			svgText = svgText.replace(re_image, "$1/");
// 		}*/
		
// 		var iframe_reg = /<foreignObject.*?<body.*?<iframe.*?<\/iframe><\/body><\/foreignObject>/g;

		
// 		var array_iframe = svgText.match(iframe_reg);
		
// 		if(array_iframe != null){
// 			for(var key = 0; key < array_iframe.length; key++ ){
				
// 				var foreign = array_iframe[key];
			
// 				foreign_width = foreign.match(/<foreignObject.*?width\=".*?\"/g)[0].match(/width\=".*?\"/g)[0];
// 				foreign = foreign.replace(/(<iframe.*?)(width\=\".*?\")(.*?)/g, "$1"+foreign_width+"$3");
				
// 				foreign_height = foreign.match(/<foreignObject.*?height\=".*?\"/g)[0].match(/height\=".*?\"/g)[0];
// 				foreign = foreign.replace(/(<iframe.*?)(height\=\".*?\")(.*?)/g, "$1"+foreign_height+"$3");
				
// 				foreign = foreign.replace(/margin-left:.*?px;margin-top:.*?px;/g, '');	
				
// 				foreign = foreign.replace(/<body.*?>(.*?)<\/body>/g,"$1");
				
// 				youtubeCheck = /youtube.com\/embed\/.*?\"/g;
				
// 				imageUrl = "xlink:";
				
// 				if(youtubeCheck.test(foreign)){
														
// 					youtybeUrl = foreign.match(youtubeCheck)[0]; 
// 					youtubeId = youtybeUrl.replace(/(youtube.com\/embed\/)(.*?)\"/g, "$2");
// 					imageUrl += 'href="http://img.youtube.com/vi/'+youtubeId+'/0.jpg"';
					
// 				}else{
// 					imageUrl += 'href="' + document.location.protocol + '//' + document.location.host +'/images/iframeimage.png"';
// 				}				
			
// 				foreign = foreign.replace(/<iframe.*?<\/iframe>/g,"");
								
// 				imageAtt = ' preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" '
// 						   + ' style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" '
// 						   + imageUrl;
				
// 				foreign = foreign.replace(/(<foreignObject)(.*?<\/foreignObject>)/g,"$1" + imageAtt + "$2");
				
// 				foreign = foreign.replace(/(<foreignObject)(.*?)(<\/foreignObject>)/g,"<image $2 </image>");
				
// 				svgText = svgText.replace(array_iframe[key], foreign);
				
// 			} 
			
// 		}
		
// 		function savePNG() {
						
// 			var cnvs = document.getElementById('svgcanvas');

// 		    if(!cnvs) return;

// // 			var fname = 'picture';
			 
// // 			var data = cnvs.toDataURL("image/png");
// // 			data = data.substr(data.indexOf(',') + 1).toString();

// // 			var svgform = document.getElementById("svg_export") ;
// // 			svgform.svg.value =  data;
// // 			svgform.type.value =  'png';
// // 			svgform.id.value =  mapId;
// // 			svgform.submit() ;

// 			var a = document.createElement("a");
// 			a.download = "fallback.png";
// 			a.href = cnvs.toDataURL("image/png");
// 			a.click();

// 		}
		
// 		canvg(document.getElementById('svgcanvas'), svgText, { 
// 			ignoreMouse: true, 
// 			ignoreAnimation: true, 
// 			offsetX: 0, 
// 			offsetY: 0, 
// 			useCORS: true, 
// 			renderCallback: savePNG,
// 			log: false
// 		}); 
//	};
	
	var createEmbedTag = function() {
		_gaq.push(['_trackEvent', 'Export', 'Embed']);
		
		var txt = '<form><div class="dialog_content"><table border="0">' +
		'<tr><td class="nobody" align="left"><spring:message code="common.width"/>:</td><td class="nobody">&nbsp;&nbsp;<input type="text" id="saveas_width" name="width" value="800" size="3"/></td>' +
		'<td class="nobody" align="left"><spring:message code="common.height"/>:</td><td class="nobody">&nbsp;&nbsp;<input type="text" id="saveas_heigth" name="height" value="600" size="3"/></td></tr>' +
		'<tr><td class="nobody" align="left"><spring:message code="message.mindmap.embed.menuview"/>:</td><td class="nobody">&nbsp;&nbsp;<input type="checkbox" name="menu" value="1"/></td>' +
		'<td class="nobody" align="left"><spring:message code="message.mindmap.embed.google"/>:</td><td class="nobody">&nbsp;&nbsp;<input type="checkbox" name="google" value="1"/></td></tr>' +
		'<tr><td class="nobody" align="left"><spring:message code="message.mindmap.embed.password"/>:</td><td class="nobody" colspan="3">&nbsp;&nbsp;<input type="text" name="password" value="" size="40"/></td></tr>' +
		'<tr><td class="nobody" align="left"><spring:message code="message.mindmap.embed.code"/></td><td class="nobody" colspan="3">&nbsp;&nbsp;<textarea id="embedcode" name="embedcode" cols="40" rows="5"></textarea></td></tr>' +
		'</table></div></form>';
	
		function EmbedTag_create(v,f) {
			var mapKey = "<c:out value="${data.map.key}"/>";
			if (v) {
				var onMenu = (f.menu) ? "on" : "off";
				var onGoogle = (f.google) ? "on" : "off";
				var passwd = (EmbedTag_trim(f.password).length > 0) ? "&password=" + EmbedTag_trim(f.password) : "";
				
				var url_prefix = document.location.protocol + '//' + document.location.host + jMap.cfg.contextPath;
				var code = '<embed src="' + url_prefix + '/map/' + mapKey + '?m=' + onMenu + '&g=' + onGoogle + passwd + '" width="' + f.width + '" height="' + f.height + '" ></embed>';
	
				var textarea = $('textarea#embedcode')[0];
				textarea.value = code;
			}
	
			return false;
		}
		function EmbedTag_trim(str) {
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
		/* var re = $.prompt(txt,{
			  submit: EmbedTag_create,
			  top : '30%',
			  buttons: { '<spring:message code="message.mindmap.embed.newcode"/>' : true }
		}); */
		
		$("#dialog").append(txt);
		var iframeWidth = $("#dialog .dialog_content").width();
		 
		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
			  	$("#dialog .dialog_content").remove();
				$("#dialog").dialog("destroy");
				jMap.work.focus();
			},
	    });
		$("#dialog").dialog("option", "width", "auto" );
		$("#dialog").dialog( "option", "buttons", [{
			text: "<spring:message code="message.mindmap.embed.newcode"/>", 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				EmbedTag_create(true, formValue); 
			} 
		}]);
		$("#dialog").dialog( "option", "dialogClass", "createEmbedTag" );		  
		$("#dialog").dialog( "option", "title", "<spring:message code="message.mindmap.embed.setting"/>" );
		$("#dialog").dialog("open"); 
	};
	
	
	var okmPreference = function() {
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/mindmap/mappreference.do?mapid='+mapId+'" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		var iframeWidth = $("#dialog iframe").width();
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy");
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "okmPreference" );
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.setting' />" );
		  $("#dialog").dialog("open");
	};
	
	var activityMonitoring = function() {
		var path = location.pathname;
		window.open(path.substring(0, path.indexOf('/map', 0)) + "/viewqueue.do?page="+location.pathname);
	};
	
	var CtrlRAction = function() {
		resetCoordinateAction();
	};
	
	function checkSave() {
		if(shouldSave && !jMap.isSaved()) {
			if(confirm("<spring:message code='message.mindmap.asksave'/>")) {
				saveMap(false);
			}
		}
	}
	
	function saveMap(bAsync, bSilent) {
		if(jMap.isSaved() && !shouldSave) {
			return;
		}

		<c:if test="${data.canEdit}">
			if(bSilent == null || bSilent == false) JinoUtil.waitingDialog("Saving Map");
			
			var params = {
				"mapId": mapId
			};
			postToURL("${pageContext.request.contextPath}/mindmap/timeline.do", params, onSaved, bAsync);
			
			function onSaved(http) {
				if(http.readyState == 4) {
					if(bSilent == null || bSilent == false) JinoUtil.waitingDialogClose();
					if(http.status == 200) {
						jMap.setSaved(true);
					} else {
//						document.write(http.responseText);
					}
				}
			}
		</c:if>
	}
	
	function saveAsMap() {
		_gaq.push(['_trackEvent', "Map", "Saveas"]);
		
		<c:choose>
		<c:when test="${ user == null || user.username == 'guest'}">
			alert("Please, Log in.");
		</c:when>
		<c:when test="${data.canEdit}">
			var txt = '<form><div class="dialog_content">' +
				'<br />' +
				'<spring:message code='common.title'/>:&nbsp;&nbsp;'+
		      	'<input type="text" id="saveas_title" name="title" value="" />' +
		      	'</div></form>';
		      	
			function callbackform_saveAs(v,f){
				if (v) {
					if( !isDuplicateMapName(f.title) ) {
						alert("<spring:message code='message.mindmap.new.duplicate.mapName'/>");
						$("#saveas_title").focus();
						return false;
					}
					if(f.title != ""){
						JinoUtil.waitingDialog("<spring:message code='message.saveas'/>");
						var params = {
								"title": f.title,
								"xml": Base64.encode( escape(jMap.toXML()) )
						};
						 $.ajax({
							type: 'post',
							dataType: 'json',
							async: false,
							url: '${pageContext.request.contextPath}/mindmap/saveAs.do',
							data: params,		
							success: onSaveAs,
							error: function(data, status, err) {
								alert("saveas error : " + status);
							}
					    });
					}else{
						alert("<spring:message code='map.new.enter_title'/>");
						$("#saveas_title").focus();
					}
					 
				}
			}
			function isDuplicateMapName(mapTitle) {
				var params = {
					"mapTitle": mapTitle
				};
				var returnV = false;
				$.ajax({
						type: 'post',
						url: "${pageContext.request.contextPath}/mindmap/isDuplicateMapName.do",
						dataType: 'json',
						data: params,
						async: false,
						success: function (data) {
							if(data.status == "ok") {
								returnV = true;
								
							} else {
								returnV = false;
								
							}
						}
					}
				);
				return returnV;
			}
			function onSaveAs(data, textStatus, jqXHR) {
				JinoUtil.waitingDialogClose();
					//var data = JSON.parse(http);
				document.location.href = data.redirect;
			}
	
			$("#dialog").append(txt);
			var iframeWidth = $("#dialog .dialog_content").width();
			 
			$("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
				  	$("#dialog .dialog_content").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
		    });
			$("#dialog").dialog("option", "width", "none" );
			$("#dialog").dialog( "option", "buttons", [{
				text: "<spring:message code='button.apply'/>", 
				click: function() {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					callbackform_saveAs(true, formValue); 
				} 
			}]);
			$("#dialog").dialog( "option", "dialogClass", "saveAsMap" );		  
			$("#dialog").dialog( "option", "title", "<spring:message code='message.saveas'/>" );
			$("#dialog").dialog("open");  
			  
		</c:when>
		<c:otherwise>
			alert("<spring:message code='common.nogrant'/>");
		</c:otherwise>
		</c:choose>
	}
	
	function changeMapName() {
		_gaq.push(['_trackEvent', "Map", "Rename"]);
		
		<c:choose>
		<c:when test="${ user == null || user.username == 'guest'}">
			alert("<spring:message code='common.pleaselogin'/>");
		</c:when>
		<c:when test="${data.canEdit}">
			var txt = '<form><div class="dialog_content">' +
				'<br />' +
				'<spring:message code="message.mindmap.newname"/> :&nbsp;&nbsp;'+
		      	'<input type="text" id="changemapname_title" name="title" value="" />' +
		      	'</div></form>';
			function callbackform_changeMapName(v,f){
				if (v) {
					if( !isDuplicateMapName(f.title) ) {
						alert("<spring:message code='message.mindmap.new.duplicate.mapName'/>");
						$("#changemapname_title").focus();
						return false;
					}
					if(f.title != ""){
						JinoUtil.waitingDialog("<spring:message code='menu.mindmap.changntitle'/>");
						var params = {
								"mapId": mapId,
								"title": f.title
							};
						postToURL("${pageContext.request.contextPath}/mindmap/changeMap.do", params, onChangeMapName, true);
						location.reload(true);
					}else{
						alert("<spring:message code='map.new.enter_title'/>");
						$("#changemapname_title").focus();
					}
				}
			}
			function isDuplicateMapName(mapTitle) {
				var params = {
					"mapTitle": mapTitle
				};
				var returnV = false;
				$.ajax({
						type: 'post',
						url: "${pageContext.request.contextPath}/mindmap/isDuplicateMapName.do",
						dataType: 'json',
						data: params,
						async: false,
						success: function (data) {
							if(data.status == "ok") {
								returnV = true;
								
							} else {
								returnV = false;
								
							}
						}
					}
				);
				return returnV;
			}
			function onChangeMapName(http) {
				if(http.readyState == 4) {
					JinoUtil.waitingDialogClose();

					if(http.status == 200) {
						var responseText = http.responseText;
						var data = JSON.parse(responseText);
						mapName = convertHexNCR2Char(data.name);
						document.title = mapName;
						$("#ribbon .maptitle").text(mapName);
					} else {
					}
				}
				
			}
			
			$("#dialog").append(txt);
			 
			$("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
				  	$("#dialog .dialog_content").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
		    });
			$("#dialog").dialog("option", "width", "none" );
			$("#dialog").dialog( "option", "buttons", [{
				text: "<spring:message code='button.apply'/>", 
				click: function() {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					callbackform_changeMapName(true, formValue); 
				} 
			}]);
			$("#dialog").dialog( "option", "dialogClass", "changeMapName" );		  
			$("#dialog").dialog( "option", "title", "<spring:message code="menu.mindmap.changntitle"/>" );
			$("#dialog").dialog("open");
			
		</c:when>
		<c:otherwise>
			alert("<spring:message code='common.nogrant'/>");
		</c:otherwise>
		</c:choose>
	}
	
	var splitMap = function() {
		_gaq.push(['_trackEvent', "Map", "Split"]);
		
		<c:choose>
		<c:when test="${ user == null || user.username == 'guest'}">
			alert("Please, Log in.");
		</c:when>
		<c:when test="${data.canEdit}">
			var node = jMap.selectedNodes.getLastElement();

			node.setFoldingExecute(false);

			if(node == null || node == undefined) {
				alert("<spring:message code='message.newnodemap.choosenode'/>");
				return;
			}

			if(node.isRootNode()) {
				alert("<spring:message code='message.newnodemap.rootrestriction'/>");
				return;
			}

			var tmpTitle = node.getText();
			var txt =
				'<form>' +
				'<div class="dialog_content">' +
				'<br />' +
				'<spring:message code="common.name"/> :&nbsp;&nbsp;'+
				'<input type="text" id="splitmap_title" name="title" value="' + tmpTitle + '" />' +
				'</div>' +
				'</form>';
			function callbackform_splitMap(v,f){
				if (v) {
					JinoUtil.waitingDialog("<spring:message code='menu.mindmap.newnodemap'/>");

					var params = {
							"title": f.title,
							"xml": Base64.encode( escape(node.toXML()) ),
							"link": document.location.href
						};
					
					$.ajax({
						type: 'post',
						dataType: 'json',
						async: false,
						url: '${pageContext.request.contextPath}/mindmap/splitMap.do',
						data: params,		
						success: onSplitMap,
						error: function(data, status, err) {
							alert("splitMap error : " + status);
						}
				    });
					
				}
			}
			
			function onSplitMap(data, textStatus, jqXHR) {
				var url = data.url;
				var node = jMap.selectedNodes.getLastElement();
				node.setHyperlink(url);

				var children = node.getChildren();
				if(children.length > 0){
					for(var k = children.length - 1; k >= 0; k--) {
						children[k].remove();
					}
				}

				jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
				jMap.layoutManager.layout(true);
						
				JinoUtil.waitingDialogClose();
				$("#dialog").dialog("close");
			}
			
			$("#dialog").append(txt);
			 
			$("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
				  	$("#dialog .dialog_content").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
		    });
			$("#dialog").dialog("option", "width", "none" );
			$("#dialog").dialog( "option", "buttons", [{
				text: "<spring:message code='button.apply'/>", 
				click: function() {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					callbackform_splitMap(true, formValue); 
				} 
			}]);
			$("#dialog").dialog( "option", "dialogClass", "splitMap" );		  
			$("#dialog").dialog( "option", "title", "<spring:message code="menu.mindmap.newnodemap"/>" );
			$("#dialog").dialog("open");
			
		</c:when>
		<c:otherwise>
			alert("<spring:message code='common.nogrant'/>");
		</c:otherwise>
		</c:choose>
	}
	
	function deleteMap(id) {
		_gaq.push(['_trackEvent', 'Map', 'Delete']);
		
		<c:choose>
			<c:when test="${data.canDelete}">
						var confirmed = confirm("<spring:message code='message.delete.confirm'/>");
						if(confirmed) {
							JinoUtil.waitingDialog("Deleting Map");

							shouldSave = false;
							document.location.href = "${pageContext.request.contextPath}/mindmap/delete.do?del_map=" + id<c:if test="${data.sid != 0}">+ "&sid=<c:out value="${data.sid}"/>"</c:if>;

						}

			</c:when>
			<c:otherwise>
						alert("<spring:message code='message.mindmap.cannotdelete'/>");
			</c:otherwise>
		</c:choose>
	}
	
	var googleSearch = function () {
		_gaq.push(['_trackEvent', 'Search', 'Google']);
		
		var checked = $("#googleSearch").attr("folding-stat");
		var el = $('#text_search');
		if(checked != 0){
			el.hide();
			$("#googleSearch").attr('folding-stat', 0);
		} else {
			if(el.length == 0) {
				var textSearch = $('<div id="text_search"><iframe id="mashup_iframe" width="300px" height="100%" frameborder="no" allowtransparency="true" src="${pageContext.request.contextPath}/media/text.do?type=google"></iframe></div>'); 
				$('#main').after(textSearch);
				var textSearchResize = function() {
					var el = $('#text_search'); 
					//var wm_y = $(window).height() - parseInt(el.css('height'));
					//el.css('top', wm_y);
					//el.css('left', 0);
					var wm_x = $(window).width() - parseInt(el.css('width'));
					el.css('top', "176px");
					el.css('left', wm_x);
				}
				textSearchResize();
				$(window).resize(textSearchResize);				
			} else {
				el.show();
			}
		$("#googleSearch").attr('folding-stat', 1);
		}

	};	
	
	var changeMapBackgroundAction = function () {
		jMap.controller.changeMapBackground();
		_gaq.push(['_trackEvent', 'Map', 'changeMapBackground']);
	};

	var nodeColorMix = function () {
		NodeColorMix(jMap.rootNode);
		
		_gaq.push(['_trackEvent', 'Map', 'nodeColorMix']);
	};
	
	var nodeLineColor = function () {
		
		jMap.controller.nodeLineColor();
		_gaq.push(['_trackEvent', 'Map', 'nodeLineColor']);
		
	};
	
	var changeToMindmap = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Mindmap']);
		
		jMap.setLayoutManager(new jMindMapLayout(jMap));
	}
	var changeToTree = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Tree']);
		
		jMap.setLayoutManager(new jTreeLayout(jMap));
	}
	var changeToFishbone = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Fishbone']);
		
		jMap.setLayoutManager(new jFishboneLayout(jMap));
	}
	var changeToTable = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Table']);
		
		jMap.setLayoutManager(new jTableLayout(jMap));
	}
	var changeToRotate = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Ratate']);
		
		jMap.setLayoutManager(new jRotateLayout(jMap));
	}
	var changeToBrain = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Brain']);
		
		jMap.setLayoutManager(new jBrainLayout(jMap));
	}
	
	var changeToSunburst = function() {
		_gaq.push(['_trackEvent', 'Layout', 'Sunburst']);
		
		jMap.setLayoutManager(new jSunburstLayout(jMap));
	}
	var changeToZoomableTreemap = function() {
		_gaq.push(['_trackEvent', 'Layout', 'ZoomableTreemap']);
		
		jMap.setLayoutManager(new jZoomableTreemapLayout(jMap));
	}

	var changeToPadlet = function() {
		
		function saveLocation(node) {
			if (!node)
				return;
			
			if (node.attributes['padlet_x'] == undefined || node.attributes['padlet_y'] == undefined) {
				var loc = node.getLocation();
				//alert(node.plainText + ' x:' + loc.x + ' y: ' + loc.y);
				node.attributes['padlet_x'] = loc.x;
				node.attributes['padlet_y'] = loc.y;
				jMap.saveAction.editAction(node);
			}			

			if (node.folded == "false" || node.folded == false) {
				//var children = node.getUnChildren();
				var children = node.getChildren();
				if (children != null && children.length > 0) {
					for (var i = 0; i < children.length; i++) {
						saveLocation(children[i]);
					}
				}
			}

		}
		
		var root = jMap.getRootNode();
		
		//unfold all nodes for location
		root.setFoldingAll(false);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(false);

		//save location nodes
		saveLocation(root);
		
		
		_gaq.push(['_trackEvent', 'Layout', 'Padlet']);
		
		jMap.setLayoutManager(new jPadletLayout(jMap));
		
	}

	var undoAction = function () {
		jMap.controller.undoAction();
	};
	var redoAction = function () {
		jMap.controller.redoAction();
	};
	var foldingAction = function () {
		jMap.controller.foldingAction();
	};
	var foldingAllAction = function () {
		jMap.controller.foldingAllAction();
	};
	var unfoldingAllAction = function () {
		jMap.controller.unfoldingAllAction();
	};
	var cutAction = function () {
		jMap.controller.cutAction();
	};
	var copyAction = function () {
		jMap.controller.copyAction();
	};
	var pasteAction = function () {
		jMap.controller.pasteAction();
	};
	var deleteAction = function () {
		jMap.controller.deleteAction();
	};			
	var editNodeAction = function () {
		jMap.controller.editNodeAction();
	};
	var ShiftenterAction = function () {
		jMap.controller.ShiftenterAction();
	};
	var insertAction = function () {
		jMap.controller.insertAction();
	};
	var insertSiblingAction = function () {
		jMap.controller.insertSiblingAction();
	};
	
	var insertTextOnBranchAction = function () {
		jMap.controller.insertTextOnBranch();
	};

	var addMoodleActivityAction = function(){
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/moodle/moodleActivity.do?mapid=${data.map.id}&mapkey=${data.map.key}" frameborder="0" allowtransparency="true" scrolling="yes"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "imageProviderAction" );
		  $("#dialog").dialog( "option", "title", "Add Moodle activity" );
		  $("#dialog").dialog("open");
	};
	
	var insertActivityAction = function(link, attributes){
		var node = jMap.getSelecteds().getLastElement();
		if(node){
			$("#dialog").dialog("close");
			J_NODE_CREATING = node;
			node.folded && node.setFolding(false);
			var param = {parent: node};
			var newNode = jMap.createNodeWithCtrl(param);
			if(attributes != undefined) newNode.attributes = attributes;
			if(link != undefined) newNode.setHyperlink(link);
			newNode.focus(true);
			
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
			jMap.layoutManager.layout(true);
			
			newNode.setTextExecute("");
			jMap.controller.startNodeEdit(newNode);
		}
	};
	
	var insertHyperAction = function () {
		_gaq.push(['_trackEvent', 'Node', 'Insert', 'Hyper Link']);
		
		jMap.controller.insertHyperAction();
	};
	//mobile hyperlink를 올리는 insertImageAction 에서 mobile 이미지를 올리는 insertImageAction으로 변경
	/* var insertImageAction = function () {
		_gaq.push(['_trackEvent', 'Node', 'Insert', 'Image']);
		
		jMap.controller.insertImageAction();
	}; */
	
	var insertImageAction = function(){
		var selected = jMap.getSelected();
		if(!jMap.isAllowNodeEdit(selected)) {
			return false;
		}
    /*     $.modal('<iframe src="${pageContext.request.contextPath}/media/image.do?mobile=true" frameborder="0" allowtransparency="true" width="100%"  height="100%" scrolling="no"></iframe>', {
                overlayId: 'okm-overlay',
                containerId: 'mashup_google_image-container',
                dataId: 'mashup_google_image-data'}); */
        
        $("#dialog").append('<iframe src="${pageContext.request.contextPath}/media/image.do?mobile=true" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "insertImageAction" );
		  $("#dialog").dialog( "option", "title", "<spring:message code='image.image_add'/>" );
		  $("#dialog").dialog("open");
	}
	var imageResizerAction = function () {
		_gaq.push(['_trackEvent', 'Node', 'Resize', 'Image']);
		
		jMap.controller.imageResizerAction();
	};
	var videoResizerAction = function (node) {
		_gaq.push(['_trackEvent', 'Node', 'Resize', 'Video']);
		
		jMap.controller.videoResizerAction();
	};
	var findNodeAction = function () {
		_gaq.push(['_trackEvent', 'Node', 'Find']);
		
		jMap.controller.findNodeAction();
	};
	
	var nodeStructureFromText = function () {
		_gaq.push(['_trackEvent', 'Node', 'Import', 'From Text']);
		
		jMap.controller.nodeStructureFromText();
	};
	var nodeStructureToText = function () {
		_gaq.push(['_trackEvent', 'Node', 'Export', 'To Text']);
		
		jMap.controller.nodeStructureToText();
	};
	var nodeStructureFromXml = function () {
		_gaq.push(['_trackEvent', 'Node', 'Import', 'From XML']);
		
		jMap.controller.nodeStructureFromXml();
	};
	var nodeStructureToXml = function () {
		_gaq.push(['_trackEvent', 'Node', 'Export', 'To XML']);
		
		jMap.controller.nodeStructureToXml();
	};
	
	var deleteArrowlinkAction = function() {
		jMap.controller.deleteArrowlinkAction();
	};
	
	var nodeTextColorAction = function() {
		_gaq.push(['_trackEvent', 'Node', 'Edit', 'Text Color']);
		
		jMap.controller.nodeTextColorAction();
	};
	var nodeBGColorAction = function() {
		_gaq.push(['_trackEvent', 'Node', 'Edit', 'Background Color']);
		
		jMap.controller.nodeBackgroundColorAction();
	};
	var resetCoordinateAction = function() {
		jMap.controller.resetCoordinateAction();		
	}
	
	var qrCodeAction = function() {
		jMap.controller.qrCodeAction();		
	}
	
	var videoProviderAction = function() {
		var selected = jMap.getSelected();
		if(!jMap.isAllowNodeEdit(selected)) {
			return false;
		}
		
		_gaq.push(['_trackEvent', 'Node', 'Insert', 'Video']);
		
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/media/video.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		var iframeWidth = $("#dialog iframe").width();
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	 	selectedNode = parent.jMap.getSelecteds().getLastElement();
					if(selectedNode.foreignObjEl !=null){
						selectedNode.foreignObjectResize(selectedNode.foreignObjEl.getAttribute("width"), selectedNode.foreignObjEl.getAttribute("height"));
					}
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy");
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "videoProviderAction" );
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.media.video'/>" );
		  $("#dialog").dialog("open");
	}
	
	var foreignObjRemoveAction = function() {
		jMap.controller.foreignObjRemoveAction();
	}
	
	var gotoLinkMount = function(){
		var selected = jMap.getSelected();
		return selected.hyperlink != null && (ISMOBILE || supportsTouch);
	}
	
	var gotoLinkAction = function() {
		var selected = jMap.getSelected();
		window.open(selected.hyperlink.attr().href,'_blank');
	};
	
	var imageProviderAction = function() {
		var selected = jMap.getSelected();
		if(!jMap.isAllowNodeEdit(selected)) {
			return false;
		}
		
		_gaq.push(['_trackEvent', 'Node', 'Insert', 'Image']);
		
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/media/image.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	selectedNode = parent.jMap.getSelecteds().getLastElement();
					if(selectedNode.img !=null){
						selectedNode.imageResize(selectedNode.img.attr().width, selectedNode.img.attr().height);
					}
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy");
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "imageProviderAction" );
		  $("#dialog").dialog( "option", "title", "<spring:message code='image.image_add'/>" );
		  $("#dialog").dialog("open");
	}
	
	var imageRemoveAction = function() {
		jMap.controller.imageRemoveAction();
	}
	
	var insertIFrameAction = function() {
		jMap.controller.insertIFrameAction();
	}
	//KHANG
	var insertWebPageAction = function() {
		jMap.controller.insertWebPageAction();
	}

	var insertLTIAction = function() {
		jMap.controller.insertLTIAction();
	}
	
	function close_dialog(callback) {
		//$("#dialog").dialog("close");
		callback();
	}
	
	var moreAddAction = function() {
		
		var node = jMap.getSelected();
		
		var txt = '<div class="dialog_content" ><br />';
		
		if (!node)
			return;
		
/*		if (node != null && !node.isRootNode()) {
			txt += '<div  class = "exportFile" onclick="nodeStructureToXml()"><img src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      	       '<div  class = "exportFile" onclick="nodeStructureToText()"><img src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}else{
			txt += '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      		   '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}
*/	
		
		if (jMap.cfg.canEdit) {
			txt += '<div  class = "exportFile" onclick="close_dialog(insertIFrameAction)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/edit_iframe.png"/><br/><spring:message code="menu.edit.iframe"/></div>' +     
	      		   '<div  class = "exportFile" onclick="close_dialog(insertWebPageAction)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/edit_webpage.png"/><br/><spring:message code="menu.edit.webpage"/></div>' +
				   '<div  class = "exportFile" onclick="close_dialog(insertLTIAction)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/edit_lti.png"/><br/><spring:message code="menu.edit.lti"/></div>';  
		}
      	
      	
   		txt += '</div>';
		$("#dialog").append(txt);
			
		$("#dialog").dialog({
		 autoOpen:false,
		    closeOnEscape: true,	//esc키로 창을 닫는다.
		    modal:true,		//modal 창으로 설정
		    resizable:false,	//사이즈 변경
		    close: function( event, ui ) {
		  	  	$("#dialog .dialog_content").remove();
		  		$("#dialog").dialog("destroy"); 
		    	},
		 //buttons:[ { text: "<spring:message code='button.apply'/>", click: function() {} } ],	//Apply 버튼 누를때 코드 필요
		 });
		  //open
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","exportFile");
		$("#dialog").dialog( "option", "title", "<spring:message code='menu.edit.more_add'/>" );
		$("#dialog").dialog("open");
	}
	
	var moreMapStyleAction = function() {
		
		var txt = '<div class="dialog_content" ><br />';
		
/*		if (node != null && !node.isRootNode()) {
			txt += '<div  class = "exportFile" onclick="nodeStructureToXml()"><img src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      	       '<div  class = "exportFile" onclick="nodeStructureToText()"><img src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}else{
			txt += '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/xmlicon.png"/><br/><span><spring:message code="menu.xmlimportexport.export"/></span></div>' +
	      		   '<div  class = "exportFile icon-disabled"><img class="icon-disabled" src="../images/icons/cliptexticon.png"/><br/><span><spring:message code="menu.textimportexport.export"/></span></div>';
		}
*/	
		
		if (jMap.cfg.canEdit) {
			txt += '<div  class = "exportFile" onclick="close_dialog(changeToFishbone)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/show_fishbone.png"/><br/><spring:message code="common.mapstyle.fishbone"/></div>' +     
	      		   '<div  class = "exportFile" onclick="close_dialog(changeToSunburst)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/show_sunburst.png"/><br/><spring:message code="common.mapstyle.sunburst"/></div>' +
	      		   '<div  class = "exportFile" onclick="close_dialog(changeToZoomableTreemap)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/show_zoomabletreemap.png"/><br/><spring:message code="common.mapstyle.zoomabletreemap"/></div>' +
				   '<div  class = "exportFile" onclick="close_dialog(changeToPadlet)"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/show_padlet.png"/><br/><spring:message code="common.mapstyle.padlet"/></div>';  
		}
      	
      	
   		txt += '</div>';
		$("#dialog").append(txt);
			
		$("#dialog").dialog({
		 autoOpen:false,
		    closeOnEscape: true,	//esc키로 창을 닫는다.
		    modal:true,		//modal 창으로 설정
		    resizable:false,	//사이즈 변경
		    close: function( event, ui ) {
		  	  	$("#dialog .dialog_content").remove();
		  		$("#dialog").dialog("destroy"); 
		    	},
		 //buttons:[ { text: "<spring:message code='button.apply'/>", click: function() {} } ],	//Apply 버튼 누를때 코드 필요
		 });
		  //open
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","exportFile");
		$("#dialog").dialog( "option", "title", "<spring:message code='menu.view.more_map_style'/>" );
		$("#dialog").dialog("open");
	}
	
	//KHANG
	/* Mobile */	
	var toggleMenu = function() {
		$('#mobile_menu').toggleFloaty({time: '0s'});
	}
	
	
	/**
	 * example -
	 * iconName : 'add.png'
	 * fncName : 'insertAction()'
	 */
	var addMobileIconMenu = function(iconName, fncName) {
		return '<div style="display: inline-block; width: 32px; height: 32px; margin: 5px 7px 5px 7px; background-image: url(\'${pageContext.request.contextPath}/images/mobile/'+iconName+'\')" onclick="'+fncName+'();"></div>';				
	}
	var insertBasketAction = function() {
		/*if($('#quick_sub_buttons').css('display') == 'none'){
			$('#quick_sub_buttons').css('display', 'block');
		} else {
			$('#quick_sub_buttons').css('display', 'none');
		}*/
		
		if($('#quick_sub_buttons_add').css('display') == 'block') {
			$('#quick_sub_buttons_add').css('display', 'none');			
		} else {
			$('#quick_sub_buttons_remove').css('display', 'none');
			$('#quick_sub_buttons_add').css('display', 'block');			
		}
	}
	var removeBasketAction = function() {
		/*if($('#quick_sub_buttons').css('display') == 'none'){
			$('#quick_sub_buttons').css('display', 'block');
		} else {
			$('#quick_sub_buttons').css('display', 'none');
		}*/
		
		if($('#quick_sub_buttons_remove').css('display') == 'block') {
			$('#quick_sub_buttons_remove').css('display', 'none');			
		} else {
			$('#quick_sub_buttons_add').css('display', 'none');
			$('#quick_sub_buttons_remove').css('display', 'block');
		}
	}
	
	
	
	var presentationStartMode = function() {
		EditorManager.start();
		_gaq.push(['_trackEvent', 'Presentation', 'start']);
	}
	
	/* Presentation */
	var presentationEditMode = function() {
		EditorManager.show();
		
		_gaq.push(['_trackEvent', 'Presentation', 'Edit']);
		
//		var checked = this.cfg.getProperty("checked");		
//		if(checked){
//			ScaleAnimate.endEditMode();
//			this.cfg.setProperty("text", "Start EditMode");
//			this.getNextSibling().cfg.setProperty("disabled", false);						
//		} else {
//			ScaleAnimate.startEditMode();
//			this.cfg.setProperty("text", "End EditMode");
//			this.getNextSibling().cfg.setProperty("disabled", true);			
//		}		
//		this.cfg.setProperty("checked", !this.cfg.getProperty("checked"));
	}
	
	/*
	var animateShowMode = function() {
		var checked = this.cfg.getProperty("checked");		
		if(checked){
			ScaleAnimate.endShowMode();
		} else {			
			ScaleAnimate.startShowMode(30, 20, true);
		}		
		this.cfg.setProperty("checked", !this.cfg.getProperty("checked"));		
	}
	*/
	/*
	var mapStyleNormal = function() {
		var items = this.parent.getItems();
		for(var i = 0; i < items.length; i++){
			items[i].cfg.setProperty("checked", false);
		}
		this.cfg.setProperty("checked", true);
		
		ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFit;
		ScaleAnimate.startShowMode(30, 20, true);
	}
	var mapStyleZoom = function() {
		ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFitWithZoomInOut;
		ScaleAnimate.startShowMode(30, 20, true);
	}
	*/
	
	/* Scale */
	var zoominAction = function(times) {
		times = parseFloat(times);		
		if(!times || isNaN(times)) times = 0.1;
		jMap.scale(jMap.scaleTimes + times);
	}
	var zoomoutAction = function(times) {
		times = parseFloat(times);
		if(!times || isNaN(times)) times = 0.1;
		jMap.scale(jMap.scaleTimes - times);
	}
	var zoomnotAction = function() {
		jMap.scale(1);
	}
	
	/* collabDocument */
	var collabDocAction = function() {
		var selected = jMap.getSelected();
		var collabDoc = new collabDocument(jMap, selected);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	}
	
	var timelineMode = function() {
		_gaq.push(['_trackEvent', 'Map', "Timeline"]);
		
		location.href = "${pageContext.request.contextPath}/map/timeline/<c:out value="${data.map.key}"/>";
	}
	
	/* Facebook */
	var FacebookGetFeedAction = function() {
		_gaq.push(['_trackEvent', 'SNS', 'Import', 'Facebook']);
		
		FacebookService.getFeed();
	}
	var FacebookPostFeedAction = function() {
		_gaq.push(['_trackEvent', 'SNS', 'Post', 'Facebook']);
		
		var name = jMap.cfg.mapName;
		var link = (jMap.cfg.shortUrl)?jMap.cfg.shortUrl:window.location.href;
		FacebookService.postFeed(name, link);
	}
	var TwitterPostFeedAction = function() {
		_gaq.push(['_trackEvent', 'SNS', 'Post', 'Twitter']);
		
		alert("Under Construction");
	}
	
	var DeliciousAction = function() {
		_gaq.push(['_trackEvent', 'SNS', 'Import', 'Delicious']);
		
		Delicious2Service.getFeed();
	}
	
	var SendEmail = function(){
		var txt = '<form><div class="dialog_content"><table border="0">' +
		'<tr><td class="nobody" align="left">공유하실 분의 이메일을 입력해 주세요.</td></tr>' +
		'<tr><td class="nobody"><textarea id="email" name="email" cols="30" rows="5"></textarea></td></tr>' +
		'</table></div></form>';
		
		$("#dialog").append(txt);
		
		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
			  	$("#dialog .dialog_content").remove();
				$("#dialog").dialog("destroy");
				jMap.work.focus();
			},
	    });
		
		$("#dialog").dialog( "option", "buttons", [{
			text: "공유하기", 
			click: function() {
				
				var email = $("textarea#email").val();
				
				if(email != "" && email != null){
					$.ajax({
						type: 'post',
						dataType: 'json',
						async: false,
						url: '${pageContext.request.contextPath}/mindmap/sendmail.do',
						//data: {'email' : $("textarea#email").val() , 'url' : "http://open.jinotech.com:8088"+window.location.pathname},		
						data: {'email' : $("textarea#email").val() , 'url' : "${data.map.short_url}"},		
						success: function(data){
							alert("메일을 발송 했습니다.");
							$("#dialog .dialog_content").remove();
							$("#dialog").dialog("destroy");
						},
						error: function(data, status, err) {
							alert("send error : " + status);
						}
				    });
				}else{
					alert("email을 입력해 주세요.");
				}
			} 
		}]);
   	  //open
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","exportFile");
		$("#dialog").dialog( "option", "title", "email 공유하기" );
		$("#dialog").dialog("open");
		
	}
	
	var SendKaKao = function(){
		
		
	}
	
	// jqueryui defaults
	$.extend($.ui.dialog.prototype.options, { 
	    create: function() {
	        var $this = $(this);

	        // focus first button and bind enter to it
	        $this.parent().find('.ui-dialog-buttonpane button:first').focus();
	        $this.keypress(function(e) {
	            if( e.keyCode == $.ui.keyCode.ENTER ) {
	                $this.parent().find('.ui-dialog-buttonpane button:first').click();
	                return false;
	            }
	        });
	    } 
	});
</script>


