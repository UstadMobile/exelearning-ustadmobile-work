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
    	type: "hbox",
    	align : "middle"
    },
    
    fontSize: "large",
    
    //The id of this parameter
    limitParamId: "",
    
    //the label for this parameter
    limitLabel: "",
    
    //The actual limits for this parameter
    limits: [],
    
    labelFontSize: "large",
    
    padding: 4,
    
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
	}
});