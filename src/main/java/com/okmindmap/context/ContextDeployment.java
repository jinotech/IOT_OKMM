package com.okmindmap.context;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.okmindmap.configuration.Configuration;



/**
 * 
 */
public class ContextDeployment implements ServletContextListener {
	public void contextInitialized(ServletContextEvent sce) {

		ServletContext sc_ = sce.getServletContext();
		
		loadConfiguration(sc_);
	} 
 
	public void contextDestroyed(ServletContextEvent sce) {
		System.out.println("Destroy....");
	}

	private void loadConfiguration(ServletContext sc) {
		String webConfName_ = sc.getInitParameter("pservice.config.file.name");
		String confPath_ = sc.getRealPath("/");

		File	propFile_ = new File(confPath_, webConfName_);

		Properties prop_ = new Properties();
		Hashtable<Object, Object> config_ = new Hashtable<Object, Object>();
		
		try {
			prop_.load(new FileInputStream(propFile_));
			System.out.println("Configuration File : " + propFile_.getAbsolutePath() + " was loaded.");
		} catch (IOException ioe) {
			System.out.println("Configuration File : " + propFile_.getAbsolutePath() + " load failed...");
		} catch (Exception e) {
			System.out.println("Configuration File : " + propFile_.getAbsolutePath() + " Exception..." + e);
		}

		for (Enumeration enum_ = prop_.keys(); enum_.hasMoreElements();) {
			Object key_ = enum_.nextElement();
			Object value_ = prop_.get(key_);

			config_.put(key_, value_);
		}
		
		config_.put("WEBROOT", confPath_);

		Configuration.setConfiguration(config_);
	}
}
