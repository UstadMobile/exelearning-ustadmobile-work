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
                                title: 'Templates',
                                bodyPadding: '10',
                                xtype:'panel',
	                            autoScroll: true,
	                            layout: {
							    	type: 'hbox'
							    },
	                            id: 'showtemplatespanel',
	                            itemId: 'wizard_show_templates',
	                            items: [
	                                    {
	                                    	xtype: 'panel',
	                                    	id: 'blahpanel',
	                                    	bodyPadding: '10',
	                                    	layout: {
	        							    	type: 'vbox'
	        							    },
	                                    	items: [
	                                    	        {
	                                    	        	xtype: 'image',
	        	                                	    src: '/images/smartphone.png',
	        	                                	    width:150,
	        	                                	    height:200,
	        	                                	    
	        	                                	    listeners: {
	        		                                    	afterrender: function(c){
	        			                                    	Ext.create('Ext.tip.ToolTip', {
	        			                                    		target: c.getEl(),
	        			                                    		html: 'This is the description',
	        			                                    	});
	        			                                    	
	        			                                    },
	        	                                	        render: function(c) {
	        	                                	            c.getEl().on('click', function(e) {
	        	                                	                console.log('User clicked image');
	        	                                	            }, c);
	        	                                	        }
	        	                                	    },
	        	                                	    border: 2,
	        	                                	    style: {
	        	                                	        borderColor: 'gray',
	        	                                	        borderStyle: 'solid',
	        	                                	        margin: '10px'
	        	                                	    }
	                                    	        },
	                                    	        {
	                                    	        	xtype: 'label',
	                                    	        	margin: '10px',
	                                    	        	html: "<b>This is the title</b>"
	                                    	        }
                                	        ]
	                                    	
	                                	    
	                                    },
	                                    {
	                                    	xtype: 'panel',
	                                    	id: 'blahpanel2',
	                                    	bodyPadding: '10',
	                                    	layout: {
	        							    	type: 'vbox',
	        							    },
	                                    	items: [
	                                    	        {
	                                    	        	xtype: 'image',
	        	                                	    src: '/images/smartphone.png',
	        	                                	    width:150,
	        	                                	    height:200,
	        	                                	    text: 'Blahhhh',
	        	                                	    html: '<b>Blahh</b>',
	        	                                	    
	        	                                	    listeners: {
	        		                                    	afterrender: function(c){
	        			                                    	Ext.create('Ext.tip.ToolTip', {
	        			                                    		target: c.getEl(),
	        			                                    		html: 'This is the description',
	        			                                    	});
	        			                                    	
	        			                                    },
	        	                                	        render: function(c) {
	        	                                	            c.getEl().on('click', function(e) {
	        	                                	                console.log('User clicked image');
	        	                                	            }, c);
	        	                                	        }
	        	                                	    },
	        	                                	    border: 2,
	        	                                	    style: {
	        	                                	        borderColor: 'gray',
	        	                                	        borderStyle: 'solid',
	        	                                	        margin: '10px'
	        	                                	    },
	        	                                	    html: "<b>BLAHHH_</b>"
	                                    	        },
	                                    	        {
	                                    	        	xtype: 'label',
	                                    	        	html: "<b>This is the title</b>"
	                                    	        }
	                                    	        
                                	        ]
	                                    	
	                                	    
	                                    },
                                    ]
                            },
                            {
                                title: 'Local Library',
                                bodyPadding: 10,
                                xtype: 'buttongroup',
								autoScroll:true,
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
								text: _('Create New'),
								icon: '/images/wizard-new.png',
							    itemId: 'wizard_create_new',
							    region: 'south',
							},
							
							{ 
								xtype: 'button',
								text: _('Open File'),
								icon: '/images/wizard-open.png',
								itemId: 'file_open',
								region: 'south',
							},
							
							
							
							{
							    xtype:  'label',
							    html:   '<h3><i>Your recent projects:</i></h3>',
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
        }); //End of ExtApplyIf       
        me.callParent(arguments);       
    },	 //end of init Component
});	 //end of Ext.define the panel form.