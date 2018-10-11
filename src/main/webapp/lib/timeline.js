//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/classes/timeline [rev. #0]

TimeLine = function(fps, f){
	this.fps = fps, this.frames = f;
};
with({o: TimeLine, $: TimeLine.prototype}){
	o.timers = [];
	$.running = !!($.current = +(o.timer = $.time = null));
	o.run = function(){
		var o = this;
		o.timer || (o.timer = setInterval(function(){
			for(var h, d = +(new Date), t = o.timers, i = t.length; i--;){
				(!t[i].running || ((d - t[i].time) / (1e3 / t[i].fps) > t[i].current + 1 &&
				t[i].onframe(++t[i].current), t[i].current >= t[i].frames)) &&
				(h = t.splice(i, 1)[0], h.stop(1));
			}
		}, 1));
	};
	$.start = function(c){
		var o = this, t = TimeLine;
		if(o.running) return;
		o.running = true, o.current = c || 0;
		o.time = new Date, o.onstart && o.onstart();
		if(!o.onframe || o.frames <= 0 || o.fps <= 0)
			return o.stop(1);
		t.timers.push(this), t.run();
	};
	$.stop = function(){
		var o = this;
		o.running = false;
		if(!TimeLine.timers.length)
			TimeLine.timer = clearInterval(TimeLine.timer), null;
		arguments.length && o.onstop && o.onstop();
	};
}