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
    	   }
       });
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
            			this.setupLevelPanelLimits(availableParams);
            		}
                });
            }
    	});
    },
    
    /**
     * Show values for leveled reader panel
     * 
     * @param {Array} availableParameters - Parameters available for linguist to choose from
     * @param {String} availableParameters[].id id of the parameter
     * @param {String} availableParameters[].unit unit of measure e.g. words or letters
     * 
     * @param {Object} currentValues 
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
    			limitLabel: labelStr,
    			unitLabel: availableParameters[i].unit
    		}]);
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

