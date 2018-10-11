package com.okmindmap.servlet;

/**
 * 2016. 3. 21
 * 부산교육정보원 사용자 정보 연동 때문에 만듦.
 *
 * web.xml 파일에 다음과 같이 정의하고 Tomcat 재시작,
 * 브라우저 주소줄에 /user/migration 입력
 * 
 *     <servlet>
 *        <servlet-name>UserMigration</servlet-name>
 *        <servlet-class>com.okmindmap.servlet.UserMigrationServlet</servlet-class>
 *        <init-param>
 *            <param-name>host</param-name>
 *            <param-value>hostip</param-value>
 *        </init-param>
 *        <init-param>
 *            <param-name>port</param-name>
 *            <param-value>1521</param-value>
 *        </init-param>
 *        <init-param>
 *            <param-name>sid</param-name>
 *            <param-value>dbsid</param-value>
 *        </init-param>
 *        <init-param>
 *            <param-name>username</param-name>
 *            <param-value>dbusername</param-value>
 *        </init-param>
 *        <init-param>
 *            <param-name>password</param-name>
 *            <param-value>dbpass</param-value>
 *        </init-param>
 *    </servlet>
 *    <servlet-mapping>
 *        <servlet-name>UserMigration</servlet-name>
 *        <url-pattern>/user/migration</url-pattern>
 *    </servlet-mapping>
 *
 * @author jinhoon
 */

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;

@SuppressWarnings("serial")
public class UserMigrationServlet extends HttpServlet {
	private String host = null;
	private String port = null;
	private String sid = null;
	private String username = null;
	private String password = null;
	
	private UserService userService = null;
	
	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
		
		host = getServletConfig().getInitParameter("host");
		port = getServletConfig().getInitParameter("port");
		sid = getServletConfig().getInitParameter("sid");
		username = getServletConfig().getInitParameter("username");
		password = getServletConfig().getInitParameter("password");
		
		
		WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(servletConfig.getServletContext());
		userService = (UserService) wac.getBean("userService");
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		String update = request.getParameter("update");
		if(update == null) {
			update = "0";
		}
		
		long startTime = System.currentTimeMillis();
		
		OutputStreamWriter out = new OutputStreamWriter(response.getOutputStream());
		
		out.write("<html dir='ltr' lang='ko' xml:lang='ko'>" +
				"<head>" +
				"<title>User Migration</title>" +
				"<meta http-equiv='Content-Type' content='text/html; charset=euc-kr' />" +
				"</head>" +
				"<body>");

		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			out.write("Where is your Oracle JDBC Driver?");
			e.printStackTrace();
		}
		
		Connection conn = null;
		try {
			conn = DriverManager.getConnection(
					"jdbc:oracle:thin:@" + host + ":" + port + ":" + sid,
					username,
					password);
			
			Statement stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery("SELECT * FROM NGLMS.v_okmind_member");
			
			int count = 1;
			DecimalFormat myFormatter = new DecimalFormat("#,###,###");
			
			while(rs.next()) {
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
				
				User user = userService.get(usr_id);
				if(user != null) {
					if(update.equals("1") && user.getId() > 6972) { // 기존에 있던 사용자 id 6972 번까지는 업데이트 하지 않음.
						user.setUsername(usr_id);
						user.setEmail(usr_email);
						user.setPassword(usr_pw);
						user.setLastname(lastname);
						user.setFirstname(firstname);
						
						userService.update(user);
						
						out.write(myFormatter.format(count) + " Update a user: " + usr_id + ", " + usr_nm + "<br/>");
					} else {
						out.write(myFormatter.format(count) + " User already exists: " + usr_id + ", " + usr_nm + "<br/>");
					}
				} else {
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
					
					out.write(myFormatter.format(count) + " Create a user: " + usr_id + ", " + usr_nm + "<br/>");
				}
				
				count += 1;
			}
		} catch (Exception e) {
			out.write("Connection Failed! Check output console");
			e.printStackTrace();
		}
		
		long estimatedTime = System.currentTimeMillis() - startTime;
		
		out.write("<p>완료: " + this.getDuration(estimatedTime) + "</p>");
		
		out.write("</body></html>");
		
		out.flush();
		out.close();
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
	
	private String getDuration(long millis) {
        if(millis < 0) {
            throw new IllegalArgumentException("Duration must be greater than zero!");
        }

        long days = TimeUnit.MILLISECONDS.toDays(millis);
        millis -= TimeUnit.DAYS.toMillis(days);
        long hours = TimeUnit.MILLISECONDS.toHours(millis);
        millis -= TimeUnit.HOURS.toMillis(hours);
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millis);
        millis -= TimeUnit.MINUTES.toMillis(minutes);
        long seconds = TimeUnit.MILLISECONDS.toSeconds(millis);

        StringBuilder sb = new StringBuilder();
        if(days > 0) {
        	sb.append(days);
        	sb.append(" 일 ");
        }
        if(hours > 0) {
        	sb.append(hours);
        	sb.append(" 시간 ");
        }
        if(minutes > 0) {
        	sb.append(minutes);
        	sb.append(" 분 ");
        }
        sb.append(seconds);
        sb.append(" 초");

        return(sb.toString());
    }
}
