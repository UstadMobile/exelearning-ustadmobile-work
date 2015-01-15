/* 
 * Image Map Idevice Javascript.  This is used to run the Image Map Idevice
 * 
 * Copyright (C) Mike Dawson 2014.  Licensed under GPLv3.
 * 
 */

/**
Provides the base ImageMapIdevice

@module ImageMapIdevice
**/

var ImageMapIdevice;


/*

*/
var imageMapIdevices = {};

/**
 * Handles creation of ImageMapIdevice
 * @class ImageMapIdevice
 * @param ideviceId {String} id string that will be used in naming conventions
 * @constructor
 */
ImageMapIdevice = function(ideviceIdArg) {
    this.ideviceId = ideviceIdArg;
    
};

var imageMapIdeviceIdPrefix = "imagemapidevice_img_";

ImageMapIdevice.prototype = {
    
    
    /**
     * Initiate this using ImageMapster JQuery plugin
     * 
     * @method initMapIdevice
     */
    initMapIdevice : function(cfg) {
        this.cfg = cfg;
    	

        
        
        //go through the areas and see if there are corresponding tips
        var areaSelector = "#imagemapidevice_map_" + this.ideviceId + " area";
        var initIdeviceId = this.ideviceId;
        
        $(areaSelector).each(function() {
            var dataKeyVal = $(this).attr("data-key");
            var tooltipDivSel = "#imageMapToolTip_"+ initIdeviceId
                + "_" + dataKeyVal;
            
            var tipHasContents = true;
            var tipContents = $(tooltipDivSel).text();
            tipContents = exeUtilRemoveWhiteSpace(tipContents);
            if(tipContents.length === 0) {
            	var numImg = $(tooltipDivSel + " img").length;
            	var numVideo = $(tooltipDivSel + " video").length
            	tipHasContents = (numImg > 0 || numVideo > 0);
            }
                
            if(tipHasContents) {
                $(this).tooltipster({
                    animation: 'fade',
                    content : $(tooltipDivSel).html(),
                    contentAsHTML: true
                });
            }
            
            var evtHandler = function(evt) {
                //find media to play if we haven't just played it
                var timeLastPlayed = 0;
                if($(this).attr("data-last-played")) {
                    timeLastPlayed = parseInt($(this).attr("last-played"));
                }
                var timeNow = new Date().getTime();
                
                if(timeNow - timeLastPlayed < 1000) {
                    return false;
                }else {
                    $(this).attr("data-last-played", timeNow);
                }
                
                var elementId = $(this).attr("id");
                var tooltipEl = document.getElementById(elementId);
                var audioElements = findAllMediaInElement(tooltipEl);
                for(var i = 0; i < audioElements.length; i++) {
                    playAndReset(audioElements[i]);
                }
                
                return false;
            };
            $(this).on("click", evtHandler);
            $(this).mouseover(evtHandler);
        });
        
        var parentWidth = 
     		  $("#id" + this.ideviceId +" div.iDevice_content_wrapper").width();
        var ratio = parentWidth / this.cfg['width'];
        var newHeight = Math.round(this.cfg['height'] * ratio);

        $("#imagemapidevice_img_" + this.ideviceId).css("width", parentWidth);
        $("#imagemapidevice_img_" + this.ideviceId).css("height", newHeight);
        $("#imagemapidevice_img_" + this.ideviceId).rwdImageMaps();
		$("imagemapidevice_img_" + this.ideviceId).attr(
		    'data-idevice-init', 'done');
    },
    
    updateLocation: function(element, updateFieldId) {
    	//var left = parseInt($(element).css("left"));
    	//var top = parseInt($(element).css("top"));
    	var parentEl = $(element).parent();
    	var left = $(element).offset().left - parentEl.offset().left;
    	var top = $(element).offset().top - parentEl.offset().top;
    	var width = $(element).width();
    	var height = $(element).height();
    	$("#" + updateFieldId).val(left + "," + top + "," 
    			+ (left+width) + "," + (top+height));
    },
    
    /**
     * 
     * Setup what we need for editing this within eXe
     * @method initEditor
     */
    initEditor: function() {
    	var thisIdeviceId = this.ideviceId;
    	$("#imagemapidevice_map_" + this.ideviceId + " area").each(function(i) {
    		var areaKey = $(this).attr("data-key");
    		var newId = "exeimgmap_element_edit_" + areaKey;  
			var newDivHTML = "<div id='"
				+ newId + "' style='position: absolute; border: 1px solid red;'></div>";
			var coords = $(this).attr("coords").split(",");
			for(var j = 0; j < coords.length; j++) {
				coords[j] = parseInt(coords[j]);
			}
			var width= coords[2] - coords[0];
			var height = coords[3] - coords[1];
			
			$("#exeimgmap_edit_container_" + thisIdeviceId).append(
					newDivHTML);
			
			var elementId = areaKey;
			var objId = areaKey.substring(0, areaKey.indexOf("_"));
			var deleteLink = ' <a style="display: inline-block; float: right; background-color: black; color: white; padding: 3px;" href="#" onclick="submitLink(\'' 
            	+ elementId + "', '" + objId + '\',1)">x</a>';
			$("#" + newId).html(deleteLink + "Area " + (i+1));
			$("#" + newId).css("left", coords[0] + "px").css("top", 
					coords[1] + "px");
			$("#" + newId).css("width", width).css("height", height);
			$("#" + newId).css("background", "rgba(255,255,255,0.5)");
			$("#" + newId).attr("data-coords-fieldid", 
					$(this).attr("data-coords-fieldid"));
			var myIdeviceId = thisIdeviceId; 
			$("#" + newId).draggable({ 
            	containment: "parent",
            	stop: function(evt, ui) {
            		var updateFieldId = $(this).attr("data-coords-fieldid");
            		/*var updateFieldId = $(this).attr("data-exednd-updatefield");*/
            		imageMapIdevices[thisIdeviceId].updateLocation(this, updateFieldId);
            	}
    		}).resizable();
    	});
    	
    	this.addPicEventHandlers();
    },
    
    getEditImgFieldId : function() {
    	var editImgId = $("#exeimgmap_edit_container_" 
				+ this.ideviceId).attr("data-imgfieldid");
    	return editImgId;
    },
    
    addPicEventHandlers : function() {
		var imgFieldId = this.getEditImgFieldId();
		var thisEl = this;
		var picEvtHandleFunction = function(evt) {
			thisEl.updateEditorSizeFromPic(evt);
		};
		
		$("#width" + imgFieldId).on("change", picEvtHandleFunction);
		$("#height" + imgFieldId).on("change", picEvtHandleFunction);
		$("#img" + imgFieldId).on("load", picEvtHandleFunction);
	},
    
    updateEditorSizeFromPic: function(evt) {
		var imgFieldId = this.getEditImgFieldId();
		var newWidth = $("#width" + imgFieldId).val();
		var newHeight = $("#height" + imgFieldId).val();
		
		$("#exeimgmap_edit_mastercontainer_" + this.ideviceId).width(
				newWidth).height(newHeight);
		$("#exeimgmap_edit_container_" + this.ideviceId).width(
				newWidth).height(newHeight);
		$("#imagemapidevice_img_" + this.ideviceId).width(
				newWidth).height(newHeight);
	},
    
    /**
     * Initiate this using ImageMapster JQuery plugin
     * 
     * @method calcMapsterSize
     */
    calcMapsterSize: function() {
    	var newWidth = $("#id"  + this.ideviceId).width();
    	var setWidth = parseInt($("#imagemapidevice_img_" + 
    	    this.ideviceId).attr("width"));
	    var setHeight = parseInt($("#imagemapidevice_img_" + 
    	    this.ideviceId).attr("height"));
    	    
    	var ratio = newWidth / setWidth;
    	var newHeight = Math.round(setHeight * ratio);
    	return [newWidth, newHeight];
    }    
};

/**
 * Initialize all imagemap idevices that are on the page
 * 
 * @param containerSelector String the selector for the active page div
 */
function imageMapIdevicePageInit(containerSelector) {
	containerSelector = checkActivePageContainer(containerSelector);
    $(containerSelector + " .imagemapidevice_img").each(function() {
        var elId = this.id;
        if(elId != null && elId.length > 1) {
            var realId = elId.substring(imageMapIdeviceIdPrefix.length);
            if(!(imageMapIdevices[realId] && $("#imagemapidevice_img_" + realId).attr("data-idevice-init") === "done")) {
                imageMapIdevices[realId] = new ImageMapIdevice(realId);
                
                if($("#exeimgmap_edit_mastercontainer_" + realId).length > 0) {
                	imageMapIdevices[realId].initEditor();
                }else {
	                var sizes = imageMapIdevices[realId].calcMapsterSize();
                    imageMapIdevices[realId].initMapIdevice({
                        width : sizes[0],
                        height: sizes[1],
                        growToFit : true
                    }); 
	                
                }
            }
        }
    });
}



/*
Init - lets get going
*/
$(function() {
    imageMapIdevicePageInit();
});

