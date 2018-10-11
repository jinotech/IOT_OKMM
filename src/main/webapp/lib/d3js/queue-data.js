function QueueData() {
	this.table = null;
	this.chartContainerId = 'ca-dwr';
	this.history = [];
	this.drawing = false;
	this.drawing_activeLine = null;
	
	this.init.apply(this, arguments);
}

QueueData.prototype.init = function(id) {
	this.table = document.getElementById(id);
};

QueueData.prototype.addHistory = function(X, colname, rowname) {
	this.history.push({ X:X, colname: colname,  rowname:rowname});
};

QueueData.prototype.getLastHistory = function() {
	return this.history[this.history.length-1];
};

QueueData.prototype.previousHistory = function() {
	if(this.history.length > 1){
		this.history.pop();
	}
};

// Who does what ?
// username and action columns
QueueData.prototype.readUsernameAndAction = function () {
	var users = [], actions = [], user = '', action = '', user_idx = {}, action_idx = {};
	for (var i = 1, row; row = this.table.rows[i]; i++) {
   		action = row.cells[0].innerHTML;
   		user = row.cells[1].innerHTML;
   		if(action_idx[action] === undefined){
   			action_idx[action] = actions.length;
   			actions.push(action);
   		};
   		if(user_idx[user] === undefined){
   			user_idx[user] = users.length;
   			users.push(user);
   		}
	}

	var X = numeric.rep([users.length, actions.length], 0);
	for (var i = 1, row; row = this.table.rows[i]; i++) {
		action = row.cells[0].innerHTML;
   		user = row.cells[1].innerHTML;
   		X[user_idx[user]][action_idx[action]] += 1;
	}
	this.addHistory(X, actions, users);
};

// Who tells about what ?
// username and etc columns
QueueData.prototype.readUsernameAndEtc = function() {
	var users = [], keywords = [], user = '', keyword = '', user_idx = {}, keyword_idx = {}, str = '', w = [];
	for (var i = 1, row; row = this.table.rows[i]; i++) {
   		str = row.cells[4].innerHTML;
   		user = row.cells[1].innerHTML;
   		w[i] = this.getKeywords(str); 
   		w[i].forEach(function(val){
   			if(val != ""){
   		   		if(keyword_idx[val] === undefined){
   		   			keyword_idx[val] = keywords.length;
   		   			keywords.push(val);
   		   		};
   			}
   		});
   		if(user_idx[user] === undefined){
   			user_idx[user] = users.length;
   			users.push(user);
   		}
	}
	var X = numeric.rep([keywords.length, users.length], 0);
	for (var i = 1, row; row = this.table.rows[i]; i++) {
		user = row.cells[1].innerHTML;
		w[i].forEach(function(val) {
			if(val != ""){
				X[keyword_idx[val]][user_idx[user]] += 1;
			}
		});
	}
	this.addHistory(X, users, keywords);
};

QueueData.prototype.getKeywords = function(html) {
	if(html){
		try {
			var div = document.createElement("div");
	        div.innerHTML = html;
	        if(div.children.length > 0 ) return [];
	        var str = document.all ? div.innerText : div.textContent;
	        if(str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) return [];
	        str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\n\"\']/g,"")
	        		.replace(/\s{2,}/g," ")
	        		.toUpperCase();
	        return str.split(" ");
		} catch (e) {
			return [];
		}
    }else return [];
};

