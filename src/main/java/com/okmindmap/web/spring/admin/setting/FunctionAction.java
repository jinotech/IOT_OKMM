package com.okmindmap.web.spring.admin.setting;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import net.sf.json.JSONArray;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.web.spring.BaseAction;

public class FunctionAction extends BaseAction {

	private JdbcTemplate jdbcTemplate = null;
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		HttpSession session = request.getSession();       
        ServletContext sc = session.getServletContext();

		WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(sc);

		DataSource dataSource = (DataSource) wac.getBean("dataSource");
		jdbcTemplate = new JdbcTemplate(dataSource);
		
		String func = request.getParameter("func");
		
		if("get".equals(func)) {
			List settings = jdbcTemplate.queryForList("SELECT * FROM mm_okm_setting");
						
			JSONArray json = JSONArray.fromObject(data);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if("set".equals(func)) {
			
			String key = request.getParameter("key");
			String value = request.getParameter("value");
			
			updateSetting (key, value);
			
			return null;
		}

		List settings = jdbcTemplate.queryForList("SELECT * FROM mm_okm_setting");
		Iterator it = settings.iterator();
		while (it.hasNext()) {
		      Map<String,String> row = (Map<String, String>) it.next();
		      data.put((String) row.get("setting_key"), row.get("setting_value"));
		}
		
		return new ModelAndView("admin/setting/function", "data", data);
	}
	
private int updateSetting(String key, String value) {
		
		String sql = "UPDATE mm_okm_setting SET setting_value = ?"
				+ " WHERE setting_key = ?";
		return jdbcTemplate.update(sql, new Object[] { value, key });
	}

}
