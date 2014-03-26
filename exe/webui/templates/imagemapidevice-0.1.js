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
     * 
     * @param {Array} data event data
     * @return {boolean} returns true
     */
    handleClick : function(data) {
        var key = data.key;
        var ideviceId = key.substring(0, key.indexOf("_"));
        /*
        $("#imagemapidevice_img_" + ideviceId).mapster("set_options", {"showToolTip" : "true"});
        var exprMe = '$("#imagemapidevice_img_ ' + ideviceId +'").mapster("tooltip", "' + key + '")';
        setTimeout(exprMe, 100);
        */
        
        //find media to play
        var elementId = "imageMapToolTip_" + ideviceId + "_" + key;
        var tooltipEl = document.getElementById(elementId);
        var audioElements = findAllMediaInElement(tooltipEl);
        for(var i = 0; i < audioElements.length; i++) {
            playAndReset(audioElements[i]);
        }
        
        return true;
    },
    
    
    /**
     * Initiate this using ImageMapster JQuery plugin
     * 
     * @method initMapIdevice
     */
    initMapIdevice : function(cfg) {
        
    	this.cfg = cfg;
    	
        //build areas
        var areasArg = [];
        
        
        //go through the areas and see if there are corresponding tips
        var areaSelector = "#imagemapidevice_map_" + this.ideviceId + " area";
        var initIdeviceId = this.ideviceId;
        $(areaSelector).each(function() {
            var dataKeyVal = $(this).attr("data-key");
            var imageMapToolTipSelector = "#imageMapToolTip_" + initIdeviceId 
                    + "_" + dataKeyVal;
            var htmlToolTip = $(imageMapToolTipSelector).html();
            var areasArgIndex = areasArg.length;
            areasArg[areasArgIndex] = {
                key : dataKeyVal
            };
            
            if(htmlToolTip !== "" && htmlToolTip !== null) {
                areasArg[areasArgIndex]['toolTip'] = htmlToolTip;
            }
        });
        
        $("#imagemapidevice_img_" + this.ideviceId).mapster({
               stroke : false,
               mapKey: 'data-key',
               fillColor: 'ff0000',
               fillOpacity: 0.0,
               onClick: this.handleClick,
               
               areas : areasArg
            });
        var parentWidth = 
     		  $("#id" + this.ideviceId +" DIV.iDevice_content_wrapper").width();
        var ratio = parentWidth / this.cfg['width'];
        var newHeight = Math.round(this.cfg['height'] * ratio);
        $("#imagemapidevice_img_" + this.ideviceId).mapster("resize",
        		parentWidth, newHeight, 0);
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
    	//alert(newWidth + "," + newHeight);
    	return [newWidth, newHeight];
    }    
};

function imageMapIdevicePageInit() {
    $(".imagemapidevice_img").each(function() {
        var elId = this.id;
        if(elId != null && elId.length > 1) {
            var realId = elId.substring(imageMapIdeviceIdPrefix.length);
            if(!imageMapIdevices[realId]) {
                imageMapIdevices[realId] = new ImageMapIdevice(realId);
                var sizes = imageMapIdevices[realId].calcMapsterSize();
                if(sizes[0] > 0) {
                    imageMapIdevices[realId].initMapIdevice({
                        width : sizes[0],
                        height: sizes[1],
                        growToFit : true
                    }); 
                }else {
                    imageMapIdevices[realId] = null;
                    $(document).on("pageshow", function() {
                        imageMapIdevicePageInit();
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
