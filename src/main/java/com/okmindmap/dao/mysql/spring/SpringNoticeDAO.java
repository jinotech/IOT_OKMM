package com.okmindmap.dao.mysql.spring;

import java.util.Date;
import java.util.List;

import org.springframework.util.StringUtils;

import com.okmindmap.dao.NoticeDAO;
import com.okmindmap.dao.mysql.spring.mapper.ManualRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.NoticeRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.UserRowMapper;
import com.okmindmap.model.Notice;
import com.okmindmap.model.User;

public class SpringNoticeDAO extends SpringDAOBase implements NoticeDAO {
	
	@Override
	public List<Notice> noticeList(String keyword, int page, int pageSize, String bbs_gb) {
		/*String sql = "SELECT id, title, content_ko, content_en, link_ko, link_en, priority, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated  FROM mm_okm_notice where bbs_gb='"+bbs_gb+"' order by id desc limit "+(page-1)*pageSize+", "+pageSize+"";*/
		String sql = "SELECT id, title, content_ko, content_en, link_ko, link_en, priority, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated  FROM mm_okm_notice where bbs_gb='"+bbs_gb+"' order by id desc limit "+(page-1)*pageSize+", "+pageSize+"";
		
		if(!StringUtils.isEmpty(keyword)) {
			sql = "SELECT id, title, content_ko, content_en, link_ko, link_en, priority, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated FROM mm_okm_notice where bbs_gb='"+bbs_gb+"' and content_ko like '%"+keyword+"%' order by id desc limit "+(page-1)*pageSize+", "+pageSize+"";
		}
		
		return getJdbcTemplate().query(sql, new NoticeRowMapper());
	}

	@Override
	public int noticeListCount(String keyword, String bbs_gb) {
		String sql = "SELECT count(id) FROM mm_okm_notice where bbs_gb='"+bbs_gb+"'";
		
		if(!StringUtils.isEmpty(keyword)) {
			sql = "SELECT count(id) FROM mm_okm_notice where bbs_gb='"+bbs_gb+"' and content_ko like '%"+keyword+"%' ";
		}
		
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		
		return listCount;
	}

	@Override
	public int insertNotice(String title, String content_ko, int id, String bbs_gb) {
		long created = new Date().getTime();
		String query =	"insert into mm_okm_notice (title, content_ko, regid, created, updtid, updated, bbs_gb) values ('"+title+"' , '"+content_ko+"' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"' , '"+bbs_gb+"')";
		return getJdbcTemplate().update(query);
	}

	@Override
	public Notice viewNotice(String id) {
		String sql = "SELECT id, title, content_ko, content_en, link_ko, link_en, priority, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated  FROM mm_okm_notice WHERE id = '"+id+"' ";
		Notice notice = (Notice)getJdbcTemplate().queryForObject(sql, new NoticeRowMapper());
		return notice;
	}

	@Override
	public int updateNotice(String nid, String title, String content_ko, String hide, int id) {
		
		if(StringUtils.isEmpty(hide)){
			hide = "0";
		}
		
		long created = new Date().getTime();
		String query =	"update mm_okm_notice set title = '"+title+"' , content_ko = '"+content_ko+"' , hide = '"+hide+"' ,  updtid = '"+id+"', updated = '"+ created +"' where id = '"+nid+"' ";
		return getJdbcTemplate().update(query);
	}
	
	/*사용자 메뉴얼 메뉴 */
	@Override
	public List<Notice> manualList(String keyword, int page, int pageSize) {
		/*String sql = "SELECT id, title, content, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated, filepath FROM mm_okm_manual order by id desc limit "+(page-1)*pageSize+", "+pageSize+"";*/
		String sql = "SELECT manual.id, manual.title, manual.content, manual.hide, user.firstname AS regid, FROM_UNIXTIME(manual.created/1000, '%Y-%m-%d') AS created, manual.updtid, FROM_UNIXTIME(manual.updated/1000, '%Y-%m-%d') AS updated, manual.filepath "
				+ "FROM mm_okm_manual AS manual "
				+ "INNER JOIN mm_user AS user ON user.id = manual.regid "
				+ "order by manual.id desc limit "+(page-1)*pageSize+", "+pageSize+"";
		
		if(!StringUtils.isEmpty(keyword)) {
			/*sql = "SELECT id, title, content, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated, filepath FROM mm_okm_manual where content like '%"+keyword+"%' order by id desc limit "+(page-1)*pageSize+", "+pageSize+"";*/
			sql = "SELECT manual.id, manual.title, manual.content, manual.hide, user.firstname AS regid, FROM_UNIXTIME(manual.created/1000, '%Y-%m-%d') AS created, manual.updtid, FROM_UNIXTIME(manual.updated/1000, '%Y-%m-%d') AS updated, manual.filepath "
					+ "FROM mm_okm_manual AS manual "
					+ "INNER JOIN mm_user AS user ON user.id = manual.regid "
					+ "where manual.content like '%"+keyword+"%' "
					+ "order by manual.id desc limit "+(page-1)*pageSize+", "+pageSize+"";
		}
		
		return getJdbcTemplate().query(sql, new ManualRowMapper());
	}

