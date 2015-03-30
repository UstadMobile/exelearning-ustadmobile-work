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
            '#wizard_show_library > wizardcoursepanel' : {
            	click: {
            		fn: function(coursePanel) {
		            	Ext.Msg.wait(_('Loading package...'));
						nevow_clientToServerEvent('loadPackage', this, '', coursePanel.elptFilepath)
            		}
            	}
            },
            '#wizard_show_templates > wizardcoursepanel' : {
            	click: {
            		fn: function(coursePanel) {
            			eXe.app.getController('Wizard').setPackageTitleAndSend(coursePanel.elptFilepath);
            		}
            	}
            }
        });
	},

	/**
	 * Create New Set Package Title and return the name.
	 * Ask the user to give a title in a popup window, if they click
	 * OK send to the server
	 */
    setPackageTitleAndSend: function(template_path, button) {
        Ext.Msg.show({
            prompt: true,
            title: _('Project Title'),
            msg: _('Enter the new name:'),
            buttons: Ext.Msg.OKCANCEL,
            multiline: false,
            scope: this,
            fn: function(button, text) {
                if (button == "ok") {
                    if (text) {
                    	Ext.Msg.wait(new Ext.Template(_('Loading template: {text}')).apply({text: text}));
    		    		nevow_clientToServerEvent('loadTemplatePackage', this, '', template_path, text);
                    }
                }
            }
        });
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
    	var dirParam = encodeURIComponent(eXe.app.config.locationButtons[1]['location'] + '/eXeLearning/Library/');
    	Ext.Ajax.request({
    		url: '/dirtree?sendWhat=both&dir=' + dirParam,
    		scope: this,
    		success: function(response) {
    			var rm = Ext.JSON.decode(response.responseText),
    					menu, text, item, pre
    					
				for (var i = 0; i < rm['items'].length; i++){
					var elp = rm['items'][i];
    				if (elp['is_readable'] == true && elp['is_writable'] == true && elp['name'].match(/.elp$/) ){
    					librarypanel.add({
    						xtype: 'wizardcoursepanel',
    						elptDescription: elp.description ? elp.description.replace(/(^\s+|\s+$)/g, '') : '',
    						elptFilepath: elp.realname.replace(/(^\s+|\s+$)/g, ''),
    						elptName: elp.name.replace(/(^\s+|\s+$)/g, ''),
    						elptTitle: elp.title,
    						elptCoverImage: elp.coverimage ? elp.coverimage.replace(/(^\s+|\s+$)/g, '') : '/images/exe_course.png',
						}	
						);    				
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
    				
				for (var i = 0; i < rm.length; i++){
    			    if(rm[i].title == "") {
    				    textButton = rm[i].num + ". " + rm[i].path;
				    }else {
				    	textButton = "<b>" + rm[i].title + "</b><br/>"
				    			+ "<i>" + rm[i].path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '').replace(eXe.app.config.locationButtons[1]['location'],"Documents").replace(eXe.app.config.locationButtons[0]['location'],"Home").replace(eXe.app.config.locationButtons[2]['location'],"Desktop") + "</i>"
			        }
    				recpanel.add({
            			xtype: 'button',
            			scale: 'medium',
        	        	text: _(textButton),
        	        	textAlign: 'left',
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
    	
    	//Sticky
    	templatespanel.add(
    			{
                	xtype: 'panel',
                	id: 'pk'+ 'blank_sticky',
                	bodyPadding: '10',
                	/*layout: {
				    	type: 'vbox',
				    	align: 'center',
				    	pack: 'center'
				    },*/
                	
                	items: [
		    			{
				        	xtype: "image",
				        	src: '/images/blank-template.png',
				        	width: 150,
				        	height: 200,
				        	
				        	listeners:{
				        		afterrender: function(c){
					        		Ext.create('Ext.tip.ToolTip',{
					        			target: c.getEl(),
					        			html: _("Creates a new blank project")
					        		});
						        },
						        render: {
						        	fn: function(comp) {
						        		comp.getEl().on('click', function() {
						        			eXe.app.getController('Wizard').setPackageTitleAndCreateNew();
						        		});
						        	}
						        }
				        	},
				        	border: 2, 
				        	style: {
				        		borderColor: 'gray',
				        		borderStyle: 'solid',
				        		margin: '10px',
				        		cursor: "pointer"
				        	}
				        },
				        
				        {
				        	xtype: 'box',
				        	autoEl: {
				        		cn: _("Blank Project")
					        }
				        }
			        ]
    			}
    			
    			);
    	
    	var dirParam = encodeURIComponent(eXe.app.config.locationButtons[1]['location'] + '/eXeLearning/Templates/');
    	Ext.Ajax.request({
    		url: '/dirtree?sendWhat=both&dir=' + dirParam,
    		scope: this,
    		success: function(response) {
    			var rm = Ext.JSON.decode(response.responseText),
    					menu, text, item, pre
				for (var i = 0; i < rm['items'].length; i++){
					var elpt = rm['items'][i];
    				if (elpt['is_readable'] == true && elpt['name'].match(/.elpt$/) ){
    					templatespanel.add({
	    						xtype: 'wizardcoursepanel',
	    						elptDescription: elpt.description ? elpt.description.replace(/(^\s+|\s+$)/g, '') : '',
	    						elptFilepath: elpt.realname.replace(/(^\s+|\s+$)/g, ''),
	    						elptName: elpt.name.replace(/(^\s+|\s+$)/g, ''),
	    						elptTitle: elpt.title,
	    						elptCoverImage: elpt.coverimage ? elpt.coverimage.replace(/(^\s+|\s+$)/g, '') : '',
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
	              xtype: 'wizardpanel'
	          }]
	        }),
          formpanel = wizard.down('form');
	      wizard.show();        
    }
	
});