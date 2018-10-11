/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// jBrainNode ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jBrainNode = function(param){
	var parentNode = param.parent;
	var text = param.text;
	var id = param.id;
	var index = param.index;
	var position = param.position;
	
	jBrainNode.superclass.call(this, parentNode, text, id, index, position);
}

extend(jBrainNode, jCustom);
jBrainNode.prototype.type = "jBrainNode";

jBrainNode.prototype.updateBody = function(){
	var x = this.x;
	var y = this.y;
	var width = this.width;
	var height = this.height;
	var path = "";
	
	if(this.getDepth() == 0){
		path = [ 
		            "M", x-38, y+220, 
		            "Q", x-35, y+131, x-130, y+158,
		            "Q", x-155, y+160, x-160, y+135,
		            "Q", x-150, y+90, x-175, y+93,
		            "Q", x-188, y+84, x-178, y+70,
		            "Q", x-188, y+60, x-180, y+48,
		            "Q", x-170, y+35, x-190, y+29,
		            "Q", x-220, y+15, x-190, y-1,
		            "Q", x-150, y-25, x-149, y-110,
		            "Q", x-150, y-120, x-140, y-135,
		            "Q", x-133, y-149, x-120, y-160,
		            "Q", x-29, y-247, x+80, y-220,
		            "Q", x+130, y-210, x+150, y-195,
		            "Q", x+205, y-165, x+225, y-125,
		            "Q", x+290, y ,x+150, y+100,
		            "Q", x+100, y+135, x+150, y+180,
		            
		            	         
		       ].join(",");
		
	} else if(this.getDepth() == 1) {
		if(this.getIndexPos() == 0) {
			var rx = x-39;
			var ry = y+43.5;
			
			path = [ 
			         "M", rx, ry, // 가운데 노드
			         "C", rx-5, ry+10, rx+17, ry+10, rx+15, ry+2,
			         "C", rx+10, ry+12, rx+33, ry+13, rx+30, ry+3, 
			         "C", rx+28, ry+13, rx+48, ry+15, rx+45, ry+5,
			         "C", rx+41, ry+15, rx+75, ry+17, rx+70, ry+7,
			         "C", rx+70, ry+17, rx+100, ry+7, rx+95, ry-3, 
			         "C", rx+95, ry+7, rx+115, ry, rx+110, ry-10,
			         "C", rx+110, ry, rx+123, ry-9, rx+115, ry-15,
			         "C", rx+123, ry-5, rx+125, ry-37, rx+118, ry-30,
			         "C", rx+123, ry-30, rx+120, ry-65, rx+112, ry-60,
			         "C", rx+122, ry-58, rx+118, ry-82, rx+108, ry-70,
			         "C", rx+115, ry-72, rx+113, ry-85, rx+105, ry-78,
			         "C", rx+115, ry-88, rx+80, ry-93, rx+82, ry-83,
			         "C", rx+87, ry-93, rx+64, ry-93, rx+68, ry-86,
			         "C", rx+70, ry-96, rx+54, ry-97, rx+56, ry-90,
			         "C", rx+60, ry-97, rx+37, ry-99, rx+40, ry-93,
			         "C", rx+43, ry-99, rx+33, ry-100, rx+34, ry-94, 
			         "C", rx+31, ry-102, rx-3, ry-103, rx+4, ry-90,
			         "C", rx+3, ry-100, rx-24, ry-90, rx-20, ry-85,
			         "C", rx-18, ry-92, rx-35, ry-88, rx-30, ry-80,
			         "C", rx-40, ry-95, rx-63, ry-55, rx-50, ry-55,
			         "C", rx-60, ry-60, rx-60, ry-30, rx-48, ry-35,
			         "C", rx-60, ry-36, rx-50, ry-15, rx-40, ry-20,
			         "C", rx-45, ry-5, rx+2, ry+15, rx, ry,
			         
			        
			         ].join(",");
		
			
		} else if(this.getIndexPos() == 1) {
			var rx = x-135;
			var ry = y-57.5; 	
			
			path = [       
			         "M", rx+135, ry+100, // 우측 밑 노드
			         "C", rx+140, ry+108, rx+165, ry+88, rx+155, ry+85,
			         "C", rx+161, ry+90, rx+167, ry+80, rx+162, ry+78, 
			         "C", rx+167, ry+82, rx+172, ry+72, rx+167, ry+72,
			         "C", rx+178, ry+82, rx+190, ry+60, rx+182, ry+58, 
			         "C", rx+189, ry+62, rx+190, ry+35, rx+185, ry+35, 
			         "C", rx+188, ry+26, rx+175, ry+20, rx+174, ry+23,
			         "C", rx+180, ry+16, rx+160, ry+7, rx+160, ry+13,
			         "C", rx+163, ry+8, rx+150, ry+3, rx+150, ry+8, 
			         "C", rx+155, ry+3, rx+138, ry-3, rx+135, ry+6,
			         "C", rx+140, ry, rx+116, ry-4, rx+118, ry+5, 
			         "C", rx+120, ry-1, rx+105, ry-1, rx+110, ry+8,
			         "C", rx+100, ry+3, rx+85, ry+25, rx+95, ry+22,
			         "C", rx+85, ry+20, rx+75, ry+45, rx+86, ry+45, 
			         "C", rx+79, ry+40, rx+75, ry+55, rx+85, ry+55,
			         "C", rx+80, ry+52, rx+77, ry+72, rx+86, ry+70,
			         "C", rx+80, ry+65, rx+85, ry+90, rx+92, ry+85,
			         "C", rx+90, ry+93, rx+103, ry+101, rx+105, ry+95,
			         "C", rx+100, ry+100, rx+145, ry+105, rx+135, ry+100
			         ].join(",");
			
		} else if(this.getIndexPos() == 2) {
			var rx = x-193.5;
			var ry = y+66; 
			
			path = [           
			         "M", rx+130, ry-10, // 오른쪽 위 노드
			         "C", rx+125, ry, rx+152, ry, rx+150, ry-6,
			         "C", rx+145, ry+2, rx+171, ry+13, rx+170, ry+5,
			         "C", rx+165, ry+13, rx+181, ry+18, rx+180, ry+12,
			         "C", rx+175, ry+18, rx+190, ry+28, rx+190, ry+18,
			         "C", rx+185, ry+28, rx+225, ry+22, rx+215, ry+12,
			         "C", rx+225, ry+17, rx+235, ry-2, rx+225, ry-2,
			         "C", rx+235, ry+2, rx+235, ry-10, rx+227, ry-7, 
			         "C", rx+240, ry-7, rx+240, ry-22, rx+233, ry-20,
			         "C", rx+242, ry-15, rx+244, ry-55, rx+233, ry-50,
			         "C", rx+243, ry-45, rx+240, ry-95, rx+228, ry-90,
			         "C", rx+235, ry-90, rx+233, ry-100, rx+226, ry-95,
			         "C", rx+233, ry-95, rx+230, ry-115, rx+221, ry-110,
			         "C", rx+226, ry-108, rx+220, ry-123, rx+216, ry-120,
			         "C", rx+222, ry-120, rx+214, ry-136, rx+211, ry-135,
			         "C", rx+215, ry-140, rx+192, ry-140, rx+197, ry-132,
			         "C", rx+200, ry-135, rx+178, ry-135, rx+180, ry-127,
			         "C", rx+183, ry-132, rx+150, ry-130, rx+155, ry-117,
			         "C", rx+158, ry-126, rx+102, ry-120, rx+110, ry-100,
			         "C", rx+105, ry-103, rx+96, ry-87, rx+106, ry-90,
			         "C", rx+108, ry-93, rx+113, ry-76, rx+120, ry-80,
			         "C", rx+118, ry-82, rx+120, ry-56, rx+130, ry-60,
			         "C", rx+125, ry-65, rx+130, ry-35, rx+135, ry-40,
			         "C", rx+125, ry-43, rx+125, ry-7, rx+130, ry-10
			         ].join(",");
			
		} else if(this.getIndexPos() == 3) {
			var rx = x-90;
			var ry = y+163.5;	
				
			path = [ 
			    "M", rx+90, ry-110,
	            "C", rx+87, ry-100, rx+112, ry-100, rx+105, ry-115,	   
	            "C", rx+100, ry-105, rx+145, ry-120, rx+135, ry-135,
	            "C", rx+135, ry-125, rx+170, ry-130, rx+160, ry-140,
	            "C", rx+158, ry-130, rx+190, ry-135, rx+180, ry-145,
	            "C", rx+188, ry-140, rx+190, ry-165, rx+182, ry-160,
	            "C", rx+188, ry-170, rx+155, ry-180, rx+160, ry-170,
	            "C", rx+165, ry-180, rx+128, ry-205, rx+130, ry-192,
	            "C", rx+135, ry-200, rx+105, ry-210, rx+110, ry-202,
	            "C", rx+115, ry-210, rx+98, ry-213, rx+100, ry-206,
	            "C", rx+105, ry-213, rx+80, ry-215, rx+85, ry-210,
	            "C", rx+90, ry-223, rx+43, ry-223, rx+50, ry-215,
	            "C", rx+55, ry-225, rx+35, ry-225, rx+40, ry-217,
	            "C", rx+45, ry-225, rx+20, ry-220,  rx+25, ry-215,
	            "C", rx+30, ry-222, rx-5, ry-217, rx, ry-210, 
	            "C", rx-9, ry-215, rx-20, ry-198, rx-10, ry-200,
	            "C", rx-20, ry-205, rx-13, ry-175, rx-8, ry-180,
	            "C", rx-15, ry-185, rx-10, ry-145, rx-2, ry-150,
	            "C", rx-12, ry-155, rx-8, ry-130, rx+2, ry-135,
	            "C", rx-8, ry-137, rx-5, ry-105, rx+5, ry-110,
	            "C", rx, ry-105, rx+23, ry-108, rx+20, ry-112, 
	            "C", rx+15, ry-102, rx+50, ry-104, rx+45, ry-114,
	            "C", rx+40, ry-104, rx+95, ry-100, rx+90, ry-110,
	            ].join(",");
		
		} else if(this.getIndexPos() == 4) {
			var rx = x+75;
			var ry = y+75+62.5; 
			
			path = [ 
			        "M", rx-30, ry-110,
		            "C", rx-23, ry-105, rx-16, ry-130, rx-25, ry-125, 
		            "C", rx-20, ry-120, rx-6, ry-150, rx-15, ry-145,
		            "C", rx-9, ry-142, rx-10, ry-164, rx-17, ry-160,
		            "C", rx-11, ry-155, rx-14, ry-195, rx-22, ry-190,
		            "C", rx-17, ry-200, rx-45, ry-205, rx-40, ry-200,
		            "C", rx-40, ry-205, rx-55, ry-202, rx-50, ry-197,
		            "C", rx-50, ry-200, rx-73, ry-198, rx-70, ry-190,
		            "C", rx-68, ry-195, rx-88, ry-187, rx-85, ry-180,
		            "C", rx-82, ry-187, rx-115, ry-168, rx-110, ry-160,
		            "C", rx-110, ry-165, rx-130, ry-145, rx-125, ry-140,
		            "C", rx-130, ry-145, rx-138, ry-120, rx-132, ry-125, 
		            "C", rx-138, ry-123, rx-138, ry-112, rx-132, ry-115,
		            "C", rx-138, ry-118, rx-140, ry-97, rx-135, ry-100,
		            "C", rx-140, ry-103, rx-142, ry-72, rx-130, ry-75, 
		            "C", rx-132, ry-68, rx-102, ry-73, rx-105, ry-78,
		            "C", rx-108, ry-73, rx-92, ry-75, rx-95, ry-80,
		            "C", rx-98, ry-75, rx-76, ry-80, rx-80, ry-85,
		            "C", rx-85, ry-80, rx-55, ry-85, rx-60, ry-93, 
		            "C", rx-65, ry-85, rx-25, ry-105, rx-30, ry-110,
		            
		            
		       ].join(",");
	
		}else if(this.getIndexPos() == 5) {
			
			path = [ 
			        "M", x, y,
		            "A", 1, 1, 0, 1, 1, x+0.5, y+0.5,
		            "Z",
		            "M", x+4, y-2,
		            "L", x+6, y-10,
		            "L", x+13, y+2,
		            "Z",
		            "M", x+10, y-4,
		            "Q", x+15, y-45, x+45, y-30,
		            "T",  x+70, y-50,
		           
		       ].join(",");
	
		}else if(this.getIndexPos() == 6) {

			path = [ 
			        "M", x, y,
			        "A", 1, 1, 0, 1, 1, x+0.5, y+0.5,
		            "Z",
		            "M", x-2, y-4,
		            "L", x-5, y-15, 
		            "L", x-15, y-2,
		            "Z",
		            "M", x-10, y-10,
		            "Q", x-30, y, x-40, y-30, 
		            "T", x-70, y-60,
		            
		            
		            
		           
		            
		            ].join(",");
		}
		
	} else if(this.getDepth() == 2) {
		
		if(this.getIndexPos() == 0){
				
				 path = [ 
					        "M", x, y,
					        "A", 8, 8, 0, 1, 1, x-10.5, y-79,
					        "Z",
					        "M", x-20, y-140,
					        "A", 11, 11, 0, 1, 1, x-20.5, y-139,
					        "Z",
					        "M", x-30, y-220,
					        "A", 16, 16, 0, 1, 1 , x-30.5, y-219,
					        "Z",
					        "M", x-40, y-300,
	     			        "A", width+5+(height/width), height+(width/height), 0, 1, 1, x-40.5, y-299,
					        "Z",
				            
				            ].join(",");
		
		} else if(this.getIndexPos() == 1){
			
			path = [ 
			        "M", x+40, y-78,
			        "A", 8,8,0,1,1, x+40.5, y-77.9,
			        "Z",
			        "M", x+50, y-140,
			        "A", 11,11,0,1,1, x+50.5, y-139,
			        "Z", 
			        "M", x+65, y-218,
			        "A", 16,16,0,1,1,x+65.5, y-217,
			        "Z",
			        "M", x+80, y-300,
			        "A", width+5+(height/width), height+(width/height), 0, 1, 1, x+80.5, y-299,
			        "Z",
			        
			        ].join(",");  
	
		}
	
	}	 

	
this.branch.width = 2;	
this.body.attr({path: path });



}