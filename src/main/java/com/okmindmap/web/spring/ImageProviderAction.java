
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/copyleft/lesser.html).
 */

package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;

public class ImageProviderAction extends BaseAction {


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		/*동작 안되는데 동작되면...?*/
		String isMobile = request.getParameter("mobile");
		if(isMobile != null && "true".equals(isMobile) ) {
			return new ModelAndView("media/image-mobile");
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String searchType = ServletRequestUtils.getStringParameter(request, "type");
		if(searchType == null){
			searchType = "url";
		}
		data.put("type", searchType);
		
		return new ModelAndView("media/image", "data", data);
	}
}
