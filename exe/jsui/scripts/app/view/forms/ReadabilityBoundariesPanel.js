/**
 *  Readability Options Panel
 */


Ext.define('ReadabilityStoreModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'filename',
            type: 'string'
        }, {
            name: 'basename',
            type: 'string'
        }]
    });

var readabilityPresetStore = Ext.create('Ext.data.Store', {
     fields: [{name: 'display'}, {name: 'value'}],
     model: 'ReadabilityStoreModel',
     proxy: {
    	 type: 'ajax',
    	 url: '/readabilitypresets?type=erb',
    	 reader: {
    		 root: "rootList"
    	 }
     },
     autoLoad: true
});



var readabilityPanel = Ext.define('eXe.view.forms.ReadabilityBoundariesPanel', {
    extend: 'Ext.tab.Panel',
    id: 'readabilityboundarypanel',
    alias: 'widget.readabilityboundarypanel',
    
    constructor: function () {
    	  this.callParent(arguments);
	},
    	
	

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: false,
            trackResetOnLoad: true,
            items: [	//This is the whole Panel start
            	{	
            		title: _("Level Preset"),
                    xtype: 'panel',
                    layout: {
                    	type: 'vbox',
                    	align: 'stretch'
                    },
                    margin: 4, //Margin from top
                    items: [
                        //The readability level tab
	                	{
                		xtype: 'panel',
                		margin: 4,
                		layout: {
                			type: 'column',
                			align: 'stretch'
                		},
                		defaults: {
                			margin: 5
                		},
                		items : [
            		        {
								xtype: 'combo',
								inputId: 'readability_boundaries_combobox',
								id: 'ext_readability_boundaries_combobox',
								fieldLabel: _('Level'),
								store: readabilityPresetStore,								
								tooltip: _('Select a level.'),
								displayField: "basename",
								valueField: "filename",
								editable: false,
								valueField: "value",
								anchor: '100%',
								listConfig: {
							        listeners: {
							            itemclick: function(list, record) {
							                var filename = "__base__" 
							                	+ record.get("filename");
							                nevow_clientToServerEvent("readabilityBoundariesImport", 
						    		    			this, '', filename);
						    		    			
							            }
							        }
							    }

            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Save"),
            		        	handler: function(obj) {
            		        		eXeReadabilityHelper.saveCurrentPreset();
            		        	}
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Delete")
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Import"),
            		        	handler: function(obj) {
            		        		eXeReadabilityHelper.importReadabilityBoundaries();
            		        	}
            		        },
            		        {
            		        	xtype: 'button',
            		        	text: _("Export"),
            		        	id: "readability_export_boundary_targets",
            		        	handler: function(obj) {
            		        		eXeReadabilityHelper.exportReadabilityBoundaries();
            		        	}
            		        }
        		        ]
	                	},
	                	{//The panel where indicators are loaded
	                		xtype: "panel",
	                		margin: 5,
	                		id: "readability_boundaries_indicator_panel",
	                		layout: {
	                			type: "table",
	                			columns: 5
	                		},
	                		width: "100%",
	                		items: [], 
	                		flex: 1
	                	}
                    ]
                },
                
            	{ //The Decoding Tab
					
                    xtype: 'panel',
                    title : _("Decoding"),
                    layout: {
                    	type: 'vbox',
                    	align: 'stretch'
                    },
					//border:1,
					width: '100%',
					id: 'showrecentprojectspanel',
					margin: 4,
                    items: [
    	                	{
    	                		xtype: 'panel',
	                    		margin: 4,
	                    		layout: {
	                    			type: 'table',
                    				columns: 2,
                    				align: "stretch"
	                    		},
	                    		flex: 1,
	                    		width: "100%",
	                    		height: "100%",
    	                		items: [
	                		        {
	                		        	xtype: 'label',
	                		        	text: 'Decodeable words'
	                		        },
	                		        {
	                		        	xtype: 'label',
	                		        	text: 'New Words',
	                		        	id: "label_new_words"
	                		        },
	                		        {
	                		        	xtype: 'textareafield',
	                		        	hideLabel: true,
	                		        	flex: 1,
	                		        	margin: 4,
	                		        	rows: 23,
	                		        	width: 320,
	                		        	id: "text_decodeable_words_str"
	                		        },
	                		        {
	                		        	xtype: 'textareafield',
	                		        	hideLabel: true,
	                		        	flex: 1,
	                		        	margin: 4,
	                		        	rows: 23,
	                		        	width: 160,
	                		        	id: "text_new_words_str"
	                		        }
                		        ]
    	                	},
    	                	{
    	                		xtype: 'panel',
    	                		margin: 4,
    	                		layout: {
    	                			type: 'column',
    	                			align: 'stretch'
    	                		},
    	                		defaults: {
    	                			margin: 5
    	                		},
    	                		items: [
	                		        {
                		        		xtype : "button",
                		        		text: _("Calculate New Words"),
                		        		handler: function(){
                		        			eXeReadabilityHelper.updateNewWords();
                		        		}
	                		        }
                		        ]
    	                	}
                    ]
                }
                
                
    	        
        ]
    }); //End of ExtApplyIf
    
    me.callParent(arguments);
         
},	 //end of initComponent
});	 //end of Ext.define the panel form.

