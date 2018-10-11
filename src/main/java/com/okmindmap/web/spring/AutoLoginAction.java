package com.okmindmap.web.spring;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.UserService;
import com.okmindmap.util.Encryptor;

public class AutoLoginAction extends BaseAction {
	private String dbHost = null;
	private String dbPort = null;
	private String dbSid = null;
	private String dbUsername = null;
	private String dbPassword = null;
	
	@Autowired
	private UserService userService;
	private MindmapService mindmapService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setDbHost(String dbHost) {
		this.dbHost = dbHost;
	}
	public void setDbPort(String dbPort) {
		this.dbPort = dbPort;
	}
	public void setDbSid(String dbSid) {
		this.dbSid = dbSid;
	}
	public void setDbUsername(String dbUsername) {
		this.dbUsername = dbUsername;
	}
	public void setDbPassword(String dbPassword) {
		this.dbPassword = dbPassword;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String url = request.getContextPath() + "/";
		
		String encrypted = request.getParameter("username");
		if(encrypted == null) {
			response.sendRedirect(url);
		}
		
		String username = Encryptor.decrypt(encrypted);
		
		try {
			User user = this.getUser(username);
			if(user != null) {
				HttpSession session = request.getSession();
				session.setAttribute("user", user);
				userService.updateLastAccess(user.getId());
				
				String returnUrl = getOptionalParam(request, "return_url", null);
				if(returnUrl == null || returnUrl.trim() == "" || returnUrl.indexOf("index") != -1) {
					int mapId = user.getLastmap();
					Map map = this.mindmapService.getMap(mapId);
					if(map == null) {
						returnUrl = url + "index.do";
					} else {
						returnUrl = url + "map/" + map.getKey();
					}					
				}
				
				response.sendRedirect(returnUrl);
			} else {
				return new ModelAndView("user/login", "message", "잘못된 접근입니다.");
			}
		} catch (Exception e) {
			return new ModelAndView("user/login", "message", "잘못된 접근입니다.");
		}
		
		return null;
	}

	private User getUser(String username) throws Exception {
		User user = userService.get(username);
		
		if(user != null) {
			return user;
		}
		
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			throw e;
		}
		
		Connection conn = null;
		try {
			conn = DriverManager.getConnection(
					"jdbc:oracle:thin:@" + this.dbHost + ":" + this.dbPort + ":" + this.dbSid,
					this.dbUsername,
					this.dbPassword);
			
			PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM NGLMS.v_okmind_member WHERE usr_id = ?");
			pstmt.setString(1, username);
			
			ResultSet rs = pstmt.executeQuery();
			
			if(rs.next()) {
				String usr_id = this.validate(rs.getString("usr_id"));
				String usr_nm_ms949 = this.validate(rs.getString("usr_nm"));
				String usr_email = this.validate(rs.getString("usr_email"));
				String usr_pw = this.validate(rs.getString("usr_pw"));
				
				// 인코딩 변경
				String usr_nm = new String(this.encode(usr_nm_ms949.getBytes(), "MS949", "UTF-8"), "UTF-8");
				
				String firstname = "";
				String lastname = "";
				if(usr_nm.indexOf(" ") > 0) {
					firstname = this.validate(usr_nm.substring(0, usr_nm.indexOf(" ")));
					lastname = this.validate(usr_nm.substring(usr_nm.indexOf(" ")));
				} else {
					lastname = this.validate(usr_nm.substring(0, 1));
					firstname = this.validate(usr_nm.substring(1));
				}
				
				User userNew = new User();
				userNew.setUsername(usr_id);
				userNew.setEmail(usr_email);
				userNew.setPassword(usr_pw);
				userNew.setLastname(lastname);
				userNew.setFirstname(firstname);
				userNew.setAuth("manual");
				userNew.setConfirmed(1);
				userNew.setDeleted(0);
				
				userService.add(userNew);
				
				return userService.get(username);
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if(conn != null) {
				conn.close();
			}
		}
		
		return null;
	}
	
	private String validate(String str) {
		if(str == null) {
			return " ";
		}
		
		str = str.trim();
		if(str.length() == 0) {
			str = " ";
		}
		
		return str;
	}
	
	private byte[] encode(byte[] arr, String fromCharsetName, String targetCharsetName) {
	    return encode(arr, Charset.forName(fromCharsetName), Charset.forName(targetCharsetName));
	}

	private byte[] encode(byte[] arr, Charset sourceCharset, Charset targetCharset) {

	    ByteBuffer inputBuffer = ByteBuffer.wrap( arr );

	    CharBuffer data = sourceCharset.decode(inputBuffer);

	    ByteBuffer outputBuffer = targetCharset.encode(data);
	    byte[] outputData = outputBuffer.array();

	    return outputData;
	}
}
