// ===========================================================================
// eXe
// Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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


function yourStuffBefore(){	//Testing purposes only
	alert("StuffBefore");
}

	
function yourStuffAfter(){	//Testing purposes only
	alert("StuffAfter");
}

function getRecent(){	 	//If needed. Used for testing.
	var recentList = new Array();
	Ext.Ajax.request({
		url: location.pathname + '/recentMenu',
		scope: this,
		success: function(response) {
			var recList = new Array();
			var rm = Ext.JSON.decode(response.responseText),
					menu, text, item, pre
						
			for (i in rm){
				console.log("i: " + rm[i]);
			}
		}
	});
	return recentJSON;
}


function getTemplates(){	//If needed. Used for testing.
		var templateList = new Array();
		Ext.Ajax.request({
			url: location.pathname + '/styleMenu',
			scope: this,
			success: function(response) {	
				var styles = Ext.JSON.decode(response.responseText),
						menu, i, item;
				for (i = styles.length-1; i >= 0; i--) {
					templateList[i] = styles[i];
				}
			}
		});
	return templateList;
}

function testgetRecent(){
	
	if (recentJSON){
		var rms = Ext.JSON.decode(recentJSON.responseText);
		//alert(rms[1]);
		for (i in rms) {		
			var text = rms[i].num + ". " + rms[i].path;
			console.log("Found recent project rms: " + rms[i].path);
			
		}
	}else{
		console.log("else");
	}
}

//This is NOT used at all.. 06/04/2014 -Varuna Singh
function updateRecent2(){	//For updating the recent projects list
	var recpanel = Ext.getCmp('showrecentprojectspanel'); //showrecentprojectspanel
	recpanel.removeAll();
	//alert("updateRecent01");
	Ext.Ajax.request({
		url: location.pathname + '/recentMenu',
		scope: this,
		success: function(response) {
			var rm = Ext.JSON.decode(response.responseText),
					menu, text, item, pre
			recpanel.add(
    		 {	//For intendation purposes.
	        	xtype: 'component',
	        	flex: 1
	        })
			for (i in rm) {				
				textButton = rm[i].num + ". " + rm[i].path;
				recpanel.add({
        			xtype: 'button',
    	        	text: _(textButton),
    	        	margin: 10,
    	        	textButton: textButton,
    	        	handler: function(cow){
						console.log("You clicked: " + cow.textButton + "!");
						askDirty("eXe.app.getController('Toolbar').fileOpenRecent2('" + cow.textButton[0] + "');")
					},

    	        	//width : 128,
    	            //height : 34,
    	            //itemid: 'recent_project_button'
        		},
        		 {	//For intendation purposes.
    	        	xtype: 'component',
    	        	flex: 1
    	        })
			}
		}
	});
}

function updateTemplate(){	//For updating the Styles list
	var stylepanel = Ext.getCmp('showstylepanel'); //showstylepanel
	stylepanel.removeAll();
	Ext.Ajax.request({
		url: location.pathname + '/styleMenu',
		scope: this,
		success: function(response) {
			var styles = Ext.JSON.decode(response.responseText),
					menu, i, item;
			stylepanel.add(
		    		 {	//For intendation purposes.
		 	        	xtype: 'component',
		 	        	flex: 1
		 	        })
			for (i = styles.length-1; i >= 0; i--) {
                item = Ext.create('Ext.Button',{
                	xtype: 'button',
    	        	text: _(styles[i].label),
    	        	margin: 10,
    	        	handler: function(button) {
            	        	//Something?
    	        	},
    	        	width : 128,
    	            height : 64,
    	            cls: 'customclassforbuttontype',
    	            //We have to make a new class in css: .opennewproject to add background images, etc
    	            	//.opennewproject
    	            	// {
    	            	//	background-image: url(/images/opennewproject-wizard.png) !important;
    	            	// }
    	            //itemId: 'execution_property_id'
                	
                })
        		stylepanel.add({
        			xtype: 'button',
    	        	text: _(styles[i].label),
    	        	margin: 10,
    	        	width : 128,
    	            height : 64,
    	            itemid: 'test_button'
        		})
			}
		}
	});
}

