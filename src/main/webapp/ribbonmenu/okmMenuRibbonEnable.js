

/////////////////////menu_list///////////////////////////////
var isOwner_menu_list = new Array("changeMapName");

var canEdit_menu_list = new Array(	"saveMap",
									"saveAsMap",
									"delMap",
									"okmPreference",
									"nodeColorMix",
									"changeMapBackgroundAction",
									"groupManage",
									"shareManage",
									"createEmbedTag",
									"exportFile",
									"clipBoard",
									"FacebookGetFeedAction",
									//"presentationStartMode",
									"presentationEditMode",
									"foldingall",
									//"zoominAction",
									//"zoomoutAction",
									//"zoomnotAction",
									"changeToMindmap",
									"changeToTree",
									"changeToFishbone",
									"changeToSunburst",
									"changeToZoomableTreemap",
									"changeToPadlet",
									"activityMonitoring",
									"googleSearch",
									"courseEnrolment",
									"moreMapStyleAction"
								 );

var canCopyNode_menu_list = new Array(
		"exportFile",
		"clipBoard"
);

var selected_menu_list = new Array(  "splitMap",
									 "insertAction",
									 "addMoodleActivityAction",
									 "insertSiblingAction",
									 "imageProviderAction",
									 "videoProviderAction",
									 "insertHyperAction",
									 "insertIFrameAction",
									 "insertWebPageAction",
									 "insertLTIAction",
									 "nodeTextColorAction",
									 "nodeBGColorAction",
									 "foldingAction",
									 "ShiftenterAction",
									 "CtrlRAction",
									 "editNodeAction",
									 "cutAction",
									 "copyAction",
									 "pasteAction",
									 "deleteAction",
									 "moreAddAction",
									 "nodeLineColor"

);

var isOwnerMenu = function(isOwner){
	if(isOwner == "true"){
		for(var i=0; i<isOwner_menu_list.length; i++){
			$("#"+isOwner_menu_list[i]).removeClass('disabled');
			$("#"+isOwner_menu_list[i]).attr('onclick',isOwner_menu_list[i]+"()");
		}
	}else{
		for(var i=0; i<isOwner_menu_list.length; i++){
			$("#"+isOwner_menu_list[i]).addClass('disabled');
			$("#"+isOwner_menu_list[i]).attr('onclick', null);
		}
		$("#restrict_editing").prop("disabled", true);
	}
}


var canEditMenu = function(canEdit){
	if(canEdit == "true"){
		for(var i=0; i<canEdit_menu_list.length; i++){
			$("#"+canEdit_menu_list[i]).removeClass('disabled');
			$("#"+canEdit_menu_list[i]).attr('onclick',canEdit_menu_list[i]+"()");
		}
	}else{
		for(var i=0; i<canEdit_menu_list.length; i++){
			$("#"+canEdit_menu_list[i]).addClass('disabled');
			$("#"+canEdit_menu_list[i]).attr('onclick', null);
		}
	}	
}

var selectedNodeMenu = function (sel){    
	if(sel){
		for(var i=0; i<selected_menu_list.length; i++){
			$("#"+selected_menu_list[i]).removeClass('disabled');
			$("#"+selected_menu_list[i]).attr('onclick',selected_menu_list[i]+"()");
		}
	}else{
		for(var i=0; i<selected_menu_list.length; i++){
			$("#"+selected_menu_list[i]).addClass('disabled');
			$("#"+selected_menu_list[i]).attr('onclick', null);
		}
	}	  
	
};

var canCopyNode = function(canCopyNode){
	if(canCopyNode == "true"){
		for(var i=0; i<canCopyNode_menu_list.length; i++){
			$("#"+canCopyNode_menu_list[i]).removeClass('disabled');
			$("#"+canCopyNode_menu_list[i]).attr('onclick',canCopyNode_menu_list[i]+"()");
		}
	}
}
