package com.okmindmap.collaboration;

import java.util.Collection;

import javax.servlet.http.HttpServlet;

import org.directwebremoting.Browser;
import org.directwebremoting.Container;
import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.event.ScriptSessionEvent;
import org.directwebremoting.event.ScriptSessionListener;
import org.directwebremoting.extend.ScriptSessionManager;

public class SessionManagerServlet extends HttpServlet {
	public SessionManagerServlet(){
		System.out.println("SessionManagerServlet init");
		
		Container container = ServerContextFactory.get().getContainer();
		ScriptSessionManager manager = container.getBean(ScriptSessionManager.class);
		
		ScriptSessionListener listener = new ScriptSessionListener() {
		    public void sessionCreated(ScriptSessionEvent evt) {
//		    	ScriptSession session = evt.getSession();
				String page = evt.getSession().getPage();
//				final String sender = session.getPage();
				
				Browser.withPage(page, new Runnable() {
					public void run() {
						Collection<ScriptSession> sessions = Browser.getTargetSessions();
						for (ScriptSession scriptSession : sessions) {
//							if(!scriptSession.getId().equals(sender)) {
//								ScriptBuffer sb = new ScriptBuffer();
//								sb.appendCall("sessionCreated");
//								scriptSession.addScript(sb);
								ScriptBuffer sb = new ScriptBuffer("sessionCreated();");
								scriptSession.addScript(sb);
//							}
						}
					}
				});
		    }

		    public void sessionDestroyed(ScriptSessionEvent evt) {
//		    	ScriptSession session = evt.getSession();
				String page = evt.getSession().getPage();
//				final String sender = session.getPage();
				
		    	Browser.withPage(page, new Runnable() {
					public void run() {
						Collection<ScriptSession> sessions = Browser.getTargetSessions();
						for (ScriptSession scriptSession : sessions) {
//							if(!scriptSession.getId().equals(sender)) {
//								ScriptBuffer sb = new ScriptBuffer();
//								sb.appendCall("sessionDestroyed");
//								scriptSession.addScript(sb);
								ScriptBuffer sb = new ScriptBuffer("sessionDestroyed();");
								scriptSession.addScript(sb);
//							}
						}
					}
				});
		    }
		    
//		    private String getMapKey(ScriptSessionEvent evt) {
//		    	String page = evt.getSession().getPage();
//		    	String[] path = page.split("/");
//		    	
//		    	return path[path.length - 1];
//		    }
		    
//		    private User getUser() {
//		    	WebContext wctx = WebContextFactory.get();
//		        HttpSession session = wctx.getSession();
//		        
//		        return (User)session.getAttribute("user");
//		    }
		};
		
		manager.addScriptSessionListener(listener);
	}
}
