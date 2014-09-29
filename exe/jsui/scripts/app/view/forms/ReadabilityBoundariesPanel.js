//To Create the Wizard Panel.
var readabilityPanel = Ext.define('eXe.view.forms.ReadabilityBoundariesPanel', {
    extend: 'Ext.tab.Panel',
    id: 'readabilityboundarypanel',
    alias: 'widget.readabilityboundarypanel',
    refs: [
           //{
	       	//ref: 'wizardStylesMenu',
	       	//selector: '#wizard_styles_menu'
	       //}
        //{
	    	//ref: 'stylesWizard',
	    	//selector: '#styles_wizard'
        //}
    ],
    constructor: function () {
    	  //yourStuffBefore();
    	  //this.callParent(arguments);
    	  //initComp();
    	  this.callParent(arguments);
    	  //yourStuffAfter();

    	},

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: false,
            trackResetOnLoad: true,
            url: 'wizard',		//declared by wizardpage.py
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
                			type: 'column'
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
            		        	text: _("Import")
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Export")
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Delete")
            		        }
        		        ]
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
                		        	text: _("Export")
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