	@Override
	public int manualListCount(String keyword) {
		String sql = "SELECT count(id) FROM mm_okm_manual ";
		
		if(!StringUtils.isEmpty(keyword)) {
			sql = "SELECT count(id) FROM mm_okm_manual where content like '%"+keyword+"%' ";
		}
		
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		
		return listCount;
	}

	@Override
	public Notice viewManual(String id) {
		String sql = "SELECT id, title, content, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated , filepath FROM mm_okm_manual WHERE id = '"+id+"' ";
		Notice notice = (Notice)getJdbcTemplate().queryForObject(sql, new ManualRowMapper());
		return notice;
	}

	@Override
	public int insertManual(String title, String content, int id, String filepath) {
		long created = new Date().getTime();
		String query =	"insert into mm_okm_manual (title, content, regid, created, updtid, updated, filepath) values ('"+title+"' , '"+content+"' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"' , '"+filepath+"')";
		return getJdbcTemplate().update(query);
	}
	
	@Override
	public int updateManual(String nid, String title, String content, String hide, int id) {
		
		if(StringUtils.isEmpty(hide)){
			hide = "0";
		}
		
		long created = new Date().getTime();
		String query =	"update mm_okm_manual set title = '"+title+"' , content = '"+content+"' , hide = '"+hide+"' ,  updtid = '"+id+"', updated = '"+ created +"' where id = '"+nid+"' ";
		return getJdbcTemplate().update(query);
	}
	
	@Override
	public int updateManual(String nid, String title, String content, String hide, int id, String filepath) {
		
		if(StringUtils.isEmpty(hide)){
			hide = "0";
		}
		
		long created = new Date().getTime();
		String query =	"update mm_okm_manual set title = '"+title+"' , content = '"+content+"' , hide = '"+hide+"' ,  updtid = '"+id+"', updated = '"+ created +"' , filepath = '"+filepath+"' where id = '"+nid+"' ";
		return getJdbcTemplate().update(query);
	}
	
	@Override
	public List<User> userMngList(int page, int pageSize) {
		String sql = "SELECT id, username, email, firstname, lastname, auth, confirmed, deleted, FROM_UNIXTIME(created/1000, '%Y-%m-%d %h:%i:%s') AS created, FROM_UNIXTIME(last_access/1000, '%Y-%m-%d %h:%i:%s') AS last_access , last_map, password ,last_access FROM mm_user order by created desc limit "+(page-1)*pageSize+", "+pageSize+"";
		return getJdbcTemplate().query(sql, new UserRowMapper());
	}

	@Override
	public int userMngListCount() {
		String sql = "SELECT count(id) FROM mm_user ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}
	
	
	/* 조동휘 메인 페이지 사용가이드*/
	@Override
	public List<Notice> frontManualList() {
		String sql = "select id, title, content, hide, regid, created, updtid, updated, filepath from mm_okm_manual order by id desc limit 3";		
		return getJdbcTemplate().query(sql, new ManualRowMapper());
	}
	
	/*사용자 가이드 맵 */
	@Override
	public List<Notice> guideMaplList() {
		String sql = "SELECT id, title, content, hide, regid, FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS created, updtid, FROM_UNIXTIME(updated/1000, '%Y-%m-%d') AS updated , filepath FROM mm_okm_manual order by id desc";		
		return getJdbcTemplate().query(sql, new ManualRowMapper());
	}
	
}