QueueData.prototype.ca = function () {
	try {
		var data = this.getLastHistory();
		var X = data.X;
		var nb_col = data.colname.length;
		var nb_row = data.rowname.length;
		var k = 2;
	
		if(nb_col <= k) {
			this.previousHistory();
			alert('The number of columns must be greater than ' + k);
			return false;
		};
	
		var q = numeric.rep([1, nb_col], 0)[0];
		var p = numeric.rep([1, nb_row], 0)[0];
	
		for (var i = 0; i < nb_row; i++) {
			for (var j = 0; j < nb_col; j++) {
				p[i] += X[i][j];
				q[j] += X[i][j];
			}
		}
	
		var V0 = numeric.rep([nb_row, nb_col], 0);
		for (var i = 0; i < nb_row; i++) {
			for (var j = 0; j < nb_col; j++) {
				V0[i][j] = (X[i][j]/Math.sqrt(p[i]*q[j])) || 0;
			}
		}
	
		var V1 = numeric.rep([nb_col, nb_row], 0);
		for (var j = 0; j < nb_col; j++) {
			for (var i = 0; i < nb_row; i++)
				V1[j][i] = V0[i][j] || 0;
		}
		var V = numeric.dotMMbig(V1, V0);
		var ev = numeric.eig(V);
		
		var index = [];
		for (var i = 0; i < nb_col; i++) 
			index[i] = {'id': i, 'val': ev.lambda.x[i]};
		index.sort(function(a, b) {return b.val - a.val;});
		
		var u = numeric.rep([nb_col, k], 0);
		for (var i = 0; i < nb_col; i++) {
			for (var j = 0; j < k; j++) {
				u[i][j] = (ev.E.x[i][index[j+1].id]/Math.sqrt(q[i])) || 0;
			}
		}
	
		for (var i = 0; i < nb_row; i++) {
			for (var j = 0; j < nb_col; j++) {
				X[i][j] = (X[i][j]/p[i]) || 0;
			}
		}
	
		var Z = numeric.dot(X, u);
		var W = numeric.rep([nb_col, k], 0);
		for (var i = 0; i < nb_col; i++) {
			for (var j = 0; j < k; j++) {
				W[i][j] = (u[i][j]*Math.sqrt(ev.lambda.x[j+1])) || 0;
			}
		}
		return { Z: Z, W: W, colname: data.colname, rowname: data.rowname };
	} catch(err) {
	    alert(err.message);
	}
};

