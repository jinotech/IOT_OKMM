package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.ActionDigester;
import com.okmindmap.action.Action;
import com.okmindmap.action.MoveAction;
import com.okmindmap.action.NewAction;
import com.okmindmap.model.Node;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.model.Attribute;
import java.io.*;
import java.util.*;
import org.imsglobal.lti.launch.*;

public class LaunchLTIAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String mapid = request.getParameter("map");
		String identity = request.getParameter("node");
	

	    if(mapid != null && identity != null) {
			int map_id = Integer.parseInt(mapid);
			Node node = this.mindmapService.getNode(identity, map_id, false);

			if(node != null) {
				String url = null, secret = "", key = "";
				List<Attribute> attrs = node.getAttributes();
				for (int i = 0; i < attrs.size(); i++) {
					if (attrs.get(i).getName().equals("url"))
						url = attrs.get(i).getValue();
					else if (attrs.get(i).getName().equals("secret"))
						secret = attrs.get(i).getValue();
					else if (attrs.get(i).getName().equals("key"))
						key = attrs.get(i).getValue();
					
				}
				if (url != null) {
					
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
					params.put("roles",									"Student"); //Instructor
					params.put("tool_consumer_info_product_family_code","cit");
					params.put("tool_consumer_info_version", 			"1.0");
					params.put("tool_consumer_instance_contact_email",	"webmaster@cit.ctu.edu.vn");
					params.put("tool_consumer_instance_description",	"College of infomation & communication technology");
					params.put("tool_consumer_instance_name",			"Can Tho University");
					params.put("user_id",								"123456");
					
					Map<String, String> signedParameters = ltiSigner.signParameters(params, key, secret, url, "POST");

					String result = "<html><body onload='document.getElementById(\"launchform\").submit()'>";
					result += "<form id='launchform' method='POST' action='" + url + "'>";
					
					for (Map.Entry<String, String> param : signedParameters.entrySet()) {
		        		result += "<input type='hidden' name='" + param.getKey() + "' value='" + param.getValue() + "'>";
		    		}
					result += "<button type='submit'>Launch</button>"
						+ "</form></body></html>";

				    response.getOutputStream().write(result.getBytes());
				} else
					response.getOutputStream().write(("Url null attrs:" + url).getBytes());
			} else
				response.getOutputStream().write("Node null".getBytes());
		}
		
		return null;
		
	}
	
	private long getCurrentTime() {
		long time = System.currentTimeMillis();
		
		return time;
	}
}
