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

//To Create the IDevice Panel.
var wizz = Ext.define('eXe.view.forms.IDevicePanel', {
    extend: 'Ext.form.Panel',
    id: 'idevicepanel',
    alias: 'widget.idevicep',
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
            url: 'idevicep',		//declared by wizardpage.py
            items: [	//This is the whole Panel start
                {	
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 200, // Width of Label that one selects from options.
                        anchor: '100%' // How much % of screen should these options take in that frame.
                    },
                    margin: 10, //Margin from top
                    items: [	//This is the box area declatationarea
                    	{
                    		xtype: 'label',
                    		html: '<h3><i>Click an idevice to add it to your current page</i></h3>'
                    	},
                    	{	//This is where we make new additions to the box. 
                        	xtype: 'container',
                        	//layout: 'hbox',
                        	margin: 10, //Maring between Save and the options above it.
                        	items: [ //This is the box's items within the panel
                        	         {
                                         xtype: 'gridpanel',
                                         itemId: 'idevice_panel',
                                         height: 300,
                                         autoScroll: true,
                                         store: 'IdeviceXmlStore',
                                         flex: 1,
                                         plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                                         features: [{
                                            ftype: 'grouping',
                                     	   startCollapsed: false,
                                     	   groupHeaderTpl: '{name}',
                                     	   
                                         }],
                                         
                                  	    tbar: [
                                  	           /*
                                  	        {
                                  	        	xtype: 'button',
                                  	        	text: _('Ungroup iDevices'),
                                  	        	handler: function(button) {
                                  	        		var panel = button.up("#idevice_panel");
                                  	        		if (button.getText() == _('Ungroup iDevices')) {
                                  	        			panel.view.features[0].disable();
                                  	        			button.setText(_('Group iDevices'));
                                  	        		}
                                  	        		else {
                                  	        			panel.view.features[0].enable();
                                  	        			button.setText(_('Ungroup iDevices'));
                                  	        		}
                                  	        	}
                                  	        },
                                  	        
                                  	        {	//This is the edit button on the iDevices panel on the left.
                                  	        	xtype: 'button',
                                  	        	text: _('Edit iDevices'),
                                  	        	handler: function(button) {
                                  	        		var panel = button.up("#idevice_panel"),
                     	             	        		leftpanel = panel.up("leftpanel"),
                     	          	        			gbutton = button.prev("button");
                     	          	        		if (button.getText() == _('Edit iDevices')) {
                                  	        			button.leftPanelSize = leftpanel.getWidth();
                                  	        			if (button.leftPanelSize < 350)
                                  	        				leftpanel.setWidth(350);
                                  	        			panel.editing = true;
                                  	        			panel.columns[1].show();
                                  	        			panel.columns[2].show();
                                  	        			panel.store.clearFilter();
                                  	        			button.setText(_('Save iDevices'));
                                  	        			panel.view.features[0].disable();
                                  	        			gbutton.disable();
                                  	        		}
                                  	        		else {
                                  	        			var restore = function() {
                     	         	        				panel.editing = false;
                     	         	        				panel.columns[1].hide();
                     	         	        				panel.columns[2].hide();
                     	         	        				leftpanel.setWidth(button.leftPanelSize);
                     	         	        				button.setText(_('Edit iDevices'));
                     	         	        				gbutton.enable();
                     	         	        				if (gbutton.getText() == _('Ungroup iDevices'))
                     	         	        					panel.view.features[0].enable();
                     	         	        				panel.store.filter('visible', true);
                                  	        			};
                                  	        			if (panel.store.getModifiedRecords().length) {
                                  	        				panel.store.sync({
                                  	        					callback: restore
                                  	        				});
                                  	        			}
                                  	        			else {
                                  	        				restore();
                                  	        			}
                                  	        		}
                                  	        	}
                                  	        }	//End of edit iDevices.
                                  	        
                                  	        */
                                  	    ],
                     					selModel: {
                     					    selType: 'cellmodel'
                     					},
                                         region: 'south',
                                         split: true,
                                         
                                         columns: [
                                                   
                                             {	//For edit iDevices section column: iDevices
                                                 xtype: 'gridcolumn',
                                                 sortable: false,
                                                 dataIndex: 'label',
                                                 fixed: true,
                                                 flex: 1,
                                                 hideable: false,
                                                 menuDisabled: true,
                                                 text: _('iDevices')
                                             },
                                             {	//For edit iDevices section coloumn: Category
                                                 xtype: 'gridcolumn',
                                                 hidden: true,
                                                 sortable: false,
                                                 dataIndex: 'category',
                                                 fixed: true,
                                                 flex: 1,
                                                 hideable: false,
                                                 menuDisabled: true,
                                                 text: _('Category')
                                             },
                                             {	//For edit iDevices section Column: Visible
                                                 xtype: 'checkcolumn',
                                                 width: 50,
                                                 hidden: true,
                                                 sortable: false,
                                                 dataIndex: 'visible',
                                                 fixed: true,
                                                 flex: 0,
                                                 hideable: false,
                                                 menuDisabled: true,
                                                 text: _('Visible'),
                                                 editor: {
                                                     xtype: 'checkbox'
                                                 }
                                             }
                                             
                                         ]
                                         
                                     }
                    	        
                	        ]
                        },
                      
                    ]
                },
                
        ]
    }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
},	 //end of initComponent


});	 //end of Ext.define the panel form.


	
	
