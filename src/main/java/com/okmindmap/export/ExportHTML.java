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
package com.okmindmap.export;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import net.sf.jazzlib.ZipEntry;
import net.sf.jazzlib.ZipOutputStream;

import org.apache.log4j.Logger;

import com.okmindmap.model.Map;

public class ExportHTML implements Export {
    Properties properties;
    
	private Map map;
	
	Logger logger;

    /**
	 * 
	 */
	public ExportHTML() {
		super();
		logger = Logger.getLogger(ExportHTML.class);
	}

	
	/**
	 * @param saveFile 
     * 
     */
    public void transform(Map map, Properties prop, OutputStream out) {
    	this.map = map;
		this.properties = prop;
		
        try {
        	ZipOutputStream zOut = new ZipOutputStream(out);
        	
        	ZipEntry htmlEntry = new ZipEntry(this.map.getName() + ".html"); 
        	zOut.putNextEntry(htmlEntry);
        	
        	String filePrefix = getProperty("filePrefix");
        	
        	
            boolean success = transformMapWithXslt(filePrefix, getProperty("xsltFileName"), zOut, "");
            zOut.closeEntry();
            
            if (!success) {
            	logger.error("Error applying XSL template.");
				throw new RuntimeException("Error applying XSL template.");
			}
            
            
            if(success) {
                String directoryName = this.map.getName()+"_files";
                
                // copy files from the resources
                String files = getProperty("files");
                
                copyFilesFromResourcesToDirectory(zOut, directoryName, files, filePrefix);
                
                // copy icons?
                copyIcons(zOut, directoryName);
            }
            
            zOut.close();
        } catch (Exception e) {
        	e.printStackTrace();
        }
    }

    /**
     */
    private void copyIcons(ZipOutputStream out, String directoryName)
    {
        String iconDirectoryName = directoryName + File.separatorChar + "icons";
        
        copyIconsToDirectory(out, iconDirectoryName);
    }


    /**
     */
    private void copyIconsToDirectory(ZipOutputStream out, String directoryName2)
    {
    	File iconDir = new File(getProperty("iconDir"));
        if (iconDir != null && iconDir.exists()){
            String[] userIconArray = iconDir.list(new FilenameFilter(){
                public boolean accept(File dir, String name) {
                    return name.matches(".*\\.png");
                }                
            });
            for ( int i = 0 ; i < userIconArray.length; ++i ) {
                String iconName = userIconArray[i];
                if(iconName.length() == 4){
                    continue;
                }
                
                copyFromFile(out, iconDir.getAbsolutePath(), iconName, directoryName2);
            }
        }
        else {
        	logger.error(iconDir.getAbsolutePath() + "does not exists!");
        }
    }

    /**
     */
    private void copyFilesFromResourcesToDirectory(ZipOutputStream out, String directoryName, String files, String filePrefix)
    {
        StringTokenizer tokenizer = new StringTokenizer(files, ",");
        while(tokenizer.hasMoreTokens()) {
            String next = tokenizer.nextToken();
            copyFromResource(out, filePrefix, next, directoryName); 
        }
    }

    /**
     * @throws IOException
     */
    private boolean transformMapWithXslt(String prefix, String xsltFileName, OutputStream out, String areaCode) throws IOException
    {
        StringWriter writer = getMapXml();
        StringReader reader = new StringReader(writer.getBuffer().toString());
        
        // search for xslt file:
        URL xsltUrl = getResource(prefix + xsltFileName);
        if(xsltUrl == null) {
            throw new IllegalArgumentException("Can't find " + xsltFileName + " as resource.");
        }
        
        InputStream xsltFile = xsltUrl.openStream();
        
        return transform(new StreamSource(reader), xsltFile, out, areaCode);
    }

    /**
     * @throws IOException
     */
    
    private StringWriter getMapXml() throws IOException
    {
        // get output:
        StringWriter writer = new StringWriter();
        
        writer.write(this.map.toXml());
        
        return writer;
    }
    

    public boolean transform(Source xmlSource, InputStream xsltStream, OutputStream resultFile, String areaCode)
    {
       Source xsltSource =  new StreamSource(xsltStream);
       Result result = new StreamResult(resultFile);
    
       // create an instance of TransformerFactory
       try{
	       TransformerFactory transFact = TransformerFactory.newInstance(  );
	    
	       Transformer trans = transFact.newTransformer(xsltSource);
	       // set parameter:
	       // relative directory <filename>_files
	       trans.setParameter("destination_dir", this.map.getName()+"_files/");
	       trans.setParameter("area_code", areaCode);
	       trans.transform(xmlSource, result);
       }
       catch(Exception e){
    	   logger.error(e);
    	   return false;
       };
      return true;
      }

	
	/**
     */
    protected void copyFromResource(ZipOutputStream out, String prefix, String fileName, String destinationDirectory)
    {
            try {
                URL resource = getResource(prefix + fileName);
                if(resource==null){
                		return;
                }
                InputStream in = resource.openStream();
                ZipEntry entry = new ZipEntry(destinationDirectory + "/" + fileName);
                out.putNextEntry(entry);
    
                // Transfer bytes from in to out
                copyStream(in, out, false);
                
                out.closeEntry();
            } catch (Exception e) {
            	e.printStackTrace();
            }
    
        
    }

    /**
     */
    protected void copyFromFile(ZipOutputStream out, String dir, String fileName, String destinationDirectory)
    {
            try {
                File resource = new File(dir, fileName);
//                if(resource==null){
//                		return;
//                }
                InputStream in  = new FileInputStream(resource);
                
                ZipEntry entry = new ZipEntry(destinationDirectory
                        + "/" + fileName);
                
                out.putNextEntry(entry);
    
                // Transfer bytes from in to out
                copyStream(in, out, false);
                
                out.closeEntry();
            } catch (Exception e) {
            	e.printStackTrace();
            }
    
        
    }
    
    public URL getResource(String resourceName) {
    	try {
			return new File(resourceName).toURI().toURL();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		
		return null;
	}
    
    public String getProperty(String key) {
    	return this.properties.getProperty(key);
    }
    
    private void copyStream(InputStream in, OutputStream out, boolean pCloseOutput) throws IOException {
		byte[] buf = new byte[1024];
		int len;
		while ((len = in.read(buf)) > 0) {
		    out.write(buf, 0, len);
		}
		in.close();
		if (pCloseOutput) {
			out.close();
		}
	}
}
