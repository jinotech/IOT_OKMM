package com.okmindmap.util;

import java.awt.image.BufferedImage;
import java.awt.image.PixelGrabber;



public class ImageCropper {
	private boolean isWhite(int pixel) {
		int alpha = (pixel >> 24) & 0xff;
		int red = (pixel >> 16) & 0xff;
		int green = (pixel >> 8) & 0xff;
		int blue = (pixel) & 0xff;
		
		return alpha == 0 || (0xFF==red && 0xFF==green && 0xFF==blue) ;
	}
	
	private boolean areAllWhite(int [] pixels, int off, int len) {
		for(int pixel=off; pixel<off+len; ++pixel) {
			if(!isWhite(pixels[pixel])) {
				return false ;
			}
		}
		return true;
	}
	
	private boolean isColumnAllWhite(int [] pixels, int col, int row_len, int row_offset, int rows) {
		for(int row=row_offset; row<row_offset+rows; ++row) {
			int pixel=row*row_len+col ;
			if(!isWhite(pixels[pixel])) {
				return false ;
			}
		}
		return true ;
	}
	
	public BufferedImage process(BufferedImage image) throws Exception {
		int min_nw_row = -1;
		int max_nw_row = -1;
		int [] pixels = new int[image.getHeight() * image.getWidth()] ;
		
		PixelGrabber pg = new java.awt.image.PixelGrabber(image, 0, 0, image.getWidth() ,image.getHeight(), pixels, 0, image.getWidth()) ;
		pg.grabPixels();
		
		for(int row=0; row<image.getHeight(); ++row) {
			if(!areAllWhite(pixels, image.getWidth()*row, image.getWidth())) {
				if(min_nw_row < 0) {
					min_nw_row = row ;
				} else if(row > max_nw_row) {
					max_nw_row = row ;
				}
			}
		}
		
		int min_nw_col = -1 ;
		int max_nw_col = -1 ;
		for(int col=0; col<image.getWidth(); ++col) {
			if(!isColumnAllWhite(pixels, col, image.getWidth(), min_nw_row, max_nw_row-min_nw_row)) {
				if(min_nw_col < 0) {
					min_nw_col = col ;
				} else if(col > max_nw_col) {
					max_nw_col = col ;
				}
			}
		}
		
		return image.getSubimage(min_nw_col, min_nw_row, (max_nw_col - min_nw_col), (max_nw_row - min_nw_row));
	}
}
