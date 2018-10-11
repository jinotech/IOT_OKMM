package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Slide  implements Serializable {
	private String nodeid;
	private double x;
	private double y;
	private double scaleX;
	private double scaleY;
	private double rotate;
	private int showDepths;
	
	public String getNodeid() {
		return nodeid;
	}
	public void setNodeid(String nodeid) {
		this.nodeid = nodeid;
	}
	public double getX() {
		return x;
	}
	public void setX(double x) {
		this.x = x;
	}
	public double getY() {
		return y;
	}
	public void setY(double y) {
		this.y = y;
	}
	public double getScaleX() {
		return scaleX;
	}
	public void setScaleX(double scaleX) {
		this.scaleX = scaleX;
	}
	public double getScaleY() {
		return scaleY;
	}
	public void setScaleY(double scaleY) {
		this.scaleY = scaleY;
	}
	public double getRotate() {
		return rotate;
	}
	public void setRotate(double rotate) {
		this.rotate = rotate;
	}
	public int getShowDepths() {
		return showDepths;
	}
	public void setShowDepths(int showDepths) {
		this.showDepths = showDepths;
	}
	
}