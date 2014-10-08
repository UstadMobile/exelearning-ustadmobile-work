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
            url: 'loginumcloudp',		
            items: [	//Start of whole panel
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
                         	id: 'webservicelogin_userpanel',
                         	margin: 0, 
                         	items: [ 
                         	         {	
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
	                    labelWidth: 100, 
	                    anchor: '100%' 
	                },
                    margin: 5, 
                    items: [	
                        	{
                            	xtype:            'button',
                                text: _('Login'),
                            	width: 100,
                            	height: 50 ,
                                icon: '/images/key.png',
                                buttonAlign: 'center',
                                handler: function(button){
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

	
