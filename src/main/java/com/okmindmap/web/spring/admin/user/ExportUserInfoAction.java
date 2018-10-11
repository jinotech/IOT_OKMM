/*FreeMind - A Program for creating and viewing Mindmaps
*Copyright (C) 2000-2006 Joerg Mueller, Daniel Polansky, Christian Foltin, Dimitri Polivaev and others.
*
*See COPYING for Details
*
*This program is free software; you can redistribute it and/or
*modify it under the terms of the GNU General Public License
*as published by the Free Software Foundation; either version 2
*of the License, or (at your option) any later version.
*
*This program is distributed in the hope that it will be useful,
*but WITHOUT ANY WARRANTY; without even the implied warranty of
*MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*GNU General Public License for more details.
*
*You should have received a copy of the GNU General Public License
*along with this program; if not, write to the Free Software
*Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
*/
/*
 * Created on 08.04.2004
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.okmindmap.web.spring.admin.user;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class ExportUserInfoAction  extends BaseAction{

   
	private int USER_ID_COLUMN =1;
	private int USER_MAPCOUNT_INDEX =2;
	private int USER_EMAIL_INDEX =3;
	
	UserService userService = null;
	
	
	
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		/*HSSFWorkbook workbook =  new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("OKMindmap UserInformation");
    	//해더 만들기 
    	HSSFRow headerRow = sheet.createRow(0);
    	headerRow.createCell(0).setCellValue("ID");
    	headerRow.createCell(USER_ID_COLUMN).setCellValue("USER ID");
    	headerRow.createCell(USER_MAPCOUNT_INDEX).setCellValue("NAME");
    	headerRow.createCell(USER_EMAIL_INDEX).setCellValue("EMAIL");
    	int currentRow = 1;
    	// 사용자 정보 가져오기
    	
    	
    	List<User> userInfo = userService.getAllUsers(1, 0, "", "", "email", true);
    	for(User user : userInfo){
    		
    		HSSFRow row = sheet.createRow(currentRow);
    		row.createCell(currentRow);
    		row.createCell(USER_ID_COLUMN).setCellValue(user.getUsername());
    		row.createCell(USER_MAPCOUNT_INDEX).setCellValue(user.getFirstname()+user.getLastname());
    		row.createCell(USER_EMAIL_INDEX).setCellValue(user.getEmail());
    		currentRow++;
    		
    	}*/
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		} else {
		
		String header = "<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><body><table border=1>";
		String title = "<tr><td>No</td><td>USERID</td><td>NAME</td><td>EMAIL</td></tr>";
		String bottom = "</table></body></html>";
		String content = "";
		List<User> userInfo = userService.getAllUsers(1, 0, "", "", "email", true);
    	int currentRow = 1;
		for(User userIter : userInfo){
			content+=("<tr>"+"<td>"+currentRow+"</td>"+"<td>"+userIter.getUsername()+"</td>"+"<td>"+(userIter.getLastname()+userIter.getFirstname())+"</td>"+"<td>"+userIter.getEmail()+"</td>"+"</tr>");
    		currentRow++;
    		
    	}
		response.reset();

		response.setHeader("content-type", "application/xls;charset=UTF-8");   
		response.setHeader("content-disposition", "attachment;filename=\"userinfo.xls\""); 
		PrintWriter op = response.getWriter();
		op.println((header+title+content+bottom));
		}
		return null;
	}

      
}
