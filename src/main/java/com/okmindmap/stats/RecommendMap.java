package com.okmindmap.stats;

import java.io.PrintStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;

import com.okmindmap.dao.mysql.spring.mapper.admin.RecommendNodeRowMapper;
import com.okmindmap.model.admin.RecommendNode;

public class RecommendMap {
	protected JdbcTemplate jdbcTemplate;
	protected DataSource dataSource;
	
	protected static String TABLE_SCHEMA = null;
	
	public DataSource getDataSource() {
		return this.dataSource;
	}
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		
		try {
			RecommendMap.TABLE_SCHEMA = this.dataSource.getConnection().getCatalog();
		} catch (SQLException e) {
			RecommendMap.TABLE_SCHEMA = "okmindmap";
		}
	}
		
	@SuppressWarnings("unchecked")
	public int updateRecommedPoint(){
		String sql = "SELECT mm.id, mm.viewcount, rd.rcount, nd.ncount FROM mm_map mm " + 
	                 "JOIN ( SELECT mr.map_id, COUNT(mr.map_id) AS rcount FROM mm_richcontent mr " +
	                 "       WHERE mr.content LIKE '%<img%' GROUP BY mr.map_id " +
	                 "	   ) rd ON rd.map_id = mm.id " + 
	                 "JOIN ( SELECT map_id, COUNT(map_id) AS ncount FROM mm_node GROUP BY map_id " +
	                 "     )nd ON nd.map_id = mm.id " +
	                 " WHERE recommend_point != -1 ";
		
		ArrayList<Object> params = new ArrayList<Object>();
		
		PrintStream ps = null;
		
		try{
			
			ps = new PrintStream("updateRecommendPoint_error.log");
			ps.println("테스트메시지 : ppppppppp");
			
			List<RecommendNode> recommendPoint = getJdbcTemplate().query(sql, params.toArray(),new RecommendNodeRowMapper());
			
			ps.println("recommendPoint Siez:" + recommendPoint.size());
			
			for(RecommendNode nodePoint : recommendPoint){
				String query = "UPDATE mm_map SET recommend_point = ? WHERE id = ?";
				
				int point = (nodePoint.getRcount()*3) + (nodePoint.getNcount()*2) + nodePoint.getViewcount();
				ps.println("recommendPoint Point:"+ nodePoint.getRcount());
				getJdbcTemplate().update(query , new Object[] {
									point,
									nodePoint.getId()
							});
			}
			
		}catch (Exception ee){
			ee.printStackTrace(ps);
			ps.println("예외메시지 : " + ee.getMessage());
		}
		
		
						
		return 1;
		
	}
	
	protected JdbcTemplate getJdbcTemplate() {
		if(this.jdbcTemplate == null) {
			this.jdbcTemplate = new JdbcTemplate(getDataSource());
		}
		
		return this.jdbcTemplate;
	}

}
