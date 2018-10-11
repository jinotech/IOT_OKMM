<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="javax.servlet.jsp.JspWriter" %>

<%!

void printError(Throwable throwable, JspWriter out) throws Exception {
	if(throwable != null) {
		out.println(throwable.toString());

		StackTraceElement[] traceElements = throwable.getStackTrace();
		for(StackTraceElement traceElement : traceElements) {
			out.println("\t" + traceElement.toString());
		}

		Throwable cause = throwable.getCause();
		if( cause != null ) {
			out.println();
			printError(cause, out);
		}
	}

}

%>

<html>
<head>
	<title>Error 500</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<h3>Internal Server Error</h3>

<% 
Throwable throwable = (Throwable)request.getAttribute("javax.servlet.error.exception");

if(throwable != null) {
	//out.println("Error: ");
	out.println("<div class='error_msg' style='border: 1px solid #c0c0c0; padding: 5px; width: 600px; height: 400px; overflow:auto; margin-top: 3px;'>");
	out.println("<pre>");
	printError(throwable, out);
	out.println("</pre>");
	out.println("</div>");
}
%>

</body>
</html>