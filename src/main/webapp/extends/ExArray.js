/**
 * Array 기능 확장
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

/**
 * element가 배열에 포함하는지 검사
 * @param {Object} element
 */
Array.prototype.contains = function(element){
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
}

/**
 * 첫번째 Element 반환
 */
Array.prototype.getFirstElement=function() 
{
   if (this[0] != null) 
   {
      return this[0];
   }
}

/**
 * 마지막 Element 반환
 */
Array.prototype.getLastElement=function() 
{
   if (this[this.length - 1] != null) 
   {
      return this[this.length - 1];
   }
}

/**
 * 빈 배열인지 검사
 */
Array.prototype.isEmpty=function() 
{
   return this.length == 0;
}

/**
 * 배열에서 obj 삭제
 * @param {Object} obj
 */
Array.prototype.remove=function(obj){	
	//var i = this.indexOf(obj);
	//if(i != -1) this.splice(i, 1);
	
	// indexOf는 JavaScript 1.6 부터 지원 한다. (문제가 있다면 for문으로)
	for (var i=0; i < this.length; i++){
		if (obj == this[i]) this.splice(i, 1);
	}
}

// Array Remove - By John Resig (MIT Licensed)
// http://ejohn.org/blog/javascript-array-remove/
Array.prototype.removeElementAt = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

// SWAP
Array.prototype.swap = function(a, b){
    var tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
}

// Array.insert( index, value ) - Insert value at index, without overwriting existing keys
Array.prototype.insertAndReturn = function(i, v){
    if (i >= 0) {
        var a = this.slice(), b = a.splice(i);
        a[i] = v;
        return a.concat(b);
    }
};

// Array.insert( index, value )
Array.prototype.insert = function(i, v){
    if (i >= 0) {
		this.splice(i, 0, v);        
    }
};

[].indexOf || (Array.prototype.indexOf = function(v, n){
    n = (n == null) ? 0 : n;
    var m = this.length;
    for (var i = n; i < m; i++) 
        if (this[i] == v) 
            return i;
    return -1;
});

