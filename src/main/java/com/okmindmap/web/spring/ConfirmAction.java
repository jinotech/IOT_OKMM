package com.okmindmap.web.spring;

import java.io.BufferedOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.share.Share;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

public class ConfirmAction extends BaseAction {
	@Autowired
	private UserService userService;
	private MindmapService mindmapService;
	private ShareService shareService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
//		int sId = getOptionalParam(request, "sid", 0);
		//String shareConfirm = getOptionalParam(request, "shareConfirm", "passwordCheck");
		int mapId = getOptionalParam(request, "id", 0);
		String username = getOptionalParam(request, "username", null);
		
		String email =  getOptionalParam(request, "email", null);
		String password = request.getParameter("password");
		
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		if(username != null) { // 로그인
			try {
				User user = userService.get(username);

				String encrypted = PasswordEncryptor.encrypt(password);
				if(user.getPassword().equals(encrypted)) {
					out.write(toBytes("{\"status\":\"ok\", \"message\":\"" + getMessage("confirm.success", null) + "\"}"));
				} else {
					out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.passwordincorrect", null) + "\"}"));
				}
				
			} catch (Exception e) {
				out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.usernamedoesnotexist", null) + "\"}"));
			}
		} else if( mapId>0 && email == null) { // 공유 password 확인
			
			if(password != null) {
				List<Share> shares = shareService.getSharesByMap(mapId);
				boolean matchPass = false;
				//String status = "insertPassword"; //과거에 sid가 있을땐 바로 out으로 찍었지만. sid가 없어지면서 상태값의 저장이 필요하다.
				if(shares != null && shares.size() > 0) {
					for(Share share : shares) {
						String shareType = share.getShareType().getShortName();
						 if("password".equals(shareType)) {
							String encrypted = PasswordEncryptor.encrypt(password);
							if( encrypted.equals(share.getPassword())) {
								out.write(toBytes("{\"status\":\"ok\", \"message\":\"" + getMessage("confirm.success", null) + "\"}"));
								matchPass = true;
								break;
							} 
						 }
					}
					if(!matchPass)
						out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.passwordincorrect", null) + "\"}"));
				}
			} else {
			out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.enterpassword", null) + "\"}"));
			}
		} else { // 이메일, 비밀번호 확인
			if(email != null && password != null) {
				User owner = this.mindmapService.getMapOwner(mapId);
				String encrypted = PasswordEncryptor.encrypt(password);
				if( !email.equals(owner.getEmail()) ) {
					out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.emaildoesnotmatch", null) + "\"}"));
				} else if( !encrypted.equals(owner.getPassword()) ) {
					out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.passwordincorrect", null) + "\"}"));
				} else {
					out.write(toBytes("{\"status\":\"ok\", \"message\":\"" + getMessage("confirm.success", null) + "\"}"));
				}
			} else {
				out.write(toBytes("{\"status\":\"error\", \"message\":\"" + getMessage("confirm.enteremailpassword", null) + "\"}"));
			}
		}
		out.flush();
		out.close();
		
		return null;
	}
	
	private byte[] toBytes(String txt) {
		try {
			return txt.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return txt.getBytes();
	}

}
