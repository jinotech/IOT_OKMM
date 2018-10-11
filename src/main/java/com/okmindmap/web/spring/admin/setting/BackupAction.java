package com.okmindmap.web.spring.admin.setting;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.RepositoryService;
import com.okmindmap.web.spring.BaseAction;

public class BackupAction extends BaseAction {
	private RepositoryService repositoryService;
	
	public RepositoryService getRepositoryService() {
		return repositoryService;
	}

	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}
	
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
		
		
		String func = request.getParameter("func");
		
		
		if("backup".equals(func)) {
			response.setHeader("Cache-Control", "no-cache");
			response.setHeader("Pragma", "no-cache");
			response.setDateHeader("Expires", 0);
			response.setHeader("Content-Type", "text/xml");
			response.setHeader( "Content-Disposition", "attachment; filename=\"okmindmap.sql\"" );
			
			BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
			
			String shellCommand = "mysqldump -uokmindmap -p38EswjwdczeMS5CW okmindmap";
			backUpExec(shellCommand, out);
			
			out.flush();
			out.close();
			
			return null;
		} else if ("restore".equals(func)) {
			
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;			
			MultipartFile multipartFile = multipartRequest.getFile("file");
			
			String subPath = "/okmdb/";
			String filepath = this.repositoryService.saveTempFile(multipartFile, subPath);
			
			int ret = -1;
			if(!"".equals(filepath)) {
				System.out.println(filepath);
				String command = "mysql -uokmindmap -p38EswjwdczeMS5CW okmindmap < " + filepath;
				ret = execShellCmd(command);
			} else {
				System.out.println("not save");
			}
			
			OutputStream out = response.getOutputStream();
			out.write(String.valueOf(ret).getBytes("UTF-8"));
			out.close();
			return null;
		}
		
        
		return new ModelAndView("admin/setting/backup", "data", data);
	}
	
	public static int execShellCmd(String cmd) {
        try {
            Runtime runtime = Runtime.getRuntime();
            Process process = runtime.exec(new String[] { "/bin/bash", "-c", cmd });
            int exitValue = process.waitFor();
            return exitValue;
        } catch (Exception e) {
            System.out.println(e);
        }
        return -1;
    }
	
	/**
	 * 커맨드 실행
	 * 
	 * @param exeCmd
	 * @param fileName
	 */
	private static void backUpExec(String exeCmd, OutputStream out) {
		try {
			Process p = Runtime.getRuntime().exec(exeCmd);
			
			InputStream in = p.getInputStream();
			byte[] d = new byte[4096];
			for( int length = in.read(d, 0, d.length); length > 0; length = in.read(d, 0, d.length)) {
				out.write(d, 0, length);
			}
			in.close();
		} catch (IOException io) {
			io.printStackTrace();
		}

	}

}
