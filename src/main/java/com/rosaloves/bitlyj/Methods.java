package com.rosaloves.bitlyj;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.rosaloves.bitlyj.Bitly.Provider;
import com.rosaloves.bitlyj.data.Pair;
import com.rosaloves.bitlyj.utils.Dom;


/**
 * Utility class to support the DSL. Exposes method instances via static
 * functions their with corresponding names.
 * 
 * $Id: Methods.java 136 2010-07-26 21:22:33Z chris@rosaloves.com $
 * 
 * @author clewis Jul 18, 2010
 *
 */
final class Methods {
	
	public static BitlyMethod<UrlInfo> info(String value) {
		return new MethodBase<UrlInfo>("info", getUrlMethodArgs(value)) {
			public UrlInfo apply(Provider provider, Document document) {
				return parseInfo(provider, document.getElementsByTagName("info").item(0));
			}
		};
	}
	
	public static BitlyMethod<Set<UrlInfo>> info(String ... values) {
		return new MethodBase<Set<UrlInfo>>("info", getUrlMethodArgs(values)) {
			public Set<UrlInfo> apply(Provider provider, Document document) {
				HashSet<UrlInfo> inf = new HashSet<UrlInfo>();
				NodeList infos = document.getElementsByTagName("info");
				for(int i = 0; i < infos.getLength(); i ++) {
					inf.add(parseInfo(provider, infos.item(i)));
				}
				return inf;
			}
		};
	}
	
	public static BitlyMethod<Url> expand(String values) {
		return new MethodBase<Url>("expand", getUrlMethodArgs(values)) {
			public Url apply(Provider provider, Document document) {
				return parseUrl(provider, document.getElementsByTagName("entry").item(0));
			}
		};
	}
	
	public static BitlyMethod<Set<Url>> expand(String ... values) {
		return new MethodBase<Set<Url>>("expand", getUrlMethodArgs(values)) {
			public Set<Url> apply(Provider provider, Document document) {
				
				HashSet<Url> inf = new HashSet<Url>();
				
				NodeList infos = document.getElementsByTagName("entry");
				for(int i = 0; i < infos.getLength(); i ++) {
					inf.add(parseUrl(provider, infos.item(i)));
				}
				
				return inf;
			}
		};
	}

	public static BitlyMethod<ShortenedUrl> shorten(final String longUrl) {
		return new MethodBase<ShortenedUrl>("shorten", Pair.p("longUrl", longUrl)) {
			public ShortenedUrl apply(Provider provider, Document document) {
				NodeList infos = document.getElementsByTagName("data");
				return parseShortenedUrl(provider, infos.item(0));
			}
		};
	}
	
	public static BitlyMethod<UrlClicks> clicks(String string) {
		return new MethodBase<UrlClicks>("clicks", Pair.p(hashOrUrl(string), string)) {
			public UrlClicks apply(Provider provider, Document document) {
				return parseClicks(provider, document.getElementsByTagName("clicks").item(0));
			}
		};
	}
	
	public static BitlyMethod<Set<UrlClicks>> clicks(String ... string) {
		return new MethodBase<Set<UrlClicks>>("clicks", getUrlMethodArgs(string)) {
			public Set<UrlClicks> apply(Provider provider, Document document) {
				HashSet<UrlClicks> clicks = new HashSet<UrlClicks>();
				NodeList nl = document.getElementsByTagName("clicks");
				for(int i = 0; i < nl.getLength(); i ++) {
					clicks.add(parseClicks(provider, nl.item(i)));
				}
				return clicks;
			}
		};
	}
	
	/* Package-private parsing aids. */
	
	//TODO this is a util - move it
	static Collection<Pair<String, String>> getUrlMethodArgs(String... value) {
		List<Pair<String, String>> pairs = new ArrayList<Pair<String,String>>();
		for(String p : value) {
			pairs.add(Pair.p(hashOrUrl(p), p));			
		}
		return pairs;
	}
	
	static String hashOrUrl(String p) {
		return p.startsWith("http://") ? "shortUrl" : "hash";
	}
	
	static UrlClicks parseClicks(Provider provider, Node item) {
		NodeList nl = item.getChildNodes();
		long user = 0, global = 0;
		for(int i = 0; i < nl.getLength(); i++) {
			String name = nl.item(i).getNodeName();
			String value = Dom.getTextContent(nl.item(i));
			if("user_clicks".equals(name)) {
				user = Long.parseLong(value);
			} else if("global_clicks".equals(name)) {
				global = Long.parseLong(value);
			}
		}
		return new UrlClicks(Methods.parseUrl(provider, item), user, global);
	}
	
	static ShortenedUrl parseShortenedUrl(Provider provider, Node nl) {
		String gHash = "", uHash = "", sUrl = "", lUrl = "", isNew = "";
		NodeList il = nl.getChildNodes();
		for(int i = 0; i < il.getLength(); i ++) {
			
			Node n = il.item(i);
			String name = n.getNodeName();
			String value = Dom.getTextContent(n).trim();
			
			if("new_hash".equals(name)) {
				isNew = value;
			} else if("url".equals(name)) {
				sUrl = value;
			} else if("long_url".equals(name)) {
				lUrl = value;
			} else if("global_hash".equals(name)) {
				gHash = value;
			} else if("hash".equals(name)) {
				uHash = value;
			}
		}
		return new ShortenedUrl(provider.getUrl(), gHash, uHash, sUrl, lUrl, isNew.equals("1"));
	}

	static Url parseUrl(Provider provider, Node nl) {
		String gHash = "", uHash = "", sUrl = "", lUrl = "";
		NodeList il = nl.getChildNodes();
		for(int i = 0; i < il.getLength(); i ++) {
			
			Node n = il.item(i);
			String name = n.getNodeName();
			String value = Dom.getTextContent(n);
			
			if("short_url".equals(name)) {
				sUrl = value;
			} else if("long_url".equals(name)) {
				lUrl = value;
			} else if("global_hash".equals(name)) {
				gHash = value;
			} else if("user_hash".equals(name)) {
				uHash = value;
			} else if("hash".equals(name)) {
				uHash = value;
			}
		}
		return new Url(provider.getUrl(), gHash, uHash, sUrl, lUrl);
	}
	
	static UrlInfo parseInfo(Provider provider, Node nl) {
		NodeList il = nl.getChildNodes();
		
		String title = "", createdBy = "";
		
		for(int i = 0; i < il.getLength(); i ++) {
			Node n = il.item(i);
			
			String name = n.getNodeName();
			String value = Dom.getTextContent(n);
			
			if("created_by".equals(name)) {
				createdBy = value;
			} else if("title".equals(name)) {
				title = value;
			}
			
		}
		
		return new UrlInfo(parseUrl(provider, nl), createdBy, title);
	}
		
}
