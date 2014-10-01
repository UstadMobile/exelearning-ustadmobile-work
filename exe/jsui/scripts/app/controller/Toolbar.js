// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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

Ext.define('eXe.controller.Toolbar', {
    extend: 'Ext.app.Controller',
    requires: ['eXe.view.forms.PreferencesPanel', 
        'eXe.view.forms.StyleManagerPanel', 
        'eXe.view.forms.WizardPanel', 
        'eXe.view.forms.IDevicePanel', 
        'eXe.view.forms.ExportUstadMobilePanel', 
        'eXe.view.forms.LoginUMCloudPanel', 
        'eXe.view.forms.LoginCloudPanel', 
        'eXe.view.forms.ReadabilityBoundariesPanel'], //Added WizardPanel and IDevicePanel and ExportUstadMobilePanel
	refs: [{
        ref: 'recentMenu',
        selector: '#file_recent_menu'
    },{
    	ref: 'stylesMenu',
    	selector: '#styles_menu'
    },{
    	ref: 'wizardStylesMenu',
    	selector: '#wizard_styles_menu'
    },
    ],    
    init: function() {
        this.control({
            '#file': {
                click: this.focusMenu
            },
            '#tools': {
                click: this.focusMenu
            },
            '#wizard_styles_button': {	//Added
                click: this.focusMenu
            },
            '#styles_button': {
                click: this.focusMenu
            },
            '#help': {
                click: this.focusMenu
            },
        	'#file_new': {
        		click: this.fileNew
        	},
            '#file_new_window': {
                click: this.fileNewWindow
            },
        	'#file_open': {
        		click: this.fileOpen
        	},
        	'#file_recent_menu': {
        		beforerender: this.recentRender
        	},
        	'#idevicepanel' : {
        	   beforerender: this.updateIdeviceTabs
        	},
        	//wizard_show_recent
        	'#wizard_show_recent': {
        		beforerender: this.updateRecent
        	},
        	'#title_button' : {
        	   click : this.setPackageTitle,
        	   beforerender : this.updatePackageTitle
        	},
        	//export_ustadmobile_show_usb_list
        	'#export_ustadmobile_show_usb_list': {
        		beforerender: this.updateUSBDevicesList
        	},
        	'#styles_button': {
        		beforerender: this.stylesRender
        	},
        	'#wizard_styles_button': {	//Added
        		beforerender: this.wizardStylesRender
        	},
        	'#file_recent_menu > menuitem': {
        		click: this.recentClick
        	},
        	'#styles_menu > menuitem': {
        		click: this.stylesClick
        	},
        	'#wizard_styles_menu > menuitem': {
        		click: this.wizardStylesClick
        	},
 
        	'#file_save': {
        		click: this.fileSave
        	},
        	'#file_save_as': {
        		click: this.fileSaveAs
        	},
            '#file_print': {
                click: this.filePrint
            },
            '#file_export_cc': {
                click: { fn: this.processExportEvent, exportType: "commoncartridge" }
            },
            '#file_export_scorm12': {
                click: { fn: this.processExportEvent, exportType: "scorm1.2" }
            },
            '#file_export_scorm2004': {
                click: { fn: this.processExportEvent, exportType: "scorm2004" }
            },
            '#file_export_agrega': {
                click: { fn: this.processExportEvent, exportType: "agrega" }
            },
            '#file_export_ims': {
                click: { fn: this.processExportEvent, exportType: "ims" }
            },
            '#file_export_website': {
                click: { fn: this.processExportEvent, exportType: "webSite" }
            },
            '#file_export_zip': {
                click: { fn: this.processExportEvent, exportType: "zipFile" }
            },
            '#file_export_singlepage': {
                click: { fn: this.processExportEvent, exportType: "singlePage" }
            },
            '#file_export_text': {
                click: { fn: this.processExportEvent, exportType: "textFile" }
            },
            '#file_export_mxml': {
                click: { fn: this.processExportEvent, exportType: "mxml" }
             },
            '#file_export_epub3': {
                click: { fn: this.processExportEvent, exportType: "epub3" }
            },
            '#file_export_xliff': {
                click: this.exportXliff
            },
            '#file_import_xliff': {
                click: this.importXliff
            },
            '#file_import_html': {
                click: this.importHtml
            },
            '#file_import_lom': {
                click: { fn: this.importLom, metadataType: "lom" }
            },
            '#file_import_lomes': {
                click: { fn: this.importLom, metadataType: "lomEs" }
            },
            '#file_insert': {
                click: this.insertPackage
            },
            '#file_extract': {
                click: this.extractPackage
            },
            '#file_quit': {
                click: this.fileQuit
            },
            '#tools_idevice': {
                click: this.toolsIdeviceEditor
            },
            '#tools_stylemanager': {
                click: this.toolsStyleManager
            },
            '#tools_preferences': {
                click: this.toolsPreferences
            },
            '#tools_wizard': {	//Added
                click: this.toolsWizard
            },
            
            '#tools_readability_boundaries' : {
                click: this.readabilityBoundariesClick
            },
            
            '#readabilityBoundariesTargetsToJSON' : {
            	click: this.saveReadabilityBoundariesTargets
            },
            
            '#readabilityboundarypanel' : {
                beforerender: this.readabilityBoundariesLoadInfo
            },
            '#toolbar_readability' : {
            	click: this.readabilityBoundariesClick
            },
            //tools_idevicep
            '#tools_idevicep': {	//Added
                click: this.toolsIDeviceP
            },
            //export_ustadmobile
            '#export_ustadmobile': {	//Added
                click: this.exportUstadMobileP
            },
            //tools_umcloud
            '#tools_umcloud': {	//Added
                click: this.umCloudP
            },
            //toolbar_umcloud_login
            '#toolbar_umcloud_login': {	//Added
                click: this.login_umcloud_toolbar
            },
            //uncloud_login_upload
            '#uncloud_login_upload': {	//Added
                click: this.umCloudLoginUpload
            },
            //umcloud_login
            '#umcloud_login': {	//Added
                click: this.umCloudLogin
            },
            '#tools_resourcesreport': {
            	click: { fn: this.processExportEvent, exportType: "csvReport" }
            },
            '#tools_preview': {
                click: { fn: this.processBrowseEvent, url: location.href + '/preview' }
            },
            '#tools_preview_smartphone': {
                click: { fn: this.processBrowseEvent, url: location.href + '/previewmobile/deviceframe.html' }
            },
            '#tools_preview_featurephone': {
                click: this.previewFeaturePhone 
            },
            '#tools_refresh': {
                click: this.toolsRefresh
            },
            '#help_tutorial': {
                click: this.fileOpenTutorial
            },
            '#help_manual': {
                click: { fn: this.processBrowseEvent, url: 'file://%s/docs/manual/Online_manual.html' }
            },
            '#help_notes': {
                click: { fn: this.processBrowseEvent, url: 'file://%t' }
            },
            '#help_website': {
                click: { fn: this.processBrowseEvent, url: 'http://exelearning.net/' }
            },
            '#help_issue': {
                click: { fn: this.processBrowseEvent, url: 'https://forja.cenatic.es/tracker/?group_id=197' }
            },
            '#help_forums': {
                click: { fn: this.processBrowseEvent, url: 'http://exelearning.net/forums/' }
            },
            '#help_about': {
                click: this.aboutPage
            }
        });
        
        this.keymap_config = [
			{
				key: Ext.EventObject.N,
				ctrl: true,
                alt: true,
				handler: function() {
				 this.fileNew();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
				key: Ext.EventObject.W,
				ctrl: true,
                alt: true,
				handler: function() {
				 this.fileNewWindow();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.O,
			     ctrl: true,
			     handler: function() {
			          this.fileOpen();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
				key: Ext.EventObject.S,
				ctrl: true,
				handler: function() {
				 this.fileSave();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.P,
			     ctrl: true,
			     handler: function() {
			          this.filePrint();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.Q,
			     ctrl: true,
			     handler: function() {
			          this.fileQuit();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.F,
			     alt: true,
			     handler: function() {
			          this.showMenu(Ext.ComponentQuery.query('#file')[0]);
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.T,
			     alt: true,
			     handler: function() {
			          this.showMenu(Ext.ComponentQuery.query('#tools')[0]);
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.S,
			     alt: true,
			     handler: function() {
			          this.showMenu(Ext.ComponentQuery.query('#styles_button')[0]);
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.H,
			     alt: true,
			     handler: function() {
			          this.showMenu(Ext.ComponentQuery.query('#help')[0]);
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
            {
	            key: Ext.EventObject.F5,
	            handler: function() {
	                 this.toolsRefresh();
	            },
	            scope: this,
	            defaultEventAction: "stopEvent"
			}
        ];
        var keymap = new Ext.util.KeyMap(Ext.getBody(), this.keymap_config);
    },

    focusMenu: function(button) {
        button.menu.focus();
    },

    showMenu: function(button) {
		button.showMenu();
        button.menu.focus();
    },

    fileNewWindow: function() {
        window.open(location.href);
    },

	aboutPage: function() {
        var about = new Ext.Window ({
          height: eXe.app.getMaxHeight(700),
          width: 420,
          modal: true,
          resizable: false,
          id: 'aboutwin',
          title: _("About"),
          items: {
              xtype: 'uxiframe',
              src: '/about',
              height: '100%'
          }
        });
        about.show();
	},
    
    browseURL: function(url) {
        nevow_clientToServerEvent('browseURL', this, '', url);
    },
    
    processBrowseEvent: function(menu, item, e, eOpts) {
        this.browseURL(e.url)
    },
    
    previewFeaturePhone: function() {
        nevow_clientToServerEvent('previewFeaturePhone');
    },
    
    fileOpenTutorial: function() {
        this.askDirty("eXe.app.getController('Toolbar').fileOpenTutorial2()");
    },
    
    fileOpenTutorial2: function() {
        nevow_clientToServerEvent('loadTutorial', this, '');
    },
    
    toolsRefresh: function() {
        eXe.app.reload();
    },
    //login_umcloud_toolbar
    login_umcloud_toolbar: function() {	//added for IDevice
    	//alert("testWizard01");
        var loginumcloudt = new Ext.Window ({
	          height: 460, 
	          width: 550, 
	          modal: true,
	          id: 'loginumcloudtwin',
	          title: _("Log in to Ustad Mobile Cloud Portal"),
	          layout: 'fit',
	          items: [{
                xtype: 'loginumcloudt'
              }]
	        }),
            formpanel = loginumcloudt.down('form');
        //formpanel.load({url: 'loginumcloudt', method: 'GET'});	//Disable calling a python file because there is no file currently associated with it. This just checks the user can logs in, thats all. Doesn't even save the credentials yet. 
        loginumcloudt.show();        
	},
    //umCloudP
    umCloudP: function() {	//added for IDevice
    	//alert("testWizard01");
        var loginumcloudp = new Ext.Window ({
	          height: 460, 
	          width: 550, 
	          modal: true,
	          id: 'loginumcloudpwin',
	          title: _("Ustad Mobile Cloud Portal"),
	          layout: 'fit',
	          items: [{
                xtype: 'loginumcloudp'
              }]
	        }),
            formpanel = loginumcloudp.down('form');
        formpanel.load({url: 'loginumcloudp', method: 'GET'});
        loginumcloudp.show();        
	},
	//umCloudLogin
	umCloudLogin: function() {	//added for Login functionality
        //Code goes here..
		//console.log("In umCloudLogin..");
		var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
		//console.log(authoring);
		//console.log(Ext.ComponentQuery.query('#authoring')[0]['src']);
		nevow_clientToServerEvent('getPackageFileName', this, '', 'eXe.app.getController("Toolbar").getFileNameAndLogin', '');
		//getPackageFileName is called and this is triggered:
		//alert(unicode(this.package.filename));
		//def handlePackageFileName(self, client, onDone, onDoneParam):
	},
	//umCloudLoginUpload
	umCloudLoginUpload: function() {	//added for Login functionality
        //Code goes here..
		//console.log("In umCloudLogin..");
		var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
		//console.log(authoring);
		//console.log(Ext.ComponentQuery.query('#authoring')[0]['src']);
		nevow_clientToServerEvent('getPackageFileName', this, '', 'eXe.app.getController("Toolbar").getFileName', '');
		//getPackageFileName is called and this is triggered:
		//alert(unicode(this.package.filename));
		//def handlePackageFileName(self, client, onDone, onDoneParam):
	},
    //exportUstadMobileP
    exportUstadMobileP: function() {	//added for IDevice
    	//alert("testWizard01");
        var exportustadmobilep = new Ext.Window ({
	          height: 450, 
	          width: 550, 
	          modal: true,
	          id: 'exportustadmobilepwin',
	          title: _("Export to Ustad Mobile"),
	          layout: 'fit',
	          items: [{
                xtype: 'exportustadmobilep'
              }]
	        }),
            formpanel = exportustadmobilep.down('form');
        formpanel.load({url: 'exportustadmobilep', method: 'GET'});
        exportustadmobilep.show();        
	},
    
    //toolsIDeviceP
    toolsIDeviceP: function() {	//added for IDevice
    	//alert("testWizard01");
        var idevicep = new Ext.Window ({
	          height: "95%", 
	          width: 550, 
	          modal: true,
	          id: 'idevicepwin',
	          title: _("Insert"),
	          layout: 'fit',
	          items: [{
                xtype: 'idevicep'
              }]
	        });
            //formpanel = idevicep.down('form');
        //formpanel.load({url: 'idevicep', method: 'GET'});
        idevicep.show();        
	},
    
    /**
     *
     */
    readabilityBoundariesClick: function() {
        var readabilityWindow = new Ext.Window( {
            height: 500,
            width: 550,
            modal: true,
            id: 'readabilityBoundariesWin',
            title: _("Readability Boundaries"),
            layout: 'fit',
            items: [ {
                xtype: 'readabilityboundarypanel'
            }]
        });
        
        readabilityWindow.show();
           
    },
    
    /**
     * Readability boundaries panel - load information
     */
    readabilityBoundariesLoadInfo: function() {
    	var boundaryInfoPanel = Ext.getCmp(
    			"readability_boundaries_indicator_panel");
    	boundaryInfoPanel.removeAll();
    	
    	var dMargin = 5;
    	
    	var statsUrl = document.location.href + "/readability_stats";
    	
    	//add headings
    	boundaryInfoPanel.add({
    		xtype: "label",
    		text: " "
    	});
    	boundaryInfoPanel.add({
    		xtype: "label",
			text: _("Average"),
			style : {
				"font-weight": "bold",
				"text-align" : "center",
				"display" : "inline-block",
				"width" : "100%"
			},
			margin: dMargin,
			colspan: 2
    	});
    	boundaryInfoPanel.add({
    		xtype: "label",
    		text: _("Maximum"),
    		style : {
				"font-weight": "bold",
				"text-align" : "center",
				"display" : "inline-block",
				"width" : "100%"
			},
    		margin: dMargin,
    		colspan: 2
    	});
    	
    	boundaryInfoPanel.add({
    		xtype: "label",
    		text: _("Indicator"),
    		style : {
				"font-weight": "bold",
				"text-align" : "left",
				"display" : "inline-block",
				"width" : "100%"
			},
    		margin: dMargin
    	});
    	
    	for(var i = 0; i < 2; i++) {
        	boundaryInfoPanel.add({
        		xtype: "label",
        		text: _("Target"),
        		margin: dMargin
        	});
        	
        	boundaryInfoPanel.add({
        		xtype: "label",
        		text: _("Actual"),
        		margin: dMargin
        	});
    	}
    	
    	Ext.Ajax.request({
    		url: statsUrl,
    		scope: this,
    		success: function(response) {
    			var respObj = Ext.JSON.decode(response.responseText);
    			boundaryInfoPanel.readabilityBoundaryStats = respObj;
    			//loop over the response
    			for (var indicator in respObj) {
    				if(respObj.hasOwnProperty(indicator)) {
    					if(!indicator.substring(0, 6) == "range_") {
    						continue;
    					}
    					
    					var indicatorValObj = respObj[indicator];
    					var indicatorName = indicator;
    					if(indicatorValObj['label']) {
    						indicatorName = _(indicatorValObj['label']);
    					}
    					
    					var indicatorId = indicator;
    					
    					boundaryInfoPanel.add({
    						xtype: "label",
    						text: indicatorName,
    						margin: dMargin
    					});
    					
    					var addBlankCellsFn = function(container, count) {
    						for(var i = 0; i < count; i++) {
    							container.add({
        							xtype: "label",
        							text: " ",
        						});
    						}
    					};
    					
    					if(indicatorValObj['average']) {
    						//the target for this indicator
        					boundaryInfoPanel.add({
        						xtype: "textfield",
        						text: " ",
        						id: "readability_boundary_target_" 
        							+ indicatorId + "_average",
    							width: 50,
    							margin: dMargin,
    							enableKeyEvents: true,
    							listeners: {
    								keyup: function(f,e) {
    									console.log("update average");
        								eXeReadabilityHelper.updateTargetHilightByTextfield(f);
        							}
    							}
        					})
        					//try formatting
        					var valueFormatted =
        						indicatorValObj['average'];
        					
        					try {
        						valueFormatted = indicatorValObj['average'].toFixed(2);
        					}catch(err) {
        						//do nothing - not formattable
        					}
        					
        					boundaryInfoPanel.add({
        						xtype: "label",
        						text: valueFormatted,
        						id: "readability_boundary_value_"
        							+ indicatorId + "_average",
        						margin: dMargin
        					});
    					}else {
    						addBlankCellsFn(boundaryInfoPanel, 2);
    					}
    					
    					
    					if(indicatorValObj['max']) {
    						//the target max value for this indicator
    						//try formatting
        					var valueFormatted =
        						indicatorValObj['max'];
        					
        					try {
        						valueFormatted = indicatorValObj['max'].toFixed(2);
        					}catch(err) {
        						//do nothing - not formattable
        					}
        					
        					boundaryInfoPanel.add({
        						xtype: "textfield",
        						text : " ",
        						id: "readability_boundary_target_" 
        							+ indicatorId + "_max",
    							width: 50,
    							margin: dMargin,
    							enableKeyEvents: true,
    							listeners: {
    								keyup: function(f,e) {
        								eXeReadabilityHelper.updateTargetHilightByTextfield(f);
        							}
    							}
        					});
        					
        					boundaryInfoPanel.add({
        						xtype: "label",
        						id: "readability_boundary_value_"
        							+ indicatorId + "_max",
        						text: valueFormatted,
        						margin: dMargin
        					});
    					}else {
    						addBlankCellsFn(boundaryInfoPanel, 2);
    					}
    				}
    			}
    			
    			//set the word list
    			var wordListArr = respObj["info_distinct_words_in_text"];
    			wordListArr.sort();
    			var wordList = eXeReadabilityHelper.wordArrToNewLinesStr(
    					wordListArr);
    			Ext.getCmp("wordlist_filtered_textarea").setValue(wordList);
    		}
    	});
    },
    
    toolsWizard: function() {	//added for Wizard test
    	//alert("testWizard01");
        var wizard = new Ext.Window ({
	          height: 480, 
	          width: 550, 
	          modal: true,
	          id: 'wizardwin',
	          title: _("Start Page"),
	          layout: 'fit',
	          items: [{
                xtype: 'wizard'
              }]
	        }),
            formpanel = wizard.down('form');
        formpanel.load({url: 'wizard', method: 'GET'});
        wizard.show();        
	},

    toolsPreferences: function() {
        var preferences = new Ext.Window ({
	          height: 320, 
	          width: 550, 
	          modal: true,
	          id: 'preferenceswin',
	          title: _("Preferences"),
	          layout: 'fit',
	          items: [{
                xtype: 'preferences'
              }]
	        }),
            formpanel = preferences.down('form');
        formpanel.load({url: 'preferences', method: 'GET'});
        preferences.show();        
	},
	
    // Launch the iDevice Editor Window
	toolsIdeviceEditor: function() {
        var editor = new Ext.Window ({
          height: eXe.app.getMaxHeight(700), 
          width: 800, 
          modal: true,
          id: 'ideviceeditorwin',
          title: _("iDevice Editor"), 
          items: {
              xtype: 'uxiframe',
              src: '/editor',
              height: '100%'
          },
          listeners: {
            'beforeclose': function(win) {
                Ext.Msg.show( {
                    title: _('Confirm'),
                    msg: _('If you have made changes and have not saved them, they will be lost. Do you really want to quit?'),
                    //scope: this,
                    //modal: true,
                    buttons: Ext.Msg.YESNO,
                    fn: function(button) {
                        if (button === 'yes') {
                            editor.doClose();
                        }
                    }
                });
                return false;                
            }
          }
        });
        editor.show();        
	},
	
	// JR: Launch the Style Manager Window
	toolsStyleManager: function() {
        var stylemanager = new Ext.Window ({
          maxHeight: eXe.app.getMaxHeight(800), 
          width: 500, 
          modal: true,
          autoShow: true,
          autoScroll: true,
          id: 'stylemanagerwin',
          title: _("Style Manager"),
          layout: 'fit',
          items: {
              xtype: 'stylemanager'
          }
        });
        stylemanager.show();        
	},
    fileQuit: function() {
	    this.saveWorkInProgress();
	    this.askDirty("eXe.app.getController('Toolbar').doQuit()", "quit");
	},

    doQuit: function() {
        eXe.app.quitWarningEnabled = false;
        nevow_clientToServerEvent('quit', this, '');
        Ext.get('loading-mask').fadeIn();
        Ext.get('loading').show();
    },

    insertPackage: function() {
        var f = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select package to insert"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    Ext.Msg.wait(new Ext.Template(_('Inserting package: {filename}')).apply({filename: fp.file.path}));
                    nevow_clientToServerEvent('insertPackage', this, '', fp.file.path);
                }
            }
        });
        f.appendFilters([
            { "typename": _("eXe Package Files (.elp)"), "extension": "*.elp", "regex": /.*\.elp$/ }, //Added //Edited
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]
        );
        f.show();        
	},

	extractPackage: function() {
        var f = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeSave,
            title: _("Save extracted package as"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                    Ext.Msg.wait(new Ext.Template(_('Extracting package: {filename}')).apply({filename: fp.file.path}));
                    nevow_clientToServerEvent('extractPackage', this, '', fp.file.path, fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                }
            }
        });
        f.appendFilters([
            { "typename": _("eXe Package Files (.elp)"), "extension": "*.elp", "regex": /.*\.elp$/ }, //Added //Edited
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]
        );
        f.show();        
	},

    importHtml: function(){
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeGetFolder,
            title: _("Select the parent folder for import."),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                    nevow_clientToServerEvent('importPackage', this, '', 'html', fp.file.path);
                }
            }
        });
        fp.show();
	},

    importHtml2: function(path) {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select the entry point for import."),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    nevow_clientToServerEvent('importPackage', this, '', 'html', path, fp.file.path);
                }
            }
        });
        fp.appendFilters([
            { "typename": _("HTML Files"), "extension": "*.html", "regex": /.*\.htm[l]*$/i },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
    },

    importLom: function(menu, item, e) {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select LOM Metadata file to import."),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    nevow_clientToServerEvent('importPackage', this, '', e.metadataType, fp.file.path);
                }
            }
        });
        fp.appendFilters([
            { "typename": _("XML Files"), "extension": "*.xml", "regex": /.*\.xml$/i },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
    },
    
    updateImportProgressWindow: function(msg) {
        if (!this.importProgressDisabled)
            this.importProgress.updateText(msg);
    },
    
    initImportProgressWindow: function(title) {
        this.importProgressDisabled = false;
        this.importProgress = Ext.Msg.show( {
            title: title,
            msg: _("Waiting progress..."),
            scope: this,
            modal: true,
            buttons: Ext.Msg.CANCEL,
            fn: function(button) {
                if (button == "cancel")    {
                    this.importProgressDisabled = true;
                    Ext.Msg.show( {
                        title: _("Cancel Import?"),
                        msg: _("There is an ongoing import. Do you want to cancel?"),
                        scope: this,
                        modal: true,
                        buttons: Ext.Msg.YESNO,
                        fn: function(button2) {
	                        if (button2 == "yes")
	                            nevow_clientToServerEvent('cancelImportPackage', this, '');
	                        else
	                            this.initImportProgressWindow(title);
                        }
                    });
                }
            }
        });        
    },
    closeImportProgressWindow: function() {
        this.importProgress.destroy();
    },

	importXliff: function() {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select Xliff file to import"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    var preferences = new Ext.Window ({
                      height: 220, 
                      width: 650, 
                      modal: true,
                      id: 'xliffimportwin',
                      title: _("XLIFF Import Preferences"),
                      items: {
                          xtype: 'uxiframe',
                          src: '/xliffimportpreferences?path=' + fp.file.path,
                          height: '100%'
                      }
                    });
                    preferences.show();
                }
            }
        });
        fp.appendFilters([
            { "typename": _("XLIFF Files"), "extension": "*.xlf", "regex": /.*\.xlf$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
	},

    exportXliff: function() {
        this.saveWorkInProgress();
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeSave,
            title: _("Export to Xliff as"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                    var preferences = new Ext.Window ({
					  height: 300, 
					  width: 650, 
                      modal: true,
                      id: 'xliffexportwin',
					  title: _("XLIFF Export Preferences"),
					  items: {
                          xtype: 'uxiframe',
                          src: '/xliffexportpreferences?path=' + fp.file.path,
                          height: '100%'
                      }
					});
                    preferences.show();
                }
            }
        });
        fp.appendFilters([
            { "typename": _("XLIFF Files"), "extension": "*.xlf", "regex": /.*\.xlf$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();            
    },

    processExportEvent: function(menu, item, e, eOpts) {
        this.saveWorkInProgress();
        this.exportPackage(e.exportType, "");
    },
    
	exportPackage: function(exportType, exportDir) {
	    if (exportType == 'webSite' || exportType == 'singlePage' || exportType == 'printSinglePage' || exportType == 'ipod' || exportType == 'mxml' ) {
	        if (exportDir == '') {
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
		            type: eXe.view.filepicker.FilePicker.modeGetFolder,
		            title: _("Select the parent folder for export."),
		            modal: true,
		            scope: this,
		            callback: function(fp) {
		                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
		                    nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
		            }
		        });
	            fp.show();
	        }
	        else {
	            // use the supplied exportDir, rather than asking.
	            nevow_clientToServerEvent('exportPackage', this, '', exportType, exportDir)
	        }
	    } else if(exportType == "textFile"){
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                    type: eXe.view.filepicker.FilePicker.modeSave,
                    title: _("Export text package as"),
                    modal: true,
                    scope: this,
                    callback: function(fp) {
                        if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                            nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
                    }
                });
		        fp.appendFilters([
		            { "typename": _("Text File"), "extension": "*.txt", "regex": /.*\.txt$/ },
		            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
		            ]
		        );
                fp.show();
	    } else if(exportType == "csvReport"){
            var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                type: eXe.view.filepicker.FilePicker.modeSave,
                title: _("Save package resources report as"),
                modal: true,
                scope: this,
                callback: function(fp) {
                    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                        nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
                }
            });
	        fp.appendFilters([
	            { "typename": _("CSV File"), "extension": "*.csv", "regex": /.*\.csv$/ },
	            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
	            ]
	        );
            fp.show();
        } else if(exportType == "epub3"){
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                    type: eXe.view.filepicker.FilePicker.modeSave,
                    title: _("Export EPUB3 package as"),
                    modal: true,
                    scope: this,
                    callback: function(fp) {
                        if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                            nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
                    }
                });
                fp.appendFilters([
                    { "typename": _("EPUB3 File"), "extension": "*.epub", "regex": /.*\.epub$/ },
                    { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
                    ]
                );
                fp.show();
	    } else {
            var title;
	        if (exportType == "scorm1.2" || exportType == 'scorm2004'|| exportType == 'agrega')
	            title = _("Export SCORM package as");
	        else if (exportType == "ims")
	            title = _("Export IMS package as");
	        else if (exportType == "zipFile")
	            title = _("Export Website package as");
	        else if (exportType == "commoncartridge")
	            title = _("Export Common Cartridge as");
	        else
	            title = _("INVALID VALUE PASSED TO exportPackage");

            var fp = Ext.create("eXe.view.filepicker.FilePicker", {
	            type: eXe.view.filepicker.FilePicker.modeSave,
	            title: title,
	            modal: true,
	            scope: this,
	            callback: function(fp) {
	                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
	                    nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
	            }
	        });
	        fp.appendFilters([
	            { "typename": _("SCORM/IMS/ZipFile"), "extension": "*.txt", "regex": /.*\.zip$/ },
	            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
	            ]
	        );
	        fp.show();            
	    }
	},// exportPackage()
    
    filePrint: function() {
	   // filePrint step#1: create a temporary print directory, 
	   // and return that to filePrint2, which will then call exportPackage():
	   var tmpdir_suffix = ""
	   var tmpdir_prefix = "eXeTempPrintDir_"
	   nevow_clientToServerEvent('makeTempPrintDir', this, '', tmpdir_suffix, 
	                              tmpdir_prefix, "eXe.app.getController('Toolbar').filePrint2")
	   // note: as discussed below, at the end of filePrint3_openPrintWin(), 
	   // the above makeTempPrintDir also removes any previous print jobs
	},
	
	filePrint2: function(tempPrintDir, printDir_warnings) {
	   if (printDir_warnings.length > 0) {
	      Ext.Msg.alert("", printDir_warnings)
	   }
	   this.exportPackage('printSinglePage', tempPrintDir);
	},
	
    recentRender: function() {
    	Ext.Ajax.request({
    		url: location.pathname + '/recentMenu',
    		scope: this,
    		success: function(response) {
				var rm = Ext.JSON.decode(response.responseText),
					menu = this.getRecentMenu(), text, item, previtem;
    			for (i in rm) {
    				
    				//alert("rm is: " + rm);
    				
    				text = rm[i].num + ". " + rm[i].path
    				previtem = menu.items.getAt(rm[i].num - 1);
    				
    				if (previtem && previtem.text[1] == ".") {
    					previtem.text = text
    				}
    				else {
	    				item = Ext.create('Ext.menu.Item', { text: text, icon: '/images/package-green.png', });
	    				//alert("text is: " + text);
	    				menu.insert(rm[i].num - 1, item);
    				}
    				
    			}
    		}
    	})
    	return true;
    },
  
    //wizardStylesRender
    wizardStylesRender: function() {	//Added
    	Ext.Ajax.request({
    		url: location.pathname + '/styleMenu',
    		scope: this,
    		success: function(response) {
    			
				var styles = Ext.JSON.decode(response.responseText),
					menu = this.getWizardStylesMenu(), i, item;
					//JR: Primero los borro
					menu.removeAll();
					
				/*
				 * { //Sample button
        	        	xtype: 'button',
        	        	text: _('Button text'),
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
        	            itemId: 'execution_property_id'
    	        	}
				 * 
				 */
    			for (i = styles.length-1; i >= 0; i--) {
                    item = Ext.create('Ext.menu.CheckItem', { text: styles[i].label, itemId: styles[i].style, checked: styles[i].selected });
                    
    				/*
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
                    */
    				menu.insert(0, item);
              
    			}
    		}
    	})
    	return true;
    },
    
    stylesRender: function() {
    	Ext.Ajax.request({
    		url: location.pathname + '/styleMenu',
    		scope: this,
    		success: function(response) {
				var styles = Ext.JSON.decode(response.responseText),
					menu = this.getStylesMenu(), i, item;
					//JR: Primero los borro
					menu.removeAll();
    			for (i = styles.length-1; i >= 0; i--) {
                    item = Ext.create('Ext.menu.CheckItem', { text: styles[i].label, itemId: styles[i].style, checked: styles[i].selected });
    				menu.insert(0, item);
    			}
    		}
    	})
    	return true;
    },

    recentClick: function(item) {
    	if (item.itemId == "file_clear_recent") {
    		nevow_clientToServerEvent('clearRecent', this, '');
    		var menu = this.getRecentMenu(),
    			items = menu.items.items.slice(),
    			i = 0,
    			len = items.length;
    		for (; i < len; i++) 
    			if (items[i].text[1] == ".")
    				menu.remove(items[i], true);
    	}
    	else
    		this.askDirty("eXe.app.getController('Toolbar').fileOpenRecent2('" + item.text[0] + "');")
    },
    
    stylesClick: function(item) { //Function triggered when style is selected to change the style.
        var ed = this.getTinyMCEFullScreen();
        if(ed!="") {
            ed.execCommand('mceFullScreen');
            setTimeout(function(){
                eXe.controller.Toolbar.prototype.executeStylesClick(item);
            },500);
        } else this.executeStylesClick(item);
    },
    
    //wizardStylesClick
    wizardStylesClick: function(item) { //Function triggered when style is selected to change the style in the Wizard
    	//alert("You clicked wizardStylesClick");
    	
        var ed = this.getTinyMCEFullScreen();
        if(ed!="") {
            ed.execCommand('mceFullScreen');
            setTimeout(function(){
                eXe.controller.Toolbar.prototype.executeStylesClick(item);
            },500);
        } else this.executeWizardStylesClick(item);
    },
	
    executeStylesClick: function(item) { //Function triggered when style is selected to change the style.
		for (var i = item.parentMenu.items.length-1; i >= 0; i--) {
			if (item.parentMenu.items.getAt(i) != item)
				item.parentMenu.items.getAt(i).setChecked(false);
		}
		item.setChecked(true);
		item.parentMenu.hide();
		//provisional
		//item.parentMenu.parentMenu.hide();
		item.parentMenu.hide();
		//
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring)
            authoring.submitLink("ChangeStyle", item.itemId, 1); 	//Doesn't go here until you change style.
    },
    
    //executeWizardStylesClick
    executeWizardStylesClick: function(item) { //Function triggered when style is selected to change the style in the wizard
		for (var i = item.parentMenu.items.length-1; i >= 0; i--) {
			if (item.parentMenu.items.getAt(i) != item)
				item.parentMenu.items.getAt(i).setChecked(false);
		}
		item.setChecked(true);
		item.parentMenu.hide();
		//provisional
		//item.parentMenu.parentMenu.hide();
		item.parentMenu.hide();
		//
		
	
		//wizz.closeit();
		//wizz.destroy();
		
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring)
            authoring.submitLink("ChangeStyle", item.itemId, 1); 	//Doesn't go here until you change style.
        //var wizardPanel = Ext.getCmp('wizardpanel'); //showrecentprojectspanel
        //wizardPanel.hide();
        //this.askDirty("eXe.app.gotoUrl('/')");
        //this.wizard.destroy();
        //wizard.destroy();
        Ext.getCmp('wizardwin').close()
        
    },
    
	fileOpenRecent2: function(number) {
        Ext.Msg.wait(_('Loading package...'));
	    nevow_clientToServerEvent('loadRecent', this, '', number)
	},
	
    fileNew: function() {
    	// Ask the server if the current package is dirty
    	this.askDirty("eXe.app.gotoUrl('/')");
	},
	
    fileOpen: function() {
    	this.askDirty("eXe.app.getController('Toolbar').fileOpen2()");
    },
    
    fileOpen2: function() {
		var f = Ext.create("eXe.view.filepicker.FilePicker", {
			type: eXe.view.filepicker.FilePicker.modeOpen,
			title: _("Open File"),
			modal: true,
			scope: this,
			callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    Ext.Msg.wait(new Ext.Template(_('Loading package: {filename}')).apply({filename: fp.file.path}));
		    		nevow_clientToServerEvent('loadPackage', this, '', fp.file.path);
                }
		    }
		});
		f.appendFilters([
			{ "typename": _("eXe Package Files (.elp)"), "extension": "*.elp", "regex": /.*\.elp$/ }, //Added
			{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
			]
		);
		f.show();
    },
    
    checkDirty: function(ifClean, ifDirty) {
    	nevow_clientToServerEvent('isPackageDirty', this, '', ifClean, ifDirty)
	},
	
	askSave: function(onProceed) {
		Ext.Msg.show({
			title: _("Save Package first?"),
			msg: _("The current package has been modified and not yet saved. Would you like to save it?"),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNOCANCEL,
			fn: function(button, text, opt) {
				if (button == "yes")
					this.fileSave(onProceed);
				else if (button == "no")
                    eval(onProceed);
			}
		});
	},
    
    getTinyMCEFullScreen: function(){
        var ifs = document.getElementsByTagName("IFRAME");
        if (ifs.length==1) {
            var d = ifs[0].contentWindow;
            var ed = "";
            if (typeof(d.tinyMCE)!='undefined' && d.tinyMCE.activeEditor) ed = d.tinyMCE.activeEditor;
            if (ed!="" && ed.id=="mce_fullscreen") {
                return ed;
            }
        }
        return "";
    },
    
    executeFileSave: function(onProceed) {
	    if (!onProceed || (onProceed && typeof(onProceed) != "string"))
	        var onProceed = '';
	    nevow_clientToServerEvent('getPackageFileName', this, '', 'eXe.app.getController("Toolbar").fileSave2', onProceed);
    },
	
	fileSave: function(onProceed) {
        var ed = this.getTinyMCEFullScreen();
        if(ed!="") {
            ed.execCommand('mceFullScreen');
            setTimeout(function(){
                eXe.controller.Toolbar.prototype.executeFileSave(onProceed);
            },500);
        } else this.executeFileSave(onProceed);
	},
	getFileNameAndLogin: function(filename, onDone) {			//Added
		var userName = Ext.getCmp('umcloudusernameinput').getValue();
  		var pswd = Ext.getCmp('umcloudpasswordinput').getValue();
  		var url = Ext.getCmp('umcloudserverurlinput').getValue();
  		console.log("Username and Password provided against url: " + userName+"/"+pswd+" ["+url+"]" + "and filepath is: " + filename);
  		
  		
		//filename is the complete path of the file to be saved including the name. //onDone isn't anything much.
  		//nevow_clientToServerEvent('EVENT', this, 'client', 'onDONE', 'onDoneParam', filename);
  		Ext.Msg.wait(_('Uploading package:') + filename + _(" to server.."));
  		var umupload_retmsg = nevow_clientToServerEvent('checkUMCloudLogin', this, '', '', '', filename, userName, pswd, url);
  		//Ext.Msg.alert(umupload_retmsg);
	   
	},
	
	
	getFileName: function(filename, onDone) {			//Added
		var userName = Ext.getCmp('umcloudusernameinput').getValue();
  		var pswd = Ext.getCmp('umcloudpasswordinput').getValue();
  		var url = Ext.getCmp('umcloudserverurlinput').getValue();
  		console.log("Username provided against url: " + userName + ":" + " [" +url+ "]" + "and filepath is: " + filename);
  		
  		
  		//We need to save the ELP file first! 
  		//code here..
  		
  		 if (filename) {
 	        this.saveWorkInProgress();	//We need to save it! This just starts the save process. This alone does NOT save the elp file.
 	        // If the package has been previously saved/loaded
 	        // Just save it over the old file
            Ext.Msg.wait(new Ext.Template(_('Saving package to: {filename}')).apply({filename: filename}));
 	        if (onDone) {	//this actually saves the elp file.. //insert file upload logic here.
 	            nevow_clientToServerEvent('savePackage', this, '', '', onDone);
 	        } else {
 	            nevow_clientToServerEvent('savePackage', this, '');
 	        }
 	    } else {
 	        // If the package is new (never saved/loaded) show a
 	        // fileSaveAs dialog
 	        this.fileSaveAs(onDone)
 	    }
  		
  		
  		
		//filename is the complete path of the file to be saved including the name. //onDone isn't anything much.
  		//nevow_clientToServerEvent('EVENT', this, 'client', 'onDONE', 'onDoneParam', filename);
  		Ext.Msg.wait(_('Uploading package:') + filename + _(" to server.."));
  		var umupload_retmsg = nevow_clientToServerEvent('startUMUploadFileName', this, '', '', '', filename, userName, pswd, url);
  		//Ext.Msg.alert(umupload_retmsg);
	    
	},
	
	fileSave2: function(filename, onDone) {
		//alert("filename/onDone: " + filename+"/"+onDone);
		//filename is the complete path of the file to be saved including the name. //onDone isn't anything much.
	    if (filename) {
	        this.saveWorkInProgress();
	        // If the package has been previously saved/loaded
	        // Just save it over the old file
            Ext.Msg.wait(new Ext.Template(_('Saving package to: {filename}')).apply({filename: filename}));
	        if (onDone) {
	            nevow_clientToServerEvent('savePackage', this, '', '', onDone);
	        } else {
	            nevow_clientToServerEvent('savePackage', this, '');
	        }
	    } else {
	        // If the package is new (never saved/loaded) show a
	        // fileSaveAs dialog
	        this.fileSaveAs(onDone)
	    }
	},
	// Called by the user when they want to save their package
	executeFileSaveAs: function(onDone) {
		var f = Ext.create("eXe.view.filepicker.FilePicker", {
			type: eXe.view.filepicker.FilePicker.modeSave,
			title: _("Save file"),
			modal: true,
			scope: this,
			callback: function(fp) {
			    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
			        this.saveWorkInProgress();
                    Ext.Msg.wait(_('Saving package...'));
			        if (onDone && typeof(onDone) == "string") {
			            nevow_clientToServerEvent('savePackage', this, '', f.file.path, onDone)
			        } else {
			            nevow_clientToServerEvent('savePackage', this, '', f.file.path)
			        }
			    } else {
                    Ext.defer(function() {
				        eval(onDone);
                    }, 500);
			    }
			}
		});
		f.appendFilters([
			{ "typename": _("eXe Package Files"), "extension": "*.elp", "regex": /.*\.elp$/ },
			{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
			]
		);
		f.show();
	},
    
    fileSaveAs: function(onDone) {
        var ed = this.getTinyMCEFullScreen();
        if(ed!="") {
            ed.execCommand('mceFullScreen');
            setTimeout(function(){
                eXe.controller.Toolbar.prototype.executeFileSaveAs(onDone);
            },500);
        } else this.executeFileSaveAs(onDone);
    },
	
	// Submit any open iDevices
	saveWorkInProgress: function() {
	    // Do a submit so any editing is saved to the server
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring && authoring.getContentForm) {
		    var theForm = authoring.getContentForm();
		    if (theForm)
		        theForm.submit();
        }
	},
	
    askDirty: function(nextStep) {
    	this.checkDirty(nextStep, 'eXe.app.getController("Toolbar").askSave("'+nextStep+'")');
    },
    
    setPackageTitle: function(button) {
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
                        nevow_clientToServerEvent('setPackageTitle', this,'', text);
                        Ext.getCmp("title_button").setText(text);
                    }
                }
            }
        });
    },
    
    updatePackageTitle: function() {
        Ext.Ajax.request({
            url: location.pathname + '/properties?pp_title=',
            scope: this,
            success: function(response) {
                var respData = Ext.JSON.decode(response.responseText);
                var packageTitle = respData['data']['pp_title'];
                if(packageTitle == "") {
                    packageTitle = _("Untitled Project");
                }
                
                Ext.getCmp("title_button").setText(packageTitle);
            }
        });
    },
    
    updateUSBDevicesList: function() {
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
					usbPath = rm[i]['removabledrivepath'] + '/ustadmobileContent/';
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
    						
    						//nevow_clientToServerEvent('exportPackage', this, '', "mxml", cow.usbPath);
    						nevow_clientToServerEvent('exportPackageToUSB', this, '', "mxml", cow.usbPath);
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
    },
    
    /*
     Update tabs in the idevice selector panel - go through, check 
     category of each idevice, make a tab for each, then populate
     with buttons
    */
    updateIdeviceTabs: function() {
        
        var ideviceTabPanel = Ext.getCmp("idevicepanel");
        Ext.Ajax.request({
            url: location.pathname + '/idevicePane',
            scope: this,
            success: function(response) {
                //dictionary of categoryname - array
                var deviceItemsByCategory = {};
                var responseXmlDoc = response.responseXML.documentElement;
                var ideviceObjs = responseXmlDoc.getElementsByTagName("idevice");
                for(var i = 0; i < ideviceObjs.length; i++) {
                    var idevice = ideviceObjs[i];
                    var visible = idevice.getElementsByTagName(
                        "visible")[0].childNodes[0].nodeValue;
                    if(visible == "false") {
                        continue;
                    }
                    
                    var label = idevice.getElementsByTagName(
                        "label")[0].childNodes[0].nodeValue;
                    var category = idevice.getElementsByTagName(
                        "category")[0].childNodes[0].nodeValue;
                    
                    var ideviceId  = idevice.getElementsByTagName(
                        "id")[0].childNodes[0].nodeValue;
                    var titleIconHTML = idevice.getElementsByTagName(
                        "titlewithicon")[0].childNodes[0].nodeValue;
                    var short_desc = idevice.getElementsByTagName(
                        "shortdesc")[0].childNodes[0].nodeValue;
                    if(!deviceItemsByCategory[category]) {
                        deviceItemsByCategory[category] = [];
                    }
                    
                    deviceItemsByCategory[category].push({
                        xtype : 'button',
                        text : titleIconHTML,
                        align : 'left',
                        id : ideviceId,
                        width: "100%",
                        margin: 5,
                        tooltip: short_desc,
                        handler: function(button) {
                            var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
                            if (authoring && authoring.submitLink) {
                                var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel();
                                selected = outlineTreePanel.getSelectionModel().getSelection();
                                authoring.submitLink("AddIdevice", button.id, 1, selected !== 0? selected[0].data.id : '0');
                            }
                            Ext.getCmp('idevicepwin').close();
                        }
                    });    
                    console.log("Found idevice "+ label + " in " + category); 
                }
                
                for(categoryName in deviceItemsByCategory) {
                    ideviceTabPanel.add({
                        title : categoryName,
                        xtype : "panel",
                        layout : {
                            type : "vbox",
                            align : "sretch"
                        },
                        items: deviceItemsByCategory[categoryName]
                    });
                }
                ideviceTabPanel.setActiveTab(0);
            }
        });
    },
    
    updateRecent: function(){	//For updating the recent projects list
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
    			    if(rm[i].title == "") {
    				    textButton = rm[i].num + ". " + rm[i].path;
				    }else {
				        textButton = "<b>" + rm[i].title + "</b><br/>"
				            + rm[i].path;
			        }
    				//Button that will appear to open recent projects
    				recpanel.add({
            			xtype: 'button',
        	        	text: _(textButton),
        	        	margin: 5,
        	        	padding: 5,
        	        	icon: '/images/package-green.png',
        	        	iconAlign: 'left',
        	        	textAlign: 'left',
        	        	id: rm[i].num + "openrecent",
        	        	textButton: textButton,
        	        	handler: function(cow){
    						console.log("You clicked: " + cow.textButton[0] + "!");
    						//this.askDirty("eXe.app.getController('Toolbar').fileOpenRecent2('" + cow.textButton[0] + "');")
    						//fileOpenRecent2(cow.textButton[0]);
    						 Ext.Msg.wait(_('Loading package...'));
    						nevow_clientToServerEvent('loadRecent', this, '', cow.id[0])
    					},
    					width: 300,
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
});

/*
 Temporary UI testing 
*/
function showIdeviceToolbar() {
    //Ext.getCmp('idevicepwin')

    var idevicep = new Ext.Window ({
        height: "95%", 
        width: 550, 
        modal: true,
        id: 'idevicepwin',
        title: _("Insert"),
        layout: 'fit',
        items: [{
          xtype: 'idevicep'
        }]
      });
      //formpanel = idevicep.down('form');
  //formpanel.load({url: 'idevicep', method: 'GET'});
  idevicep.show();        
}

