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


//View: To Create the Publish Panel.
var pub = Ext.define('eXe.view.forms.PublishPanel', {
    extend: 'Ext.form.Panel',
    id: 'publishpanel',
    alias: 'widget.publishpanel',
    constructor: function () {
    	  this.callParent(arguments);
    	},

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: true,
            margin: 10,
            trackResetOnLoad: true,
            items: [	
				{
					xtype:  'label',
					html:   '<br></br><img src="/images/UstadMobile/UstadMobile01.png"' +
									'hspace="90" /></h3>',
				},
				{	
			     	xtype: 'container',
			     	id: 'umcloudusernamepanel',
			     	items: [ 
		     	         {	
		                      xtype: 'textfield',
		                      fieldLabel: _('Username'),
		                      height:30,
		                      width:'100%',
		                      id: 'umcloudusernameinput',
		                      allowBlank: false,
		                      blankText: _('You need to enter a username to log in'),
	         	         },
	         	        {	
	  		               xtype: 'textfield',
	  		               fieldLabel: _('Password'),
	  		               height:30,
	  		               width:'100%',
	  		               inputType: 'password',
	  		               id: 'umcloudpasswordinput',
	  		               allowBlank: false,
	  		               blankText: _('You need to enter a password to log in'),
	  		  	         },
		 	        ]
		         },
		         {	
	                   xtype: 'textfield',
	                   fieldLabel: _('Server'),
	                   height:30,
	                   width:'100%',
	                   id: 'umcloudserverurlinput',
	                   allowBlank: false,
	                   value: 'http://umcloud1.ustadmobile.com/blockupload/',
	                   blankText: _('You need to enter a servername to log in'),

	  	         },
	  	         {
		   	          xtype: 'button',
		   	          text: _('Create an account'),
		   	          icon: '/images/plusbutton.png',
			   	      style: {
			  	       	  	"margin-left":"20px"
				  	         },
		   	          handler: function(){
		   	        	 window.open('http://umcloud1.ustadmobile.com/register/start/');
		  	          }
	       	     },
	  	         {
		   	          xtype: 'button',
		   	          text: _('Go to UMCloud'),
		   	          icon: '/images/weather-clouds-2.png',
		   	          style: {
	  	        	  	"margin-left":"20px"
		  	          },
		   	          handler: function(){
		   	        	 window.open('http://umcloud1.ustadmobile.com/');
		  	          }
	       	     },
	       	     {
	 				  xtype:	'label',
	 				  html:		'<p></p><i>'+ _('Your block will become a course on first upload.' +  
	 					  			'If you are making changes to already published block,' +
	 					  				'it will update the course') + '.</i>',
	 				  width: 100,
	       	     },
	 			 {
	 				  xtype      : 'fieldcontainer',
	 				  fieldLabel : 'Options',
	 				  defaultType: 'checkboxfield',
	 				  style: {
		       	    	margin: '10px' 
		       	     },
	 				  items: [
	 				      {
	 				          boxLabel  : 'Force New Course ',
		 				      name      : 'forceNew',
		 				      inputValue: '1',
		 				      id        : 'forceNew'
					      }, 
		 				  {
		 				      boxLabel  : 'Dont assign me to this course',
		 				      name      : 'noAutoassign',
		 				      inputValue: '1',
		 				      id        : 'noAutoassign'
					      }
				      ]
	 			 },
	 			 {
		            	xtype:            'button',
		            	text: _('Login and Upload'),
		            	width: '100%',
		            	height: 50 ,
		                icon: '/images/key.png',
		                buttonAlign: 'center',
		                handler: function(button){
		        	  		var userName = Ext.getCmp('umcloudusernameinput').getValue();
		        	  		var pswd = Ext.getCmp('umcloudpasswordinput').getValue();
		        	  		var forceNew = Ext.getCmp('forceNew').getValue();
		        	  		var noAutoassign = Ext.getCmp('noAutoassign').getValue();
		        	  		var url = Ext.getCmp('umcloudserverurlinput').getValue();
		            		},
		        		itemId: 'publish_login_and_upload' ,  
                }		  
            ]
        });
        me.callParent(arguments);       
    },
});
