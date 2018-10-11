package com.okmindmap.configuration;

import java.util.Enumeration;
import java.util.Hashtable;

/**
 * 웹서버 구동시 웹서버에서 사용하는 기본 설정 정보를 저장하고 있는 클래스.
 * @author Administrator
 *
 */
public class Configuration
{
	private static Hashtable<Object,Object> m_config = new Hashtable<Object,Object>();
	
	/**
	 * Configuration 입력
	 * @param config
	 */
	public static void setConfiguration(Hashtable<Object,Object> config)
	{
		m_config = config;
		print();
	}
	
	/**
	 * Key 값에 해당하는 Object 리턴
	 * @param key
	 * @return
	 */
	public static Object getObject(String key)
	{
		return m_config.get(key);
	}
	
	/**
	 * Key 값에 해당하는 String 리턴
	 * @param key
	 * @return
	 */
	public static String getString(String key)
	{
		String value_ = (String) m_config.get(key);
 		return value_;
	}
	
	/**
	 * Key 값에 해당하는 Integer 리턴
	 * @param key
	 * @return
	 */
	public static int getInt(String key)
	{
		String value_ = getString(key);
		synchronized(value_)
		{
			try
			{
				if(value_ != null) return Integer.parseInt(value_);
			}
			catch (NumberFormatException e)
			{
				System.out.println("ERROR KEY : " + key);
				e.printStackTrace();
			}
		}
		return 0;
	}
	
	/**
	 * Key 값에 해당하는 Float 리턴
	 * @param key
	 * @return
	 */
	public static float getFloat(String key)
	{
		String value_ = getString(key);
		synchronized(value_)
		{
			try
			{
				if(value_ != null) return Float.parseFloat(value_);
			}
			catch (NumberFormatException e)
			{
				System.out.println("ERROR KEY : " + key);
				e.printStackTrace();
			}
		}
		return 0;
	}
	
	/**
	 * Key 값에 해당하는 Long 리턴
	 * @param key
	 * @return
	 */
	public static long getLong(String key)
	{
		String value_ = getString(key);
		synchronized(value_)
		{
			try
			{
				if(value_ != null) return Long.parseLong(value_);
			}
			catch (NumberFormatException e)
			{
				System.out.println("ERROR KEY : " + key);
				e.printStackTrace();
			}
		}
		return 0;
	}
	
	/**
	 * Key 값에 해당하는 Double 리턴
	 * @param key
	 * @return
	 */
	public static double getDouble( String key )
	{
		String value_ = getString(key);
		synchronized(value_)
		{
			try
			{
				if(value_ != null) return Double.parseDouble(value_);
			}
			catch (NumberFormatException e)
			{
				System.out.println("ERROR KEY : " + key);
				e.printStackTrace();
			}
		}
		return 0;
	}
	
	/**
	 * Key 값에 해당하는 Boolean 리턴
	 * @param key
	 * @return
	 */
	public static boolean getBoolean(String key)
	{
		String value_ = getString(key);

		boolean bool_ = false;
		synchronized(value_)
		{
			if(value_ != null)
				bool_ = Boolean.valueOf(value_).booleanValue();
		}
		return bool_;
	}
	
	private static void print()
	{
		System.out.println("\n\n--------------------------------------");
		for(Enumeration enum_ = m_config.keys(); enum_.hasMoreElements();)
		{
			Object key_ = enum_.nextElement();
			Object value_ = m_config.get(key_);

			System.out.println(key_ + " : " + value_);
		}
		System.out.println("--------------------------------------\n\n");
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		Hashtable<Object, Object> config_ = new Hashtable<Object, Object>();
		config_.put("Object", "sample");
		config_.put("String", "sample");
		config_.put("Integer", "10");
		config_.put("Float", "11.1");
		config_.put("Long", "22.2");
		config_.put("Double", "33.3");
		config_.put("Boolean", "true");
		
		Configuration.setConfiguration(config_);
		System.out.println( Configuration.getString("test") );
	}
}
