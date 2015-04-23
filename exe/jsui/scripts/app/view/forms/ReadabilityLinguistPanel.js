/**
 * 
 */

var readabilityLinguistPanel = Ext.define('eXe.view.forms.ReadabilityLinguistPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.readabilitylinguistpanel',
    
    panelFontSize: "large",
    
    layout: {
    	type: "border"
    },
    
    constructor: function () {
    	this.callParent(arguments);
	},
    	
	

    initComponent: function() {
		var me = this;
		
	    Ext.applyIf(me, {
            items: [
                {
                	xtype: "toolbar",
                	region: "north",
                	items: [{
                		xtype: "textfield",
            			itemId: "linguist_panel_name_textfield",
            			emptyText: _("e.g. MyLevel 1"),
            			minWidth: 250,
            			labelWidth: 60,
            			fieldLabel: _("Name"),
            			fieldStyle: {
        	    			"font-size" : "large"
        	    		}
                	},
                	{
                		xtype: "button",
                		scale : "medium",
                		menu: {
                			xtype: "menu",
                			itemId: "readability_linguist_presetmenu",
                			items : [{
                    			xtype: "menuitem",
                    			itemId: "readability_linguist_new",
                    			text: _("New Guide")
                    		}]
                		} 
                	},
                	{
                		xtype: "textfield",
                		itemId: "linguist_panel_uuid_textfield",
                		hidden : true,
                		value : ""
                	},
                	{
                		xtype: "tbfill"
                	},
                	{
                		xtype: "combo",
                		fieldLabel: _("Language"),
                		itemId: "linguist_panel_langcombo",
                		labelAlign: "left",
                		store: langsStore,
                		fieldStyle: {
        	    			"font-size" : "large"
        	    		}
                	}
        	        ]
                },
                {
                	xtype: "panel",
                	region: "center",
                	layout: {
                		type: "vbox",
                		align: "stretch"
                	},
                	items: [
            	        {
            	        	xtype: "fieldcontainer",
            	        	fieldLabel: _("Type"),
            	        	labelStyle: "font-size: large;",
            	        	padding: 4,
            	        	items: [
        	        	        {
        	        	        	xtype: "segmentedbutton",
        	        	        	items: [
    	        	        	        {
    	        	        	        	text: _("Leveled Reader"),
    	        	        	        	itemId: "linguist_panel_leveled_button",
    	        	        	        	pressed: "true",
    	        	        	        	scale: "medium",
    	        	        	        	icon: "/images/icon-leveled-reader.png"
    	        	        	        },
    	        	        	        {
    	        	        	        	text: _("Decodable Reader"),
    	        	        	        	scale: "medium",
    	        	        	        	itemId: "linguist_panel_decodable_button",
    	        	        	        	icon: "/images/icon-decodable-reader.png"
    	        	        	        }
	        	        	        ]
        	        	        }
    	        	        ]
            	        },
						{
							xtype: "panel",
							itemId: "readability_linguist_levelpanel",
							flex: 1,
							title: _("Limits"),
							scrollable: "vertical",
							items: [
						        {
						        	xtype: "readabilitylinguistlimit",
						        	limitLabel: "Word Length",
						        	unitLabel: "Letters"
						        },
						        {
						        	xtype: "readabilitylinguistlimit",
						        	limitLabel: "Sentence Length",
						        	unitLabel: "Words"
						        },
						        {
						        	xtype: "readabilitylinguistlimit",
						        	limitLabel: "Total Word Count",
						        	unitLabel: "Words"
						        }
					        ]
						},
						{
							xtype: "panel",
							itemId: "readability_linguist_decodablepanel",
							hidden: true,
							flex: 1,
							layout: {
								type: "hbox",
								align: "stretch"
							},
							border: 2,
							items: [
						        {
						        	xtype: "panel",
						        	flex: 4,
						        	title: _("Decodable Words"),
						        	layout: "fit",
						        	padding: "0 3 0 0",
						        	items: [
					        	        {
					        	        	xtype: "textarea",
					        	        	itemId: "readability_linguist_decodablewords"
					        	        }
				        	        ]
						        },
						        {
						        	xtype: "panel",
						        	flex: 6,
						        	title: _("Find Words"),
						        	layout : {
						        		type: "hbox",
						        	},
				        			//find words - search criteria side
						        	items: [
						        	        {
						        	        	xtype: "panel",
						        	        	height: "100%",
						        	        	flex: 1,
						        	        	layout : {
						        	        		type: "vbox",
						        	        		align: "stretch"
					        	        		},
					        	        		items : [
				        	        		         {
				        	        		        	 xtype: "textfield",
				        	        		        	 itemId: "readability_linguist_decodable_to_teach",
				        	        		        	 fieldLabel: _("Letters and combinations to teach"),
				        	        		        	 labelAlign: "top"
			        	        		         	},
			        	        		         	{
			        	        		         		xtype: "textfield",
			        	        		         		itemId: "readability_linguist_decodable_lengthlim",
			        	        		         		fieldLabel: _("Word Length Limit"),
			        	        		         		labelAlign: "top",
			        	        		         		value: "limit"
			        	        		         	},
			        	        		         	{
			        	        		         		xtype: "textarea",
			        	        		         		itemId: "readability_linguist_decodable_searchlist",
			        	        		         		labelAlign: "top",
			        	        		         		fieldLabel: _("Text to search"),
			        	        		         		flex: 1
			        	        		         	}
		        	        		         	]
						        	        },
						        	        {	
						        	        	xtype: "panel",
						        	        	flex: 1,
						        	        	layout : {
						        	        		type: "vbox",
						        	        		align: "stretch"
						        	        	},
						        	        	items : [
					        	        	         {
					        	        	        	 xtype: "label",
					        	        	        	 text: _("Suggested Words")
				        	        	         	 },
				        	        	         	 {//panel to show word suggestions in
				        	        	         		 xtype: "panel",
				        	        	         		 rowspan: 2,
				        	        	         		 itemId: "readability_linguist_decodable_suggestions"
				        	        	         	 }
			        	        	         	]
						        	        }
					        	        ]
						        }//end of find words panel*/
					        ]
						}
        	        ]
                },
                {
                	xtype: "toolbar",
                	region: "south",
                	items: [{
                		xtype: "button",
                		text: _("Share"),
                		scale: "medium",
                		itemId: "readability_linguist_share"
                	},
                	{
                		xtype: "button",
                		text: _("Import"),
                		scale: "medium",
                		itemId: "readability_linguist_import"
                	},
                	{
                		xtype: "tbfill"
                	},
                	{
                		xtype: "button",
                		scale: "medium",
                		text: _("OK")
                	}]
                }
                
            ]
        });
	    
	    this.callParent(arguments);
    }
});

