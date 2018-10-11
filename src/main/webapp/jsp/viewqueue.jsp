<%@page import="net.sf.json.JSONObject"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

 

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/JavascriptChat.js'></script>

<script type='text/javascript' src='${pageContext.request.contextPath}/lib/d3js/numeric-1.2.6.min.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/lib/d3js/d3.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/lib/d3js/d3.tip.v0.6.3.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/lib/d3js/queue-data.js'></script>

<script>
function checkEmpty() {
	
		if(confirm("큐를 지우시겠습니까?")) {
			console.log(JavascriptChat);
			JavascriptChat.emptyQueue(location.href, function(){
				location.href =location.href; 
			});
			
		}
	
}

var ca;

function ca_dwr(fn) {
	document.getElementById('table-view').style.display = 'none';
	document.getElementById('chart-view').style.display = 'block';
	ca = new QueueData("queue-data");
	ca[fn]();
	ca.dwr(ca.ca());
};
</script>		
	
	<style type="text/css">
		rect {
		  	fill: transparent;
		  	shape-rendering: crispEdges;
		}

		.axis path, .axis line {
		  	fill: none;
		  	stroke: rgba(0, 0, 0, 0.04);
		  	shape-rendering: crispEdges;
		}

		.axisLine {
		  	fill: none;
		  	shape-rendering: crispEdges;
		  	stroke: rgba(0, 0, 0, 0.5);
		  	stroke-width: 1px;
		}

		.triangle, .rect, .axis text{
		  fill-opacity: .5;
		}

		.d3-tip {
		  	line-height: 1;
		  	font-weight: bold;
		  	padding: 12px;
		  	background: rgba(0, 0, 0, 0.8);
		  	color: #fff;
		  	border-radius: 2px;
		}

		.d3-tip:after {
		  	box-sizing: border-box;
		  	display: inline;
		  	font-size: 10px;
		  	width: 100%;
		  	line-height: 1;
		  	color: rgba(0, 0, 0, 0.8);
		  	content: "\25BC";
		  	position: absolute;
		  	text-align: center;
		}

		.d3-tip.n:after {
		  	margin: -1px 0 0 0;
		  	top: 100%;
		  	left: 0;
		}
	</style>
</head>
<body>
		<div id="chart-view" style="display: none;">
			<input type="button" class="btn" onclick="location.reload();" value="Reload"/>
			<div id="ca-dwr"></div>
		</div>
		<div id="table-view">
			<input type="button" class="btn" onclick="checkEmpty()" value="큐지우기"/>
			<input type="button" class="btn" onclick="location.reload();" value="Reload"/>
			<input type="button" class="btn" onclick="ca_dwr('readUsernameAndAction')" value="Correspondence Analysis (username and action)"/>
			<input type="button" class="btn" onclick="ca_dwr('readUsernameAndEtc')" value="Correspondence Analysis (username and etc)"/>
			<table id="queue-data" width="100%" cellspacing="0" cellpadding="5" border="1">
				<tbody>
					<tr>
						<th>액션</th>
						<th>username</th>
						<th>세션아이디</th>
						<th>노드아이디</th>
						<th>기타</th>
					</tr>
			<%
				List<String> historyList = (List<String>) request.getAttribute("data") ;
				 
				JSONObject jsonObject = null ;
				 for(String historyText : historyList){
					 jsonObject = JSONObject.fromObject(historyText);%>
					 <tr>
					 <td><%=jsonObject.get("action")%></td>
						<td><%=jsonObject.get("username")%></td>
						<td><%=jsonObject.get("sender")%></td>
						<td><%=jsonObject.get("nodeId")%></td>
						<td><%=jsonObject.get("data")==null?"":jsonObject.get("data")%><%=jsonObject.get("dx")==null?"":"<br>"+jsonObject.get("dx")+" , "+jsonObject.get("dy")%></td>
					 </tr>
			<%}%>
				</tbody>
			</table>
		</div>
</body>
</html>