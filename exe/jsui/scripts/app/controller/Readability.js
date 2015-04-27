/**
 * 
 */


Ext.define('eXe.controller.Readability', {
    extend: 'Ext.app.Controller',
    
    indicatorIDToLabel: {
    	"word_count" : _("Total word count"),
    	"word_length_average" : _("Word length: Book Average"),
    	"word_length" : _("Word length"),
    	"distinct_words" : _("Unique words in Text"),
    	"sentence_length" : _("Sentence length"),
    	"sentence_length_average" : _("Sentence length: Book Average"),
    	"words_per_page" : _("Words per Page"),
    	"syllables_per_word" : _("Syllables per word"),
    	"syllables_per_word_average" : _("Syllables per word: Book Average"),
    	"sentences_per_page" : _("Sentences Per Page"),
    	"sentences_per_page_average": _("Sentences Per Page: Book Average"),
    	"words_per_page_average" : _("Words Per Page: Book Average")
    },
    
    currentlyAvailableLevelParams: [],
    
    presetHasChanged: false,
    
    currentReadabilityPreset: null,
    
    currentReadabilityStats: null,
    
    /** Sort key for decodable writer panel: word, countPage, countBook */
    writerPanelDecodableSortKey: "word",
    
    /** direction: 1 for asc, -1 for desc */
    writerPanelDecodableSortOrder: 1,
    
    packageReadabilityInfo: {},
    
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
    	},
    	{
    		selector: '#writer_panel_levelmenu',
    		ref: "writerPanelLevelMenu"
    	},
    	{
    		selector: '#writer_panel_level_button',
    		ref: 'writerPanelLevelButton'
    	},
    	{
    		selector: "#writer_panel_limit_subpanel",
			ref: 'writerPanelLimitSubPanel'
    	},
    	{
    		selector: "#writer_panel_decodable_subpanel",
    		ref: 'writerPanelDecodableSubpanel'
    	},
    	{
    		selector: "#writer_panel_decodable_words",
    		ref: "writerPanelDecodableWords"
    	},
    	{
    		selector: "#writer_panel_undecodable_words",
    		ref : 'writerPanelUndecodableWords'
    	},
    	{
    		selector: '#readability_linguist_decodable_to_teach',
    		ref: 'linguistPanelDecodableToTeach'
    	},
    	{
    		selector: '#readability_linguist_decodable_lengthlim',
    		ref: 'linguistPanelDecodableLengthLim'
    	},
    	{
    		selector: "#readability_linguist_decodable_searchlist",
    		ref: 'linguistPanelDecodableSearchList'
    	},
    	{
    		selector: "#readability_linguist_decodable_suggestions",
    		ref: "linguistPanelDecodableSuggestions"
    	},
    	{
    		selector: "#readability_linguist_decodablewords",
    		ref: "linguistPanelDecodableWords"
    	},
    	{
    		selector: "#linguist_panel_leveled_button",
    		ref: "linguistPanelLeveledButton"
    	},
    	{
    		selector: "#linguist_panel_decodable_button",
    		ref: "linguistPanelDecodableButton"
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
    	   },
    	   '#writer_panel_level_setup' : {
    		   click: this.showLinguistPanel
    	   },
     	   '#writer_panel_levelmenu > menuitem' : {
     	   		click: this.setCourseLevel
     	   },
     	   '#writer_panel_level_button' : {
     		   beforerender: this.writerPanelShowCoursePreset
     	   },
     	   '#writer_panel_check_button' : {
     		   click: this.updateWriterStats
     	   },
     	   '#writer_panel_decodable_sort_segmentedbutton' : {
     		   toggle: this.handleClickWriterPanelDecodableSortOrder
     	   },
     	   '#readability_linguist_decodable_searchlist' : {
     		   change: this.updateDecodableWords
     	   }
       });
    },
    
    
    showLinguistWindow: function() {
    	this.presetHasChanged = false;
    	var linguistPanel = new Ext.Window( {
    		height: "80%",
    		width: 800,
    		modal: true,
    		id: "readabilityLinguistWin",
    		title: _("Readability"),
    		layout: "fit",
    		items: [ {
    			xtype: "readabilitylinguistpanel"
    		}]
    		        
    	});
    	linguistPanel.show();
    },
    
    _setPresetChanged: function() {
    	this.presetHasChanged = true;
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
    		var labelStr = this._getParameterLabel(availableParameters[i].id);
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
    		
    		var decodableInfo = currentValues.decodableInfo || {};
    		this.getLinguistPanelDecodableToTeach().setValue(
				decodableInfo.toTeach || "");
    		this.getLinguistPanelDecodableLengthLim().setValue(
				decodableInfo.lengthLim || "");
    		this.getLinguistPanelDecodableSearchList().setValue(
				decodableInfo.searchList || "");
			var decodableWords = decodableInfo.words || [];
			var decodableWordsStr = "";
			for(var j = 0; j < decodableWords.length; j++) {
				decodableWordsStr += decodableWords[j] + " ";
			}
			this.getLinguistPanelDecodableWords().setValue(
				decodableWordsStr);
			
			if(currentValues.type === "decodable") {
				this.showTypePanelDecodable();
			}else {
				this.showTypePanelLeveled();
			}
			
			this.getLinguistPanelDecodableButton().setPressed(
				currentValues.type === "decodable");
			this.getLinguistPanelLeveledButton().setPressed(
				currentValues.type !== "decodable");
    	}
    	
    },
    
    _getParameterLabel: function(paramId) {
    	return this.indicatorIDToLabel[paramId] ?
				this.indicatorIDToLabel[paramId] : paramId;
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
			
			decodableInfo: {}
			
    	};
    	
    	presetObj.type = this.getLinguistPanelDecodableButton().pressed ? 
			"decodable" : "leveled";
    	
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
    	
    	presetObj.decodableInfo.toTeach = 
    		this.getLinguistPanelDecodableToTeach().getValue();
    	presetObj.decodableInfo.lengthLim = 
			this.getLinguistPanelDecodableLengthLim().getValue();
    	presetObj.decodableInfo.searchList = 
    		this.getLinguistPanelDecodableSearchList().getValue();
    	var wordsReadabilityHelper = new ReadabilityHelper(
			this.getLinguistPanelDecodableWords().getValue());
    	presetObj.decodableInfo.words =
    		wordsReadabilityHelper.getUniqueWords();
    	
    	this.updateDecodableWords();
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
    	var updateDisplayFn = function(readabilityPreset) {
    		this.updateWriterPanelLevelMenu();
    		this.showWriterLimitsForPreset();
    	};
    	
    	if(this.presetHasChanged) {
    		this.savePreset({ noformupdate : true}, function() {
    			//update display for the writer
    			if(this.currentReadabilityPreset.uuid !== "") {
    				this.updateCourseLevelFromUUID(
		    			this.currentReadabilityPreset.uuid,{}, 
		    			updateDisplayFn);
    			}
    		});
    	}else {
    		this.updateCourseLevelFromUUID(
    			this.currentReadabilityPreset.uuid,{}, 
    			updateDisplayFn
			);
    	}
    },
    
    _runOptionalCallback: function(callback, context, args) {
    	if(callback) {
    		callback.apply(context, args);
    	}
    },
    
    _addPresetsToMenu: function(targetMenu, successFn, failFn) {
    	Ext.Ajax.request({
    		url: '/readabilitypresets?action=list_presets',
    		scope: this,
    		success: function(response) {
				var presetList = Ext.JSON.decode(response.responseText);
				
				for(var i = 0; i < presetList.length; i++) {
					targetMenu.add([
		                {
		                	xtype: "menuitem",
		                	text: presetList[i].name,
		                	presetUUID: presetList[i].uuid
		                }
	                ]);
				}
				this._runOptionalCallback(successFn, this, [targetMenu]);
    		}
    	});
    },
    
    /**
     * Update the preset drop down menu with list of those available from the 
     * server
     */
    updatePresetMenu: function() {
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
		this._addPresetsToMenu(presetMenu);
    },
    
    updateWriterPanelLevelMenu: function(successFn, failFn) {
    	var writerPanelLevelMenu = this.getWriterPanelLevelMenu();
    	writerPanelLevelMenu.removeAll();
    	this._addPresetsToMenu(writerPanelLevelMenu, successFn, failFn);
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
    
    
    showLinguistPanel: function() {
    	eXe.app.getController("Toolbar").readabilityLinguistClick();
    },
    
    getCourseReadabilityPreset: function(options, successFn, failFn) {
    	var ourScope = options.scope ? options.scope : this;
    	
		Ext.Ajax.request({
            url: location.pathname + '/properties?pp_readability_preset=',
            scope: ourScope,
            success: function(response) {
            	var jsonResponse = Ext.JSON.decode(response.responseText);
            	var presetValueStr = jsonResponse.data.pp_readability_preset;
            	//when there is no preset value is blank
            	presetValueStr = presetValueStr === "" ? "{}" : presetValueStr;
            	var presetValues = JSON.parse(presetValueStr);
            	if(successFn) {
            		successFn.apply(ourScope,[presetValues]);
            	}
        	}
        });
    },
    
    writerPanelShowCoursePreset: function() {
    	//load the preset for this course
    	this.getCourseReadabilityPreset({},function(readabilityPreset){
    		this.currentReadabilityPreset = readabilityPreset;
    		//update the menu
    		this.updateWriterPanelLevelMenu(function(menu) {
    			if(this.currentReadabilityPreset.uuid) {
    				var panelLevelButton = this.getWriterPanelLevelButton();
        			panelLevelButton.setText(this.currentReadabilityPreset.name);
        			this.showWriterLimitsForPreset();
    			}
    		});
    	});
    },
    
    /**
     * Show in the writer panel the limits that are in a particular preset
     */
    showWriterLimitsForPreset: function(preset) {
    	var preset = preset ? preset : this.currentReadabilityPreset;
    	var limitSubPanel = this.getWriterPanelLimitSubPanel();
    	limitSubPanel.removeAll();
    	
    	this.getWriterPanelDecodableSubpanel().setHidden(
			preset.type !== "decodable");
		this.getWriterPanelLimitSubPanel().setHidden(
			preset.type === "decodable");
    	
    	if(preset.type !== "decodable") {
    		for(var limitId in preset.levelLimits) {
        		limitSubPanel.add({
        			xtype: "readabilitywriterlimit",
        			itemId: "writer_limit_" + limitId,
        			limits: preset.levelLimits[limitId],
    				limitLabel: this._getParameterLabel(limitId)
        		});
        	}
    	}else {
    		
    	}
    },

    /**
     * Get info about this UUID from server; update our currentReadabilityPreset
     * 
     * @param {String} presetUUID The Unique ID for this preset.  If undefined or null
     * then run the successFn immediately, with no preset values
     * @param {Object} options 
     * @param {function} successFn success callback function
     * @param {function} failFn failure callback function
     */
    updateCourseLevelFromUUID: function(presetUUID, options, successFn, failFn) {
    	//Load the preset from the server
    	if(!presetUUID) {
    		this._runOptionalCallback(successFn, this, [null]);
    		return;
    	}
    	
    	var loadURL = '/readabilitypresets?action=get_preset_by_id&presetid='
    		+ presetUUID;
    	
    	Ext.Ajax.request({
    		url: loadURL,
    		scope: this,
    		success: function(response) {
    			var presetValues = Ext.JSON.decode(response.responseText);
    			var presetValuesStr = ""+response.responseText;
    			this.currentReadabilityPreset = presetValues;
    			
    			//now set them on the package
    			Ext.Ajax.request({
    	            url: location.pathname + '/properties',
    	            method: "POST",
    	            scope: this,
    	            params: {
    	            	"pp_readability_preset" : presetValuesStr,
    	            },
    	            
    	            success: function(response) {
    	            	this._runOptionalCallback(successFn, this, [presetValues]);
    	            }
    	        });
    		}
    	});
    },
    
    setCourseLevel: function(clickedItem) {
    	var presetName = clickedItem.text;
    	var presetUUID = clickedItem.presetUUID;
    	
    	this.getWriterPanelLevelButton().setText(presetName);
    	
    	this.updateCourseLevelFromUUID(presetUUID, {}, function() {
    		this.showWriterLimitsForPreset();
    		this.updateWriterStats();
    	});
    },
    
    updateWriterStats: function(onDone) {
    	var loadURL = location.pathname + '/package_text';
    	
    	Ext.Ajax.request({
    		url: loadURL,
    		scope: this,
    		success: function(response) {
    			var textInfo = Ext.JSON.decode(response.responseText);
    			var pkgInfo = this.makeReadabilityInfoForPackage(textInfo);
    			this.updateWriterPanelDisplay(pkgInfo);
    		}
    	});
    },
    
    makeReadabilityInfoForPackage: function(pkgText) {
    	var allText = "";
    	var result = {};
    	result.pages = [];
    	
    	//A list of limitParamIds for which we need to check the min and max on each page
    	var rangeTrackerList = ["word_count", "sentence_count", 
    	                        "word_length", "sentence_length"];
    	
    	var rangeTrackerResults = {};
    	
    	var wordsPerPage = [null, null];
    	
    	var sentencesPerPage = [null, null];
    	
    	//loop through all pages
    	for(var p = 0; p < pkgText.length; p++) {
    		var thisPg = pkgText[p];
    		var pgText = "";
    		//loop through idevices on this page
    		for(var i = 0; i < thisPg.idevices.length; i++) {
    			pgText += thisPg.idevices[i].text + ".";
    		}
    		var pgHelper = new ReadabilityHelper(pgText);
    		var pgResults = pgHelper.getReadabilityStats();
    		
    		//because this is one page - the average sentence length is equal to sentence length
    		//pgResults.sentences_per_page_average = pgResults.sentence_count;
    		
    		pgResults.words_per_page = pgResults.word_count;
    		pgResults.sentences_per_page = pgResults.sentence_count;
    		
    		
    		pgResults.id = thisPg.pageid;
    		result.pages.push(pgResults);
    		
    		for(var r = 0; r < rangeTrackerList.length; r++) {
    			var trackerName = rangeTrackerList[r];
    			if(typeof pgResults[trackerName] !== "undefined") {
    				if(!rangeTrackerResults[trackerName]) {
    					rangeTrackerResults[trackerName] = [null, null];
    				}
    				
    				var pgResultMin = null, pgResultMax = null;
    				if(pgResults[trackerName] instanceof Array) {
    					//there is a range in the result from the page e.g. word length
    					pgResultMin = pgResults[trackerName][0];
    					pgResultMax = pgResults[trackerName][1];
    				}else {
    					//its a single result e.g. total word count
    					pgResultMin = pgResults[trackerName];
    					pgResultMax = pgResults[trackerName];
    				}
    				
    				if(rangeTrackerResults[trackerName][0] === null || 
						pgResultMin < rangeTrackerResults[trackerName][0]) {
    					rangeTrackerResults[trackerName][0] = pgResultMin;
    				}
    				
    				if(rangeTrackerResults[trackerName][1] === null || 
						pgResultMax > rangeTrackerResults[trackerName][1]) {
    					rangeTrackerResults[trackerName][1] = pgResultMax;
    				}
    			}
    		}
    		
    		allText += pgText;
    		if(pgText.length > 0) {
    			allText += ".";
    		}
    	}
    	
    	var allTextHelper = new ReadabilityHelper(allText);
    	result.wholeCourse = allTextHelper.getReadabilityStats();
    	result.wholeCourse.words_per_page = rangeTrackerResults['word_count'];
    	result.wholeCourse.sentences_per_page =  rangeTrackerResults['sentence_count'];
    	result.wholeCourse.sentence_length = rangeTrackerResults['sentence_length'];
    	result.wholeCourse.words_per_page_average = 
    		allTextHelper._roundNum(result.wholeCourse.words_per_page / pkgText.length,2);
    	result.wholeCourse.sentences_per_page_average =
    		allTextHelper._roundNum(result.wholeCourse.sentence_count / pkgText.length, 2);
    	
    	//remove items on the pages that are not meaningful on
    	//individual pages... e.g. total word count word_count 
    	//instead of words_per_page
    	
    	for(var p = 0; p < result.pages.length; p++) {
    		delete result.pages[p].word_count;
    	}
    	
    	
    	return result;
    },
    
    /**
     * Make a span element that is used to show the frequency counts 
     * for a decodable or non decodable word
     * 
     * @param word {String} the word e.g. cat
     * @param countAll {Number} count for whole course
     * @param countPg {Number} count for current page
     * @returns {String} html formatted 
     */
    _mkWordCountSpan: function(word, countAll, countPg) {
    	var htmlVal = " <span class='exe-readability-word-count'>"
    		+ countPg + "/" + countAll + "</span>";
    	return htmlVal;
    },
    
    /**
     * Makes an array in which the 
     */
    _mkWordFrequencyArr: function(wordArr, wordDictBook, wordDictPage) {
    	var result = [];
    	for(var i = 0; i < wordArr.length; i++) {
    		result.push({
    			word: wordArr[i],
    			bookCount: wordDictBook[wordArr[i]] || 0,
    			pageCount: wordDictPage[wordArr[i]] || 0
    		});
    	}
    	return result;
    },
    
    /**
     * 
     * @param {Array} wordArr Array of words from _mkWordFrequencyArr
     * @param {String} sortKey "word", "bookCount" or "pageCount"
     * @param {Number} sortDir 1 for asc, -1 for desc
     */
    _sortWordFrequencyArr: function(wordArr, sortKey, sortDir) {
    	wordArr.sort(function(item1, item2) {
    		if(sortKey === "word") {
    			return item1.word.localeCompare(item2.word) * sortDir;
    		}else {
				return (item1[sortKey] - item2[sortKey]) * sortDir;
			}
    	});
    	
    	return wordArr;
    },
    
    /**
     * Get the readability stats object for the currently 
     * selected page
     * 
     * @param {Object} readability stats with pages array
     */
    _getSelectedPageStats: function(readabilityStats) {
    	//find out what page is selected
    	var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel();
	    var selectedPg = outlineTreePanel.getSelectionModel().getSelection();
	    var selectedNodeid = '0';
	    
	    if (selectedPg != 0) {
	    	selectedNodeid = selectedPg[0].data.id;
    	}
	    
	    var selectedPgStats = null;
	    for(var i = 0; i < readabilityStats.pages.length; i++) {
	    	if(readabilityStats.pages[i].id == selectedNodeid) {
	    		return readabilityStats.pages[i];
	    	}
	    }
    },
    
    /**
     * Update the writer panel display
     * 
     * @param {Object} readabilityStats object for the course/by page 
     */
    updateWriterPanelDisplay: function(readabilityStats) {
    	if(readabilityStats) {
    		this.currentReadabilityStats = readabilityStats;
    	}else {
    		readabilityStats = this.currentReadabilityStats;
    	}
    	
    	var presetLimits = this.currentReadabilityPreset;
    	var writerLimitPanel = this.getWriterPanelLimitSubPanel();
    	
	    //selectedPgStats
	    var selectedPgStats = this._getSelectedPageStats(readabilityStats);
    	
    	for(limitParamId in presetLimits.levelLimits) {
    		if(presetLimits.levelLimits.hasOwnProperty(limitParamId)) {
    			var writerLimitId = "#writer_limit_" + limitParamId;
    			var paramWriterLimitPanel = writerLimitPanel.query(writerLimitId)[0];
    			var thisParamWholeCourse = readabilityStats.wholeCourse[limitParamId];
    			if(typeof thisParamWholeCourse !== "undefined") {
    				paramWriterLimitPanel.setActualValWholeCourse(thisParamWholeCourse);
    			}
    			
    			var thisParamSelectedPg = selectedPgStats[limitParamId];
    			if(selectedPgStats && typeof selectedPgStats[limitParamId] !== "undefined") {
    				paramWriterLimitPanel.setActualValPage(selectedPgStats[limitParamId]);
    			}
    		}
    	}
    	
    	if(this.currentReadabilityPreset && this.currentReadabilityPreset.type === "decodable") {
    		this.updateWriterPanelDisplayDecodable(readabilityStats, selectedPgStats);
    	}
    },
    
    updateWriterPanelDisplayDecodable: function(readabilityStats, selectedPgStats) {
    	if(!readabilityStats) {
    		readabilityStats = this.currentReadabilityStats;
    		selectedPgStats = this._getSelectedPageStats(readabilityStats);
    	}
    	
    	var decodableSubPanel = this.getWriterPanelDecodableWords();
		decodableSubPanel.removeAll();
		var decodableWordList = this.currentReadabilityPreset.decodableInfo.words;
		var wordDictAll = readabilityStats.wholeCourse.unique_words_dict;
		var wordDictPg = selectedPgStats.unique_words_dict;
		
		var decodableWordArr = this._mkWordFrequencyArr(
			decodableWordList, wordDictAll, wordDictPg);
		var decodableWordDict = {};
		
		decodableWordArr = this._sortWordFrequencyArr(decodableWordArr, 
				this.writerPanelDecodableSortKey, 
				this.writerPanelDecodableSortOrder);
		
    	for(var j = 0; j < decodableWordArr.length; j++) {
    		var curWord = decodableWordArr[j].word;
    		var countSpan = this._mkWordCountSpan(curWord, 
				decodableWordArr[j].bookCount, 
				decodableWordArr[j].pageCount);
    		
    		decodableSubPanel.add({
    			xtype: "label",
    			html: curWord + " " + countSpan,
    			cls: "exe-readability-decodableword",
    			padding: 5
    		});
    		decodableWordDict[curWord] = 1;
    	}
    	
    	var undecodableWords = [];
    	for(currentWord in readabilityStats.wholeCourse.unique_words_dict) {
    		if(!decodableWordDict[currentWord]) {
    			undecodableWords.push(currentWord);
    		}
    	}

    	var undecodableWordArr = this._mkWordFrequencyArr(
    			undecodableWords, wordDictAll, wordDictPg);
    	
    	undecodableWordArr = this._sortWordFrequencyArr(undecodableWordArr, 
				this.writerPanelDecodableSortKey, 
				this.writerPanelDecodableSortOrder);
    	
    	var undecodableSubpanel = this.getWriterPanelUndecodableWords();
    	undecodableSubpanel.removeAll();
    	
    	for(var k = 0; k < undecodableWords.length; k++) {
    		var curUnWord = undecodableWordArr[k].word;
    		var unWordSpan = this._mkWordCountSpan(curUnWord, 
				undecodableWordArr[k].bookCount, 
				undecodableWordArr[k].pageCount);

    		undecodableSubpanel.add({
    			xtype: "label",
    			html: curUnWord + " " + unWordSpan,
    			cls: "exe-readability-decodableword",
    			padding: 5
    		});
    	}
    },
    
    
    /**
     * Port of decodable word checker
     */
    updateDecodableWords: function() {
    	//the text in which we search
    	var textToSearchStr = this.getLinguistPanelDecodableSearchList().getValue();
    	var textToSearchHelper = new ReadabilityHelper(textToSearchStr);
    	var textToSearchWords = textToSearchHelper.getUniqueWords();
    	
    	//the word limit length
    	var wordLenLimit = parseInt(this.getLinguistPanelDecodableLengthLim());
    	wordLenLimit = isNaN(wordLenLimit) ? -1 : wordLenLimit;
    	
    	//combos to teach
    	var toTeachStr = this.getLinguistPanelDecodableToTeach().getValue();
    	var toTeachHelper = new ReadabilityHelper(toTeachStr);
    	var toTeachWords = toTeachHelper.getUniqueWords();
    	
    	//determine which are valid suggestions
    	var suggestions = [];
    	for(var i = 0; i < textToSearchWords.length; i++) {
    		var thisWordLower = textToSearchWords[i].toLowerCase();
    		var foundCombo = false;
    		for(var j = 0; (j < toTeachWords.length) && (foundCombo === false); j++) {
    			var thisComboLower = toTeachWords[j].toLowerCase();
    			if(thisWordLower.indexOf(thisComboLower) !== -1) {
    				if(wordLenLimit === -1 || thisWordLower.length <= wordLenLimit) {
    					foundCombo = true;
        				suggestions.push(thisWordLower);
    				}
    			}
    		}
    	}
    	
    	var suggestionPanel = this.getLinguistPanelDecodableSuggestions();
    	suggestionPanel.removeAll();
    	
    	for(var k = 0; k < suggestions.length; k++) {
    		suggestionPanel.add({
    			xtype: "label",
				text: suggestions[k],
				padding: 5,
				listeners: {
	        		click: {
	        			element: 'el',
	        			fn : this.handleClickSuggestedDecodableWord
	        		},
	        		scope: this
				}
    		});
    	}
    },
    
    handleClickWriterPanelDecodableSortOrder: function(container, button, pressed) {
    	this.writerPanelDecodableSortKey = button.readabilitySortKey;
    	this.writerPanelDecodableSortOrder = button.readabilitySortOrder;
    	this.updateWriterPanelDisplayDecodable();
    },
    
    handleClickSuggestedDecodableWord: function(evt) {
    	var text = evt.delegatedTarget.textContent;
    	var decodableWordsTextArea = this.getLinguistPanelDecodableWords();
    	var decodableWordsStr = decodableWordsTextArea.getValue();
    	if(decodableWordsStr.toLowerCase().indexOf(text) === -1) {
    		decodableWordsTextArea.setValue(decodableWordsStr + " " + text);
    	}
    }
});

