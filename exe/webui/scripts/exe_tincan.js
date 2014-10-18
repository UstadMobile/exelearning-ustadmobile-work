/*
    EXE Tin Can Support - enables EXE to talk tin can 

    Copyright (C) 2014 Michael Dawson mike@mike-dawson.net

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


/**
 * Provides the base TinCanQueue
 * 
 * @module EXETinCan
 */

var EXETinCan;

var exeTinCanInstance;


/**
 * Helps exe to talk tin can
 * 
 * https://github.com/RusticiSoftware/TinCanJS
 * 
 * @class EXETinCan
 * @constructor
 */
EXETinCan = function() {
    this.tinCanQueue = new TinCanQueue();
    this.tinCan = new TinCan();
    
    this.actor = null;
    
    // TODO: Fix this
    this.idActivityPrefix = "http://www.ustadmobile.com/tincan/";
};

EXETinCan.mainInstance = null;

EXETinCan.getInstance = function() {
	if(EXETinCan.mainInstance === null) {
		EXETinCan.mainInstance = new EXETinCan();
	}
	
	return EXETinCan.mainInstance;
};


EXETinCan.prototype = {
    
	/**
	 * The proxy destination to send statements to (e.g. queue)
	 */
	tinCanProxyURL : null,
		
	/**
	 * 
	 * @method setActor
	 */
	setActor : function(actor) {
		this.actor = actor;
	},

	/**
	 * 
	 * @method getActor
	 */
	getActor : function() {
		return this.actor;
	}, 
		

    /**
	 * Set how we are working based on parameters in URL
	 * 
	 * If exetincanproxy is set all statements will be sent to the proxy without
	 * authentication (e.g. Ustad Mobile) to a local server
	 * 
	 * Otherwise the statement will be serialized and sent to the LRS if Rustici
	 * launch method parameters are in the URL
	 * 
	 * @method setLRSParamsFromLaunchURL
	 */
    setLRSParamsFromLaunchURL : function() {
    	var queryVars = this.getQueryVariables();
    	// Handle Rustici method
    	if(queryVars['actor']) {
    		var queryActorStr = queryVars['actor'];
	    	var ourActor = TinCan.Agent.fromJSON(queryActorStr);
	    	this.setActor(ourActor);
    	}
    	
    	if(queryVars['exetincanproxy']) {
	    	this.tinCanProxyURL = queryVars['exetincanproxy']; 
    	}else if (this.getActor()){
			var newLRS = new TinCan.LRS({
	            "endpoint" : queryVars['endpoint'],
	            "version" : "1.0.0",
	            "user" : ourActor,
	            'auth' : queryVars['auth']
	        }); 
	    	
			this.tinCan.recordStores[0] = newLRS;
    	}
    },
    
    /**
	 * 
	 */
    getTinCanIDURLPrefix: function() {
    	if($("BODY").attr("data-tincan-prefix")) {
    		return $("BODY").attr("data-tincan-prefix");
    	}else {
    		return "http://www.ustadmobile.com/um-tincan/";
    	}
    },
    
    /**
	 * Record a statement - send it to the proxy or queue
	 * 
	 * @param stmt
	 *            TinCan.Statement Statement to record
	 */
    recordStatement : function(stmt) {
    	console.log("record: " + stmt.originalJSON);
    	
    	if(this.tinCanProxyURL) {
    		$.ajax({
    			url : this.tinCanProxyURL,
    			data : {
    				"statement" : stmt.originalJSON
    			}
    		}).done(function() {
    			console.log("Sent statement to proxy");
    		});
    	}else {
    		// TODO: Put directly into queue
    	}
    },
    
    makeLRSQueryParams : function(endpoint, actorName, actorMbox, user, password) {
    	var queryStr = "endpoint=" + encodeURI(endpoint) + "&";
    	var actorStr = JSON.stringify({
    		"name" : [actorName],
    		"mbox" : ["mailto:" + actorMbox]
    	});
    	queryStr += "actor=" + encodeURI(actorStr) + "&";
    	
    	var authStr = "Basic " + Base64.encode(user, + ":" + password);
    	queryStr += "auth=" + encodeURI(authStr);
    	
    	return queryStr;
    },
    
    /**
     * Make a TINCAN Statement for user experiencing the page.  Actor must
     * be set.
     * 
     * @param pagename String page identifier (e.g. filename without .html)
     * @param name String Name of activity (e.g. short title) for activity def
     * @param desc String Description of activity for activity def
     * 
     * @returns TinCan.Statement statement for input args
     */
    makePageExperienceStmt : function(pagename, name, desc) {
    	var myVerb = new TinCan.Verb({
			id : "http://adlnet.gov/expapi/verbs/experienced",
			display: {
	            "en-US": "experienced"
	        }
		});
    	
    	var myDefinition = {
    		type : "http://adlnet.gov/expapi/activities/module",
    		name : {
    			"en-US" : name
    		},
    		description : {
    			"en-US" : desc
    		}
    	};
    	
    	var myActivity = new TinCan.Activity({
			id : this.getTinCanIDURLPrefix() + "/" + pagename,
			definition : myDefinition
		});
    	
    	var stmt = new TinCan.Statement({
			actor : this.getActor(),
			verb : myVerb,
			target : myActivity,
			},{'storeOriginal' : true});
		
		return stmt;
    },

    /**
	 * Turns search query variables into a dictionary - adapted from
	 * http://css-tricks.com/snippets/javascript/get-url-variables/
	 * 
	 * @method getQueryVariable
	 */
	getQueryVariables : function() {
		var retVal = {};
		if(window.location.search.length > 2) {
			var query = window.location.search.substring(1);
	        var vars = query.split("&");
	        for (var i=0;i<vars.length;i++) {
	        	var pair = vars[i].split("=");
	            retVal[pair[0]] = decodeURIComponent(pair[1]);
	        }
		}
        return retVal;
	},
	
	/**
	 * Register activity definition for a given ideviceid
	 * 
	 * @method
	 * 
	 */
	
    
    // Methods that will handle core EXE idevice tin can work
    
	/**
	 * Make a tin can statement for a multi choice item
	 * 
	 * @param activityDefinition
	 *            {TinCan.ActivityDefinition} definition of MCQ question ativity
	 * @param responseId
	 *            {String} ID of response chosen
	 * @param responseIsCorrect
	 *            {Boolean} is this a correct answer?
	 * 
	 * @method makeMCQTinCanStatement
	 * @return {TinCan.Statement} Statement for MCQ given arguments
	 */
	makeMCQTinCanStatement: function(activityDefinition, questionId, responseId, responseIsCorrect) {
		var myVerb = new TinCan.Verb({
			id : "http://adlnet.gov/expapi/verbs/answered",
			display: {
	            "en-US": "answered"
	        }
		});
		
		var myActivity = new TinCan.Activity({
			id : this.idActivityPrefix+ "/" + questionId,
			definition : activityDefinition
			
		});
		
		var myResult = new TinCan.Result({
			success : responseIsCorrect,
			response : responseId
		});
		
		var myStmt = new TinCan.Statement({
			actor : this.getActor(),
			verb : myVerb,
			result : myResult,
			target : myActivity,
			},{'storeOriginal' : true});
		
		this.tinCanQueue.queueStatement(myStmt)
		
	}
	
	
}

// check and see if we should take TINCAN parameters from the URL
EXETinCan.getInstance().setLRSParamsFromLaunchURL();
