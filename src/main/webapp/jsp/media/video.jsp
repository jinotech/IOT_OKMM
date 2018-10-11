<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%
String useragent = (String)request.getAttribute("agent");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title><spring:message code='video.video_upload'/></title>	
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
			//var videoSearcher = null;
			
			var prevPageToken = null;
			var nextPageToken = null;
			
			function OnLoad() {
				// 선택된 노드의 Text를 검색 단어로..
				var searchText = '';
				if(parent.jMap.getSelected())
					searchText = parent.jMap.getSelected().getText();
				document.getElementById("searchInput").value = searchText;
				
				////////////////////// Video /////////////////////////
				/*
				videoSearcher = new google.search.VideoSearch();
				//videoSearcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search.SAFESEARCH_OFF);
				videoSearcher.setResultSetSize(8);

				videoSearcher.setSearchCompleteCallback(this, function(searcher){
					var contentDiv = document.getElementById('dataview-content-video');
					contentDiv.innerHTML = '';
					
					if (searcher.results && searcher.results.length > 0) {
						var results = searcher.results;
						
						for (var i = 0; i < results.length; i++) {
							var result = results[i];						
							var videoContainer = document.createElement('div');
							videoContainer.className = "videoContainer";						
							videoContainer.googleData = result;
							videoContainer.onclick = function(){
								selectedItem && (selectedItem.style.background = "none");
								this.style.background = "#b2bdc1";
								contentSelect(this);
								selectItemComplete();
							}
							videoContainer.ondblclick = function(){
								selectItemComplete();
							}
							
							var newImg = document.createElement('img');
							newImg.src = result.tbUrl;
							
							videoContainer.appendChild(newImg);						
							contentDiv.appendChild(videoContainer);
						}
		
					}
				}, [videoSearcher]);
				*/
				////////////////////// Video /////////////////////////
								
				// 검색
				videoSearch();
				
			}
			google.setOnLoadCallback(OnLoad);
			
			function videoSearchFrom(page) {
				$.ajax({
            		type: 'GET',
           			url: 'https://www.googleapis.com/youtube/v3/search',
            		dataType: 'json',
            		data: {
                		'key' : 'AIzaSyCqhNd5-z2hAqEK1hSozv32AkFV88_TFjs',
                		'cx' : '006697568995703237209:vljrny3h45w',
                		'q' : document.getElementById("searchInput").value,
                		'type' : 'video',
                		'part' : 'snippet',
                		'maxResults' : 8,
                		'pageToken' : page
            		},
            		success: function (response) {
    					var contentDiv = document.getElementById('dataview-content-video');
    					contentDiv.innerHTML = '';
    					nextPageToken = response.nextPageToken;
    					prevPageToken = response.prevPageToken;
    					
                		$.each(response.items, function(index, item) {
							var videoContainer = document.createElement('div');
							videoContainer.className = "videoContainer";						
							videoContainer.googleData = {
									//KHANG
									GsearchResultClass : "GvideoSearch",
        							playUrl : "https://www.youtube.com/watch?v=" + item.id.videoId
							};
							videoContainer.onclick = function(){
								selectedItem && (selectedItem.style.background = "none");
								this.style.background = "#b2bdc1";
								contentSelect(this);
								selectItemComplete();
							}
							videoContainer.ondblclick = function(){
								selectItemComplete();
							}
							
							var newImg = document.createElement('img');
							newImg.src = item.snippet.thumbnails.default.url;
							
							videoContainer.appendChild(newImg);						
							contentDiv.appendChild(videoContainer);
                		});
            		}
                });
			}
			
			
			// 구글 검색시에 사용되는 일반적인 검색
			function videoSearch(){
				//videoSearcher.execute(document.getElementById("searchInput").value);
				videoSearchFrom("");
			}
	
			//////////// 다음 함수들은 공통적으로 사용하는 함수 ///////////////
			function contentSelect(el){			
				selectedItem = el;
			}
			
			function nextPage(){
				//var currentPageIndex = parseInt(videoSearcher.cursor.currentPageIndex)+1;			
				//videoSearcher.gotoPage(currentPageIndex);
				//document.getElementById("pageIndex").innerHTML = currentPageIndex+1;
				
				videoSearchFrom(nextPageToken);
			}
			function prevPage(){
				//var currentPageIndex = parseInt(videoSearcher.cursor.currentPageIndex)-1;
				//videoSearcher.gotoPage(currentPageIndex);
				//document.getElementById("pageIndex").innerHTML = currentPageIndex+1;

				videoSearchFrom(prevPageToken);
			}
			
			function selectItemComplete(){
				var jMap = parent.jMap;
				var selected = jMap.getSelecteds().getLastElement();
				//var param = {parent: selected};
				//var newNode = jMap.createNodeWithCtrl(param);
				//selected.folded && selected.setFoldingExecute(false);
				
				if (selectedItem.googleData.GsearchResultClass == "GvideoSearch") {
					var playUrl = selectedItem.googleData.playUrl;
					selected.setYoutubeVideo(playUrl);
				}
				
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
				
			//	parent.$("#dialog").dialog("close");
			}
			
			function googleSearchEnter(e) {
				e = e || window.event;
				if(e.keyCode == 13) {
					videoSearch();
				}
			}
			//////////////// 공통적으로 사용하는 함수 끝 //////////////////////////				
	</script>
	</c:when>
	<c:when test="${data.type eq 'url'}">
		<script type="text/javascript">
			function urlCompleted(){
				var selected = parent.jMap.getSelected();
				var playUrl = $('#jino_input_video_url').val();
				$.ajax({
					type: 'post',
					dataType: 'jsonp',
					async: false,
					url: 'http://api.longurl.org/v2/expand?url='+encodeURIComponent(playUrl)+'&format=json',
					success: function(data){
						var url = data['long-url'];
						if(url.indexOf('youtube') != -1) {
							if(selectedNode.foreignObjEl != null){
								selected.setYoutubeVideo(url,selectedNode.foreignObjEl.getAttribute("width"),selectedNode.foreignObjEl.getAttribute("height"));
							}else{
								selected.setYoutubeVideo(url);
							}
						} else {
							if(selectedNode.foreignObjEl !=null){
								selected.setVideo(url, selectedNode.foreignObjEl.getAttribute("width"),selectedNode.foreignObjEl.getAttribute("height"));
							}else{
								selected.setVideo(url);
							}
						}
						
						parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
						parent.jMap.layoutManager.layout(true);
						parent.jMap.work.focus();
						//parent.$("#dialog").dialog("close");
					},
					error: function(data, status, err) {
						alert("Video Embed Error");
					}
				});
			}
			/*
			function url_init(){
				var selected = parent.jMap.getSelected();				
				if(selected) {
					var urlImg = selected.imgInfo.href && selected.imgInfo.href;
					urlImg = urlImg || "http://";
					
					$('#jino_input_video_url').val(urlImg);
				}
			}
			$(document).ready( url_init );
			*/
			function cancel(){
				parent.$("#dialog").dialog("close");
			}
		</script>
		</c:when>
		<c:when test="${data.type eq 'embed'}">
		<script type="text/javascript">
			function embedCompleted() {
				var selected = parent.jMap.getSelected();
				var embedcode = $('#jino_video_embed').val();
				selected.setEmbedVideo(embedcode);
				
				parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
				parent.jMap.layoutManager.layout(true);
				parent.jMap.work.focus();
				parent.$("#dialog").dialog("close");
			}
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
		videoAndLinkConfirm = function(){
			//selectedNode.imageResize(selectedNode.foreignObjEl.getAttribute("width"), selectedNode.foreignObjEl.getAttribute("height"));
			var video_url= $("#jino_input_video_url").val();  
			if(video_url == null){
				selectItemComplete();
			}else{
				urlCompleted();
			}
			//parent.$("#dialog").dialog("close");
		}
		slidesize = function(){
			this.value = document.getElementById("rangeValue").value;
			if((minimumSize <= this.value) && (this.value <= maximumSize)){
				$( "#sizeSlider" ).slider( "value", this.value);
				selectedNode.foreignObjectResize(this.value, this.value);
				
			}else if(this.value <= minimumSize){
				
				$( "#sizeSlider" ).slider( "value", minimumSize);
  				document.getElementById("rangeValue").value = minimumSize;
  				selectedNode.foreignObjectResize(minimumSize, minimumSize);
  				
  			}else if(maximumSize <= this.value){
  				
  				$( "#sizeSlider" ).slider( "value", maximumSize);
  				document.getElementById("rangeValue").value = maximumSize;
  				selectedNode.foreignObjectResize(maximumSize, maximumSize);
  				
  			}
		}
		
		//삭제버튼
		videoAndLinkDelete = function(){
			node = parent.jMap.getSelecteds().getLastElement();
			node.setForeignObject("");
			node.setHyperlink("");
			parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
			parent.jMap.layoutManager.layout(true);
		}
		
		//range값이 변하면 택스트 창에는 %로 표시하고 비디오창의 크기를 변경한다.
	$(document).ready(function() {
			selectedNode = parent.jMap.getSelecteds().getLastElement();
			
			if(selectedNode.foreignObjEl != undefined){
				videoEmbedTag = selectedNode.foreignObjEl.getElementsByTagName("iframe")[0];
				if(videoEmbedTag != undefined){
					$("#jino_input_video_url").attr("value",videoEmbedTag.getAttribute("src"));
				}	
				
				NodeWidth = selectedNode.foreignObjEl.getAttribute("width");
				
			}else{
				
				NodeWidth = parent.jMap.cfg.default_video_size;
			}
			
			//$(".rangeValue").attr("value", NodeWidth);
			document.getElementById("rangeValue").value = NodeWidth;	
			
			//슬라이더를 그려주고 chang 이벤트를 등록
			$("#sizeSlider").slider({
				min:minimumSize, 
				max:maximumSize, 
				value:NodeWidth,
				slide: function(event, ui){
					var changValue = ui.value;
					document.getElementById("rangeValue").value = changValue;
					if(selectedNode.foreignObjEl != undefined){
						selectedNode.foreignObjectResizeExecute(changValue, Math.floor(changValue * (selectedNode.foreignObjEl.getAttribute("height")/selectedNode.foreignObjEl.getAttribute("width"))));
					}
				}
			});
			
			//주소 입력에서 url에 사용자가 입력하고 enter키를 눌렀을때 이벤트
			$('#jino_input_video_url').keypress(function(event){
				if(event.charCode == 13)urlCompleted();
			});
			
			//rangeValue 에서 사용자가 입력하고 enter키를 눌렀을때 이벤트
			$('#contentSizeSet #rangeValue').keypress(function(event){
				if(event.charCode == 13){
          			
					if((minimumSize <= this.value) && (this.value <= maximumSize)){
						
						$( "#sizeSlider" ).slider( "value", this.value);
						selectedNode.foreignObjectResize(this.value, this.value);
						
					}else if(this.value <= minimumSize){
						
						$( "#sizeSlider" ).slider( "value", minimumSize);
          				document.getElementById("rangeValue").value = minimumSize;
          				selectedNode.foreignObjectResize(minimumSize, minimumSize);
          				
          			}else if(maximumSize <= this.value){
          				
          				$( "#sizeSlider" ).slider( "value", maximumSize);
          				document.getElementById("rangeValue").value = maximumSize;
          				selectedNode.foreignObjectResize(maximumSize, maximumSize);
          				
          			}
          			
				}else if((48 > event.charCode) || (event.charCode > 57)){
          			event.preventDefault();
				}
				
          		
			});
		});
	</script>
	
