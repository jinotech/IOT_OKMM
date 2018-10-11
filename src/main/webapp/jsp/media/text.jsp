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
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>	
	<script src="http://www.google.com/jsapi"></script>
	<script type="text/javascript">
		// Load Google Search Api
		google.load('search', '1');
		
		var selectedItem = null;
		var webSearcher = null;
		var currentPage = 0;
		
		function OnLoad() {
			////////////////////// web /////////////////////////
			/*
			webSearcher = new google.search.WebSearch();
			webSearcher.setResultSetSize(8);
			webSearcher.setSearchCompleteCallback(this, function(searcher){
				var contentDiv = document.getElementById('dataview-content');
				contentDiv.innerHTML = '';

				if (searcher.results && searcher.results.length > 0) {
					var results = searcher.results;
					for (var i = 0; i < results.length; i++) {
						var result = results[i];

						var webContainer = document.createElement('div');
						webContainer.className = "webContainer";						
						webContainer.googleData = result;
						
						webContainer.onclick = function(){
							selectedItem && (selectedItem.style.background = "none");
							this.style.background = "#E0E4EE";
							contentSelect(this);							
						}
						webContainer.ondblclick  = function() {
							selectItemComplete();
						}
						
						//webContainer.innerHTML = "<a href=\"" + result.url + "\" target=\"_blank\">" + result.title + "</a>";
						webContainer.innerHTML = "<span width=\"100%\" title=\"" + result.content + "\">" + result.title + "</span>";
						contentDiv.appendChild(webContainer);

					}
	
				}
			}, [webSearcher]);
			*/
			///////////////////////////////////////////////////////////

			// 선택된 노드의 Text를 검색 단어로..
			try {
				if(parent.jMap.getSelected()) {
					document.getElementById("searchInput").value = parent.jMap.getSelected().getText();
					// 검색
					googleSearch();
				}
			}catch(e) {}
			
			
			parent.jMap.addActionListener(parent.ACTIONS.ACTION_NODE_SELECTED, function(){
				var node = arguments[0];
				document.getElementById("searchInput").value = node.getText();
				googleSearch();
			});
		}
		google.setOnLoadCallback(OnLoad);
		
		
		
		function googleSearchFrom(page) {
			$.ajax({
        		type: 'GET',
       			url: 'https://www.googleapis.com/customsearch/v1',
        		dataType: 'json',
        		data: {
            		'key' : 'AIzaSyCqhNd5-z2hAqEK1hSozv32AkFV88_TFjs',
            		'cx' : '006697568995703237209:vljrny3h45w',
            		'q' : document.getElementById("searchInput").value,
            		'num' : 8,
            		'start' : page*8 + 1
        		},

        		success: function (response) {
    				var contentDiv = document.getElementById('dataview-content');
    				contentDiv.innerHTML = '';
            		$.each(response.items, function(index, result) {
						var webContainer = document.createElement('div');
						webContainer.className = "webContainer";						
						webContainer.googleData = {
								titleNoFormatting : result.snippet,
								url : result.formattedUrl
						};
						
						webContainer.onclick = function(){
							selectedItem && (selectedItem.style.background = "none");
							this.style.background = "#E0E4EE";
							contentSelect(this);							
						}
						webContainer.ondblclick  = function() {
							selectItemComplete();
						}
						
						//webContainer.innerHTML = "<a href=\"" + result.url + "\" target=\"_blank\">" + result.title + "</a>";
						webContainer.innerHTML = "<span width=\"100%\" title=\"" + result.snippet + "\">" + result.htmlTitle + "</span>";
						contentDiv.appendChild(webContainer);

            		});
        		}
            });
		}
		
		function googleSearch() {			
			currentPage = 0;
			googleSearchFrom(currentPage);
			//webSearcher.execute(document.getElementById("searchInput").value);		
		}
		
		function contentSelect(el){
			selectedItem = el;
		}
		
		function previousPage() {
			if (currentPage > 0) {
				currentPage--;
				googleSearchFrom(currentPage);
			}
			//var currentPageIndex = parseInt(webSearcher.cursor.currentPageIndex);
			//if(currentPageIndex > 0) {
			//	webSearcher.gotoPage(currentPageIndex-1);
			//}
		}

		function nextPage() {
			currentPage++;
			googleSearchFrom(currentPage);

			//var currentPageIndex = parseInt(webSearcher.cursor.currentPageIndex);
			//webSearcher.gotoPage(currentPageIndex+1);
		}
		
		function selectItemComplete(){
			var jMap = parent.jMap;
			var selected = jMap.getSelected();
			var param = {
					parent: selected,
					text: selectedItem.googleData.titleNoFormatting
			};
			var newNode = jMap.createNodeWithCtrl(param);
			selected.folded && selected.setFolding(false);
			
			newNode.setHyperlink(unescape(selectedItem.googleData.url));
			
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(newNode);
			jMap.layoutManager.layout(true);
		}
		
	</script>
	<style>
		.webContainer {
			background-color:#f2f4f8;
			font-size:12px;
			padding-top:5px;
			padding-bottom:5px;
		}
		.search_input {
			width:200px;
			height:17px;
			border:1px solid #c9d0da;
			padding-left:1px;	
		}
		
	</style>
</head>
<body>
	<input id="searchInput" class="search_input" type="text" value="" style="float:left; margin-right:8px;">
	<div style="margin-top:11px;">
		<input id="searchButton" type="image" src="../images/search18.png" value="<spring:message code='common.search'/>" onClick="googleSearch()">
		<input id="previousButton" type="image" src="../images/prev18.png" value="<spring:message code='image.prev'/>" onClick="previousPage()">
		<input id="nextButton" type="image" src="../images/next18.png" value="다음" onClick="nextPage()">
	</div>
<div class="webContainer">
		<div id="dataview-content"></div>
	
</div><!-- webContainer -->
</body>
</html>