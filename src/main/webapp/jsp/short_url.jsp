<%
	String short_url  = request.getParameter("short_url");
%>
<div><a target="_blank" href="http://api.qrserver.com/v1/create-qr-code/?data=<%=short_url%>"><img style="width:300px; height:300px;-webkit-user-select: none" src="http://api.qrserver.com/v1/create-qr-code/?data=<%=short_url%>"></a></div>
<div style="font-size:39px; font-weight:bold;"><%=short_url%></div>