</head>
<body>
	<!-- the tabs --> 
	
	<div style="padding-top:10px; padding-left:10px;">
	<div class="html5_notice"><spring:message code='video.html5'/></div>
	<div><a href="http://youtube.com/html5" class="youtube_link" target=""_blank>http://youtube.com/html5</a></div>
	
	<div id="contentSizeSet" > 
		<div class="sizeTitle"><spring:message code='common.size'/>:</div> 
		<div id="sizeSlider"></div>
		<input type="text" class="rangeValue" id="rangeValue"/>
		<input type="button" name="button" value=<spring:message code='button.apply'/> onclick="slidesize()"/>
		<input type="button" name="deletebutton" value=<spring:message code='button.videodelete'/> onclick="videoAndLinkDelete()"/>
	</div>	
	<ul class="tabs">
		<!-- <li><a id="url" href="${pageContext.request.contextPath}/media/video.do?type=url"><spring:message code='video.tabs.url'/></a></li> -->
		<!-- <li><a id="embed" href="${pageContext.request.contextPath}/media/video.do?type=embed"><spring:message code='video.tabs.embed'/></a></li> -->
		<li><a id="google" href="${pageContext.request.contextPath}/media/video.do?type=google"><spring:message code='video.tabs.google'/></a></li>
	</ul> 
	
	<!-- tab "panes" -->
	<div class="panes">
		<c:choose>
			<c:when test="${data.type eq 'url'}">
				URL:
				<br />
				<input type="text" id="jino_input_video_url" name="jino_input_video_url" style="width:500px;"/>
				<input type="button" name="button" value=<spring:message code='button.confirm'/> onclick="videoAndLinkConfirm()"/>
			</c:when>
			
			<c:when test="${data.type eq 'embed'}">
				Embed Code:
				<br />
				<textarea cols="70" rows="10" id="jino_video_embed" name="jino_video_embed" ></textarea>				
				
				<div style="margin-top:10px; margin-bottom:10px;">	
						<input name="video-url-button" id="video-url-button" type="button" class="video_btn" value="<spring:message code='button.confirm' />" onclick="embedCompleted()">
							
				</div>
			</c:when>
			
			<c:when test="${data.type eq 'google'}">
				<div style="text-align: center;">
					<INPUT id="searchInput" type="text" value="" onkeypress="googleSearchEnter(event)" style="width: 80%">
					<INPUT id="searchButton" type="button" class="file_input" value="<spring:message code='video.video_search'/>" onClick="videoSearch()">
				</div>
				<br>
				<div id="dataview-content-video" width = ""></div>
				<br>
				<div style="text-align: center;">
					<INPUT id="prevButton" type="button" class="video_btn" value="<spring:message code='video.prev'/>" onClick="prevPage()">&nbsp;&nbsp;&nbsp;<!-- <a id="pageIndex">1</a> -->&nbsp;&nbsp;&nbsp;<INPUT id="nextButton" type="button" class="video_btn" value="<spring:message code='video.next'/>" onClick="nextPage()">
				</div>
			</c:when>			
		</c:choose>
	</div>
</div>
</body>
</html>