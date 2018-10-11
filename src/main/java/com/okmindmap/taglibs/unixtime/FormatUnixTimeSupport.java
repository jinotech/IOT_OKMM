package com.okmindmap.taglibs.unixtime;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspTagException;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;

public class FormatUnixTimeSupport extends TagSupport {
	protected long value;
	protected Object timeZone;
	protected String pattern;
	
    //*********************************************************************
    // Private state

    private String var;                          // 'var' attribute
    private int scope;                           // 'scope' attribute
    
	public FormatUnixTimeSupport() {
		super();
		
		init();
	}
	
	private void init() {
		value = -1;
		pattern = var = null;
		timeZone = null;
		scope = PageContext.PAGE_SCOPE;
	}
	
	public void setValue(long value) {
		this.value = value;
	}
	
	public void setPattern(String pattern) {
		this.pattern = pattern;
	}
	
	public void setTimeZone(Object timeZone) {
		this.timeZone = timeZone;
	}
	
	public void setVar(String var) {
        this.var = var;
    }

    public void setScope(String scope) {
    	this.scope = this.getScope(scope);
    }
    
    public int doEndTag() throws JspException {
    	String formatted = null;
    	
    	if (value == -1) {
    	    if (var != null) {
    	    	pageContext.removeAttribute(var, scope);
    	    }
    	    return EVAL_PAGE;
    	}
    	
    	java.util.Date d = new java.util.Date(value);
    	
    	DateFormat formatter = null;
    	if(pattern == null) {
    		formatter = DateFormat.getDateInstance(DateFormat.FULL);
    	} else {
    		formatter = new SimpleDateFormat(pattern);
    	}
    	
    	// Set time zone
	    TimeZone tz = null;
	    if ((timeZone instanceof String) 	&& ((String) timeZone).equals("")) {
	    	timeZone = null;
	    }
	    if (timeZone != null) {
	    	if (timeZone instanceof String) {
	    		tz = TimeZone.getTimeZone((String) timeZone);
	    	} else if (timeZone instanceof TimeZone) {
	    		tz = (TimeZone) timeZone;
	    	} else {
	    		throw new JspTagException("");
	    	}
	    } else {
	    	tz = TimeZone.getTimeZone("GMT");
	    }
	    if (tz != null) {
	    	formatter.setTimeZone(tz);
	    }
		
    	formatted = formatter.format(d);
    	
    	if (var != null) {
    	    pageContext.setAttribute(var, formatted, scope);	
    	} else {
    	    try {
    	    	pageContext.getOut().print(formatted);
    	    } catch (IOException ioe) {
    	    	throw new JspTagException(ioe.toString(), ioe);
    	    }
    	}
    	
    	return EVAL_PAGE;
    }
           
    public void release() {
    	init();
    }
        
    private int getScope(String scope) {
    	int ret = PageContext.PAGE_SCOPE; // default

    	if ("request".equalsIgnoreCase(scope))
    	    ret = PageContext.REQUEST_SCOPE;
    	else if ("session".equalsIgnoreCase(scope))
    	    ret = PageContext.SESSION_SCOPE;
    	else if ("application".equalsIgnoreCase(scope))
    	    ret = PageContext.APPLICATION_SCOPE;

    	return ret;
    }
}
