package com.okmindmap.bookmark;


/*
 * http://java.sun.com/products/jfc/tsc/articles/bookmarks/ 에서 가져왔음.
 */

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;

import javax.swing.text.MutableAttributeSet;
import javax.swing.text.html.HTML;
import javax.swing.text.html.HTMLEditorKit;
import javax.swing.text.html.parser.ParserDelegator;

import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;

public class BookmarkParser {

	public final static String OUTPUT_FORMAT_XML = "xml";
	public final static String OUTPUT_FORMAT_JSON = "json";
	
    private static final short NO_ENTRY = 0;
    private static final short BOOKMARK_ENTRY = 2;
    private static final short DIRECTORY_ENTRY = 3;
    
	private BookmarkDirectory root;
	
	public BookmarkParser() {
		root = new BookmarkDirectory("bookmarks");
	}
	
	public BookmarkDirectory getRoot() {
		return root;
	}
	
	public void parse(String path) throws IOException {
		this.parse(new FileInputStream(path));
	}
	
	public void parse(InputStream in) throws IOException {
		StringBuffer buffer = new StringBuffer();
		byte[] data = new byte[4096];
		for(int l = in.read(data); l > 0; l = in.read(data)) {
			buffer.append( new String(data, 0, l) );
		}
		
		CharsetDetector detector = new CharsetDetector();
		detector.setText( buffer.toString().getBytes() );
		CharsetMatch match = detector.detect();
		String encoding = match.getName();
		
		BufferedReader reader = null;
		if( encoding != null ) {
			reader =  new BufferedReader(new InputStreamReader( new ByteArrayInputStream(buffer.toString().getBytes()), encoding ));
		} else {
			reader =  new BufferedReader(new InputStreamReader( new ByteArrayInputStream(buffer.toString().getBytes()) ));
		}

		this.parse(reader);
	}
	
