// ===========================================================================
// eXe
// Copyright 2014, Varuna Singh, Ustad Mobile
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

//To Create the ExportUstadMobile Panel.

function updateUSBDevicesList(){	//Added for refreshing of USB devices.
    	var recpanel = Ext.getCmp('showremovabledevices'); //showrecentprojectspanel
    	recpanel.removeAll();
    	
       	Ext.Ajax.request({
    		//url: location.pathname + '/exportustadmobilep',
       		url: 'exportustadmobilep',
    		scope: this,
    		success: function(response) {
				var rm = Ext.JSON.decode(response.responseText),
					menu, text, item, previtem;
				//var rm = Ext.JSON.decode(response.responseText),
				//	menu = this.getRecentMenu(), text, item, previtem;
				
				recpanel.add(
		        		 {	//For intendation purposes.
		    	        	xtype: 'component',
		    	        	flex: 1
		    	        })
		    	        
    			for (i in rm) {
    				//alert("rm is: " + rm[i]['removabledrivepath']);
    				textButton = rm[i]['removabledrivevendor'] + " " + rm[i]['removabledrivesize'] + " [" + rm[i]['removabledrivepath'] + "]";
					usbPath = rm[i]['removabledrivepath'];
    				recpanel.add({
            			xtype: 'button',
        	        	text: _(textButton),
        	        	margin: 10,
        	        	height:30,
                        width:450,
        	        	textButton: textButton,
        	        	usbPath: usbPath,
        	        	handler: function(cow){
    					
	    					//We have to save the file. 
							nevow_clientToServerEvent('autoSavePackage', this, '');	
							
    						console.log("You clicked: " + cow.textButton + "!");
    						//this.askDirty("eXe.app.getController('Toolbar').fileOpenRecent2('" + cow.textButton[0] + "');")
    						//fileOpenRecent2(cow.textButton[0]);
    						Ext.Msg.wait(_('Saving package to ' + cow.textButton + ' ...'));
    						//nevow_clientToServerEvent('loadRecent', this, '', cow.textButton[0])
    						
    						//self.package.name needs to be changed to the user's input
    						nevow_clientToServerEvent('exportPackage', this, '', "mxml", cow.usbPath);
    						
    						//Works well, but we need to stop the J2ME emulator from popping up all the time.
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

var exportump = Ext.define('eXe.view.forms.ExportUstadMobilePanel', {
    extend: 'Ext.form.Panel',
    id: 'exportustadmobilep',	//Doesnt do much..
    alias: 'widget.exportustadmobilep',
    refs: [
           //none.
    ],
    constructor: function () {
    	  this.callParent(arguments);
	},

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'exportustadmobilep',		//declared by exportustadmobile.py
            items: [	//This is the whole Panel start
                    	
            	{
                    xtype:            'label',
                    html:       '<br></br><img src="/images/UstadMobile/UstadMobile01.png" hspace="90" /><h3><i>Your Options:</i></h3>',
                	width: 100,
                	height: 10,	//Doesnt really do much.
            	},
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
                         	margin: 0, //Maring between Save and the options above it.
                         	items: [ //This is the box's items within the panel
                     	       
                         	         {
                                          xtype: 'button',
                                          text: _('Export to UMCloud'),
                                          //icon: '/images/icon-16-vldpi.png', //Added
                                          itemId: 'tools_umcloud',
                                          height:50,
                                          width:480,
                                      },
                 	        ]
                         },
                     ]
                 },
                 {
                     xtype:            'label',
                     html:       '<i>This option will upload your projects and keep them in sync with UMCloud</i><br></br>',
                 	width: 100,
                 	height: 10,	//Doesnt really do much.
                 },
                    	
                    	

                
                 {
                	 	xtype: 'container',
                		title: 'Test',
                		buttonAlign: 'right',
                		items: [
                            {
                            	xtype:            'button',
                                //html:       '<i>Select which Removable USB Drive to export your project</i><br></br>',
                            	text: _('Refresh disks'),
                                icon: '/images/view-refresh-5.png',
                                buttonAlign: 'right',
                                handler: function(button){
                           	 		updateUSBDevicesList();
                            	}
                            },
                		],
                		
            		},
                 
                 
                 
              
               {	
                  xtype: 'fieldset',
                  defaults: {
                      labelWidth: 200, // Width of Label that one selects from options.
                      anchor: '100%' // How much % of screen should these options take in that frame.
                  },
                  margin: 1, //Margin from top
                  items: [	//This is the box area declatationarea
                          	
                          	 {
                                 xtype:            'label',
                                 html:       '<i>Select which Removable USB Drive to export your project</i><br></br>',
                             	width: 100,
                             	height: 10,	//Doesnt really do much.
                             },
                            
                  	{	//This is where we make new additions to the box. 
                      	xtype: 'container',
                      	id: 'showremovabledevices',
                      	//layout: 'hbox',
                      	margin: 0, //Maring between Save and the options above it.
                      	items: [ //This is the box's items within the panel
                      	         {
                                       xtype: 'button',
                                       text: _('Export to USB device'),
                                       //icon: '/images/icon-16-vldpi.png', //Added
                                       itemId: 'export_ustadmobile_show_usb_list',
                                       height:50,
                                       width:480,
                                      
                                   },
              	        ]
                      },
                  ]
              },
              {
                  xtype:            'label',
                  html:       '<i>This option will save and export your project to your connected USB devices</i><br></br>',
              	width: 100,
              	height: 10,	//Doesnt really do much.
              },
              
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
                      	margin: 0, //Maring between Save and the options above it.
                      	items: [ //This is the box's items within the panel
                  	       
                      	         {
                                       xtype: 'button',
                                       text: _('Export to PC'),
                                       //icon: '/images/icon-16-vldpi.png', //Added
                                       itemId: 'file_export_mxml',
                                       height:50,
                                       width:480,
                                       cls: 'customclassforexportdisk',
                       	            //We have to make a new class in css: .opennewproject to add background images, etc
                       	            	//.opennewproject
                       	            	// {
                       	            	//	background-image: url(/images/opennewproject-wizard.png) !important;
                       	            	// }
                                   },
              	        ]
                      },
                  ]
              },
              {
                  xtype:            'label',
                  html:       "<i>This option will save and export your project to your computer's disk</i><br></br>",
              	width: 100,
              	height: 10,	//Doesnt really do much.
              },
          ]
        }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
	},	 //end of initComponent

});	 //end of Ext.define the panel form.


	
	