/**
 * Options:
 * limitLabel
 * limitId
 * unitLabel
 */
var readabilityLinguistLimitPanel = Ext.define("eXe.view.forms.ReadabilityLinguistLimit", {
	extend : "Ext.panel.Panel",
	alias : "widget.readabilitylinguistlimit",
	
	layout: {
    	type: "hbox",
    	align : "middle"
    },
    
    fontSize: "large",
    
    /**
     * The parameter name e.g. word_length
     */
    limitParamId: "",
    
    constructor: function () {
    	this.callParent(arguments);
	},
	
	
	
	initComponent: function() {
		var me = this;
		
		Ext.applyIf(me, {
			padding: 4,
		});
		
	    Ext.apply(me, {
	    	items: [{
	    		xtype: "checkbox",
	    		boxLabel: me.limitLabel,
	    		boxLabelCls: "readabilitylimit_checkbox_label x-form-cb-label",
	    		itemId: "limit_enabled_checkbox",
	    		flex: 1,
	    		listeners: {
	    			change: {
	    				scope: me,
	    				fn: this._fireChanged
	    			}
	    		}
	    	},
	    	{
	    		xtype: "textfield",
	    		length: 5,
	    		width: 50,
	    		itemId: "limit_min_textfield",
	    		fieldStyle: {
	    			"font-size" : me.fontSize
	    		},
	    		listeners: {
	    			change: {
	    				scope: me,
	    				fn: this._fireChanged
	    			}
	    		}
	    	},
	    	{
	    		xtype: "label",
	    		text: _("to"),
	    		padding: "0 6 0 6",
	    		style: {
	    			"font-size" : me.fontSize
	    		}
	    	},
	    	{
	    		xtype: "textfield",
	    		length: 5,
	    		width: 50,
	    		itemId: "limit_max_textfield",
	    		fieldStyle: {
	    			"font-size" : me.fontSize
	    		},
	    		listeners: {
	    			change: {
	    				scope: me,
	    				fn: this._fireChanged
	    			}
	    		}
	    	},
	    	{
	    		xtype: "label",
	    		text: _(me.unitLabel),
	    		padding: "0 6 0 6",
	    		style: {
	    			"font-size" : me.fontSize
	    		}
	    	},
	    	{
	    		xtype: "label",
	    		length: 5,
	    		text: ""
	    	}
	        ]
	    });
	    
	    this.callParent(arguments);
	},
	
	_fireChanged: function(comp) {
		this.fireEvent('change', this);
	},
	
	/**
	 * Get the limits that the user has set for this parameter
	 */
	getLimits: function() {
		var minValInt = -1;
		var maxValInt = -1;
		var minVal = this.query("#limit_min_textfield")[0].getValue();
		var maxVal = this.query("#limit_max_textfield")[0].getValue();
		
		try {
			minValInt = parseInt(minVal);
		}catch(e) {}
		
		try {
			maxValInt = parseInt(maxVal);
		}catch(e2) {}
		
		return [minValInt, maxValInt];
		
	},
	
	setLimits: function(limits) {
		var minValStr = (limits[0] === -1 || limits[0] === null) ? "" : ""+limits[0];
		var maxValStr = (limits[1] === -1 || limits[1] === null) ? "" : ""+limits[1];
		
		this.query("#limit_enabled_checkbox")[0].setValue(true);
		this.query("#limit_min_textfield")[0].setValue(minValStr);
		this.query("#limit_max_textfield")[0].setValue(maxValStr);
	},
	
	isLimitEnabled: function() {
		return this.query("#limit_enabled_checkbox")[0].getValue();
	},
	
});
