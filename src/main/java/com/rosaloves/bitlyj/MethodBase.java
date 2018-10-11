package com.rosaloves.bitlyj;

import java.util.Arrays;

import com.rosaloves.bitlyj.data.Pair;

/**
 * 
 * $Id: MethodBase.java 133 2010-07-26 11:11:03Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 *
 */
public abstract class MethodBase<A> implements BitlyMethod<A> {
	
	private final String name;
	
	private final Iterable<Pair<String, String>> parameters;
	
	public MethodBase(String name, Pair<String, String> ... parameters) {
		this(name, Arrays.asList(parameters));
	}
	
	public MethodBase(String name, Iterable<Pair<String, String>> parameters) {
		this.name = name;
		this.parameters = parameters;
	}
	
	public String getName() {
		return name;
	}

	public Iterable<Pair<String, String>> getParameters() {
		return parameters;
	}
	
	@Override
	public String toString() {
		return getClass().getSimpleName() 
			+ " [name=" + name + ", parameters=" + parameters + "]";
	}
	
}
