/**
 * 
 */

var readabilityWriterPanel = Ext.define('eXe.view.forms.ReadabilityWriterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.readabilitywriterpanel',
    
    collapsible: true,
    
    title: "Readability",
    
    layout: { 
    	type: "vbox",
    	align: "stretch"
    },
    
    initComponent: function() {
		var me = this;
		
		Ext.applyIf(me, {
            items: [
                {
                	xtype: "label",
                	padding: 6,
                	text: _("Level:")
                },
                {
                	xtype: "toolbar",
                	items: [ 
            	        {
            	        	xtype: "button",
                        	itemId: "writer_panel_level_button",
                        	scale: "medium",
                        	text: "Selected Level",
                        	menu: {
                        		xtype: "menu",
                        		itemId : "writer_panel_levelmenu",
                        		items: [{
                        			xtype: "menuitem",
                        			itemId : "writer_panel_dummylevel",
                        			text: " "
                        		}]
                        	}
            	        },
            	        {
            	        	xtype: "button",
                        	itemId: "writer_panel_level_setup",
                        	scale: "medium",
                        	layout: {
                        		type: "vbox",
                        		align: "stretch"
                        	},
                        	text: "Setup"
            	        },
        	        ]
                },
                {
                	xtype: "panel",
                	itemId: "writer_panel_limit_subpanel",
                	items : [] 
                }
            ]
		});
		
		this.callParent(arguments);
    }
    
});


/**
 * Panel used to show limits to the writer
 */
var readabilityLinguistLimitPanel = Ext.define("eXe.view.forms.ReadabilityWriterLimit", {
	extend : "Ext.panel.Panel",
	alias : "widget.readabilitywriterlimit",
	
	layout: {
    	type: "vbox",
    	align : "stretch"
    },
    
    fontSize: "large",
    
    //The id of this parameter
    limitParamId: "",
    
    //the label for this parameter
    limitLabel: "",
    
    //The actual limits for this parameter
    limits: [],
    
    labelFontSize: "medium",
    
    padding: 4,
    
    actualValPage: [null, null],
    
    actualValCourse: [null, null],
    
    constructor: function () {
    	this.callParent(arguments);
	},
	
	
	initComponent: function() {
		var me = this;
		
		Ext.apply(me, {
	    	items: [
    	        {
    	        	xtype : "label",
    	        	text: me._formatLimitParamString(me.limitLabel,
    	        			me.limits),
        			style : {
        				"font-size" : me.labelFontSize
        			}
    	        },
    	        {
    	        	xtype: 'container',
    	        	layout: {
    	        		type: "hbox",
    	        		align: "stretch"
    	        	},
    	        	defaults: {
    	        		padding: 2
    	        	},
    	        	items: [
	        	        {
	        	        	xtype: "image",
	        	        	src: "/images/result-blank.png",
	        	        	width: 16,
	        	        	height: 16,
	        	        	itemId: "icon_page"
	        	        },
	        	        {
	        	        	xtype: "label",
	        	        	text: _("This page: "),
	        	        	itemId: "prelabel_page"
	        	        },
	        	        {
	        	        	xtype: "label",
	        	        	itemId: "actual_val_page",
	        	        	style: {
	        	        		"text-decoration" : "underline"
	        	        	},
	        	        	text: " "
	        	        },
	        	        {
	        	        	xtype: "image",
	        	        	src: "/images/result-blank.png",
	        	        	width: 16,
	        	        	height: 16,
	        	        	itemId: "icon_course"
	        	        },
	        	        {
	        	        	xtype: "label",
	        	        	text: _("Book: "),
	        	        },
	        	        {
	        	        	xtype: "label",
	        	        	itemId: "actual_val_course",
	        	        	text: "_",
	        	        	style: {
	        	        		"text-decoration" : "underline"
	        	        	}
	        	        }
        	        ]
    	        }
	        ]
		});
		
		this.callParent(arguments);
	},
	
	_formatLimitParamString: function(limitLabel, limitParams) {
		var minLimit = -1;
		var maxLimit = -1;
		if(typeof limitParams[0] !== "undefined" && limitParams[0] !== null) {
			minLimit = parseInt(limitParams[0]);
			minLimit = isNaN(minLimit) ? -1 : minLimit;
		}
		
		if(typeof limitParams[1] !== "undefined" && limitParams[1] !== null) {
			maxLimit = parseInt(limitParams[1]);
			maxLimit = isNaN(maxLimit) ? -1 : maxLimit;
		}
		
		var labelPostfix = "";
		if(minLimit !== -1 && maxLimit !== -1) {
			labelPostfix = ": " + minLimit + " - " + maxLimit;
		}else if(minLimit !== -1) {
			labelPostfix = ": > " + minLimit;
		}else if(maxLimit !== -1) {
			labelPostfix = ": < " + maxLimit;
		}
		
		return limitLabel + labelPostfix;
	},
	
	_formatActualVal: function(val) {
		if(val instanceof Array) {
			return val[0] + "-" + val[1];
		}else {
			return "" + val;
		}
	},
	
	// -1 = not possible to determine, 0 = no, 1 = yes
	isWithinLimits: function(val) {
		if(this.limits.length === 0) {
			return -1;
		}
		
		var actMin = (val instanceof Array) ? val[0] : val;
		var actMax = (val instanceof Array) ? val[1] : val;
		
		var isWithinMin = true
		if(this.limits[0] !== null && this.limits[0] !== -1) {
			isWithinMin = (actMin >= this.limits[0]);
		}
		
		var isWithinMax = true;
		if(this.limits[1] !== null && this.limits[1] !== -1) {
			isWithinMax = (actMax <= this.limits[1]);
		}
		
		var retVal = (isWithinMin && isWithinMax) ? 1 : 0; 
		return retVal;
	},
	
	/**
	 * The actual value - either a two item array of min and max 
	 * or a single numerical value
	 */
	setActualValWholeCourse: function(val) {
		this.actualValCourse = val;
		this.query("#actual_val_course")[0].setText(
			this._formatActualVal(val));
		var withinResult = this.isWithinLimits(val);
		var imgType = "blank";
		if(withinResult === 0) {
			imgType = "bad";
		}else if(withinResult === 1) {
			imgType = "good";
		}
		
		this.query("#icon_course")[0].setSrc("/images/result-" + imgType +".png");
	},
	
	setActualValPage: function(val) {
		this.actualValPage = val;
		this.query("#actual_val_page")[0].setText(
			this._formatActualVal(val));
		
		var withinResult = this.isWithinLimits(val);
		var imgType = "blank";
		if(withinResult === 0) {
			imgType = "bad";
		}else if(withinResult === 1) {
			imgType = "good";
		}
		
		this.query("#icon_page")[0].setSrc("/images/result-" + imgType +".png");
	}
});