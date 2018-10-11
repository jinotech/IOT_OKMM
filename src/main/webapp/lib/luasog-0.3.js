/*

    Luasog - A JavaScript framework for accessing the MediaWiki API.
    Copyright (C) 2010 Oliver Moran

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

																			*/

/**
 * Contains the source code of the Luasog class. 
 * @file luasog.js
 */

/**
 * Luasog
 * @project Luasog
 * @description A JavaScript framework for accessing the MediaWiki API.
 * @author Oliver Moran
 * @version 0.3
 * @timestamp
 */

/**
 * Defines the Luasog class of bot for interacting with the MediaWiki API. This is the sole class of the Luasog framework.
 * @class {abstract} Luasog
 * @author Oliver Moran
 * @since 0.2
 */
 
/**
 * Creates an instance of a Luasog bot. 
 * @constructor {protected} Luasog
 * @param {optional String} api The URL of the MediaWiki API to be used by the bot (e.g. http://en.wikipedia.org/w/api.php).
 * @return Nothing.
 * @see api
 * @author Oliver Moran
 * @since 0.2
 */
function Luasog(__luas_api){
	/* PRIVATE PROPERTIES */

	/* PRIVATE METHODS */

	/* PRIVILAGED METHODS */
	
	/* CONSTRUCTED PROPERTIES */
	
	if (__luas_api != undefined) this.api = __luas_api;
}
var Luasog = Luasog; // a reference to the constructor using the fada

/* PUBLIC PROPERTIES */

/**
 * The URL of the MediaWiki API to be used by the bot (e.g. http://en.wikipedia.org/w/api.php). The default value is an empty string.
 * @property {read write String} api
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.api = "";

/**
 * The shortest time in miliseconds between calls to the MediaWiki API. This value is used to throttle access to the MediaWiki API. Calls to Luasog methods that invoke the MediaWiki API will be queued and called in sequence with the period in miliseconds between each call being defined by this property.<br/>The default value is 10000 (i.e. a minimum of 10 seconds between each call to the MediaWiki API).
 * @property {read write Number} speed
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.speed = 10000;

/**
 * The time, in Unix time, of the last request to the MediaWiki API. This value will represent a time in the future if the last request is still queued. The default is undefined.
 * @property {read Number} timeoflastrequest
 * @see speed
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.timeoflastrequest = undefined;

/**
 * The value to be passed to as the assert parameter of the <a href="http://www.mediawiki.org/wiki/Extension:Assert_Edit" target="_blank">Assert Edit</a> extension. Possible string values are "user", "bot", "true", "false", "exists" and "test".<br/>Setting this property to a Boolean value of true is the same as setting it to a string value of "user". Setting this property to a Boolean value of false (actually anything other than a Boolean true or a string value) is the same as setting it to a string value of "true". The default value is a Boolean true.
 * @property {read write Bool | String} assert
 * @see nassert
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.assert = true;

/**
 * The value to be passed to as the nassert parameter of the <a href="http://www.mediawiki.org/wiki/Extension:Assert_Edit" target="_blank">Assert Edit</a> extension. Possible string values are "user", "bot", "true", "false", "exists" and "test".<br/>Setting this property to a Boolean value of true is the same as setting it to a string value of "exists". Setting this property to a Boolean value of false (actually anything other than a Boolean true or a string value) is the same as setting it to a string value of "false". The default value is a Boolean false.
 * @property {read write Bool | String} nassert
 * @see assert
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.nassert = false;

/**
 * A string to append to comments marking edits made by this instance of a Luasog bot e.g. " edited using Luasog". The default is an empty string.
 * @property {read write String} byeline
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.byeline = "";

/**
 * A token, valid for each log in session, that is required to make edit using the MediaWiki API. This property will be automatically generated and deleted as necessary.
 * @property {private String} edittoken
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.edittoken = undefined;

/**
 * A timestamp that is generated at the same time as the edit token and is used by the MediaWiki API during edit requests. This property will be automatically generated and deleted when necessary.
 * @property {private String} edittoken
 * @see edittoken
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.starttimestamp = undefined;

/**
 * An object containing a description of each namespace enumerated by ID (number). Each namespace is further enumerated as an object with the properties: canonical (canonical name), name (name as used on the MediaWiki installation) and alias (an alias used for this namespace on the MediaWiki installation). The name and alias properties may be undefined for any namespace. The 'Main' namespace has no canonical name and thus the namespace property will be undefined for the 'Main' namespace. The namespace property will initially be undefined and is populated by the {@link getnamespaces} method. It may be populated implicitly by a method that needs an enumeration of namespaces to perform its function.
 * @property {public Object} namespaces
 * @see getnamespaces
 * @author Oliver Moran
 * @since 0.3
 */
