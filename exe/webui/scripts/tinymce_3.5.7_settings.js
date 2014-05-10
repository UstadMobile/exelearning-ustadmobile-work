_ = parent._;
/*******************************************/	
/********** Available languages **********/
/***************************************/
var tinyMCE_languages=["ca","es","eu","fr","gl","it","nl","pt","ru"];
var tinyMCE_language = getTinyMCELang(document.getElementsByTagName("HTML")[0].lang);
/*******************************************/	
/*****************************************/
/****************************************/
tinyMCE.init({
	// General options
	mode : "specific_textareas",
	editor_selector: "mceEditor",	
	theme : "advanced",
	convert_urls : false,
	// The New eXeLearning
	content_css : "/css/extra.css," + exe_style,
    height : "250",
	// The New eXeLearning
	plugins : "clearfloat,advalign,autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,exemath,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,visualblocks,pastecode,inlinepopups,spellchecker,template",
    //paste_text_sticky : true,    
    //paste_text_sticky_default : true,
	extended_valid_elements : "img[*],iframe[*]", //The exemath plugin uses this attribute: exe_math_latex, and the iframes might have "allowfullscreen".
	//entity_encoding : "raw",

	// Theme options
	theme_advanced_buttons1 : "newdocument,spellchecker,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,clearfloat,|,bullist,numlist,|,outdent,indent,blockquote,|,formatselect,fontsizeselect,fontselect,|,forecolor,backcolor,|,sub,sup,|,fullscreen",
	theme_advanced_buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,pastehtml,pastecode,|,search,replace,|,link,unlink,anchor,|,image,media,|,removeformat,cleanup,|,insertdate,inserttime,advhr,cite,abbr,acronym,del,ins,attribs,nonbreaking,|,charmap,exemath,|,styleprops",
	theme_advanced_buttons3 : "template,|,tablecontrols,|,code,help",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,	
	
    template_external_list_url : "/scripts/tinymce_templates/lang/"+tinyMCE_language+".js",
	// No new base64 images
	setup : function(ed) {
		//check if this is the default text, clear if so on click
		ed.onInit.add(function(ed){
			console.log("Editor " + ed.id + " does init");
			if(scrollBackInterval == null) {
				scrollBackInterval = setTimeout("scrollBackOnAllMceInit()", 500);
			}
			var edObj = $("#" + ed.id);
			if(edObj.hasClass("defaultprompt")) {
				var defaultPrompt = edObj.attr('data-defaultprompt');
				var heightSet = "250";//eXe's default
				if(ed.settings.height) {
					heightSet = ed.settings.height;
				}
				heightSet = parseInt(heightSet);
				var margin = Math.round(heightSet/2);
				var width = $("#" + ed.id)
				
				$('#' + ed.id).after(
					"<div id='" + ed.id + "_defaultprompt' "  
					+ "style='z-index: 10; position: absolute; width: 900px; "
					+ "text-align: center; margin-top : " + margin + "px;'>"
					+ defaultPrompt + "</div>");
				
			}
		});
		 ed.onEvent.add(function(ed, e) {
	         console.log('Editor event ' + ed.id + ' occured on: ' + e.target.nodeName + " : " + e.type);
	         var textArea = $("#" + ed.id);
	         if(e.type && (e.type == "keypress" || e.type == "click")) {
		         if(textArea.hasClass("defaultpromptactive")) {
		        	 $("#" + ed.id + "_defaultprompt").css("display", "none");
		        	 textArea.removeClass("defaultpromptactive");
		         }
	         }
	      });	
		
		ed.onInit.add(function(ed, e) {
			$exeAuthoring.countBase64(ed);
		});	
		ed.onChange.add(function(ed, e) {
			$exeAuthoring.compareBase64(ed);
		});
	},
    // Spell check
    init_instance_callback : function() {
        if (tinyMCE.activeEditor.execCommands.mceSpellCheck) tinymce.execCommand('mceSpellCheck', true);
    },   
    // Image & media
	file_browser_callback : "exe_tinymce.chooseImage",
	media_types: "flash=swf,mp3,mp4,flv;qt=mov,qt,mpg,mpeg;wmp=avi,wmv,wm,asf;rmp=rm,ra,ram",		
	flash_video_player_url: "../templates/flowPlayer.swf"	

});