	public void parse(InputStream in, String encoding) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader( in, encoding ));
		
		this.parse(reader);
	}
	
	public void parse(Reader reader) throws IOException {
		new ParserDelegator().parse(reader, new CallbackHandler(), true);
	}
	
	private class CallbackHandler extends HTMLEditorKit.ParserCallback {
		/** Parent node that new entries are added to. */
		private BookmarkDirectory            parent;
		/** The most recently parsed tag. */
		private HTML.Tag                     tag;
		/** The last tag encountered. */
		private HTML.Tag                     lastTag;
		/**
		 * The state, will be one of NO_ENTRY, DIRECTORY_ENTRY,
	         * or BOOKMARK_ENTRY.
		 */
		private short                        state;
		/**
		 * Date for the next BookmarkDirectory node.
		 */
		private Date                         parentDate;

		/**
		 * The values from the attributes are placed in here. When the
		 * text is encountered this is added to the node hierarchy and a
	         * new instance is created.
		 */
		private BookmarkEntry                lastBookmark;


		/**
		 * Creates the CallbackHandler.
		 */
		public CallbackHandler() {
		    parent = root;
		    lastBookmark = new BookmarkEntry();
		}

		//
		// HTMLEditorKit.ParserCallback methods
		//

		/**
		 * Invoked when text in the html document is encountered. Based on
		 * the current state, this will either: do nothing
	         * (state == NO_ENTRY),
		 * create a new BookmarkEntry (state == BOOKMARK_ENTRY) or
	         * create a new 
		 * BookmarkDirectory (state == DIRECTORY_ENTRY). If state is
	         * != NO_ENTRY, it is reset to NO_ENTRY after this is
	         * invoked.
		 */
		public void handleText(char[] data, int pos) {
			switch (state) {
		    case NO_ENTRY:
			break;
		    case BOOKMARK_ENTRY:
			// URL.
			{
			    lastBookmark.setName(new String(data));
	                    parent.add(lastBookmark);
	                    lastBookmark = new BookmarkEntry();
			}
			break;
		    case DIRECTORY_ENTRY:
			// directory.
			{
			    BookmarkDirectory newParent = new 
				             BookmarkDirectory(new String(data));
			    newParent.setCreated(parentDate);
			    parent.add(newParent);
			    parent = newParent;
			}
			break;
		    default:
			break;
		    }
	            state = NO_ENTRY;
		}

		/**
		 * Invoked when a start tag is encountered. Based on the tag
		 * this may update the BookmarkEntry and state, or update the
		 * parentDate.
		 */
		public void handleStartTag(HTML.Tag t, MutableAttributeSet a,
					   int pos) {
			
		    lastTag = tag;
		    tag = t;
		    if (t == HTML.Tag.A && lastTag == HTML.Tag.DT) {
	                long lDate;

			// URL
			URL url;
			try {
			    url = new URL((String)a.getAttribute(HTML.Attribute.HREF));
			} catch (MalformedURLException murle) {
			    url = null;
			}
			lastBookmark.setLocation(url);

			// created
			Date date;
			try {
	                    lDate = Long.parseLong((String)a.getAttribute("add_date"));
	                    if (lDate != 0l) {
	                        date = new Date(1000l * lDate);
	                    }
	                    else {
	                        date = null;
	                    }
			} catch (Exception ex) {
			    date = null;
			}
			lastBookmark.setCreated(date);

			// last visited
			try {
	                    lDate = Long.parseLong((String)a.
	                                           getAttribute("last_visit"));
	                    if (lDate != 0l) {
	                        date = new Date(1000l * lDate);
	                    }
	                    else {
	                        date = null;
	                    }
			} catch (Exception ex) {
			    date = null;
			}
			lastBookmark.setLastVisited(date);

			state = BOOKMARK_ENTRY;
		    }
		    else if (t == HTML.Tag.H3 && lastTag == HTML.Tag.DT) {
			// new node.
			try {
			    parentDate = new Date(1000l * Long.parseLong((String)a.
							 getAttribute("add_date")));
			} catch (Exception ex) {
			    parentDate = null;
			}
			state = DIRECTORY_ENTRY;
		    }
		}

		/**
		 * Invoked when the end of a tag is encountered. If the tag is
		 * a DL, this will set the node that parents are added to the current
		 * nodes parent.
		 */
		public void handleEndTag(HTML.Tag t, int pos) {
		    if (t == HTML.Tag.DL && parent != null) {
			parent = (BookmarkDirectory)parent.getParent();
		    }
		}
	}
	
	public void writeTo(OutputStream out) throws IOException {
		writeTo(out, OUTPUT_FORMAT_XML);
	}
	
	public void writeTo(Writer writer) throws IOException {
		writeTo(writer, OUTPUT_FORMAT_XML);
	}
	
	public void writeTo(Writer out, String format) throws IOException {
		ByteArrayInputStream in = null;
		if(format != null && format.endsWith(OUTPUT_FORMAT_JSON)) {
			in = new ByteArrayInputStream(getRoot().toJSON().getBytes());
		} else {
			in = new ByteArrayInputStream(getRoot().toXML().getBytes());
		}
		byte[] data = new byte[4096];
		for(int length = in.read(data);  length > 0; length = in.read(data)) {
			out.write(new String(data, 0, length));
		}
	}
	
	public void writeTo(OutputStream out, String format) throws IOException {
		ByteArrayInputStream in = null;
		if(format != null && format.endsWith(OUTPUT_FORMAT_JSON)) {
			in = new ByteArrayInputStream(getRoot().toJSON().getBytes());
		} else {
			in = new ByteArrayInputStream(getRoot().toXML().getBytes());
		}
		byte[] data = new byte[4096];
		for(int length = in.read(data);  length > 0; length = in.read(data)) {
			out.write(data, 0, length);
		}
	}
	
	public static void main(String[] args) {
		BookmarkParser parser = new BookmarkParser();
		try {
			parser.parse("d:/bookmark.htm");
			parser.writeTo(System.out, BookmarkParser.OUTPUT_FORMAT_JSON);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
