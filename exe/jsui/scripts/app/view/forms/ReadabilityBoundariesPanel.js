//To Create the Wizard Panel.
var readabilityPanel = Ext.define('eXe.view.forms.ReadabilityBoundariesPanel', {
    extend: 'Ext.tab.Panel',
    id: 'readabilityboundarypanel',
    alias: 'widget.readabilityboundarypanel',
    
    constructor: function () {
    	  this.callParent(arguments);
	},
    	
	

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: false,
            trackResetOnLoad: true,
            items: [	//This is the whole Panel start
            	{	
            		title: _("Level"),
                    xtype: 'panel',
                    layout: {
                    	type: 'vbox',
                    	align: 'stretch'
                    },
                    margin: 4, //Margin from top
                    items: [
                        //The readability level tab
	                	{
                		xtype: 'panel',
                		margin: 4,
                		layout: {
                			type: 'column',
                			align: 'stretch'
                		},
                		defaults: {
                			margin: 5
                		},
                		items : [
            		        {
								xtype: 'combobox',
								inputId: 'readability_boundaries_combobox',
								fieldLabel: _('Level'),
								store: [
								    ['Kindergarten1.1', 'Kindergarten-1.1'],
								    ['Kindergarten-1.1', 'Kindergarten-1.2'],
								    ['Grade1', 'Grade1'],
								    ['Grade2', 'Grade2']
								],
								tooltip: _('Select a level.'),
								anchor: '100%'
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Import"),
            		        	handler: function(obj) {
            		        		eXeReadabilityHelper.importReadabilityBoundaries();
            		        	}
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Export"),
            		        	id: "readability_export_boundary_targets",
            		        	handler: function(obj) {
            		        		eXeReadabilityHelper.exportReadabilityBoundaries();
            		        	}
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Delete")
            		        }
        		        ]
	                	},
	                	{//The panel where indicators are loaded
	                		xtype: "panel",
	                		margin: 5,
	                		id: "readability_boundaries_indicator_panel",
	                		layout: {
	                			type: "table",
	                			columns: 5
	                		},
	                		width: "100%",
	                		items: [], 
	                		flex: 1
	                	}
                    ]
                },
                
            	{ //The Decoding Tab
					
                    xtype: 'panel',
                    title : _("Decoding"),
                    layout: {
                    	type: 'vbox',
                    	align: 'stretch'
                    },
					//border:1,
					width: '100%',
					id: 'showrecentprojectspanel',
					margin: 4,
                    items: [
                            {
                    		xtype: 'panel',
                    		margin: 4,
                    		layout: {
                    			type: 'column'
                    		},
                    		items : [
                		        {//Preset dropdown panel
    								xtype: 'combobox',
    								inputId: 'readability_decoding_combobox',
    								fieldLabel: _('Level'),
    								store: [
    								    ['Kindergarten1.1', 'Kindergarten-1.1'],
    								    ['Kindergarten-1.1', 'Kindergarten-1.2'],
    								    ['Grade1', 'Grade1'],
    								    ['Grade2', 'Grade2']
    								],
    								tooltip: _('Select a level.'),
    								anchor: '100%'
                		        },
                		        {
                		        	xtype: 'button',
                		        	text: _("Import")
                		        },
                		        {
                		        	xtype: 'button',
                		        	text: _("Export"),
                		        },
                		        {
                		        	xtype: 'button',
                		        	text: _("Delete")
                		        }
            		        ]
    	                	},
    	                	{//word limiting panel
	                    		xtype: 'panel',
	                    		margin: 4,
	                    		layout: {
	                    			type: 'column'
	                    		},
	                    		items : [
                    		         {
                    		        	 xtype: 'checkboxfield',
                    		        	 inputId: 'limitNewWordsCheckboxField',
                    		        	 hideLabel: true,
                    		        	 flex: 1,
                    		        	 margin: 4
                    		         },
                    		         {
                    		        	 xtype: 'textfield',
                    		        	 fieldLabel: "Limit new words to",
                    		        	 width: 150
                    		         },
                    		         {
                    		        	 xtype: 'checkboxfield',
                    		        	 inputId: 'limitTotalWordsCheckboxField',
                    		        	 hideLabel: true,
                    		        	 flex: 1,
                    		        	 margin: 4
                    		         },
                    		         {
                    		        	 xtype: 'textfield',
                    		        	 fieldLabel: "Limit total words to",
                    		        	 width: 150
                    		         }
                		        ]
    	                	},
    	                	{
    	                		xtype: 'panel',
	                    		margin: 4,
	                    		layout: {
	                    			type: 'table',
                    				columns: 2,
                    				align: "stretch"
	                    		},
	                    		flex: 1,
	                    		width: "100%",
	                    		height: "100%",
    	                		items: [
	                		        {
	                		        	xtype: 'label',
	                		        	text: 'Decodeable words'
	                		        },
	                		        {
	                		        	xtype: 'label',
	                		        	text: 'New Words'
	                		        },
	                		        {
	                		        	xtype: 'textareafield',
	                		        	hideLabel: true,
	                		        	flex: 1,
	                		        	margin: 4,
	                		        	rows: 20,
	                		        	width: 320
	                		        },
	                		        {
	                		        	xtype: 'textareafield',
	                		        	hideLabel: true,
	                		        	flex: 1,
	                		        	margin: 4,
	                		        	rows: 20,
	                		        	width: 160
	                		        }
                		        ]
    	                	}
                    ]
                }
                
                
    	        
        ]
    }); //End of ExtApplyIf
    
    me.callParent(arguments);
         
},	 //end of initComponent
});	 //end of Ext.define the panel form.

