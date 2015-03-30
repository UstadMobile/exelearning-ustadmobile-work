/**
 * 
 */


Ext.define('eXe.controller.Readability', {
    extend: 'Ext.app.Controller',
    
    indicatorIDToLabel: {
    	"word_count" : _("Total word count"),
    	"word_length_average" : _("Word length: Average"),
    	"word_length_max" : _("Word length"),
    	"distinct_words" : _("Unique words in Text"),
    	"sentence_length_max" : _("Sentence length"),
    	"sentence_length_average" : _("Sentence length: Average"),
    	"words_per_page_max" : _("Words per Page"),
    	"syllables_per_word_max" : _("Syllables per word"),
    	"syllables_per_word_average" : _("Syllables per word: Average")
    },
    
    currentlyAvailableLevelParams: [],
    
    presetHasChanged: false,
    
    refs: [{
	    	selector: '#readability_linguist_levelpanel',
	    	ref: 'linguistLevelPanel'
    	},
    	{
    		selector : '#readability_linguist_decodablepanel',
    		ref: 'linguistDecodablePanel'
    	},
    	{
    		selector: "#linguist_panel_langcombo",
    		ref: "linguistLangCombo"
    	},
    	{
    		selector: "#linguist_panel_name_textfield",
    		ref: "linguistPanelPresetName"
    	},
    	{
    		selector: "#linguist_panel_uuid_textfield",
    		ref: 'linguistPresetUUID'
    	},
    	{
    		selector: "#readability_linguist_presetmenu",
    		ref: "presetMenu"
    	}
    ],
    
    init: function() {
       this.control({
    	   '#linguist_panel_decodable_button' : {
    		   click: function() {
    			   this.showTypePanelDecodable();
    		   }
    	   },
    	   
    	   '#linguist_panel_leveled_button' : {
    		   click: function() {
    			   this.showTypePanelLeveled();
    		   }
    	   },
    	   
    	   '#linguist_panel_langcombo': {
    		   beforerender: this.setLangComboFromPackage
    	   },
    	   
    	   '#readability_linguist_preset_new' : {
    		   click: this.makeNewPreset
    	   },
    	   '#readability_linguist_preset_delete' : {
    		   click: this.handleClickPresetDelete
    	   },
    	   '#readability_linguist_presetmenu' : {
    		   beforerender: this.updatePresetMenu
    	   },
    	   '#readability_linguist_presetmenu > menuitem' : {
    		   click: this.clickPresetMenu
    	   },
    	   '#readability_linguist_levelpanel > readabilitylinguistlimit' : {
    		   change: this._setPresetChanged
    	   },
    	   '#linguist_panel_name_textfield': {
    		   change: this.handlePresetNameChange
    	   },
    	   'readabilitylinguistpanel' : {
    		   beforedestroy: this.handleBeforeDestroy
    	   }
       });
    },
    
    
    _setPresetChanged: function() {
    	this.presetHasChanged = true;
    	console.log("preset has changed");
    },
    
    /**
     * Set the language combo field from the package's language
     */
    setLangComboFromPackage: function() {
    	Ext.Ajax.request({
            url: location.pathname + '/properties?pp_lang=',
            scope: this,
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                var lang = json.data.pp_lang;
                this.getLinguistLangCombo().setValue(lang);
                
                Ext.Ajax.request({
                	url: "/readabilitypresets?action=list_params_by_lang&lang=" +
                		encodeURIComponent(lang),
            		scope: this,
            		success: function(response) {
            			var availableParams = Ext.JSON.decode(
            					response.responseText);
            			this.currentlyAvailableLevelParams = availableParams;
            			this.setupLevelPanelLimits(availableParams);
            		}
                });
            }
    	});
    },
    
    makeNewPreset: function() {
    	var me = this;
    	var makeNewPresetFn = function() {
    		me.getLinguistPresetUUID().setValue("");
    		me.getLinguistPanelPresetName().setValue("");
    		me.setupLevelPanelLimits(me.currentlyAvailableLevelParams);
    		me.getPresetMenu().add({
            	xtype: "menuitem",
            	text: _("New Untitled Preset"),
            	presetUUID: "__newpreset__"
            });
    		this.presetHasChanged = false;
    	};
    	
    	if(this.presetHasChanged) {
    		this.savePreset({}, makeNewPresetFn)
    	}else {
    		this._removeNewPresetPlaceholder();
    		makeNewPresetFn();
    	}
    },
    
    handlePresetNameChange: function() {
    	this.updatePresetNameInMenu();
    	this._setPresetChanged();
    },
    
    updatePresetNameInMenu: function(newName) {
    	var uuidToFind = this.getLinguistPresetUUID().getValue();
    	uuidToFind = uuidToFind && uuidToFind !== "" ? uuidToFind : "__newpreset__";
    	newName = (typeof newName === "undefined") ? 
			this.getLinguistPanelPresetName().getValue() : newName;
    	var menuItem = this._getPresetMenuItemByUUID(uuidToFind);
    	if(menuItem) {
    		menuItem.setText(newName);
    	}
    },
    
    _getPresetMenuItemByUUID: function(uuid) {
    	var presetMenuItems = this.getPresetMenu().query("menuitem");
    	for(var i = 0; i < presetMenuItems.length; i++) {
			if(presetMenuItems[i].presetUUID && presetMenuItems[i].presetUUID === uuid) {
				return presetMenuItems[i];
			}
		}
    },
    
    /**
     * If a new placeholder was made in the menu - but no changes made...
     */
    _removeNewPresetPlaceholder: function() {
    	var placeholderItem = this._getPresetMenuItemByUUID("__newpreset__");
    	if(placeholderItem) {
    		this.getPresetMenu().remove(placeholderItem);
    	}
    },
    
    handleClickPresetDelete: function(uuid) {
    	Ext.Msg.show( {
            title: _('Confirm'),
            msg: _('Delete preset named: ') + 
            	this.getLinguistPanelPresetName().getValue() + " ?",
            scope: this,
            modal: true,
            buttons: Ext.Msg.YESNO,
            fn: function(button) {
                if (button === 'yes') {
                	var presetUUID = this.getLinguistPresetUUID().getValue();
                	if(presetUUID !== "") {
                		this.deletePresetByID(
                        		this.getLinguistPresetUUID().getValue());
                	}else {
                		this.presetHasChanged = false;
                		this._removeNewPresetPlaceholder();
                		this.makeNewPreset();
                	}
                }
            }
        });
    },
    
    deletePresetByID: function(uuid) {
    	Ext.Ajax.request({
    		url: '/readabilitypresets?action=delete_preset_by_id&presetid=' + uuid,
    		scope: this,
    		success: function(response) {
    			this.presetHasChanged = false;
    			//go through the menu and get rid of it - presetUUID
    			var presetMenuItems = this.getPresetMenu().query("menuitem");
    			var menuItemToRemove = this._getPresetMenuItemByUUID(uuid);
    			if(menuItemToRemove) {
    				this.getPresetMenu().remove(menuItemToRemove);
    			}
    			
    			this.makeNewPreset();
    		}
    	});
    },
    
    /**
     * Show values for leveled reader panel
     * 
     * @param {Array} availableParameters - Parameters available for linguist to choose from
     * @param {String} availableParameters[].id id of the parameter
     * @param {String} availableParameters[].unit unit of measure e.g. words or letters
     * @param {Object} currentValues in the form of:
     *   currentValues.PARAMNAME = [min, max]
     *   

     */
    setupLevelPanelLimits: function(availableParameters, currentValues) {
    	//remove 
    	var levelPanel = this.getLinguistLevelPanel();
    	levelPanel.removeAll();
    	
    	
    	for(var i = 0; i < availableParameters.length; i++) {
    		var labelStr = this.indicatorIDToLabel[availableParameters[i].id] ?
    				this.indicatorIDToLabel[availableParameters[i].id] :
    					availableParameters[i].id;
    		levelPanel.add([{
    			xtype: 'readabilitylinguistlimit',
    			limitParamId: availableParameters[i].id,
    			itemId: "limit_" + availableParameters[i].id,
    			limitLabel: labelStr,
    			unitLabel: availableParameters[i].unit
    		}]);
    	}
    	
    	if(currentValues) {
    		this.getLinguistPresetUUID().setValue(currentValues.uuid);
    		this.getLinguistPanelPresetName().setValue(currentValues.name);
    		
    		for(var paramName in currentValues.levelLimits) {
    			if(!currentValues.levelLimits.hasOwnProperty(paramName)) {
    				continue;
    			}
    			
    			var limitPanelRes = levelPanel.query("#limit_" + paramName);
    			if(limitPanelRes[0]) {
    				limitPanelRes[0].setLimits(
						currentValues.levelLimits[paramName]);
    			}
    		}
    	}
    	
    },
    
    makePresetJSON: function() {
    	var presetObj = {
			//"leveled" or "decodable"
			type : "",
			
			//friendly display name for the user
			name: this.getLinguistPanelPresetName().getValue(),
			
			//unique id by which to save and retrieve
			uuid: this.getLinguistPresetUUID().getValue(),
			
			levelLimits : {},
			
    	};
    	//go through the level panel
    	
    	var levelComps = this.getLinguistLevelPanel().query(
			"readabilitylinguistlimit");
    	for(var i = 0; i < levelComps.length; i++) {
    		if(levelComps[i].isLimitEnabled()) {
    			var limitParamName = levelComps[i].limitParamId;
    			presetObj.levelLimits[limitParamName] = 
    				levelComps[i].getLimits();
    		}
    	}
    	
    	return presetObj;
    },
    
    /**
     * @param options
     * @param {boolean} [options.noformupdate=false] set to true to disable updating UUID (e.g. ondestroy in progress)
     * @param {function} [onDoneFn] function to run once updated successfully
     */
    savePreset: function(options, onDoneFn) {
    	var presetVals = this.makePresetJSON();
    	options = options ? options : {};
    	
    	console.log("Save preset: " + presetVals.name + " ID: " + presetVals.uuid);
    	Ext.Ajax.request({
    		url: "/readabilitypresets",
	    	method: "POST",
	    	scope: this,
	        params: {
	        	"action" : "savepreset",
	        	"presetval" : JSON.stringify(presetVals)
	        },
	        
	        success: function(response) {
	        	var jsonResp = JSON.parse(response.responseText);
	        	if(!options.noformupdate) {
	        		this.getLinguistPresetUUID().setValue(jsonResp.uuid);
		        	
		        	
		        	//update the preset menu
		        	if(presetVals.uuid === "") {
		        		var newPresetMenuItem = 
		        			this._getPresetMenuItemByUUID("__newpreset__");
		        		if(newPresetMenuItem) {
		        			newPresetMenuItem.presetUUID = jsonResp.uuid;
		        		}
		        	}
	        	}
	        	
	        	this._runOptionalCallback(onDoneFn, this, []);
	    	}
    	});
    },
    
    handleBeforeDestroy: function() {
    	if(this.presetHasChanged) {
    		this.savePreset({ noformupdate : true});
    	}
    },
    
    _runOptionalCallback: function(callback, context, args) {
    	if(callback) {
    		callback.apply(context, args);
    	}
    },
    
    /**
     * Update the preset drop down menu with list of those available from the 
     * server
     */
    updatePresetMenu: function() {
    	Ext.Ajax.request({
    		url: '/readabilitypresets?action=list_presets',
    		scope: this,
    		success: function(response) {
				var presetList = Ext.JSON.decode(response.responseText);
				var presetMenu = this.getPresetMenu();
				presetMenu.removeAll();
				
				presetMenu.add([
	                {
	                	xtype: "menuitem",
	                	text: _("New Preset"),
	                	itemId: "readability_linguist_preset_new"
	                },
	                {
	                	xtype: "menuitem",
	                	text: _("Delete preset"),
	                	itemId: "readability_linguist_preset_delete"
	                },
	                {
	                	xtype: "menuseparator"
	                }
                ]);
				
				for(var i = 0; i < presetList.length; i++) {
					presetMenu.add([
		                {
		                	xtype: "menuitem",
		                	text: presetList[i].name,
		                	presetUUID: presetList[i].uuid
		                }
	                ]);
				}
    		}
    	});
    },
    
    clickPresetMenu: function(item) {
    	if(item.itemId === 'readability_linguist_preset_new' ||
    			item.itemId === 'readability_linguist_preset_delete') {
    		return;
    	}
    	
    	var presetUUID = item.presetUUID;
    	var loadURL = '/readabilitypresets?action=get_preset_by_id&presetid='
    		+ presetUUID;
    	var me = this;
    	var loadPresetFn = function() {
    		Ext.Ajax.request({
        		url: loadURL,
        		scope: me,
        		success: function(response) {
        			var presetValues = Ext.JSON.decode(response.responseText);
        			this.setupLevelPanelLimits(this.currentlyAvailableLevelParams,
    					presetValues);
        		}
        	});
    	};
    	if(this.presetHasChanged) {
    		this.savePreset({}, loadPresetFn);
    	}else {
    		this._removeNewPresetPlaceholder();
    		loadPresetFn();
    	}
    },
    
    showTypePanelDecodable: function() {
    	this.getLinguistLevelPanel().setHidden(true);
    	this.getLinguistDecodablePanel().setHidden(false);    	
    },
    
    showTypePanelLeveled: function() {
    	this.getLinguistDecodablePanel().setHidden(true);   
    	this.getLinguistLevelPanel().setHidden(false);
    },
    
    
    

	

});

