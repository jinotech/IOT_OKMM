package com.okmindmap.web.spring.admin.notice;

import java.io.OutputStream;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

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

import com.okmindmap.dao.mysql.spring.mapper.admin.NoticeRowMapper;
import com.okmindmap.model.User;
import com.okmindmap.model.admin.Notice;
import com.okmindmap.web.spring.BaseAction;

public class OkmNoticeAction extends BaseAction {

	private JdbcTemplate jdbcTemplate = null;
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User adminuser = getUser(request);
		
		
		HttpSession session = request.getSession();       
        ServletContext sc = session.getServletContext();

		WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(sc);

		DataSource dataSource = (DataSource) wac.getBean("dataSource");
		jdbcTemplate = new JdbcTemplate(dataSource);
		
		String func = request.getParameter("func");
		if("view".equals(func)) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			
			Timestamp updated = (Timestamp)jdbcTemplate.queryForObject("SELECT FROM_UNIXTIME(setting_value) FROM mm_okm_setting WHERE setting_key='notice_updated'", java.sql.Timestamp.class);
			List<Notice> notices = jdbcTemplate.query("SELECT * FROM mm_okm_notice WHERE hide=0", new NoticeRowMapper());
			
			data.put("updated", updated.getTime());
			data.put("notices", notices);
						
			JSONArray json = JSONArray.fromObject(data);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		} else {
			if("get".equals(func)) {
				int id = Integer.parseInt(request.getParameter("id"));
				Notice notice = (Notice)jdbcTemplate.queryForObject("SELECT * FROM mm_okm_notice WHERE id=?",
						new Object[] { id }, new NoticeRowMapper());
				
				JSONArray json = JSONArray.fromObject(notice);
				OutputStream out = response.getOutputStream();
				out.write(json.toString().getBytes("UTF-8"));
				out.close();
				return null;
			} else if("set".equals(func)) {
				String id = request.getParameter("id");
				String hide = request.getParameter("hide");
				
				if(hide != null) {
					int h = ("true".equals(hide))?1:0;
					updateHide(Integer.parseInt(id), h);
					return null;
				}
				
				String content_ko = request.getParameter("content_ko");
				String content_en = request.getParameter("content_en");
				String link_ko = request.getParameter("link_ko");
				String link_en = request.getParameter("link_en");
				int priority = Integer.parseInt(request.getParameter("priority"));
				
				int result = -1;			
				if(id == null || "".equals(id)|| "null".equals(id)) {
					result = inserNotice(content_ko, content_en, link_ko, link_en, priority);
				} else {
					result = updateNotice(Integer.parseInt(id), content_ko, content_en, link_ko, link_en, priority);
				}
				
				OutputStream out = response.getOutputStream();
				out.write(String.valueOf(result).getBytes("UTF-8"));
				out.close();
				return null;
			}
		}

		List<Notice> notices = jdbcTemplate.query("SELECT * FROM mm_okm_notice", new NoticeRowMapper());
		
		return new ModelAndView("admin/notice/okm_notice", "notices", notices);
	}
	
	private int inserNotice(String content_ko, String content_en, String link_ko, String link_en, int priority) {
		String query = "INSERT INTO mm_okm_notice (id, content_ko, content_en, link_ko, link_en, priority, created)" +
		" VALUES (?, ?, ?, ?, ?, ?, ?)";
		
		int id = createNewID("mm_okm_notice");
		long created = System.currentTimeMillis() / 1000;

		// 공지사항 띄움기간 리셋
		updateNoticeDateUpdate();
		
		return jdbcTemplate.update(query , new Object[] {
				new Integer(id), content_ko, content_en, link_ko, link_en, priority, created,
		});

	}
	
	private int updateNotice(int id, String content_ko, String content_en, String link_ko, String link_en, int priority) {
		
		int count = jdbcTemplate.queryForInt("SELECT count(*) FROM mm_okm_notice WHERE id = ? ",
				new Object[]{id});
		
		if(count == 0) {
			return inserNotice(content_ko, content_en, link_ko, link_en, priority);
		}
		
		long created = System.currentTimeMillis() / 1000;
		
		String sql = "UPDATE mm_okm_notice SET content_ko = ?,"
				+ " content_en = ?, link_ko = ?, link_en = ?, priority = ?, created = ?"
				+ " WHERE id = ?";
		return jdbcTemplate.update(sql, new Object[] { content_ko, content_en, link_ko, link_en, priority, created, new Integer(id) });
	}
	
	private int deleteNotice(int id) {
		String sql = "DELETE FROM mm_okm_notice WHERE id = ?";

		return jdbcTemplate.update(sql, new Object[] { id });
	}
	
	private int updateNoticeDateUpdate() {
		// 공지사항 팝업 기간 업데이트
		String sql = "UPDATE mm_okm_setting SET setting_value = ?"				
				+ " WHERE setting_key='notice_updated'";
		
		long created = System.currentTimeMillis() / 1000;
		
		return jdbcTemplate.update(sql, new Object[] { created });
	}
	
	private int updateHide(int id, int hide) {
		String sql = "UPDATE mm_okm_notice SET hide = ?"
				+ " WHERE id = ?";
		return jdbcTemplate.update(sql, new Object[] { hide, new Integer(id) });
	}
	
	private int createNewID(String tableName) {
		String tableSchema = "okmindmap";
		
		String query = "SELECT AUTO_INCREMENT" +
			" FROM information_schema.TABLES" +
			" WHERE TABLE_SCHEMA = '" + tableSchema + "'" +
			" AND TABLE_NAME = ?";
		
		return jdbcTemplate.queryForInt(query, new Object[]{tableName});
	}

}
