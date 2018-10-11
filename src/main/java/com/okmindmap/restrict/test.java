package com.okmindmap.restrict;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

import com.okmindmap.restrict.action.Restrict;

public class test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			String key = "Map";
			@SuppressWarnings("rawtypes")
			Class<?> cls = Class.forName("com.okmindmap.restrict.action." + key + "Action" );
			Constructor<?> cnst = cls.getConstructor(int.class) ;
			Restrict action = (Restrict)cnst.newInstance(22);

			
			action.isAvailable();
			
			
//			if(action != null) {
//				String[] stra = roomnumber.split("/");
//				try {
//					action.execute(stra[stra.length-1]);
//				} catch(Exception e) {
//					System.err.println("Error:: " + stra[stra.length-1]);
//					e.printStackTrace();
//				}
//			}
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