Luasog.namespaces = undefined;

/* PUBLIC METHODS */

/**
 * An abstract method that is called when an exception is trown by a method in the framework. Exceptions when executing callback functions will also fire this method. This method should be over-written by an custom method if needed.
 * @function {public static abstract void} exception
 * @param {Object} error An object containing details of the error.
 * @... {String} name A short string identifying the exepction that was thrown.
 * @... {String} message A brief but meaningful message explaining the cause of the exception.
 * @return n/a
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.exception = function(__luas_err){};



/**
 * Makes a "generic" call to the MediaWiki API, throttling the call if necessary. All other methods in the framework that invoke the MediaWiki API do so through this method.
 * @function {public void} request
 * @param {Object} args An object containing all of the arguments to be passed to the MediaWiki API.
 * @param {Function} callback A function to be called on the successful return of the API call. (See the {@link onrequest} interface function.)
 * @... {Object} data An object containing the result of the API call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see onrequest
 * @see speed
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.request = function(__luas_args, __luas_callback){
	this.checksignature(arguments);

	var __luas_currenttime = (new Date()).getTime();
	var __luas_timeout = (__luas_currenttime < this.timeoflastrequest + this.speed) ? (this.timeoflastrequest - __luas_currenttime) + this.speed:0;

	var __luas_this = this;
	setTimeout(function(){
		__luas_args.format = "json";
		jQuery.ajax({
			type: "POST",
			url: __luas_this.api,
			data: __luas_args,
			success: function(__luas_data){
					if (__luas_data == undefined || __luas_data == null) {
						Luasog.exception({ name: "empty data", message: "No data was returned by from "+__luas_this.api+"." });
					} else {
						try { 
							/**
							 * The function called on completion of the {@link request} method.
							 * @ifunction {local abstract void} onrequest
							 * @param {Object} result An object containing the result of the request.
							 * @throws exception if there is an error during execution.
							 * @returns Nothing.
							 * @see request
							 * @author Oliver Moran
							 * @since 0.2
							 */
							__luas_callback(__luas_data);
						} catch (__luas_err) { Luasog.exception(__luas_err); }
					}
				},
			error: function(__luas_request, __luas_status, __luas_error) {
					if (__luas_error == undefined) {
						var __luas_info = "An unknown error occurred when trying to contact.";
						switch (__luas_status){
							case "timeout":
								__luas_info = "A HTTP request timed out while trying to contact "+__luas_this.api+".";
								break;
							case "notmodified":
								__luas_info = "Received HTTP error 304, \"Not modified\", from "+__luas_this.api+".";
								break;
							case "parsererror":
								__luas_info = "Could not parse a JSON object in the response from "+__luas_this.api+".";
								break;
							case "error":
							default:
								__luas_info = "An unknown error occurred when trying to contact "+__luas_this.api+".";
								break;
						}
						Luasog.exception({ name: __luas_status, message: __luas_info });
					} else Luasog.exception(__luas_error);
				},
			dataType: "json",
			beforeSend: function(__luas_request){
					__luas_request.withCredentials = true;
				}
			});}, __luas_timeout);
		
	this.timeoflastrequest = __luas_currenttime + __luas_timeout;
}

/**
 * Requests the user name of the currently logged in user from the MediaWiki API. 
 * @function {public void} whoami
 * @param {Function} callback A function to be called with the result of the call. (See the {@link onwhoami} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see onwhoami
 * @see login
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.whoami = function(__luas_callback){
	this.checksignature(arguments);

	this.request({ action: "query", meta: "userinfo" }, function(__luas_data){
		try { 
			/**
			 * The function called on completion of the {@link whoami} method.
			 * @ifunction {local abstract void} onwhoami
			 * @param {Boolean} success A Boolean indicating the success or failure of the request. Always true in this release.
			 * @param {Object} result An object containing the result of the request.
			 * @... {String} name The user name or IP address of the current user.
			 * @throws exception if there is an error during execution.
			 * @returns Nothing.
			 * @see whoami
			 * @author Oliver Moran
			 * @since 0.2
			 */
			__luas_callback(true, {name: __luas_data.query.userinfo.name})
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	});
}

