package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Node;
import com.okmindmap.util.EscapeUnicode;

public class NodeRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
		Node node = new Node();
		node.setId(rs.getInt("id")); 
		node.setBackgroundColor(rs.getString("background_color"));
		node.setColor(rs.getString("color"));
		node.setFolded(rs.getString("folded"));
		node.setIdentity(rs.getString("identity"));
		node.setLink( EscapeUnicode.text(rs.getString("link")));
		node.setPosition(rs.getString("position"));
		node.setStyle(rs.getString("style"));
		node.setText( EscapeUnicode.text(rs.getString("text")) );
		node.setOriginText(rs.getString("text") );
		node.setCreated(rs.getLong("created"));
		node.setModified(rs.getLong("modified"));
		node.sethGap(rs.getString("hgap"));
		node.setvGap(rs.getString("vgap"));
		node.setvShift(rs.getString("vshift"));
		node.setEncryptedContent(rs.getString("encrypted_content"));
		node.setLft(rs.getInt("lft"));
		node.setRgt(rs.getInt("rgt"));
		node.setParentId(rs.getInt("parent_id"));
		node.setClientId(rs.getString("client_id"));
		node.setMapId(rs.getInt("map_id"));
		
		node.setNodeType(rs.getString("node_type"));
		node.setCreator(rs.getLong("creator"));
		node.setCreatorIP(rs.getString("creator_ip"));
		node.setModifier(rs.getLong("modifier"));
		node.setModifierIP(rs.getString("modifier_ip"));
		
		node.setExtraData(rs.getString("extra_data"));
		
		node.setNumOfChildren(rs.getInt("num_of_children"));
		
		node.setLine_color(rs.getString("line_color"));
		
		return node;
	}

}
