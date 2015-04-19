// ===========================================================================
// eXe
// Copyright 2015, Varuna Singh, Ustad Mobile
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================


//View: To Create the Wizard Panel.
var wizz = Ext.define('eXe.view.forms.WizardPanel', {
    extend: 'Ext.form.Panel',
    id: 'wizardpanel',
    alias: 'widget.wizardpanel',
    layout: 'border',
    constructor: function () {
    	  this.callParent(arguments);
    	},

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            items: [	
                    {
                    	xtype: 'tabpanel',
                        activeTab: 0,
                        items: [
                            {
                                title: _('Templates'),
                                bodyPadding: '10',
                                autoScroll: true,
                                xtype: 'panel',
                                layout: {
                            		type: 'table',
                            		columns: 3
                            	},
                            	listeners: {
	                                    boxready: function(panel) {
	                        			panel.layout.columns = Math.floor(panel.getWidth()/205);
	                        			console.log(panel.layout.columns);

                            		}
                            	},
	                            id: 'showtemplatespanel',
	                            itemId: 'wizard_show_templates'
                            },
                            {
                                title: _('Local Library'),
                                bodyPadding: '10',
                                xtype: 'panel',
								autoScroll:true,

								layout: {
	                            	type: 'table',
	                            	columns: 3
	                            },
	                            listeners: {
	                                    boxready: function(panel) {
	                        			panel.layout.columns = Math.floor(panel.getWidth()/205);
	                        			console.log(panel.layout.columns);
		                    		}
		                    	},
								id: 'showfileopenlibrarypanel',
								margin: 4,
								itemId: 'wizard_show_library',
                                
                            }
                        ],
                        region: "center",
						
        			},
        			 {
                    	xtype: 'panel',
                        layout: 'border',
                        width: '20%',
                        items: [
                                
							{ 
								xtype: 'button',
								text: _('Open File'),
								icon: '/images/wizard-open.png',
								itemId: 'file_open',
								region: 'south',
								scale: 'large'
							},
							{ 
								xtype: 'button',
								text: _('Create New'),
								icon: '/images/wizard-new.png',
							    itemId: 'wizard_create_new',
							    region: 'south',
							    scale: 'large'
							},
							{
							    xtype:  'label',
							    html:   '<h3><i>' + _('Your recent projects') + 
							    	':</i></h3>',
							    region: 'north'
							},
							{ 
								
							    xtype: 'panel',
							    layout: {
							    	type: 'vbox',
							    	align: 'stretch',
							    	autoScroll:true,
							    },
								width: '100%',
								autoScroll:true,
								id: 'showrecentprojectspanel',
								margin: 4,
								itemId: 'wizard_show_recent',
								region: 'north'
							}
                          
                        ],
                        region: "west",
						
        			},
                	
            ]
        });       
        me.callParent(arguments);       
    },	
});	

//View: Wizard Course Panel
var wizardCoursePanel = Ext.define("eXe.view.forms.WizardCoursePanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.wizardcoursepanel",
	elptFilepath: "",
	constructor: function(){
		this.callParent(arguments);
	},
	
	initComponent: function(){
		var me = this;
		Ext.applyIf(me, {
			bodyPadding: 10,
			
		});
		Ext.apply(me,{
			items: [
		        {
		        	xtype: "image",
		        	src: me.elptCoverImage ? me.elptCoverImage : '/images/stock-template.png',
		        	width: 150,
		        	height: 200,
		        	
		        	listeners:{
		        		afterrender: function(c){
			        		Ext.create('Ext.tip.ToolTip',{
			        			target: c.getEl(),
			        			html: me.elptDescription ? me.elptDescription : me.elptTitle ?
			        					me.elptTitle : me.elptName.slice(0, -5).charAt(0).toUpperCase() + 
			        						me.elptName.slice(0, -5).slice(1).replace(/_/g, ' ')
			        		});
				        },
				        render: {
				        	scope: me,
				        	fn: function(comp) {
				        		comp.getEl().on('click', function() {
				        			me.fireEvent("click", me);
				        		});
				        	}
				        }
		        	},
		        	border: 2, 
		        	fieldStyle: 'text-align: right;',
		        	style: {
		        		borderColor: 'gray',
		        		borderStyle: 'solid',
		        		margin: '10px',
		        		cursor: "pointer",
		        		"text-align": 'center'
		        	}
		        },
		        
		        {
		        	xtype: 'box',
		        	style: {
		        		"text-align": 'center'
			        },
			        //Sets the title to be the Title given, or else converts 
			        //name from text_input to: "Text input" to make it look pretty.
		        	autoEl: {
		        		cn: me.elptTitle ? me.elptTitle : me.elptName.slice(0, -5).charAt(0).toUpperCase() 
		        				+ me.elptName.slice(0, -5).slice(1).replace(/_/g, ' ')
			        }
		        }
	        ]
		});
		this.callParent(arguments);
		
	},
	
});