/**
 * Logs a user in to the MediaWiki API.
 * @function {public void} login
 * @param {Object} args An object containing a users log-in credentials.
 * @... {String} username The user to log in as.
 * @... {String} password The password for that user.
 * @... {optional String} token A token received from the server to allow the user to log in. If a token is not passed to the method then the method will request the server for one.
 * @param {Function} callback A function to be called with the result of the call. (See the {@link onlogin} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see onlogin
 * @see logout
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.login = function(__luas_args, __luas_callback){
	this.checksignature(arguments);

	delete this.edittoken; // delete the edit token because it is reset after a log out
	delete this.starttimestamp; // ditto

	var __luas_this = this;
	this.request({ action: "login", lgname: __luas_args.username, lgpassword: __luas_args.password, lgtoken: __luas_args.token }, function(__luas_data){
		
		if (__luas_data.login.token != undefined) {
			__luas_this.login({ username: __luas_args.username, password: __luas_args.password, token: __luas_data.login.token }, __luas_callback);
			return true;
		}

		if (__luas_data.login != undefined && __luas_data.login.result.toUpperCase() == "SUCCESS") {
			var __luas_success = true;
			var __luas_result = new Object();
		} else {
			var __luas_success = false;
			
			if (__luas_data.login != undefined) {
				var __luas_info = new Object();
				__luas_info.NONAME = "You didn't set the lgname parameter.";
				__luas_info.ILLEGAL = "You provided an illegal username.";
				__luas_info.NOTEXISTS = "The username you provided doesn't exist.";
				__luas_info.EMPTYPASS = "You didn't set the lgpassword parameter or you left it empty.";
				__luas_info.WRONGPASS = "The password you provided is incorrect.";
				__luas_info.WRONGPLUGINPASS = "An authentication plugin, rather than MediaWiki, itself rejected the password.";
				__luas_info.CREATEBLOCKED = "The wiki tried to automatically create a new account for you, but your IP address has been blocked from account creation.";
				__luas_info.THROTTLED = "You've logged in too many times in a short time.";
				__luas_info.BLOCKED = "User is blocked.";
				__luas_info.MUSTBEPOSTED = "The login module requires a POST request.";
				__luas_info.NEEDTOKEN = "Either you did not provide the login token or the sessionid cookie. Request again with the token and cookie given in this response.";

				var __luas_result = new Object();
				__luas_result.code = __luas_data.login.result.toUpperCase();
				__luas_result.info = __luas_info[__luas_data.login.result.toUpperCase()];
			}
		}
		try { 
			/**
			 * The function called on completion of the {@link login} method.
			 * @ifunction {local abstract void} onlogin
			 * @paramset Success
			 * @param {Boolean} success A Boolean true indicating the success of the request.
			 * @param {Object} result An object containing the result of the request. This object will be empty in this release.
			 * @paramset Failure
			 * @param {Boolean} success A Boolean false indicating the failure of the request.
			 * @param {Object} error An object containing information about why the request failed.
			 * @... {String} code A short string identifying the cause of the failue.
			 * @... {String} info A brief message explaining the failure.
			 * @throws exception if there is an error during execution.
			 * @returns Nothing.
			 * @see login
			 * @author Oliver Moran
			 * @since 0.2
			 */
			__luas_callback(__luas_success, __luas_result);
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	});
}

/**
 * Logs a user out of the MediaWiki API.
 * @function {public void} logout
 * @param {Function} callback A function to be called with the result of the call. (See the {@link onlogout} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call. (Normally this will be empty.)
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see onlogout
 * @see login
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.logout = function(__luas_callback){
	this.checksignature(arguments);

	delete this.edittoken; // delete the edit token because it is reset after a log out
	delete this.starttimestamp; // ditto

	this.request({ action: "logout" }, function(__luas_data){
		try { 
			/**
			 * The function called on completion of the {@link logout} method.
			 * @ifunction {local abstract void} onlogout
			 * @param {Boolean} success A Boolean indicating the success or failure of the request. Always true in this release.
			 * @param {Object} result An object containing the result of the request. This object will be empty in this release.
			 * @throws exception if there is an error during execution.
			 * @returns Nothing.
			 * @see logout
			 * @author Oliver Moran
			 * @since 0.2
			 */
			__luas_callback(true, {});
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	});
}

