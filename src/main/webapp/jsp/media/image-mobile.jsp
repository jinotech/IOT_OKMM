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
	
	<style type="text/css">
		#dataview-content {
			background-color: #FFFFFF;
			overflow: auto;
			vertical-align: top;
			text-align: center;
			margin:0;
			width:  530px;
		}
		.imgContainer {
			padding: 7px;
			float: none;
			height:150px;
			width:150px;
			text-align:center;
			vertical-align: middle;			
			display: inline-block;
		}
	</style>
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	
	
		
		
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
				parent.$.modal.close();
			}
	    </script>
	    			
		<script type="text/javascript">
		
			function urlCompleted(){
				var selected = parent.jMap.getSelected();
				var url = $('#jino_input_img_url').val();
				selected.setImage(url);
				parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
				parent.jMap.layoutManager.layout(true);
				parent.jMap.work.focus();
				
				parent.$.modal.close();
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
				parent.$.modal.close();
			}
		</script>
		
	
</head>
<body>
			<div id='fileupload'>
				<form id="frm_confirm" action="${pageContext.request.contextPath}/media/fileupload.do" method="post" enctype="multipart/form-data">
					<input type="hidden" name="confirm" value="1"/>
					<input type="hidden" name="mapid"/>
					<div id='popcontent'>
						<!-- <input type="text" id="fileName" class="file_textbox" readonly="readonly" style="width:95%;"> -->
						<div class="file_input_div">
						<input type="file" name="file" class="file_input_hidden" value="<spring:message code='image.image_search'/>" accept="image/*" onchange="javascript: document.getElementById('fileName').value = this.value" />
						</div>
		    		</div>
					<br>
					<div style="margin-top: 20px; margin-bottom:10px; text-align:center;">
						<a href="#" onClick="uploadFile();"><input type="button" class="create_btn" value="<spring:message code='image.image_upload'/>" /></a>
						<input type="button" class="create_btn" value="<spring:message code='common.cancel' />" onclick="cancel();" />
					</div>
				</form>
			</div>
			
</body>
</html>