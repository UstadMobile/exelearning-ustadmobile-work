/*
 EXE Content QUnit Testing
 
 This conducts unit testing on EXE output to ensure to do automated
 regression testing against different browsers and platforms. 
*/


/**
 * Provide the base class
 *
 * @module EXEContentTesting
 */ 
var EXEContentTesting = function() {
    this.qunitOutput = "";
};

/**
 * Main instance
 */
EXEContentTesting.mainInstance = null;

/**
 * Main String for storing testing output as it goes
 */
EXEContentTesting.qunitOutput = "";

EXEContentTesting.ideviceClassNames = ["MultichoiceIdevice"];

/**
 * The name of the local storage variable for saving page testing 
 * results
 */
EXEContentTesting.STORAGENAME_PAGELIST = "execontenttesting_pagelist";


/**
 * The prefix for local storage variables saving the results of a test
 * on a page (using JSON) - e.g. prefix-pagename.html
 */
EXEContentTesting.STORAGENAME_PAGEPREFIX = "execontenttesting_result";

/**
 * Get the Instance of UstadMobile class
 * @returns {UstadMobile} UstadMobile instance
 */
EXEContentTesting.getInstance = function() {
    if(EXEContentTesting.mainInstance === null) {
        EXEContentTesting.mainInstance = new EXEContentTesting();
    }
    
    return EXEContentTesting.mainInstance;
}; 
 
EXEContentTesting.prototype = {
		
	/**
	 * Run this once all desired testing scripts have loaded.
	 */ 
	runAfterScriptsLoad: function() {
		if(document.readyState === "complete" || document.readyState === "interactive") {
			EXEContentTesting.getInstance().init();
		}else {
			$(document).one("load", function() {
				EXEContentTesting.getInstance().init();
			});
		}
	},	
		
	init: function() {
		console.log("EXE Content QUnit Init Time!");
		EXEContentTesting.getInstance().setupQUnitHandlers();
		EXEContentTesting.getInstance().testPage();
	},
	
	setupQUnitHandlers: function() {
		//QUnit Event Handlers

		//1.
		QUnit.begin(function( details ) {
		    console.log( "QUnit: Test Suit Starting." );
		});

		//2.
		QUnit.moduleStart(function( details ) {
		    console.log( "QUnit: Starting module: ", details.module );
		}); 

		//3.
		QUnit.testStart(function( details ) {
		    var msg = "QUnit: Now starting Test: " +  details.module 
		    	+ " " + details.name;
		    EXEContentTesting.qunitOutput += msg + "\n";
		    console.log(msg);
		});

		//4.
		QUnit.log(function( details ) {
		    var msg = "QUnit: Now logging Test: " +  details.module
		    	+ " " + details.name;
		    EXEContentTesting.qunitOutput += msg + "\n";
		    console.log(msg);
		});

		//5.
		QUnit.testDone(function( details ) {
		    var msg =  "QUnit: Finished Running Test: " + details.module + " : "
		        + details.name + " Passed/Total: " +  details.passed + "/" 
		        + details.total + " Duration:" + details.duration;
		    
		    console.log(msg);       
		    EXEContentTesting.qunitOutput += msg + "\n";
		});                                                                                                                                 



		//Final.
		QUnit.done(function( details ) {
		    var msg =  "QUnit: Test Suit Done. Results: Total: " + details.total
		    	+ " Failed: " + details.failed +  " Passed: " +  details.passed
		        + " Runtime: " + details.runtime;
		    console.log(msg);
		    EXEContentTesting.qunitOutput += msg;
		    var paramsToSend = { "numPass" : details.passed, "numFail" : details.failed,
		        "logtext" : EXEContentTesting.qunitOutput};
		    
		    if(typeof jscoverage_serializeCoverageToJSON === "function") {
		        paramsToSend['jscover'] = jscoverage_serializeCoverageToJSON();                       
		    }
		    
		    var currentPageList = localStorage.getItem(
		    		EXEContentTesting.STORAGENAME_PAGELIST);
		    
		    if(currentPageList === null) {
		    	currentPageList = [];//init as blank array
		    }else {
		    	currentPageList = JSON.parse(currentPageList);
		    }
		    
		    var endPageNameStr = location.pathname.indexOf("?") !== -1 ?
		    		location.pathname.indexOf("?") : 
	    			location.pathname.length;
		    		
		    var currentPageName = location.pathname.substring(
		    		location.pathname.lastIndexOf("/")+1,
		    		endPageNameStr);
		    
		    currentPageList.push(currentPageName);
		    localStorage.setItem(EXEContentTesting.STORAGENAME_PAGELIST,
		    		JSON.stringify(currentPageList));
		    
		    var pageResultKey = EXEContentTesting.STORAGENAME_PAGEPREFIX
		    	+ currentPageName;
		    localStorage.setItem(pageResultKey, 
		    		JSON.stringify(paramsToSend));
		    
		    EXEContentTesting.getInstance().checkPageComplete();
		    //sendTestOutputSimple(paramsToSend);
		});
	},
		
		
    testPage: function() {
        //make sure the page itself loaded
    	QUnit.module("Page Tests");
    	QUnit.test("Main content div present", function( assert){
    		assert.ok($("#main").length >= 1, "Main div present");
    	});
    	QUnit.module("Idevice Tests");
    	EXEContentTesting.getInstance().testIdevices();
    },
	
	testIdevices: function() {
		//get list of idevices
		$(".iDevice_wrapper").each(function(index, el) {
			for(var i = 0; i < EXEContentTesting.ideviceClassNames.length; i++) {
				var deviceClassName = 
					EXEContentTesting.ideviceClassNames[i];
				if($(el).hasClass(deviceClassName)) {
					var fn = eval("test" + deviceClassName);
					if(typeof fn === "function") {
						fn.apply(el, [$(el).attr("id")]);
					}else {
						console.log("Warning: No unit test found for :"
								+ deviceClassName);
					}
				}
			}
		});
	},
    
	loadNextPageAJAX: function() {
		
	},
	
    checkPageComplete: function() {
    	var nextLink = $(".next").attr("href");
    	
    	
    	if(nextLink) {
    		if($.mobile) {
    			//Using UstadMobile with JQueryMobile
    			UstadMobileContentZone.getInstance().contentPageGo(
					UstadMobile.RIGHT,function (result) {
						alert("check on next page now");
					});
    		}else {
    			document.location.href = nextLink + "?exe_content_qunit_test=1";
    		}
    	}else {
    		var currentPageList = localStorage.getItem(
		    		EXEContentTesting.STORAGENAME_PAGELIST);
    		currentPageList = JSON.parse(currentPageList);
    		
    		var totalPass = 0;
    		var totalFail = 0;
    		
    		var serverTxt = "";
    		for(var i = 0; i < currentPageList.length; i++) {
    			serverTxt += "\n====" + currentPageList[i] 
    				+ "=====\n";
    			var currentPageObj = localStorage.getItem(
        				EXEContentTesting.STORAGENAME_PAGEPREFIX 
        				+ currentPageList[i]);
    			currentPageObj = JSON.parse(currentPageObj);
    			serverTxt += currentPageObj['logtext'];
    			totalPass += currentPageObj['numPass'];
    			totalFail += currentPageObj['numFail'];
    		}
    		
    		var serverParams = {"numPass" : totalPass, 
    				"numFail" : totalFail, "logtext" : serverTxt};
    		var x = 0;
    		alert("Done");
    	}
    }
};


 