var eXeReadabilityHelper = {
	readabilityBoundariesTargetsToJSON: function() {
    	var boundaryInfoPanel = Ext.getCmp(
			"readability_boundaries_indicator_panel");
    	var indicatorsObj = boundaryInfoPanel.readabilityBoundaryStats;
    	var jsonResult = {};
    	for(indicatorId in indicatorsObj) {
    		if(indicatorsObj.hasOwnProperty(indicatorId)) {
    			jsonResult[indicatorId] = {}
    			if(indicatorsObj[indicatorId]['max']) {
    				jsonResult[indicatorId]['max'] = Ext.getCmp(
    						"readability_boundary_target_" 
    						+ indicatorId + "_max").getValue();
    			}
    			if(indicatorsObj[indicatorId]['average']) {
    				jsonResult[indicatorId]['average'] = Ext.getCmp(
    						"readability_boundary_target_"
    						+ indicatorId + "_average").getValue();
    			}
    		}
    	}
    	
    	
    	return jsonResult;
    },
    
    /**
     * Get the server to export the currently set readability 
     * boundaries to a specific location
     * 
     */
    exportReadabilityBoundaries: function() {
    	var f = Ext.create("eXe.view.filepicker.FilePicker", {
    		type: eXe.view.filepicker.FilePicker.modeSave,
    		title: _("Save file"),
    		modal: true,
    		scope: this,
    		callback: function(fp) {
    		    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
    		    	var boundariesSet = 
    		    		eXeReadabilityHelper.readabilityBoundariesTargetsToJSON();
    		    	nevow_clientToServerEvent("readabilityBoundariesExport", 
    		    			this, '', f.file.path, JSON.stringify(boundariesSet));
    		        //nevow_clientToServerEvent('savePackage', this, '', f.file.path)
    		    } else {
    	            Ext.defer(function() {
    			        eval(onDone);
    	            }, 500);
    		    }
    		}
    	});
    	f.appendFilters([
    		{ "typename": _("eXe Readability Boundaries"), "extension": "*.erb", "regex": /.*\.erb$/ },
    		{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    		]
    	);
    	f.show();
    },
    
    importReadabilityBoundariesShow: function(name, boundariesToSet) {
    	var boundariesObj = JSON.parse(boundariesToSet);
    	for(indicatorId in boundariesObj) {
    		if(boundariesObj.hasOwnProperty(indicatorId)) {
    			var indicatorVals = boundariesObj[indicatorId];
    			if(indicatorVals['average']) {
    				var comp = Ext.getCmp("readability_boundary_target_"
    						+ indicatorId + "_average");
    				comp.setValue(indicatorVals['average']);
    			}
    			
    			if(indicatorVals['max']) {
    				var comp = Ext.getCmp("readability_boundary_target_"
    						+ indicatorId + "_max");
    				comp.setValue(indicatorVals['max']);
    			}
    		}
    	}
    },
    
    /**
     * Import readability boundaries: Show the file picker, then tell 
     * the server about it
     * 
     * @method
     */
    importReadabilityBoundaries: function() {
    	var f = Ext.create("eXe.view.filepicker.FilePicker", {
    		type: eXe.view.filepicker.FilePicker.modeOpen,
    		title: _("Open file"),
    		modal: true,
    		scope: this,
    		callback: function(fp) {
    		    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
    		    	nevow_clientToServerEvent("readabilityBoundariesImport", 
    		    			this, '', f.file.path);
    		    } 
    		}
    	});
    	f.appendFilters([
    		{ "typename": _("eXe Readability Boundaries"), "extension": "*.erb", "regex": /.*\.erb$/ },
    		{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    		]
    	);
    	f.show();
    }
    
};