/**
 * Requests the raw contents of a page on the wiki.
 * @function {public void} get
 * @param {Object} args An object containing parameters that will be used in the execution of the call. In this release, this object contains a single element: the title of the page to get.
 * @... {String} page The title of the page which contents will be returned.
 * @param {Function} callback A function to be called with the result of the call. (See the {@link onget} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an error during the callback (by use of the {@link checksignature} method).
 * @return Nothing.
 * @see onget
 * @see post
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.get = function(__luas_args, __luas_callback){
	this.checksignature(arguments);

	this.request({ action: "query", prop: "revisions", titles: __luas_args.page, rvprop: "timestamp|content" }, function(__luas_data){
		if (__luas_data.query != undefined) {
			var __luas_success = true;
			var __luas_result = new Object(); // will be empty if page is missing
			for (__luas_page in __luas_data.query.pages){
				for (__luas_revision in __luas_data.query.pages[__luas_page].revisions){
					__luas_result.content = __luas_data.query.pages[__luas_page].revisions[__luas_revision]["*"];
					__luas_result.timestamp = __luas_data.query.pages[__luas_page].revisions[__luas_revision]["timestamp"];
				}
			}
		} else {
			var __luas_success = false;
			if (__luas_data.error != undefined) var __luas_result = __luas_data.error;
		}
		try { 
			/**
			 * The function called on completion of the {@link get} method.
			 * @ifunction {local abstract void} onget
			 * @paramset Success
			 * @param {Boolean} success A Boolean true indicating the success of the request.
			 * @param {Object} result An object containing the result of the request.
			 * @... {String} content The content of latest revision the page.
			 * @... {String} timestamp The timestamp of the latest revision of the page.
			 * @paramset Failure
			 * @param {Boolean} success A Boolean false indicating the failure of the request.
			 * @param {Object} error An object containing information about why the request failed.
			 * @... {String} code A short string identifying the cause of the failue.
			 * @... {String} info A brief message explaining the failure.
			 * @throws exception if there is an error during execution.
			 * @returns Nothing.
			 * @see get
			 * @author Oliver Moran
			 * @since 0.2
			 */
			__luas_callback(__luas_success, __luas_result);
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	});
}

/**
 * Replaces the content of a page on the wiki.
 * @function {public void} post
 * @param {Object} args An object containing parameters that will be used in the replacemet of the page contents.
 * @... {String} page The title of the page which contents will be replaced.
 * @... {String} content The new contents of the page.
 * @... {String} summary An edit summary to leave.
 * @... {optional String} timestamp A timestamp to be used by the method to catch edit conflicts. Ordinarily, this will be the timestamp returned by {@link get} method.
 * @param {Function} callback A function to be called with the result of the call. (See the {@link onpost} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see onpost
 * @see get
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.post = function(__luas_args, __luas_callback){
	this.checksignature(arguments);
	
	if (this.edittoken == undefined || this.starttimestamp == undefined){ // only request an edit token if we don't have one already
		var __luas_this = this;
		this.request({ action: "query", prop: "info", intoken: "edit", titles: __luas_args.page }, function(__luas_data){
			for (var __luas_page in __luas_data.query.pages) {
				__luas_this.edittoken = __luas_data.query.pages[__luas_page].edittoken;
				__luas_this.starttimestamp = __luas_data.query.pages[__luas_page].starttimestamp;
			}

			if (__luas_this.edittoken == undefined) {
				var __luas_result = new Object();
				__luas_result.code = "NOTOKEN";
				__luas_result.info = "Could not get an edit token.";
				try { __luas_callback(false, __luas_result); }
				catch(__luas_err) { Luasog.exception(__luas_err); }
			} else __luas_this.post({ page: __luas_args.page, content: __luas_args.content, summary: __luas_args.summary, timestamp: __luas_args.timestamp }, __luas_callback);
		});
	} else {
		var __luas_assert = "true"; // will always pass
		switch(this.assert){
			case true:
				__luas_assert = "user"; // must be logged in to perform edit
				break;
			default:
				if (typeof this.assert == "string") __luas_assert = this.assert; // if a string then assert what ever it is
				break;
		}
		var __luas_nassert = "false"; // will always pass
		switch(this.nassert){
			case true:
				__luas_nassert = "exists"; // page must not exist to perform edit
				break;
			default:
				if (typeof this.nassert == "string") __luas_nassert = this.assert; // if a string then nassert what ever it is
				break;
		}
		
		this.request({ action: "edit", title: __luas_args.page, summary: __luas_args.summary+this.byeline, text: __luas_args.content, bot: "true", token: this.edittoken, assert: __luas_assert, nassert: __luas_nassert, basetimestamp: __luas_args.timestamp, starttimestamp: this.starttimestamp }, function(__luas_data){
			var __luas_result = new Object();
			if (__luas_data.edit != undefined && __luas_data.edit.result.toUpperCase() == "SUCCESS") var __luas_success = true;
			else {
				var __luas_success = false;
				if (__luas_data.error != undefined) var __luas_result = __luas_data.error;
			}
			try { 
				/**
				 * The function called on completion of the {@link post} method.
				 * @ifunction {local abstract void} onpost
				 * @paramset Success
				 * @param {Boolean} success A Boolean true indicating the success of the request.
				 * @param {Object} result An object containing the result of the request. This object will be empty in this release.
				 * @paramset Failure
				 * @param {Boolean} success A Boolean false indicating the failure of the request.
				 * @param {Object} error An object containing information about why the request failed.
				 * @... {String} code A short string identifying the cause of the failue.
				 * @... {String} info A brief message explaining the failure.
				 * @throws exception if there is an error during execution.
				 * @returns Nothing.
				 * @see post
				 * @author Oliver Moran
				 * @since 0.2
				 */
				__luas_callback(__luas_success, __luas_result);
			} catch(err) { Luasog.exception(err); }
		});
	}
}

