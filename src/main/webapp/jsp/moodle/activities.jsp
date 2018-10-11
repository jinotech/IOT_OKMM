<%@page import="com.sun.accessibility.internal.resources.accessibility"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
	String mapId = (String) request.getParameter("mapid");
	String mapKey = (String) request.getParameter("mapkey");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
<meta name="apple-mobile-web-app-capable" content="yes">

<title>Moodle Activities</title>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css?v=<env:getEntry name="versioning"/>" type="text/css">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>

<script type="text/javascript">
	var addModule = null;
	var actions = [
			// 'assign', 'chat', 'resource', 'folder', 'page', 'url', 
			'fn'
		];
	
	function chooseModule(el, name, link){
		addModule = {
			name: name,
			link: link
		};
		$(".moodle-module").removeClass("selected");
		$(el).addClass("selected");
		$('#create_btn').removeClass('disable');
	}

	function checkSubmit(frm){
		if(addModule != null){
			if(actions.indexOf(addModule.name) >= 0){
				if(addModule.name == 'fn'){
					parent.insertActivityAction(addModule.link);
				}else {
					$.ajax({
						type: 'post',
						url: "${pageContext.request.contextPath}/moodle/moodleActivity.do",
						dataType: 'json',
						data: {
							addModule: addModule.name,
							mapid: <%=mapId%>
						},
						success: function (data) {
							if(data.status == "ok") {
								parent.insertActivityAction(data.module.link, {
									moodleModule: data.module.modulename,
									moodleModuleId: String(data.module.coursemodule)
								});
							}
						}
					});
				}
			}else{
				//parent.open(addModule.link);
				parent.location.href = addModule.link + '&mapid=<%=mapId%>&mapkey=<%=mapKey%>';
				parent.$("#dialog").dialog("close");
			}
		} 
		return false;
	}
</script>

<style>
	.moodle-group-title {
		font-weight: bold;
    	margin: 10px 5px;
    	font-size: 15px;
	}
	.moodle-modules {
		columns: 2;
	  -webkit-columns: 2;
	  -moz-columns: 2;
	  list-style: none;
	}
	.moodle-module {
		padding: 5px 5px;
	    border: 1px solid #ddd;
	    margin-bottom: 7px;
	    cursor: pointer;
	    vertical-align: top;
	}
	.moodle-module:hover {
		border-color: #4ddee6;
	}
	.moodle-module.selected {
		background: #57f6ff24;
    	border-color: #4ddee6;
	}
	.moodle-module span {
		font-size: 12px;
	    position: relative;
	    top: -4px;
	    margin-left: 5px;
	}
	table {
		margin: 0px;
	}
	table td{
		vertical-align: top;
	}
	.actions {
		margin-top: 20px;
		text-align: center;
	}
	.actions p {
		margin-top: 20px;
	}
	.actions a {
		color: #328e92;
	    font-weight: bold;
	    text-decoration: underline;
	    cursor: pointer;
	}
	.disable {
		opacity: .3;
	}
</style>

</head>
<body>
<div id="waitingDialog"></div>
<c:if test="${data.message eq ''}">
<div>
<form id="frm-user-new" action="${pageContext.request.contextPath}/moodle/moodleActivity.do" method="post" onSubmit="return checkSubmit(this);">
<table>
	<tbody>
		<tr>
			<td style="border-right: 1px solid #ddd;width: 60%;padding-right: 15px;">
				<div class="moodle-group-title">Activities</div>
				<ul class="moodle-modules">
				<c:forEach items="${data.activities}" var="module">
				   <li class="moodle-module" onclick="chooseModule(this, '${module.name}', '${module.link}')">
						${module.icon}
						<span>${module.title}</span>
					</li>
				</c:forEach>
				</ul>
			</td>
			<td style="padding-left: 15px;">
				<div class="moodle-group-title">Course administration</div>
				<c:forEach items="${data.course_menus}" var="menu">
				   <div class="moodle-module" style="display:block;width:100%;" onclick="chooseModule(this, '${menu.name}', '${menu.link}')">
						${menu.icon}
						<span>${menu.title}</span>
					</div>
				</c:forEach>
			</td>
		</tr>
	</tbody>
</table>

<div class="actions">
	<input type="submit" class="create_btn disable" id="create_btn" value="Add selected" />
</div>
</div>
</form>

</c:if>
	
<c:if test="${data.message ne ''}">
	<h3>${data.message}</h3>
</c:if>

</body>
</html>