var eXeReadabilityHelper = {
	
	/**
	 * Indicate processing the target has failed
	 */
	TARGET_PROC_FAIL: -1,
	
	/**
	 * Indicates the target is blank - nothing to check really
	 */
	TARGET_BLANK: -2,
		
	readabilityBoundariesTargetsToJSON: function() {
    	var boundaryInfoPanel = Ext.getCmp(
			"readability_boundaries_indicator_panel");
    	var indicatorsObj = boundaryInfoPanel.readabilityBoundaryStats;
    	var jsonResult = {};
    	for(indicatorId in indicatorsObj) {
    		if(indicatorsObj.hasOwnProperty(indicatorId)) {
    			//Boundary ranges set
    			if(indicatorId.startsWith("range_")) {
    				jsonResult[indicatorId] = {}
        			if(indicatorsObj[indicatorId]['max']) {
        				jsonResult[indicatorId]['max'] = Ext.getCmp(
        						"readability_boundary_target_" 
        						+ indicatorId + "_max").getValue();
        			}
        			if(indicatorsObj[indicatorId]['average']) {
        				jsonResult[indicatorId]['average'] = Ext.getCmp(
        						"readability_boundary_target_"
        						+ indicatorId + "_average").getValue();
        			}
    			}
    		}
    	}
    	
    	//now make a list of the words from decodeable tab
    	var wordArr = eXeReadabilityHelper.getDecodeableWordArr();
    	jsonResult['text_decodeable_words_list'] = wordArr;
    	
    	return jsonResult;
    },
    
    getDecodeableWordArr: function() {
    	var wordListStr = Ext.getCmp("text_decodeable_words_str").getValue();
    	var wordArr = wordListStr.split("\n");
    	var wordsToRemoveArr = [];
    	for(var i = 0; i < wordArr.length; i++) {
    		wordArr[i] = wordArr[i].trim();
    	}
    	
    	return wordArr;
    },
    
    saveCurrentPreset: function() {
    	var fPath = "__base__"
    		+ document.getElementById(
    				"readability_boundaries_combobox").value
		var boundariesSet = 
    		eXeReadabilityHelper.readabilityBoundariesTargetsToJSON();
    	nevow_clientToServerEvent("readabilityBoundariesExport", 
    			this, '', fPath, JSON.stringify(boundariesSet));
    },
    
    /**
     * Get the server to export the currently set readability 
     * boundaries to a specific location
     * 
     */
    exportReadabilityBoundaries: function() {
    	var f = Ext.create("eXe.view.filepicker.FilePicker", {
    		type: eXe.view.filepicker.FilePicker.modeSave,
    		title: _("Save file"),
    		modal: true,
    		scope: this,
    		callback: function(fp) {
    		    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
    		    	var boundariesSet = 
    		    		eXeReadabilityHelper.readabilityBoundariesTargetsToJSON();
    		    	nevow_clientToServerEvent("readabilityBoundariesExport", 
    		    			this, '', f.file.path, JSON.stringify(boundariesSet));
    		        
    		    } else {
    	            Ext.defer(function() {
    			        eval(onDone);
    	            }, 500);
    		    }
    		}
    	});
    	f.appendFilters([
    		{ "typename": _("eXe Readability Boundaries"), "extension": "*.erb", "regex": /.*\.erb$/ },
    		{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    		]
    	);
    	f.show();
    },
    
    importReadabilityBoundariesShow: function(name, boundariesToSet) {
    	var boundariesObj = JSON.parse(boundariesToSet);
    	
    	//Set generic range indicators
    	for(indicatorId in boundariesObj) {
    		if(boundariesObj.hasOwnProperty(indicatorId)) {
    			if(indicatorId.startsWith("range_")) {
	    			var indicatorVals = boundariesObj[indicatorId];
	    			if(indicatorVals['average']) {
	    				var comp = Ext.getCmp("readability_boundary_target_"
	    						+ indicatorId + "_average");
	    				comp.setValue(indicatorVals['average']);
	    				
	    				//check if the target is hit
	    				eXeReadabilityHelper.hilightReadabilityTarget(
	    						indicatorId, "average");
	    			}
	    			
	    			if(indicatorVals['max']) {
	    				var comp = Ext.getCmp("readability_boundary_target_"
	    						+ indicatorId + "_max");
	    				comp.setValue(indicatorVals['max']);
	    				
	    				//check if the target is hit
	    				eXeReadabilityHelper.hilightReadabilityTarget(
	    						indicatorId, "max");
	    			}
    			}
    		}
    	}
    	
    	
    	//look for word lists
    	if(boundariesObj['text_decodeable_words_list']) {
    		var wordListStr = "";
    		var wordArr = boundariesObj['text_decodeable_words_list'];
    		for(var i = 0; i < wordArr.length; i++) {
    			wordListStr += wordArr[i];
    			if(i < wordArr.length -1) {
    				wordListStr += "\n";
    			}
    		}
    		
    		if(wordListStr.length >= 0) {
    			Ext.getCmp("text_decodeable_words_str").setValue(
    					wordListStr);
    		}
    	}else {
    		Ext.getCmp("text_decodeable_words_str").setValue("");
    	}
    },
    
    /**
     * Import readability boundaries: Show the file picker, then tell 
     * the server about it
     * 
     * @method
     */
    importReadabilityBoundaries: function() {
    	var f = Ext.create("eXe.view.filepicker.FilePicker", {
    		type: eXe.view.filepicker.FilePicker.modeOpen,
    		title: _("Open file"),
    		modal: true,
    		scope: this,
    		callback: function(fp) {
    		    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
    		    	nevow_clientToServerEvent("readabilityBoundariesImport", 
    		    			this, '', f.file.path);
    		    } 
    		}
    	});
    	f.appendFilters([
    		{ "typename": _("eXe Readability Boundaries"), "extension": "*.erb", "regex": /.*\.erb$/ },
    		{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    		]
    	);
    	f.show();
    },
    
    /**
     * Update the hilight on a textfield - find the indicator id
     * and indicator type from the id of the textfield according
     * to naming convention used on their creation
     * 
     * @param textEl Object ExtJS elemetn for the text field
     */
    updateTargetHilightByTextfield: function(textEl) {
    	var textId = textEl.id;
    	var targetPrefix = "readability_boundary_target_";
    	var lastUScore = textId.lastIndexOf("_");
    	var indicatorId = textId.substring(targetPrefix.length,
    			lastUScore);
    	var indicatorType = textId.substring(lastUScore+1);
    	eXeReadabilityHelper.hilightReadabilityTarget(indicatorId, 
    			indicatorType);
    },
    
    /**
     * Hilight if a target has been met or not
     * 
     * @param indicatorId String indicator ID e.g. total_words
     * @param indicatorType String "max" or "average"
     */
    hilightReadabilityTarget: function(indicatorId, indicatorType) {
    	var targetVal = Ext.getCmp("readability_boundary_target_"
    			+ indicatorId + "_" + indicatorType).getValue();
    	var valueLabelId = "readability_boundary_value_"
			+ indicatorId + "_" + indicatorType;
    	var actualVal = Ext.getCmp(valueLabelId).text;
    	var isTargetHit = eXeReadabilityHelper.targetWithinRange(
    			targetVal, actualVal);
    	var labelEl = document.getElementById(valueLabelId);
    	if(isTargetHit === true) {
    		labelEl.style.backgroundColor = 'green';
    		labelEl.style.color = "white";
    		labelEl.style.fontWeight = "bold";
    	}else if(isTargetHit === false) {
    		labelEl.style.backgroundColor = 'red';
    		labelEl.style.color = "white";
    		labelEl.style.fontWeight = "bold";
    	}else {
    		//did not really process
    		labelEl.style.backgroundColor = 'white';
    		labelEl.style.color = "black";
    		labelEl.style.fontWeight = "";
    	}
    },
    
    /**
     * Checks to see if a target is within the stated range
     * 
     * 
     * @param targetStr String can be a range X-Y, >X, <X, or just X which = <X
     * @param targetActualVal mixed 
     */
    targetWithinRange: function(targetStr, targetActualVal) {
    	//try and check the comparison
    	targetStr = targetStr.replace(/\s+/, "");
    	if(typeof targetActualVal === "string") {
    		targetActualVal = parseFloat(targetActualVal);
    	}
    	
    	if(targetStr.length === 0) {
    		return eXeReadabilityHelper.TARGET_BLANK;
    	}else if(targetStr.indexOf("-") !== -1) {
    		//this is a range
    		var strParts = targetStr.split("-");
    		var value1 = parseFloat(strParts[0]);
    		var value2 = parseFloat(strParts[1]);
    		
    		return targetActualVal > value1 && targetActualVal < value2;
    	}else if(targetStr.indexOf(">") !== -1) {
    		//this is a greater than request
    		var strNum = targetStr.substring(targetStr.indexOf(">")+1);
    		var value = parseFloat(strNum);
    		
    		return targetActualVal > value;
    	}else {
    		//assuming we mean less than
    		var targetNumStr = targetStr;
    		if(targetStr.indexOf("<") !== -1) {
    			targetNumStr = targetStr.substring(
    					targetStr.indexOf("<")+1);
    		} 
    			
    		var strNum = targetStr.substring(targetStr.indexOf("<")+1);
    		var value = parseFloat(strNum);
    		return targetActualVal < value;
    	}
    	
    	return eXeReadabilityHelper.TARGET_PROC_FAIL;
    },
    
    
    updateNewWords: function() {
    	var decodeableWordArr = eXeReadabilityHelper.getDecodeableWordArr();
    	var boundaryInfoPanel = Ext.getCmp(
			"readability_boundaries_indicator_panel");

    	var uniqueWords = boundaryInfoPanel.readabilityBoundaryStats[
                                         'info_distinct_words_in_text'];
    	var newWords = eXeReadabilityHelper.calculateNewWords(
    			uniqueWords, decodeableWordArr);
    	
    	newWords.sort();
    	
    	Ext.getCmp("text_new_words_str").setValue(
    			eXeReadabilityHelper.wordArrToNewLinesStr(newWords));
    	Ext.getCmp("label_new_words").setText("New Words (" 
    			+ newWords.length + ")");
    },
    
    /**
     * Figure out which words are not in the 
     * @param uniqueWordArr Array Array of unique words that are in the text itself
     * @param decodeableWordArr Array Array of deocdeable words (words student already should know)
     * 
     * @return Array Array of those words in uniqueWordArr that are not in decodeableWordArr
     */
    calculateNewWords: function(uniqueWordArr, decodeableWordArr) {
    	var newWordsArr = [];
    	for(var i = 0; i < uniqueWordArr.length; i++) {
    		if(decodeableWordArr.indexOf(uniqueWordArr[i]) === -1) {
    			newWordsArr.push(uniqueWordArr[i]);
    		}
    	}
    	
    	return newWordsArr;
    },
    
    /**
     * 
     */
    wordArrToNewLinesStr: function(wordArr) {
    	var result = "";
    	for(var i = 0; i < wordArr.length; i++) {
    		result += wordArr[i];
    		if(i < (wordArr.length - 1)) {
    			result += "\n";
    		}
    	}
    	
    	return result;
    }
    
    
};
