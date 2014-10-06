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

var webServiceLoginPanel = Ext.define('eXe.view.forms.WebServiceLoginPanel', {
    extend: 'Ext.form.Panel',
    id: 'webserviceloginp',
    alias: 'widget.webserviceloginp',
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
            url: 'loginumcloudp',		//declared by exportustadmobile.py
            items: [	//This is the whole Panel start
                {	
                     xtype: 'fieldset',
                     defaults: {
                         labelWidth: 200, 
                         anchor: '100%' 
                     },
                     margin: 10, //Margin from top
                     items: [	//This is the box area declatationarea
                         
                     	{	//This is where we make new additions to the box. 
                         	xtype: 'container',
                         	id: 'webservicelogin_userpanel',
                         	//layout: 'hbox',
                         	margin: 0, //Maring between Save and the options above it.
                         	items: [ //This is the box's items within the panel
                     	       
                         	         {	//Should be text input (Username)
                                          xtype: 'textfield',
                                          fieldLabel: _('Username'),
                                          height:30,
                                          width:480,
                                          id: 'webservicelogin_username',
                                          allowBlank: false,
                                          blankText: _('You need to enter a username to log in')
                         	         },
                 	        ]
                         },
                     ]
                 },
                
              {	
                  xtype: 'fieldset',
                  defaults: {
                      labelWidth: 200, 
                      anchor: '100%'
                  },
                  margin: 10, 
                  items: [	
                  	{	 
                      	xtype: 'container',
                      	id: 'umcloudpasswordpanel',
                      	margin: 0, 
                      	items: [ 
                      	       {
                                   xtype: 'textfield',
                                   fieldLabel: _('Password'),
                                   height:30,
                                   width:480,
                                   inputType: 'password',
                                   id: 'webservicelogin_password',
                                   allowBlank: false,
                                   blankText: _('You need to enter a password to log in'),
                  	         },
              	        ]
                      },
                  ]
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
                        	  		var username = Ext.getCmp('webservicelogin_username').getValue();
                        	  		var password = Ext.getCmp('webservicelogin_password').getValue();
                        	  		eXe.app.getController('Toolbar'
                        	  				).handleWebServiceLogin(username, password);
                        		},
                        		itemId: 'webservicelogin_loginbutton' ,  
                            }
                    ]
                },
          ]
        }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
	},	 //end of initComponent

});	 //end of Ext.define the panel form.

	
