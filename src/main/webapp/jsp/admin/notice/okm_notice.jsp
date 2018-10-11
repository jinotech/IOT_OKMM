<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<META HTTP-EQUIV="Expires" CONTENT="0">
		
	<title>Notice</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/admin.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		
	<script type="text/javascript">
	
		function detailView(el) {
			var id = $(el).attr('nid');
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/notice/okmNotice.do',
				data: {	'func': 'get',
							'id' : id
				},
				success: function(data) {
					var modal = $('#detail-modal');
					modal.find('#notice_id').val(data[0].id);
					modal.find('#content_ko').val(data[0].content_ko);
					modal.find('#content_en').val(data[0].content_en);
					modal.find('#link_ko').val(data[0].link_ko);
					modal.find('#link_en').val(data[0].link_en);
					$('#detail-modal').modal();
				},
				error: function(data, status, err) {
					alert("notice detailview error : " + status);
				}
			});
		}
		
		function newNotice(el) {
			$('#detail-modal').modal();
		}
		
		function saveNotice() {
			var modal = $('#detail-modal');			
			var id = modal.find('#notice_id').val();
			var content_ko = modal.find('#content_ko').val();
			var content_en = modal.find('#content_en').val();
			var link_ko = modal.find('#link_ko').val();
			var link_en = modal.find('#link_en').val();
			var priority = 5;
			
			if(priority == null || priority == "") priority = 5;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/notice/okmNotice.do',
				data: {	'func': 'set',
							'id' : id,
							'content_ko' : content_ko,
							'content_en' : content_en,
							'link_ko' : link_ko,
							'link_en' : link_en,
							'priority' : priority
				},
				success: function(data) {
					$.modal.close();
					document.location.reload();
				},
				error: function(data, status, err) {
					alert("notice save error : " + status);
				}
			});
		}
		
		function setHide(el) {
			var checked = !$(el).is(':checked');			
			var id = $(el).attr('nid');
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/notice/okmNotice.do',
				data: {	'func': 'set',
							'id' : id,
							'hide' : checked
				},
				success: function(data) {					
				},
				error: function(data, status, err) {
					alert("notice detailview error : " + status);
				}
			});
			
		}
		
		function init_d(){
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
<div class="table_box">
	<div class="table_box_title">공지사항</div>
	<div class="table_box_con">
	<div id="content">
		<table width="100%">
			<tr class="th_title">
				<th width="40%">한글</th>
				<th width="40%">영문</th>
				<th>표시</th>
				<th>편집</th>
			</tr>
			<c:forEach var="notice" items="${notices}">
			<tr>				
				<td align="left" id="left_line" ><c:out value="${notice.content_ko}"></c:out></td>
				<td align="left" id="left_line"><c:out value="${notice.content_en}"></c:out></td>
				<td><input type="checkbox" nid="<c:out value="${notice.id}"></c:out>" onclick="setHide(this);" id="notice_hide" name="notice_hide" <c:if test="${notice.hide == 0}">checked</c:if>/></td>
				<td><button nid="<c:out value="${notice.id}"></c:out>" onclick="detailView(this);">편집</button></td>		
			</tr>
			</c:forEach>
		</table>
		
		<div align="center" class="center_btn"><button onclick="newNotice();">공지 추가</button></div>
	</div>
		
	</div>
</div>

	<div id='detail-modal' style='display:none;'>
		<input type="hidden" id="notice_id" name="notice_id" value="" />
		<div>content_ko : <input tabindex="1" type="text" id="content_ko" name="content_ko" value="" /></div>
		<div>content_en : <input tabindex="2" type="text" id="content_en" name="content_en" value="" /></div>
		<div>link_ko : <input tabindex="3" type="text" id="link_ko" name="link_ko" value="" /></div>
		<div>link_en : <input tabindex="4" type="text" id="link_en" name="link_en" value="" /></div>
		<div style="margin:10px auto"><a onclick="saveNotice();" class="savebtn">저장</a></div>
	</div>
</body>
</html>
