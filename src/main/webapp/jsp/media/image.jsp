<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Image</title>	
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/dialog.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.css" type="text/css" media="screen">
	
	<% // ${data.type}은 탭을 만들면서 주소로 보내진 type인데, 이 type으로 탭선택 CSS및 검색에 다이나믹하게 활용된다.
	   // 탭 선택 역시 ${data.type}으로 넘어온 값으로 된 id를 선택하게 된다. %>
	<style type="text/css">
		/* active tab uses a id name ${data.type}. its highlight is also done by moving the background image. */
		ul.tabs a#${data.type}, ul.tabs a#${data.type}:hover, ul.tabs li#${data.type} a {
		background-position: -420px -62px;		
		cursor:default !important; 
		color:#000 !important;
		}
	</style>
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	
	<c:choose>
		<c:when test="${data.type eq 'google'}">
		
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>	
		<script src="http://www.google.com/jsapi"></script>
		<script type="text/javascript">
			// Load Google Search Api
			google.load('search', '1');
			
			var selectedItem = null;
			var imageSearcher = null;
			
			var currentPage = 0;
			
			function OnLoad() {
				// 선택된 노드의 Text를 검색 단어로..
				var searchText = '';
				if(parent.jMap.getSelected())
					searchText = parent.jMap.getSelected().getText();
				document.getElementById("searchInput").value = searchText;
				
				////////////////////// Image /////////////////////////
				/*
				imageSearcher = new google.search.ImageSearch();
				//imageSearcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search.SAFESEARCH_OFF);
				imageSearcher.setResultSetSize(6);
				
				imageSearcher.setSearchCompleteCallback(this, function(searcher){
					var contentDiv = document.getElementById('dataview-content-image');
					contentDiv.innerHTML = '';
					
					alert('search xong ' + searcher.results.ength);
					
					if (searcher.results && searcher.results.length > 0) {					
						var results = searcher.results;
						
						var sepCount = 0;
						for (var i = 0; i < results.length; i++) {
							var result = results[i];							
							var imgContainer = document.createElement('div');
							imgContainer.className = "imgContainer"; 
							//imgContainer.style.border = "none";
							imgContainer.googleData = result;
							imgContainer.onclick = function(){
								selectedItem && (selectedItem.style.background = "none");
								this.style.background = "#b2bdc1";
								contentSelect(this);
								selectItemComplete();
							}
							imgContainer.ondblclick = function(){
								selectItemComplete();
							}
							
							var newImg = document.createElement('img');
							newImg.src = result.tbUrl;
							
							imgContainer.appendChild(newImg);
							contentDiv.appendChild(imgContainer);
						}
		
					}
					
				}, [imageSearcher]);				
				*/
				////////////////////// Image /////////////////////////

				// 검색
				imageSearch();
				
			}
			google.setOnLoadCallback(OnLoad);
			
			
			function imageSearchFrom(page) {
				$.ajax({
            		type: 'GET',
           			url: 'https://www.googleapis.com/customsearch/v1',
            		dataType: 'json',
            		data: {
                		'key' : 'AIzaSyCqhNd5-z2hAqEK1hSozv32AkFV88_TFjs',
                		'cx' : '006697568995703237209:vljrny3h45w',
                		'q' : document.getElementById("searchInput").value,
                		'searchType' : 'image',
                		'num' : 6,
                		'start' : page*6 + 1
            		},
            		success: function (response) {
            			var contentDiv = document.getElementById('dataview-content-image');
    					contentDiv.innerHTML = '';
    					
                		$.each(response.items, function(index, item) {
							var imgContainer = document.createElement('div');
							imgContainer.className = "imgContainer"; 
							//imgContainer.style.border = "none";
							imgContainer.googleData = {
									GsearchResultClass :"GimageSearch",
        							unescapedUrl : item.link
							};
							imgContainer.onclick = function() {
								selectedItem && (selectedItem.style.background = "none");
								this.style.background = "#b2bdc1";
								contentSelect(this);
								selectItemComplete();
							}
							imgContainer.ondblclick = function(){
								selectItemComplete();
							}
							var newImg = document.createElement('img');
							newImg.src = item.link;
							
							imgContainer.appendChild(newImg);
							contentDiv.appendChild(imgContainer);
                		});
            		},
            		error:function(request,status,error){
            	        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            	    }
                });
			}
			
			// 구글 검색시에 사용되는 일반적인 검색
			function imageSearch(){
				//imageSearcher.execute(document.getElementById("searchInput").value);
				currentPage = 0;
				imageSearchFrom(currentPage);
			}
			
			function contentSelect(el){			
				selectedItem = el;
			}
			
			function nextPage() {
				//var currentPageIndex = parseInt(imageSearcher.cursor.currentPageIndex)+1;			
				//imageSearcher.gotoPage(currentPageIndex);
				//document.getElementById("pageIndex").innerHTML = currentPageIndex+1;
				
				currentPage++;
				imageSearchFrom(currentPage);
			}
			
			function prevPage() {
				//var currentPageIndex = parseInt(imageSearcher.cursor.currentPageIndex)-1;
				//imageSearcher.gotoPage(currentPageIndex);
				//document.getElementById("pageIndex").innerHTML = currentPageIndex+1;
				
				if (currentPaget > 0) {
					currentPage--;
					imageSearchFrom(currentPage);
				}
			}
			
			function selectItemComplete(){
				var jMap = parent.jMap;
				var selected = jMap.getSelecteds().getLastElement();
				//var param = {parent: selected};
				//var newNode = jMap.createNodeWithCtrl(param);
				//selected.folded && selected.setFoldingExecute(false);
				
				if(selectedItem.googleData.GsearchResultClass == "GimageSearch") {
					selected.setImage(selectedItem.googleData.unescapedUrl);
				}
				
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
				jMap.layoutManager.layout(true);
				
				//parent.$("#dialog").dialog("close");
			}
			 
			function googleSearchEnter(e) {
				e = e || window.event;
				if(e.keyCode == 13) {
					imageSearch();
				}
			}
		</script>
		
		</c:when>
		<c:when test="${data.type eq 'fileupload'}">
		
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css" type="text/css" media="screen">
		<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
		    function uploadFile() {
				var frm = document.getElementById("frm_confirm");
				$.prompt('<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="${pageContext.request.contextPath}/images/wait16trans.gif"></td><td class="nobody">Uploading File</td><tr><td class="nobody">Please wait...</td></tr></table>', { buttons: {}, prefix:'jqismooth2', top : '40%' });
				frm.mapid.value = parent.jMap.cfg.mapId;
				frm.submit();
			}
		    function cancel(){
				parent.$("#dialog").dialog("close");
			}
	    </script>
	    
		</c:when>
		<c:when test="${data.type eq 'url'}">
		
		<script type="text/javascript">
		
			function urlCompleted(){
				var selected = parent.jMap.getSelected();
				var url = $('#jino_input_img_url').val();
				if(selectedNode.img !=null){
					selected.setImage(url,selectedNode.img.attr().width,selectedNode.img.attr().height);
				}else{
					selected.setImage(url);
				}
				parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
				parent.jMap.layoutManager.layout(true);
				parent.jMap.work.focus();
				
				//parent.$("#dialog").dialog("close");
			}
		
			function url_init(){
				var selected = parent.jMap.getSelected();				
				if(selected) {
					var urlImg = selected.imgInfo.href && selected.imgInfo.href;
					urlImg = urlImg || "http://";
					
					$('#jino_input_img_url').val(urlImg);
				}
			}
			$(document).ready( url_init );
			
			function cancel(){
				parent.$("#dialog").dialog("close");
			}
		</script>
		
		</c:when>
	</c:choose>
	<script type="text/javascript">
	
		var minimumSize = 50;
		var maximumSize = 700;
		
		//확인버튼
		imageAndLinkConfirm = function(){
			this.value = document.getElementById("rangeValue").value
			if((minimumSize <= this.value) && (this.value <= maximumSize)){
				$( "#sizeSlider" ).slider( "value", this.value);
				selectedNode.imageResize(this.value, Math.round(this.value * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
				
			}else if(this.value <= minimumSize){
				$( "#sizeSlider" ).slider( "value", minimumSize);
  				document.getElementById("rangeValue").value = minimumSize;
  				selectedNode.imageResize(minimumSize, Math.round(minimumSize * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
  				
  			}else if(maximumSize <= this.value){
  				$( "#sizeSlider" ).slider( "value", maximumSize);
  				document.getElementById("rangeValue").value = maximumSize;
  				selectedNode.imageResize(maximumSize, Math.round(maximumSize * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
  			}
		}
		
		//삭제버튼
		imageLinkDelete = function(){
			node = parent.jMap.getSelecteds().getLastElement();
			node.setImage();
			parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
			parent.jMap.layoutManager.layout(true);
		}
		
		//range값이 변하면 택스트 창에는 %로 표시하고 비디오창의 크기를 변경한다.
		$(document).ready(function() {
			selectedNode = parent.jMap.getSelecteds().getLastElement();

			if(selectedNode.img != undefined){
				NodeWidth = selectedNode.img.attr().width;
			}else{
				NodeWidth = parent.jMap.cfg.default_img_size;
			}
			
			document.getElementById("rangeValue").value = NodeWidth;
				
			//슬라이더를 그려주고 chang 이벤트를 등록
			$("#sizeSlider").slider({
				min:50, 
				max:700, 
				value:NodeWidth,
				slide: function(event, ui){
					var changValue = ui.value;					
					document.getElementById("rangeValue").value = changValue;
					if(selectedNode.img != undefined){
						selectedNode.imageResizeExecute(changValue, Math.round(changValue * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
					}
				}
			});
			
			//주소 입력에서 url에 사용자고 입력하고 enter키를 눌렀을때 이벤트
			$('#jino_input_img_url').keypress(function(event){
				if(event.charCode == 13)urlCompleted();
			});
			
			//rangeValue 에서 사용자가 입력하고 enter키를 눌렀을때 이벤트
			$('#contentSizeSet #rangeValue').keypress(function(event){
				if(event.charCode == 13){
					if((minimumSize <= this.value) && (this.value <= maximumSize)){
						$( "#sizeSlider" ).slider( "value", this.value);
						selectedNode.imageResize(this.value, Math.round(this.value * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
						
					}else if(this.value <= minimumSize){
						
						$( "#sizeSlider" ).slider( "value", minimumSize);
          				document.getElementById("rangeValue").value = minimumSize;
          				selectedNode.imageResize(minimumSize, Math.round(minimumSize * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
          				
          			}else if(maximumSize <= this.value){
          				
          				$( "#sizeSlider" ).slider( "value", maximumSize);
          				document.getElementById("rangeValue").value = maximumSize;
          				selectedNode.imageResize(maximumSize, Math.round(maximumSize * (selectedNode.img.attr().height / selectedNode.img.attr().width)));
          				
          			}
          			
				}else if((48 > event.charCode) || (event.charCode > 57)){
          			event.preventDefault();
				}
				
          		
			});
		});
	</script>
</head>
<body>
	<div style="padding-top:10px;padding-left:10px;">
	
	<div id="contentSizeSet"> 
		<div class="sizeTitle"><spring:message code='common.size'/>:</div> 
		<div id="sizeSlider"></div>
		<input type="text" class="rangeValue" id="rangeValue"/>
		<input type="button" name="button" value=<spring:message code='button.apply'/> onclick="imageAndLinkConfirm()"/>
		<input type="button" name="deletebutton" value=<spring:message code='button.imagedelete'/> onclick="imageLinkDelete()"/>
	</div>	
	
	<!-- the tabs --> 
	
	<ul class="tabs">
		<li><a id="url" href="${pageContext.request.contextPath}/media/image.do?type=url"><spring:message code='image.tabs.url'/></a></li>
		<li><a id="fileupload" href="${pageContext.request.contextPath}/media/fileupload.do?type=fileupload"><spring:message code='image.tabs.fileupload'/></a></li>
		<li><a id="google" href="${pageContext.request.contextPath}/media/image.do?type=google"><spring:message code='image.tabs.google'/></a></li>
	</ul> 

	<!-- tab "panes" -->
	<div class="panes">
		<c:choose>
			<c:when test="${data.type eq 'google'}">
				<div style="text-align: center;">
					<INPUT id="searchInput" type="text" value="" onkeypress="googleSearchEnter(event)" style="width: 80%">
					<INPUT id="searchButton" type="button" class="file_input" value="<spring:message code='image.image_search'/>" onClick="imageSearch()">
				</div>	
				<div id="dataview-content-image"></div>
				<br>
				<div style="text-align: center; margin-bottom:10px;">
					<input id="prevButton" type="button" class="image_btn" value="<spring:message code='image.prev'/>" onClick="prevPage()">&nbsp;&nbsp;&nbsp;<!-- <a id="pageIndex">1</a> -->&nbsp;&nbsp;&nbsp;<INPUT id="nextButton" type="button" class="image_btn" value="<spring:message code='image.next'/>" onClick="nextPage()">
				</div>
			</c:when>
			<c:when test="${data.type eq 'fileupload'}">
			
			<div id='fileupload'>
				<form id="frm_confirm" action="${pageContext.request.contextPath}/media/fileupload.do" method="post" enctype="multipart/form-data">
					<input type="hidden" name="confirm" value="1"/>
					<input type="hidden" name="mapid"/>
					<div id='popcontent'>
						<!-- <input type="text" id="fileName" class="file_textbox" readonly="readonly" style="float:left;"> -->
						<div class="file_input_div">
						<!--  <input type="button" value="<spring:message code='image.image_search'/>" class="file_input" />-->
						<input type="file" name="file" class="file_input_hidden" capture="camera" accept="image/*" onchange="javascript: document.getElementById('fileName').value = this.value" />
						</div>
		    		</div>
					<br>
					<div style="margin-top: 20px; margin-bottom:10px; text-align:center;">
						<a href="#" onClick="uploadFile();"><input type="button" class="create_btn" value="<spring:message code='image.image_upload'/>" /></a>
						<input type="button" class="create_btn" value="<spring:message code='common.cancel' />" onclick="cancel();" />
					</div>
				</form>
			</div>
			
			</c:when>
			<c:when test="${data.type eq 'url'}">
			
			URL:
			<br />
			<input type="text" id="jino_input_img_url" name="jino_input_img_url" style="width:500px;" value=""/>
			<input type="button" name="button" value=<spring:message code='button.confirm'/> onclick="urlCompleted()"/>
			</c:when>
		</c:choose>
	</div>
</div>
</body>
</html>