//To Create the Wizard Panel.
var wizz = Ext.define('eXe.view.forms.WizardPanel', {
    extend: 'Ext.form.Panel',
    id: 'wizardpanel',
    alias: 'widget.wizard',
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
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'wizard',		//declared by wizardpage.py
            items: [	//This is the whole Panel start
                {	
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 200, // Width of Label that one selects from options.
                        anchor: '100%' // How much % of screen should these options take in that frame.
                    },
                    margin: 10, //Margin from top
                    items: [	//This is the box area declatationarea
                        
                    	{	//This is where we make new additions to the box. 
                        	xtype: 'container',
                        	//layout: 'hbox',
                        	margin: 10, //Maring between Save and the options above it.
                        	items: [ //This is the box's items within the panel
                    	        { //To open a new blank Project
                    	        	xtype: 'button',
                    	        	text: _('New Project'),
                    	        	margin: 10,
                    	        	handler: function(button) {
	                    	        	//Something?
                    	        	},
                    	        	width : 128,
                    	            height : 64,
                    	            cls: 'opennewproject',
                    	            //We have to make a new class in css: .opennewproject to add background images, etc
                    	            	//.opennewproject
                    	            	// {
                    	            	//	background-image: url(/images/opennewproject-wizard.png) !important;
                    	            	// }
                    	            itemId: 'file_new'
                    	        },
                    	        {	//Trying out to put Styles in here..
                                    xtype: 'accesskey_button',
                                    text: _('New Styled Project'),
                                    accesskey: 's',
                                    width : 128,
                    	            height : 64,
                                    itemId: 'wizard_styles_button',
                                    menu: {
                                        xtype: 'menu',
                	                    itemId: 'wizard_styles_menu',
                                    }
                                },
                    	        { //To Open Existing elp files from the Wizard
                    	        	xtype: 'button',
                    	        	text: _('Open Existing'),
                    	        	margin: 10,
                    	        	handler: function(button) {
                	        			//Something?
                    	        		},
                    	        	width : 128,
                    	            height : 64,
                    	            cls: 'openexistingproject',
                    	            //We have to make a new class in css: .openexistingproject to add background images, etc
                    	            	//.openexistingproject
                    	            	// {
                    	            	//	background-image: url(/images/openexistingproject-wizard.png) !important;
                    	            	// }
                	            	itemId: 'file_open'	//Actual call to open the file
                    	        },
                    	        
                    	        
                                {	//For intendation purposes.
                    	        	xtype: 'component',
                    	        	flex: 1
                    	        },
                    	        {                 	        	
                    	        	xtype: 'container',
                                    layout: 'hbox',
            						//layout:'column',
            						border:1,
            						width: '100%',
            						id : 'testsubpanel',
                                    items: [
                                       //{},{},{} //..etc     
                                            
                                    ]
                                },
                    	        {	//For intendation purposes.
                    	        	xtype: 'component',
                    	        	flex: 1
                    	        },
                	        ]
                        },
                      
                    ]
                },
                {
                    xtype:            'label',
                    html:       '<h3><i>Your recent projects:</i></h3><br></br>',
                	width: 100,
                	height: 10,	//Doesnt really do much.
                },
                               
                
            	{ //This is another box..
					
                    xtype: 'panel',
                    //layout: 'hbox',
					//border:1,
					width: '100%',
					id: 'showrecentprojectspanel',
                    items: [
                            //Any items for testing here..
                            { //Sample button
		        	        	xtype: 'button',
		        	        	text: _('Show Recent Projects'),
		        	        	margin: 10,
		        	        	handler: function(button) {
		            	        	//Something?
                            		//alert("test: calling updateRecent()");
                            		//updateRecent(); //Updates the Wizard panel with style templates
		        	        	},
		        	        	width : 128,
		        	            height : 64,
		        	            cls: 'customclassforbuttontype',
		        	            //We have to make a new class in css: .opennewproject to add background images, etc
		        	            	//.opennewproject
		        	            	// {
		        	            	//	background-image: url(/images/opennewproject-wizard.png) !important;
		        	            	// }
		        	            itemId: 'wizard_show_recent',
		        	            
		    	        	}
		    	        	
                    ]
                },
                
    	        { //Auto start check button
    	        	xtype: 'checkboxfield',
    	        	margin: 10,
    	        	//inputId: 'showPreferencesOnStart',
    	        	inputId: 'showWizardOnStart',
    	        	inputValue: '1',
                    uncheckedValue: '0',
                    dirtyCls: 'property-form-dirty',
    	        	boxLabelAlign: 'before',
    	        	boxLabel: _('Show this window on eXe start')
    	        },
    	        {	//Save button
    	        	xtype: 'button',
    	        	text: _('Save'),
    	        	margin: 10,
    	        	handler: function(button) {
    	        		var formpanel = button.up('form'),
    	        		form = formpanel.getForm();
    	        		form.submit({
    	        			success: function() {
    	        				nevow_clientToServerEvent('reload');
    	        			},
    	        			failure: function(form, action) {
    	        				Ext.Msg.alert(_('Error'), action.result.errorMessage);
    	        			}
    	        		});
    	        	},
    	        	itemId: 'save_wizard'	 //Just an ID..
    	        },
    	        
        ]
    }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
},	 //end of initComponent


});	 //end of Ext.define the panel form.


	
	