QueueData.prototype.dwr = function(ca) {
	if(ca === false) return true;
	var self = this;
	var usersData = [], actionsData = [];
	var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
	ca.Z.forEach(function(val, idx){
		usersData.push({ x: val[0], y: val[1], lbl: ca.rowname[idx] });
		xMin = Math.min(val[0], xMin);
		xMax = Math.max(val[0], xMax);
		yMin = Math.min(val[1], yMin);
		yMax = Math.max(val[1], yMax);
	});
	ca.W.forEach(function(val, idx){
		actionsData.push({ x: val[0], y: val[1], lbl: ca.colname[idx] });
		xMin = Math.min(val[0], xMin);
		xMax = Math.max(val[0], xMax);
		yMin = Math.min(val[1], yMin);
		yMax = Math.max(val[1], yMax);
	});
	
	var margin = { top: 50, right: 150, bottom: 50, left: 50 },
		padding = 0.02,
    	outerWidth = 800,
    	outerHeight = 700,
    	width = outerWidth - margin.left - margin.right,
    	height = outerHeight - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]).nice(),
		y = d3.scale.linear().range([height, 0]).nice();
	
	var cell = Math.max(xMin < 0 ? -1*xMin:xMin, xMax, yMin < 0 ? -1*yMin:yMin, yMax);
	cell += padding;
	x.domain([-cell, cell]);
  	y.domain([-cell, cell]);

  	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height);
  	var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width);
  	var color = d3.scale.category10();
  	var tip = d3.tip()
      			.attr("class", "d3-tip")
      			.offset([-10, 0])
      			.html(function(d) { return d.lbl; });
  	
  	d3.select("#"+this.chartContainerId+" svg").remove();
  	d3.select(".d3-tip").remove();
  	
  	var svg = d3.select("#"+this.chartContainerId)
  				.style("width", outerWidth + "px")
  				.style("height", outerHeight + "px")
  				.style("margin", "0px auto")
  				.append("svg")
			    .attr("width", outerWidth)
			    .attr("height", outerHeight)
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	svg.call(tip);
	// canvas
	svg.append("g")
		.attr('class', "canvas");
	svg.append("rect")
      	.attr("width", width)
      	.attr("height", height)
      	.call(d3.behavior.drag()
	    .on("dragstart", function(){
	    	if(!self.drawing) return true;
	    	self.activeLine = d3.select("#"+self.chartContainerId + ' svg .canvas')
	    						.append("path")
	    						.attr("class", "line")
								.style("fill", "rgba(56, 241, 109, 0.46)")
								.style("stroke", "#44cc6b")
								.style("stroke-width", "2px")
								.style("stroke-linejoin", "round")
								.style("stroke-linecap", "round")
	    						.datum([]);
  			self.activeLine.datum().push(d3.mouse(this));
	    })
	    .on("drag", function(){
	    	if(!self.drawing) return true;
	    	self.activeLine.datum().push(d3.mouse(this));
  			self.activeLine.attr("d", d3.svg.line()
			    .x(function(d) { return d[0]; })
			    .y(function(d) { return d[1]; })
			    .tension(0)
			    .interpolate("basis-closed")
			);
	    })
	    .on("dragend", function(){
	    	if(!self.drawing) return true;
	    	self.activeLine = null;
	    }));
	// end canvas
	svg.append("g")
      	.classed("x axis", true)
      	.attr("transform", "translate(0," + height + ")")
      	.call(xAxis);
    svg.append("g")
      	.classed("y axis", true)
      	.call(yAxis);

    var triangle = d3.svg.symbol().type("triangle-up");
    var objects = svg.append("svg")
      	.classed("objects", true)
      	.attr("width", width)
      	.attr("height", height);

  	objects.append("svg:line")
      	.classed("axisLine hAxisLine", true)
      	.attr("x1", 0)
      	.attr("y1", 0)
      	.attr("x2", width)
      	.attr("y2", 0)
      	.attr("transform", "translate(0," + (height/2) + ")");

  	objects.append("svg:line")
      	.classed("axisLine vAxisLine", true)
      	.attr("x1", 0)
      	.attr("y1", 0)
      	.attr("x2", 0)
      	.attr("y2", height)
      	.attr("transform", "translate(" + (width/2) + ", 0)");
    
    var triangles = objects.selectAll(".triangle")
      	.data(usersData)
	    .enter().append("g")
	      	.classed("triangle", true)
		    .attr("transform", function(d){ return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
  	triangles.append("path")
      	.attr("d", triangle())
      	.style("fill", "blue")
      	.on("mouseover", tip.show)
      	.on("mouseout", tip.hide);

	var rects = objects.selectAll(".rect")
      	.data(actionsData)
	    .enter().append("g")
	      	.classed("rect", true)
		    .attr("transform", function(d){ return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
  	rects.append("rect")
      	.attr("width", 10)
      	.attr("height", 10)
      	.style("fill", "red");
    rects.append("text")
    	.attr("transform", "translate(5,-5)")
    	.style("text-anchor", "middle")
    	.style("font-family", "'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif")
    	.style("font-size", 11)
    	.text(function(d){ return d.lbl; });

    // toolbox
    var toolbox = d3.select("#"+self.chartContainerId + ' svg')
  				.append("g")
			    .attr("transform", "translate(" + (outerWidth - margin.right + 25) + "," + margin.top + ")");
	// Drawing button
	var btn = toolbox.append("g");
	btn.append("rect").attr("width", 100).attr("height", 29).style("fill", self.drawing ? "#f5f5f5":"#ffffff").style("stroke", "#cccccc").attr("cursor", "pointer");
    btn.append("path").attr("width", 12).attr("height", 12).style("pointer-events", "none").style("fill", "#333333")
    	.attr("d", "M13,18.47V21h2.53l7.33-7.4-2.53-2.53Zm11.8-6.8a.64.64,0,0,0,0-.93L23.27,9.2a.64.64,0,0,0-.93,0l-1.2,1.2,2.53,2.53Z");
    btn.append("text").attr("transform", "translate(36.5 19.11)").style("pointer-events", "none")
    	.style("font-family", "'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif")
    	.style("font-size", 13).style("fill", "#333333")
    	.text(function(){
  			return self.drawing ? "Drawn":"Drawing";
  		});
    btn.on("click", function(){
  		self.drawing = !self.drawing;
  		d3.select(this).select("rect").style("fill", self.drawing ? "#f5f5f5":"#ffffff");
  		d3.select(this).select("text").text(function(){
  			return self.drawing ? "Drawn":"Drawing";
  		});
  	});

  	// Clear all button
	var btn = toolbox.append("g").attr("transform", "translate(0,40)");
	btn.append("rect").attr("width", 100).attr("height", 29).style("fill", "#ffffff").style("stroke", "#cccccc").attr("cursor", "pointer");
    btn.append("path").attr("width", 12).attr("height", 12).style("pointer-events", "none").style("fill", "#333333")
    	.attr("d", "M19,10.17v.72h4.27v8.67A1.45,1.45,0,0,1,21.83,21H16.06a1.45,1.45,0,0,1-1.45-1.44V10.89H19v-.72H13.89V8.72h2.53L17.14,8h3.61l.72.72H24v1.45Z");
    btn.append("text").text("Clear all").attr("transform", "translate(36.5 19.11)").style("pointer-events", "none")
    	.style("font-family", "'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif")
    	.style("font-size", 13).style("fill", "#333333");
    btn.on("click", function(){
  		d3.selectAll("#"+self.chartContainerId + ' svg .canvas .line').remove();
  	});

  	// CA button
	var btn = toolbox.append("g").attr("transform", "translate(0,80)");
	btn.append("rect").attr("width", 100).attr("height", 29).style("fill", "#ffffff").style("stroke", "#cccccc").attr("cursor", "pointer");
    btn.append("path").attr("width", 12).attr("height", 12).style("pointer-events", "none").style("fill", "#333333")
    	.attr("d", "M23.73,14.76,15.45,9a.29.29,0,0,0-.45.24V20.71a.29.29,0,0,0,.45.24l8.29-5.71a.29.29,0,0,0,0-.47Z");
    btn.append("text").text("Analysis").attr("transform", "translate(36.5 19.11)").style("pointer-events", "none")
    	.style("font-family", "'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif")
    	.style("font-size", 13).style("fill", "#333333");
    btn.on("click", function(){
    	var cur = self.getLastHistory();
    	var user_cnt = 0;
    	var new_users_idx = {};
    	var action_cnt = 0;
    	var new_actions_idx = {};
  		d3.selectAll("#"+self.chartContainerId + ' svg .canvas .line')
		.each(function(d, i){
    		usersData.forEach(function(p){
    			if(self.inside([x(p.x), y(p.y)], d)){
    				new_users_idx[p.lbl] = 1;
    				user_cnt++;
    			}
    		});
    		actionsData.forEach(function(p){
    			if(self.inside([x(p.x), y(p.y)], d)){
    				new_actions_idx[p.lbl] = 1;
    				action_cnt++;
    			}
    		});
    	});
		
    	var new_X = numeric.rep([user_cnt, action_cnt], 0);
    	user_cnt = 0;
		for (var i = 0; i < cur.rowname.length; i++) {
			if(new_users_idx[cur.rowname[i]]){
				action_cnt = 0;
				for (var j = 0; j < cur.colname.length; j++) {
					if(new_actions_idx[cur.colname[j]] ){
						new_X[user_cnt][action_cnt] = cur.X[i][j];
						action_cnt++;
					}
				}
				user_cnt++;
			}
		}
		var new_colname = [], new_rowname = [];
		for (var i = 0; i < cur.rowname.length; i++) {
			if(new_users_idx[cur.rowname[i]]){
				new_rowname.push(cur.rowname[i]);
			}
		}
		for (var j = 0; j < cur.colname.length; j++) {
			if(new_actions_idx[cur.colname[j]] ){
				new_colname.push(cur.colname[j]);
			}
		}
		self.addHistory(new_X, new_colname, new_rowname);
		self.dwr(self.ca());
  	});

  	// Back button
	var btn = toolbox.append("g").attr("transform", "translate(0,120)");
	btn.append("rect").attr("width", 100).attr("height", 29).style("fill", "#ffffff").style("stroke", "#cccccc").attr("cursor", "pointer");
    btn.append("path").attr("width", 12).attr("height", 12).style("pointer-events", "none").style("fill", "#333333")
    	.attr("d", "M18,14.57l5-5a.29.29,0,0,0,0-.41l-.55-.55a.29.29,0,0,0-.41,0l-5.71,5.71a.29.29,0,0,0,0,.41l5.71,5.71a.29.29,0,0,0,.41,0l.55-.55a.29.29,0,0,0,0-.41Z");
    btn.append("text").text("Back").attr("transform", "translate(36.5 19.11)").style("pointer-events", "none")
    	.style("font-family", "'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif")
    	.style("font-size", 13).style("fill", "#333333");
    btn.on("click", function(){
    	self.previousHistory();
  		self.dwr(self.ca());
  	});
};
QueueData.prototype.inside = function(point, polygon) {
	var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
