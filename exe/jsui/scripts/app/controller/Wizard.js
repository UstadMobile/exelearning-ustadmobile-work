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

//Controller: For Wizard Panel
Ext.define('eXe.controller.Wizard', {
    extend: 'Ext.app.Controller',
    requires: [
               'eXe.view.forms.WizardPanel'
            ],
    
    init: function() {
        this.control({
        	'#wizard_create_new': {
       	   		click : this.setPackageTitleAndCreateNew,
         	},
         	'#wizard_show_library': {
            	beforerender:this.updateLibrary
            },
            '#wizard_show_recent': {
            	beforerender:this.updateRecent
            },
            '#wizard_show_templates': {
            	beforerender:this.updateTemplates
            },
            '#tools_wizard': {
            	click:this.toolsWizard
            },
        });
	},

	clickItemId: function() {
		//do stuff - reference the main toolbar as eXe.app.getController("Toolbar").
	},
	
	/**
	 * Create New Set Package Title and Create New project.
	 * Ask the user to give a title in a popup window, if they click
	 * OK send to the server and update the button text and create new project file
	 */
    setPackageTitleAndCreateNew: function(button) {
        Ext.Msg.show({
            prompt: true,
            title: _('Project Title'),
            msg: _('Enter the new name:'),
            buttons: Ext.Msg.OKCANCEL,
            multiline: false,
            value: button.text,
            scope: this,
            fn: function(button, text) {
                if (button == "ok") {
                    if (text) {
                    	eXe.app.getController("Toolbar").askDirty("eXe.app.gotoUrl('/?name="+encodeURIComponent(text)+"')");
                    }
                }
            }
        });
    },
    /*
     * Open Library Panel on Wizard Panel
     */
    updateLibrary: function() {
    	var librarypanel = Ext.getCmp('showfileopenlibrarypanel');
    	librarypanel.removeAll();
    	Ext.Ajax.request({
    		url: '/dirtree?sendWhat=both&dir=' + eXe.app.config.locationButtons[1]['location'] + '/eXeLearning/Library/',
    		scope: this,
    		success: function(response) {
    			var rm = Ext.JSON.decode(response.responseText),
    					menu, text, item, pre
    			for (var elp of rm['items']) {
    				if (elp['is_readable'] == true && elp['is_writable'] == true && elp['name'].match(/.elp$/) ){
	    				librarypanel.add({
	    					xtype: 'button',
	    					text: elp['name'],
	    					width: 150,
                            height: 200,
	    					icon: '/images/package-green.png',
	    					id: 'pk'+elp['size']+elp['name'].slice(0, -4).replace(' ','_'),
	    					handler: function(selectedOption){
		    					Ext.Msg.wait(_('Loading package...'));
								nevow_clientToServerEvent('loadPackage', this, '', elp['realname'])
		    				},
    					},	
	    				{	//For intendation purposes.
            	        	xtype: 'component',
            	        	flex: 1
            	        });
    				}
    			}
    		}
    	});
    },
    /**
     * Wizard Panel - Updating Recent Projects list
     */
    updateRecent: function(){	
    	var recpanel = Ext.getCmp('showrecentprojectspanel');
    	recpanel.removeAll();
    	Ext.Ajax.request({
    		url: location.pathname + '/recentMenu',
    		scope: this,
    		success: function(response) {
    			var rm = Ext.JSON.decode(response.responseText),
    					menu, text, item, pre
    			
    			for (i in rm) {				
    			    if(rm[i].title == "") {
    				    textButton = rm[i].num + ". " + rm[i].path;
				    }else {
				        textButton = "<b>" + rm[i].title
				        + "</b><br/>" + rm[i].path;
			        }
    				recpanel.add({
            			xtype: 'button',
        	        	text: _(textButton),
        	        	icon: '/images/package-green.png',
        	        	id: "openrecent" + rm[i].num,
        	        	textButton: textButton,
        	        	handler: function(selectedOption){
    						Ext.Msg.wait(_('Loading package...'));
    						nevow_clientToServerEvent('loadRecent', this, '', selectedOption.id[10])
    					},
    					width: 300,
            		});
    			}
    		}
    	});
    },
    /**
     * Wizard Panel - Updating Templates list
     */
    updateTemplates: function(){	
    	
    	var templatespanel = Ext.getCmp('showtemplatespanel');
    	templatespanel.removeAll();
    	Ext.Ajax.request({
    		url: '/dirtree?sendWhat=both&dir=' + eXe.app.config.locationButtons[1]['location'] + '/eXeLearning/Templates/',
    		scope: this,
    		success: function(response) {
    			var rm = Ext.JSON.decode(response.responseText),
    					menu, text, item, pre
				for (var elpt of rm['items']) {
    				if (elpt['is_readable'] == true && elpt['name'].match(/.elpt$/) ){
    					templatespanel.add(
	    						
	    						{
                                	xtype: 'panel',
                                	id: 'pk'+elpt['size']+elpt['name'].slice(0, -5).replace(' ','_'),
                                	bodyPadding: '10',
                                	layout: {
    							    	type: 'vbox',
    							    	align: 'center',
    							    	pack: 'center'
    							    },
                                	items: [
                                	        {
                                	        	xtype: 'image',
    	                                	    src: elpt['coverimage'] ? elpt['coverimage'] : '/images/stock-template.png',
    	                                	    width:150,
    	                                	    height:200,
    	                                	    
    	                                	    listeners: {
    		                                    	afterrender: function(c){
    			                                    	Ext.create('Ext.tip.ToolTip', {
    			                                    		target: c.getEl(),
    			                                    		html: elpt['description'] ? elpt['description'] : elpt['name'].slice(0, -5),
    			                                    	});
    			                                    	
    			                                    },
    	                                	        render: function(c) {
    	                                	            c.getEl().on('click', function(e) {
    	                                	                console.log('User clicked');
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
                                	        	xtype: 'box', autoEl: {cn: elpt['title'] ? elpt['title'] : elpt['name'].slice(0, -5)}
                                	        	//xtype: 'label',
                                	        	//margin: '5px',
                                	        	//html: 
                                	        }
                        	        ]
                                	
                            	    
                                }
	    						
	    						);
    				}
    			}
    			
    			
    		}
    	});
    },
    toolsWizard: function() {
    	var wizard = new Ext.Window ({
	          height: '80%', 
	          width: '80%', 
	          modal: true,
	          autoScroll: true,
	          id: 'wizardwin', //WIZard WINdow
	          title: _("Wizard"),
	          layout: 'fit',
	          items: [{
	        	  //xtype is from WizardPanel.js's alias
	              xtype: 'wizardpanel'
	          }]
	        }),
          formpanel = wizard.down('form');
	      wizard.show();        
    }
	
});