/**
 * Populates the {@link namespaces} property.
 * @function {public void} getnamespaces
 * @param {Function} callback A function to be called with the result of the call. (See the {@link ongetnamespaces} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an HTTP error during the AJAX request.
 * @return Nothing.
 * @see namespaces
 * @author Oliver Moran
 * @since 0.3
 */
Luasog.prototype.getnamespaces = function(__luas_callback){
	this.checksignature(arguments);
	
	this.namespaces = new Object();
	
	var __luas_this = this;
	this.request({action:"query", meta:"siteinfo", siprop:"namespaces|namespacealiases"}, function(__luas_data){
		for (var __luas_namespace in __luas_data.query.namespaces){
			var __luas_namespace_info = new Object();
			__luas_namespace_info.canonical = __luas_data.query.namespaces[__luas_namespace].canonical;
			__luas_namespace_info.name = __luas_data.query.namespaces[__luas_namespace]["*"];
			__luas_this.namespaces[parseInt(__luas_data.query.namespaces[__luas_namespace].id)] = __luas_namespace_info;
		}
		for (var __luas_namespacealias in __luas_data.query.namespacealiases)
			__luas_this.namespaces[parseInt(__luas_data.query.namespacealiases[__luas_namespacealias].id)].alias = __luas_data.query.namespacealiases[__luas_namespacealias]["*"];
		
		try { 
			/**
			* The function called on completion of the {@link getnamespaces} method.
			* @ifunction {local abstract void} ongetnamespaces
			* @param {Boolean} success A Boolean indicating the success or failure of the request. Always true in this release.
			* @param {Object} result An object containing the result of the request.
			* @... {Object} namespaces The {@link namespaces} property.
			* @throws exception if there is an error during execution.
			* @returns Nothing.
			* @see getnamespaces
			* @see namespaces
			* @author Oliver Moran
			* @since 0.3
			*/
			__luas_callback(true, {namespaces:__luas_this.namespaces});
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	});
}

/**
 * Requests a list of all the members of a category.
 * @function {public void} getcategory
 * @param {Object} args An object containing parameters that will be used in the execution of the call. In this release, this object contains a single element: the title of the category to list.
 * @... {String} category The title of the category to list.
 * @param {Function} callback A function to be called with the result of the call. (See the {@link ongetcategory} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an error during the callback (by use of the {@link checksignature} method).
 * @return Nothing.
 * @see ongetcategory
 * @see getpagesincategory
 * @author Oliver Moran
 * @since 0.3
 */
Luasog.prototype.getcategory = function(__luas_args, __luas_callback){
	this.checksignature(arguments);
	
	var __luas_members = new Array();
	var __luas_bynamespace = new Object();
	var __luas_continue = undefined;

	var __luas_this = this;
	var __luas_getcategory = function(){
		__luas_this.request({action:"query", list:"categorymembers", cmtitle:__luas_args.category, cmlimit:"500", cmprop:"title|timestamp", cmsort:"sortkey", cmdir:"asc", cmcontinue:__luas_continue}, function(__luas_data){
			if (__luas_data.query !== undefined) {
				for (var __luas_member in __luas_data.query.categorymembers){
					var __luas_memberobject = new Object();
					__luas_memberobject.title = __luas_data.query.categorymembers[__luas_member].title;
					__luas_memberobject.timestamp = __luas_data.query.categorymembers[__luas_member].timestamp;
					
					if (__luas_bynamespace[__luas_data.query.categorymembers[__luas_member].ns] === undefined)
						__luas_bynamespace[__luas_data.query.categorymembers[__luas_member].ns] =  new Array();
					__luas_bynamespace[__luas_data.query.categorymembers[__luas_member].ns].push(__luas_memberobject);
					__luas_memberobject.namespace = __luas_data.query.categorymembers[__luas_member].ns;
					__luas_members.push(__luas_memberobject);
				}
				
				if (__luas_data["query-continue"] !== undefined){
					__luas_continue = __luas_data["query-continue"].categorymembers.cmcontinue;
					__luas_getcategory();
				} else {
					try { 
						/**
						* The function called on completion of the {@link getcategory} method.
						* @ifunction {local abstract void} ongetcategory
						* @paramset Success
						* @param {Boolean} success A Boolean true indicating the success of the request.
						* @param {Object} result An object containing the result of the request.
						* @... {Array} members An array of objects describing the members of the category. Each object has a title, timestamp and namespace property describing the title of the member, the date and time it was added to the category and the ID (number) of the namespace to which it belongs.
						* @... {Object} bynamespace An object enumerating the members of the category by namespace ID (number). Each enumeration is an array of objects describing the members of the category that belong to each namespace. The elements in these arrays are objects with a title and timestamp property describing the title of the member and the date and time it was added to the category.
						* @paramset Failure
						* @param {Boolean} success A Boolean false indicating the failure of the request.
						* @param {Object} error An object containing information about why the request failed.
						* @... {String} code A short string identifying the cause of the failue.
						* @... {String} info A brief message explaining the failure.
						* @throws exception if there is an error during execution.
						* @returns Nothing.
						* @see getcategory
						* @author Oliver Moran
						* @since 0.3
						*/
						__luas_callback(true, {members:__luas_members, bynamespace:__luas_bynamespace});
					} catch(__luas_err) { Luasog.exception(__luas_err); }
				}
			} else {
				if (__luas_data.error != undefined) var __luas_result = __luas_data.error;
				try { 
					__luas_callback(false, __luas_result);
				} catch(__luas_err) { Luasog.exception(__luas_err); }
			}
		});
	};
    
	__luas_getcategory();
}

/**
 * Requests an alphabetically-sorted list of all of the 'Main' namespace pages that are members of a category, including all sub-categories. Each page is listed only once even if duplicates occur sub-category. Calling this method will implicitly populate the {@link namespace} property.
 * @function {public void} getpagesincategory
 * @param {Object} args An object containing parameters that will be used in the execution of the call. In this release, this object contains a single element: the title of the category to list.
 * @... {String} category The title of the category to list.
 * @param {Function} callback A function to be called with the result of the call. (See the {@link ongetpagesincategory} interface function.)
 * @... {Boolean} success A Boolean indicating the success or failure of the request.
 * @... {Object} result An object containing the result of the call.
 * @throws exception if invalid arguments are passed to the method.
 * @throws exception if there was an error during the callback (by use of the {@link checksignature} method).
 * @return Nothing.
 * @see ongetpagesincategory
 * @see getcategory
 * @author Oliver Moran
 * @since 0.3
 */
Luasog.prototype.getpagesincategory = function(__luas_args, __luas_callback){
	this.checksignature(arguments);

	var __luas_pages = new Array();
	var __luas_categories = new Array();
	
	var __luas_this = this;
	__luas_getpagesincategory = function(__luas_success, __luas_result){
		if (__luas_success){
			for (var __luas_member in __luas_result.bynamespace[__luas_this.numberforcanonicalnamespace()]) 
				__luas_pages.push(__luas_result.bynamespace[__luas_this.numberforcanonicalnamespace()][__luas_member].title);
			for (var __luas_member in __luas_result.bynamespace[__luas_this.numberforcanonicalnamespace("Category")]) 
				__luas_categories.push(__luas_result.bynamespace[__luas_this.numberforcanonicalnamespace("Category")][__luas_member].title);
		
			var __luas_category = __luas_categories.shift();
			if (__luas_category !== undefined) {
				__luas_this.getcategory({category:__luas_category}, __luas_getpagesincategory);
			} else {
				var __luas_i, __luas_j;
				
				// remove duplicates
				var __luas_sortedpages = new Array();
				for (__luas_i = 0; __luas_i<__luas_pages.length; __luas_i++){
					for (__luas_j = __luas_i+1; __luas_j<__luas_pages.length; __luas_j++){
						if (__luas_pages[__luas_i] == __luas_pages[__luas_j]) break;
					}
					if (__luas_j == __luas_pages.length) __luas_sortedpages.push(__luas_pages[__luas_i]);
				}
	
				// sort alphabetically
				for(__luas_i = 0; __luas_i < __luas_sortedpages.length; __luas_i++) {
					for(__luas_j = 0; __luas_j < (__luas_sortedpages.length-1); __luas_j++) {
						if(__luas_sortedpages[__luas_j] > __luas_sortedpages[__luas_j+1]) {
							var __luas_tmp = __luas_sortedpages[__luas_j+1];
							__luas_sortedpages[__luas_j+1] = __luas_sortedpages[__luas_j];
							__luas_sortedpages[__luas_j] = __luas_tmp;
						}
					}
				}
				
				__luas_result = {pages:__luas_sortedpages};
			}
		}
		try { 
			/**
			* The function called on completion of the {@link getpagesincategory} method.
			* @ifunction {local abstract void} ongetpagesincategory
			* @paramset Success
			* @param {Boolean} success A Boolean true indicating the success of the request.
			* @param {Object} result An object containing the result of the request.
			* @... {Array} pages An array of unqiue alphabetically-sorted string represenging the titles of 'Main' namespace pages that are members of the category, including sub-categories.
			* @paramset Failure
			* @param {Boolean} success A Boolean false indicating the failure of the request.
			* @param {Object} error An object containing information about why the request failed.
			* @... {String} code A short string identifying the cause of the failue.
			* @... {String} info A brief message explaining the failure.
			* @throws exception if there is an error during execution.
			* @returns Nothing.
			* @see getcategory
			* @author Oliver Moran
			* @since 0.3
			*/
			__luas_callback(__luas_success, __luas_result);
		} catch(__luas_err) { Luasog.exception(__luas_err); }
	};
	
	if (this.namespaces === undefined) this.getnamespaces(function(__luas_success, __luas_result){
			__luas_this.getcategory({category:__luas_args.category}, __luas_getpagesincategory);
		});
	else this.getcategory({category:__luas_args.category}, __luas_getpagesincategory);
}







/**
 * Returns the namespace ID (number) for a given canonical name. NB: This method will not automatically populate the {@link namespaces} property.
 * @function {private void} numberforcanonicalnamespace
 * @param {optional String} canonical The canonical name of a namespace. The 'Main' namespace does not have a canonical name. Do not pass this value or pass undefined as this value to return the namespace ID (number) of the Main namespace.
 * @throws exception if invalid arguments are passed to the method.
 * @return A number representing the namespace or undefined.
 * @see namespaces
 * @see ongetnamespaces
 * @author Oliver Moran
 * @since 0.3
 */
Luasog.prototype.numberforcanonicalnamespace = function(__luas_canonical){
	this.checksignature(arguments);

	for (var __luas_namespace in this.namespaces) 
		if (this.namespaces[__luas_namespace].canonical == __luas_canonical) 
			return parseInt(__luas_namespace);
	return undefined;
}

/**
 * Validates arguments passed to another method in the framework. This method is called by other methods in the framework and never needs to be called externally.
 * @function {private Boolean} checksignature
 * @param {Object} args An native arguments object of another method in the framework.
 * @throws exception if invalid arguments were passed to another method in the framework.
 * @return A Boolean false if invalid arguments were passed to a calling method from the framework. Otherwise, a Boolean true. In reality only a Boolean true will be returned since an exception will be thrown before false can be returned.
 * @author Oliver Moran
 * @since 0.2
 */
Luasog.prototype.checksignature = function(__luas_args){

	switch(__luas_args.callee){

		case this.poprequestqueue:
			if (typeof __luas_args[0] != undefined){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'request' function. Usage: request()."});
				return false;
			}
			break; // for completness

		case this.request:
			if (typeof __luas_args[0] != "object" || typeof __luas_args[1] != "function" || typeof __luas_args[2] != "undefined"){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'request' function. Usage: request(args:Object, callback:Function)."});
				return false;
			}
			break; // for completness
		
		case this.whoami:
			if (typeof __luas_args[0] != "function" || typeof __luas_args[1] != "undefined"){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'whoami' function. Usage: whoami(callback:Function)."});
				return false;
			}
			break; // for completness
			
		case this.login:
			if (typeof __luas_args[0] != "object" 
				|| typeof __luas_args[0].username != "string"
				|| typeof __luas_args[0].password != "string"
				|| (typeof __luas_args[0].token != "undefined" && typeof __luas_args[0].token != "string")
				|| typeof __luas_args[1] != "function"
				|| typeof __luas_args[2] != "undefined"){
					throw({ name: "invalid arguments", message: "Invalid arguments passed to 'login' function. Usage: login({ username:String, password:String[, token:String] }:Object, callback:Function)."});
					return false;
			}
			break; // for completness
			
		case this.logout:
			if (typeof __luas_args[0] != "function" || typeof __luas_args[1] != "undefined"){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'logout' function. Usage: logout(callback:Function)."});
					return false;
			}
			break; // for completness
			
		case this.get:
			if (typeof __luas_args[0] != "object" 
				|| typeof __luas_args[0].page != "string" 
				|| typeof __luas_args[1] != "function"
				|| typeof __luas_args[2] != "undefined"){
					throw({ name: "invalid arguments", message: "Invalid arguments passed to 'get' function. Usage: get({ page:String }:Object, callback:Function)."});
					return false;
			}
			break; // for completness
			
		case this.post:
			if (typeof __luas_args[0] != "object" 
				|| typeof __luas_args[0].page != "string"
				|| typeof __luas_args[0].content != "string"
				|| typeof __luas_args[0].summary != "string"
				|| (typeof __luas_args[0].timestamp != "undefined" && typeof __luas_args[0].timestamp != "string")
				|| typeof __luas_args[1] != "function" 
				|| typeof __luas_args[2] != "undefined"){
					throw({ name: "invalid arguments", message: "Invalid arguments passed to 'post' function. Usage: post({ page:String, content:String, summary:String[, timestamp:String] }:Object, callback:Function)."});
					return false;
			}
			break; // for completness
			
		case this.getnamespaces:
			if (typeof __luas_args[0] != "function" || typeof __luas_args[1] != "undefined"){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'getnamespaces' function. Usage: getnamespaces(callback:Function)."});
					return false;
			}
			break; // for completness

		case this.numberforcanonicalnamespace:
			if ((typeof __luas_args[0] != "string" && typeof __luas_args[0] != "undefined") || typeof __luas_args[1] != "undefined"){
				throw({ name: "invalid arguments", message: "Invalid arguments passed to 'numberforcanonicalnamespace' function. Usage: numberforcanonicalnamespace([canonical:String])."});
					return false;
			}
			break; // for completness

		case this.getcategory:
			if (typeof __luas_args[0] != "object" 
				|| typeof __luas_args[0].category != "string"
				|| typeof __luas_args[1] != "function" 
				|| typeof __luas_args[2] != "undefined"){
					throw({ name: "invalid arguments", message: "Invalid arguments passed to 'getcategory' function. Usage: getcategory({ category:String }:Object, callback:Function)."});
					return false;
			}
			break; // for completness

		case this.getpagesincategory:
			if (typeof __luas_args[0] != "object" 
				|| typeof __luas_args[0].category != "string"
				|| typeof __luas_args[1] != "function" 
				|| typeof __luas_args[2] != "undefined"){
					throw({ name: "invalid arguments", message: "Invalid arguments passed to 'getpagesincategory' function. Usage: getpagesincategory({ category:String }:Object, callback:Function)."});
					return false;
			}
			break; // for completness

	}
	
	return true;
}