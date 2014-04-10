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

//To Create the ExportUstadMobile Panel.

var loginumcloudpanel = Ext.define('eXe.view.forms.LoginCloudPanel', {
    extend: 'Ext.form.Panel',
    id: 'loginumcloudt',	//Doesnt do much..
    alias: 'widget.loginumcloudt',
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
            //buttonAlign: 'center',
            url: 'loginumcloudt',		//declared by exportustadmobile.py
            items: [	//This is the whole Panel start
                    	
            	{
                    xtype:            'label',
                    html:       '<br></br><img src="/images/UstadMobile/UstadMobile01.png" hspace="90" /><h3><i>Log in here:</i></h3>',
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
                         	id: 'umcloudusernamepanel',
                         	//layout: 'hbox',
                         	margin: 0, //Maring between Save and the options above it.
                         	items: [ //This is the box's items within the panel
                     	       
                         	         {	//Should be text input (Username)
                                          xtype: 'textfield',
                                          fieldLabel: _('Username'),
                                          height:30,
                                          width:480,
                                          id: 'umcloudusernameinput',
                                          allowBlank: false,
                                          blankText: _('You need to enter a username to log in'),
                                          //minLength:3,
                                          //maxLength:400,
                         	         },
                 	        ]
                         },
                     ]
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
                      	id: 'umcloudpasswordpanel',
                      	//layout: 'hbox',
                      	margin: 0, //Maring between Save and the options above it.
                      	items: [ //This is the box's items within the panel
                      	       {	//Should be text input (Username)
                                   xtype: 'textfield',
                                   fieldLabel: _('Password'),
                                   height:30,
                                   width:480,
                                   inputType: 'password',
                                   id: 'umcloudpasswordinput',
                                   allowBlank: false,
                                   blankText: _('You need to enter a password to log in'),
                                   //minLength:3,
                                   //maxLength:400,
                  	         },
              	        ]
                      },
                  ]
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
                      	id: 'umcloudserverurlpanel',
                      	//layout: 'hbox',
                      	margin: 0, //Maring between Save and the options above it.
                      	items: [ //This is the box's items within the panel
                  	       
                      	         {	//Should be text input (Username)
                                       xtype: 'textfield',
                                       fieldLabel: _('Server'),
                                       height:30,
                                       width:480,
                                       id: 'umcloudserverurlinput',
                                       allowBlank: false,
                                       value: 'http://127.0.0.1:8000/checklogin/',
                                       blankText: _('You need to enter a servername to log in'),
                                       //minLength:3,
                                       //maxLength:400,
                      	         },
                      	       {
                      	          xtype: 'button',
                      	          text: _('Go to UMCloud'),
                      	          icon: '/images/weather-clouds-2.png',
                      	          handler: function(){
                      	        	 window.open('http://127.0.0.1:8000');
                      	         }
                      	       }
              	        ]
                      },
                  ]
              },
              {
                  xtype:            'label',
                  html:       '<i>Click on Login to Log in to Ustad Mobile Cloud Portal for analytics</i><br></br>',
              	  width: 100,
              	  height: 10,	//Doesnt really do much.
              },
              
                
                
                
                {	
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 100, // Width of Label that one selects from options.
                        anchor: '100%' // How much % of screen should these options take in that frame.
                    },
                    margin: 5, //Margin from top
                    items: [	//This is the box area declatationarea
                            	
                            	{
                                	xtype:            'button',
                                    //html:       '',
                                	text: _('Login'),
                                	width: 100,
                                	height: 50 ,
                                    icon: '/images/key.png',
                                    buttonAlign: 'center',
                                    handler: function(button){
                               	 		//Something?
                            	  		var userName = Ext.getCmp('umcloudusernameinput').getValue();
                            	  		var pswd = Ext.getCmp('umcloudpasswordinput').getValue();
                            	  		var url = Ext.getCmp('umcloudserverurlinput').getValue();
                            	  		console.log(" Button handler: Username and Password provided against url: " + userName+"/"+pswd+" ["+url+"]");
                                		},
                            		itemId: 'umcloud_login' ,  
                                },
                    ]
                },
                	/*
                	{
                    	xtype:            'button',
                        //html:       '<i>Select which Removable USB Drive to export your project</i><br></br>',
                    	text: _('Reset'),
                        icon: '/images/edit-clear-2.png',
                        buttonAlign: 'center',
                        handler: function(button){
                   	 		//Something?
                    		}
                	},
                	 */
          ]
        }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
	},	 //end of initComponent

});	 //end of Ext.define the panel form.


	
	
