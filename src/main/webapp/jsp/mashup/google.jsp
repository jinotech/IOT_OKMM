<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>googleMashup</title>	
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
	
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
	
	<style type="text/css">
		#dataview-content {
			background-color: #FFFFFF;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			overflow: auto;
			height:320px;
			text-align: center;
			vertical-align: middle;
		}
		.imgContainer, .videoContainer{
			padding: 7px;
			text-align: center;
			vertical-align: middle;			
			display: inline-block;
			position: relative;
		}
		
	</style>
	
	<script src="${pageContext.request.contextPath}/lib/browser.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>	
	<script src="http://www.google.com/jsapi"></script>
	<script type="text/javascript">
		// Load Google Search Api
		google.load('search', '1');
		
		var selectedItem = null;
		var geocoder = null;
		var map = null;
		
		var imageSearcher = null;
		var videoSearcher = null;
		var webSearcher = null;
		
		function OnLoad() {
			// 선택된 노드의 Text를 검색 단어로..
			document.getElementById("searchInput").value = parent.jMap.getSelecteds().getLastElement().getText();
			
			////////////////////// Image /////////////////////////
			imageSearcher = new google.search.ImageSearch();
			//imageSearcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search.SAFESEARCH_OFF);
			imageSearcher.setResultSetSize(8);
			
			imageSearcher.setSearchCompleteCallback(this, function(searcher){
				var contentDiv = document.getElementById('dataview-content');
				contentDiv.innerHTML = '';
				
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
			
			////////////////////// Video /////////////////////////
			videoSearcher = new google.search.VideoSearch();
			//videoSearcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search.SAFESEARCH_OFF);
			videoSearcher.setResultSetSize(8);
			
			videoSearcher.setSearchCompleteCallback(this, function(searcher){
				var contentDiv = document.getElementById('dataview-content');
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
			
			////////////////////// googleMaps /////////////////////////			
			<c:if test="${data.type eq 'maps'}">				
				geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(37.566535, 126.9779692);
				var myOptions = {
					zoom: 8,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
				map = new google.maps.Map(document.getElementById("dataview-content"), myOptions);
			</c:if>
			
			// 검색
			// ${data.type}으로 가변적으로 변하는 함수를 호출한다. 예를들어 ${data.type}이 image이면 imageSearch()를 부르게 된다.
			${data.type}Search();
			
		}
		google.setOnLoadCallback(OnLoad);
		
		// 구글 검색시에 사용되는 일반적인 검색
		function ${data.type}Search(){
			${data.type}Searcher.execute(document.getElementById("searchInput").value);
		}
		
		// map 검색은 약간 틀리므로 따로 함수명을 생성하여 만든다.
		function mapsSearch(){
			/*$(document).ready(function() { 
				$('#dataview-content').googleMaps(); 
			});*/ 
			
			/*var latlng = new google.maps.LatLng(-34.397, 150.644);
		    var myOptions = {
		      zoom: 8,
		      center: latlng,
		      mapTypeId: google.maps.MapTypeId.ROADMAP,
		      style: google.maps.NavigationControlStyle.SMALL
		    };
		    var map = new google.maps.Map(document.getElementById("dataview-content"), myOptions);
		    */
		    
		    var address = document.getElementById("searchInput").value;
			if (geocoder) {
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						for (var i = 0; i < results.length; i++) {
							var marker = new google.maps.Marker({
								map: map, 
								position: results[i].geometry.location
							});
						}						
					} else {
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}
			
			/*var input = document.getElementById("searchInput").value;
			var latlngStr = input.split(",",2);
			var lat = parseFloat(latlngStr[0]);
			var lng = parseFloat(latlngStr[1]);
			var latlng = new google.maps.LatLng(lat, lng);
			if (geocoder) {
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							map.setZoom(11);
							marker = new google.maps.Marker({
								position: latlng, 
								map: map
							}); 
							infowindow.setContent(results[1].formatted_address);
							infowindow.open(map, marker);
						}
					} else {
						alert("Geocoder failed due to: " + status);
					}
				});
			}*/
			
		}

		//////////// 다음 함수들은 공통적으로 사용하는 함수 ///////////////
		function contentSelect(el){			
			selectedItem = el;
		}
		
		function nextPage(){
			var currentPageIndex = parseInt(${data.type}Searcher.cursor.currentPageIndex);			
			${data.type}Searcher.gotoPage(currentPageIndex+1);
			document.getElementById("pageIndex").innerHTML = currentPageIndex+1;
		}
		function prevPage(){
			var currentPageIndex = parseInt(${data.type}Searcher.cursor.currentPageIndex);
			${data.type}Searcher.gotoPage(currentPageIndex-1);
			document.getElementById("pageIndex").innerHTML = currentPageIndex-1;
		}
		
		function selectItemComplete(){
			var jMap = parent.jMap;
			var selected = jMap.getSelecteds().getLastElement();
			var param = {parent: selected};
			var newNode = jMap.createNodeWithCtrl(param);
			selected.folded && selected.setFoldingExecute(false);
			
			if(selectedItem.googleData.GsearchResultClass == "GimageSearch") {
				//console.log(selectedItem.googleData.unescapedUrl)
				newNode.setImage(selectedItem.googleData.unescapedUrl);
			}
			else if(selectedItem.googleData.GsearchResultClass == "GvideoSearch") {
				var playUrl = selectedItem.googleData.playUrl;
				newNode.setYoutubeVideo(playUrl);
			}
			
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(newNode);
			jMap.layoutManager.layout(true);
			
			parent.$("#dialog").dialog("close");
		}
		
		function googleSearchEnter(e) {
			e = e || window.event;
			if(e.keyCode == 13) {
				${data.type}Search();
			}
		}
		//////////////// 공통적으로 사용하는 함수 끝 //////////////////////////
				
	</script>
		
		
</head>
<body>

	<b>Google Mashup</b>
	<br><br>
	<div style="text-align: center;">
		<INPUT id="searchInput" type="text" value="" onkeypress="googleSearchEnter(event)" style="width: 80%">
		<INPUT id="searchButton" type="button" value="Search" onClick="${data.type}Search()">
	</div>
	<!-- <INPUT id="selectButton" type="button" value="Select" onClick="selectItemComplete()"> -->
	<br>
	
	<!-- the tabs --> 
	<ul class="tabs">		
		<li><a id="image" href="${pageContext.request.contextPath}/mashup/google.do?type=image">Image</a></li>
		<li><a id="video" href="${pageContext.request.contextPath}/mashup/google.do?type=video">Video</a></li>
		<!-- <li><a id="maps" href="${pageContext.request.contextPath}/mashup/google.do?type=maps">Maps</a></li>
		<li><a id="web" href="${pageContext.request.contextPath}/mashup/google.do?type=web">Web</a></li>-->	 	 
	</ul> 

	<!-- tab "panes" --> 
	<div class="panes"> 
		<div id="dataview-content"></div>
	</div>
	<br>
	<div style="text-align: center;">
		<INPUT id="prevButton" type="button" value="Prev" onClick="prevPage()">&nbsp;<a id="pageIndex">0</a>&nbsp;<INPUT id="nextButton" type="button" value="Next" onClick="nextPage()">
	</div>
	
	
</body>
</html>