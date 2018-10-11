<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ page import="java.io.*, java.util.*, org.imsglobal.lti.launch.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>LTI</title>
	</head>
	<body>
		<%
//			--------------------------------------------------------------
// 			start configuation
			
			//String launch_url = "http://localhost/www/MoodleLTIProviders/enrol/lti/tool.php?id=3";
			String launch_url = "http://else.ctu.edu.vn/local/ltiprovider/tool.php?id=1";

			String key = "KHANG";
			//String secret = "VKVdHBLHL8zDMVkj4YZblBEUaEHSXLcn";
			String secret = "12345";
			LtiSigner ltiSigner = new LtiOauthSigner();
			
			Map<String, String> params = new HashMap<String, String>();
			params.put("launch_presentation_document_target", 	"frame");
			params.put("launch_presentation_locale", 			"en-GB");
			params.put("lis_person_contact_email_primary",		"lticonsumer@gmail.com");
			params.put("lis_person_name_family",				"Consumer");
			params.put("lis_person_name_full", 					"LTI consumer");
			params.put("lis_person_name_given", 				"LTI");
			params.put("lti_message_type", 						"basic-lti-launch-request");
			params.put("lti_version", 							"LTI-1p0");
			params.put("oauth_callback", 						"about:blank");
			params.put("resource_link_description",				"LTI consumer");
			params.put("resource_link_id",						"123456");
			params.put("resource_link_title",					"LTI consumer");
			params.put("roles",									"Instructor");
			params.put("tool_consumer_info_product_family_code","cit");
			params.put("tool_consumer_info_version", 			"1.0");
			params.put("tool_consumer_instance_contact_email",	"webmaster@cit.ctu.edu.vn");
			params.put("tool_consumer_instance_description",	"College of infomation & communication technology");
			params.put("tool_consumer_instance_name",			"Can Tho University");
			params.put("user_id",								"123456");
			
			Map<String, String> signedParameters = ltiSigner.signParameters(params, key, secret, launch_url, "POST");
			
// 			end configuation
// 			--------------------------------------------------------------
		%>
		<table border="1" cellspacing="0">
			<tbody>
				<% for(Map.Entry<String, String> param : signedParameters.entrySet()) { %>
		       		<tr>
						<td><%=param.getKey()%></td><td><%=param.getValue()%></td>
					</tr>
		   		<% } %>
			</tbody>
		</table>
    		
		<form method="POST" action="<%=launch_url%>">
			<% for(Map.Entry<String, String> param : signedParameters.entrySet()) { %>
        		<input type="hidden" name="<%=param.getKey()%>" value="<%=param.getValue()%>">
    		<% } %>
			<button type="submit">Launch</button>
		</form>
	</body>
</html>