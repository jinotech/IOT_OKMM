/**
 * 
 * @author Jang Jinhoon
 * 
 */

function postToURL(url, params, handler, bAsync) {
	if(bAsync == undefined) {
		bAsync = true;
	}

	var http = getHTTPObject();

	var tmp = new Array();
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			//document.write(key + "=" + params[key] + "<br />");
			tmp.push(key + "=" +  params[key] );
		}
	}
	var paramsStr = tmp.join("&");

	http.open("POST", url, bAsync);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//http.setRequestHeader("Content-length", paramsStr.length);
	//http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {handler(http);}

	http.send(paramsStr);

	return false;
}

function getHTTPObject () {
	var http = false;

	//Use IE's ActiveX items to load the file.
	if(typeof ActiveXObject != 'undefined') {
		try {
			http = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				http = false;
			}
		}
	} else if (XMLHttpRequest) {
		try {
			http = new XMLHttpRequest();
		} catch (e) {
			http = false;
		}
	}

	return http;
}

