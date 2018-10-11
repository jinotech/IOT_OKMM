package com.okmindmap.report;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.service.MailService;

public class StatisticsReport{
	protected JdbcTemplate jdbcTemplate;
	protected DataSource dataSource;
	protected List<String> emails;
	protected int days;
	private MailService mailService;
	
	protected static String TABLE_SCHEMA = null;
	
	public DataSource getDataSource() {
		return this.dataSource;
	}
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		
		try {
			StatisticsReport.TABLE_SCHEMA = this.dataSource.getConnection().getCatalog();
		} catch (SQLException e) {
			StatisticsReport.TABLE_SCHEMA = "okmindmap";
		}
	}
	
	public void setReportTo(String to) {
		this.emails =  Arrays.asList(to.split(","));;
	}
	
	public void setReportDays(int days) {
		this.days = days;
	}
	
	public void setMailService(MailService mailService) {
		this.mailService = mailService;
	}
	
	public void report() {
		StringBuffer message = new StringBuffer();
		
		message.append("전체 사용자: " + countTable("mm_user"));
		message.append("\n");
		message.append("새로 등록된 사용자");
		message.append("\n");
		List<DateCount> users = this.getUserRegistersByDate(days);
		for(DateCount count : users) {
			message.append(count.getDate() + ": " + count.getCount() + "\n");;
		}
		message.append("\n");
		message.append("\n");

		message.append("전체 맵: " + countTable("mm_map"));
		message.append("\n");
		message.append("새로 생성된 맵");
		message.append("\n");
		List<DateCount> maps = this.getMapCreationsByDate(days);
		for(DateCount count : maps) {
			message.append(count.getDate() + ": " + count.getCount() + "\n");
		}
		message.append("\n");
		message.append("\n");
		
		message.append("전체 노드: " + countTable("mm_node"));
		message.append("\n");
		message.append("새로 생성된 노드");
		message.append("\n");
		List<DateCount> nodes = this.getNodeCreationsByDate(days);
		for(DateCount count : nodes) {
			message.append(count.getDate() + ": " + count.getCount() + "\n");;
		}
		
		this.mailService.sendMail(emails, "OKMindmap Statistics Report", message.toString());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getMapCreationsByDate(int rows) throws DataAccessException {
		String sql = "SELECT FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS `date`, " 
		+ " COUNT(*) AS count  "
		+ " FROM mm_map "
		+ " WHERE created > 0 "
		+ " GROUP BY `date` "
		+ " ORDER BY `date` DESC" 
		+ " LIMIT ? ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{rows},
				new DateCountRowMapper());
	}
	
	/**
	 * rows가 -1이면 모든 맵
	 * 
	 * @param rows
	 * @return
	 * @throws DataAccessException
	 */
	@SuppressWarnings("unchecked")
	public List<DateCount> getMapCreations(int rows, String order, String format) throws DataAccessException {
		if(order == null) order = "DESC";
		if(format == null) format = "%Y-%m-%d";
		
		String sql = "SELECT FROM_UNIXTIME(created/1000, '"+format+"') AS `date`, " 
		+ " COUNT(*) AS count  "
		+ " FROM mm_map "
		+ " WHERE created > 0 "
		+ " GROUP BY `date` "
		+ " ORDER BY `date` "+order;
		
		ArrayList params = new ArrayList();
		
		if(rows > -1) {
			sql += " LIMIT ? ";
			params.add(rows);
		}
		
		return getJdbcTemplate().query(sql, 
				params.toArray(),
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getMapCreationsGroupMonth(String date,  int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created/1000, '%Y/%m') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_map" +
				" WHERE created /1000 >=  UNIX_TIMESTAMP('"+date+"-01')" +
				" AND created /1000 <   UNIX_TIMESTAMP('"+date+"-01' + INTERVAL "+period+" MONTH )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getMapCreationsGroupYear(String date, int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created/1000, '%Y') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_map" +
				" WHERE created /1000 >=  UNIX_TIMESTAMP('"+date+"-01-01')" +
				" AND created /1000 <   UNIX_TIMESTAMP('"+date+"-01-01' + INTERVAL "+period+" YEAR )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getMapCreationsGroupDay(String date, int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created/1000, '%Y/%m/%d') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_map" +
				" WHERE created /1000 >=  UNIX_TIMESTAMP('"+date+"')" +
				" AND created /1000 <   UNIX_TIMESTAMP('"+date+"' + INTERVAL "+period+" DAY )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	public DateCount getMapCreationsAccrue(String date) throws DataAccessException {
		String sql = "SELECT 'prev' AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_map" +
				" WHERE created /1000 <  UNIX_TIMESTAMP('"+date+"')";
		
		return (DateCount) getJdbcTemplate().queryForObject(sql, new DateCountRowMapper());
	}
	
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getUserRegistersByDate(int rows) throws DataAccessException {
		String sql = "SELECT FROM_UNIXTIME(created, '%Y-%m-%d') AS `date`, " 
		+ " COUNT(*) AS count  "
		+ " FROM mm_user "
		+ " WHERE created > 0 "
		+ " GROUP BY `date` "
		+ " ORDER BY `date` DESC" 
		+ " LIMIT ? ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{rows},
				new DateCountRowMapper());
	}
	
	/**
	 * rows가 -1이면 모든 유저
	 * 
	 * @param rows
	 * @return
	 * @throws DataAccessException
	 */
	@SuppressWarnings("unchecked")
	public List<DateCount> getUserRegisters(int rows, String order, String format) throws DataAccessException {
		if(order == null) order = "DESC";
		if(format == null) format = "%Y-%m-%d";
		
		String sql = "SELECT FROM_UNIXTIME(created, '"+format+"') AS `date`, "
		+ " COUNT(*) AS count  "
		+ " FROM mm_user "
		+ " WHERE created > 0 "
		+ " GROUP BY `date` "
		+ " ORDER BY `date` "+order;
		
		ArrayList params = new ArrayList();
		
		if(rows > -1) {
			sql += " LIMIT ? ";
			params.add(rows);
		}
		
		return getJdbcTemplate().query(sql, 
				params.toArray(),
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getUserRegistersGroupMonth(String date, int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created, '%Y/%m') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_user" +
				" WHERE created >=  UNIX_TIMESTAMP('"+date+"-01')" +
				" AND created <   UNIX_TIMESTAMP('"+date+"-01' + INTERVAL "+period+" MONTH )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getUserRegistersGroupYear(String date, int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created, '%Y') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_user" +
				" WHERE created >=  UNIX_TIMESTAMP('"+date+"-01-01')" +
				" AND created <   UNIX_TIMESTAMP('"+date+"-01-01' + INTERVAL "+period+" YEAR )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getUserRegistersGroupDay(String date, int period, String order) throws DataAccessException {
		if(order == null) order = "ASC";
		if(period <= 0) period = 1;
		
		String sql = "SELECT FROM_UNIXTIME(created, '%Y/%m/%d') AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_user" +
				" WHERE created >=  UNIX_TIMESTAMP('"+date+"')" +
				" AND created <   UNIX_TIMESTAMP('"+date+"' + INTERVAL "+period+" DAY )" +
				" GROUP BY `date`" +
				" ORDER BY `date` "+order;
		
		return getJdbcTemplate().query(sql,
				new DateCountRowMapper());
	}
	
	public DateCount getUserRegistersAccrue(String date) throws DataAccessException {
		String sql = "SELECT 'prev' AS `date`," +
				" COUNT(*) AS COUNT   FROM mm_user" +
				" WHERE created /1000 <  UNIX_TIMESTAMP('"+date+"')";
		
		return (DateCount) getJdbcTemplate().queryForObject(sql, new DateCountRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<DateCount> getNodeCreationsByDate(int rows) throws DataAccessException {
//		String sql = "SELECT FROM_UNIXTIME(created/1000, '%Y-%m-%d') AS `date`, " 
//		+ " COUNT(*) AS count  "
//		+ " FROM mm_node "
//		+ " WHERE created > 0 "
//		+ " GROUP BY `date` "
//		+ " ORDER BY `date` DESC" 
//		+ " LIMIT ? ";
		
		String sql =
			   "SELECT FROM_UNIXTIME(n.created/1000, '%Y-%m-%d') AS `date`, " 
			+ "	       COUNT(*) AS COUNT " 
			+ "FROM (SELECT created "
			+ "          FROM mm_node "
			+ "          WHERE created >= UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL " + rows + " DAY))*1000) n "
			+ "GROUP BY `date` " 
			+ "ORDER BY `date` DESC ";
		
		return getJdbcTemplate().query(sql, 
				new DateCountRowMapper());
	}
	
	public int countTable(String tableName) {
		String sql = "SELECT count(*) FROM " + tableName;
		
		return getJdbcTemplate().queryForInt(sql);
	}
	/*
	public int countTable(String tableName) {
		String sql = "SELECT TABLE_ROWS " +
                "FROM INFORMATION_SCHEMA.TABLES WHERE table_schema =  ? " +
                "  AND table_name LIKE  ?";
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{StatisticsReport.TABLE_SCHEMA, tableName});
	}*/
	
	protected JdbcTemplate getJdbcTemplate() {
		if(this.jdbcTemplate == null) {
			this.jdbcTemplate = new JdbcTemplate(getDataSource());
		}
		
		return this.jdbcTemplate;
	}
}

class DateCountRowMapper  implements RowMapper {
	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		DateCount count = new DateCount();
		count.setCount(rs.getInt("count"));
		count.setDate(rs.getString("date"));
		
		return count;
	}
}

