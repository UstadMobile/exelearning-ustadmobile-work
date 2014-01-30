//
// eXeLearning TIN CAN support 
// Copyright 2014 Michael Dawson.
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
// ===========================================================================

var tinCanStatementQueue = new Array();
var tinCanObj = null;
var tinCanLRS = null;
var tinCanActor = null;

function exeTinCanQueueStatement(stmt) {

}



/*
 Should use config parameters to get LRS object
*/
function exeTinCanLRS(exeTinCanSettings) {
    var newLRS = new TinCan.LRS({
        "endpoint" : exeTinCanSettings['endpoint'],
        "version" : "1.0.0",
        "user" : exeTinCanSettings['user'],
        'auth' : "Basic " + Base64.encode(exeTinCanSettings['user'] + ":" + exeTinCanSettings['password'])
    }); 
    return newLRS;
}

function getTinCanActor(exeTinCanSettings) {
    var newActor = new TinCan.Agent(
        {"name" : exeTinCanSettings['actor']['name'], 
        "mbox" : exeTinCanSettings['actor']['mbox']
        });
    
    return newActor;
}

/**
Return Tin Can object
*/
function getTinCanObj() {
    return new TinCan();
}

function sendTinCanStatements() {
    if(tinCanObj == null) {
        tinCanObj = getTinCanObj();
    }
    
    if(tinCanLRS == null) {
        tinCanLRS = getTinCanLRS(exeTinCanDefaults);
    }
    
    if(tinCanActor == null) {
        tinCanActor = getTinCanActor(exeTinCanDefaults);
    }
    
    tinCanObj.recordStores[0] = tinCanLRS;
}

function runTestStatement() {
    var myVerb = new TinCan.Verb({
		id : "http://activitystrea.ms/specs/json/schema/activity-schema.html#read",
		display : {
			"en-US":"read", 
			"en-GB":"read"
		}
	});
	
	var myActivityDefinition = new TinCan.ActivityDefinition({
		name : {
			"en-US":"Hello World", 
			"en-GB":"Hello World"
		},
		description : {
			"en-US":"the meaning of life is 42",
			"en-GB":"the meaning of life is 42"
		}
	});
 
	var myActivity = new TinCan.Activity({
		id : "http://www.ustadmobile.com/looking_at_things",
		definition : myActivityDefinition
	});
	
	var stmt = new TinCan.Statement({
		actor : getTinCanActor(exeTinCanDefaults),
		verb : myVerb,
		target : myActivity
	},false);

    if(tinCanObj == null) {
        tinCanObj = getTinCanObj();
    }
    
    if(tinCanLRS == null) {
        tinCanLRS = getTinCanLRS(exeTinCanDefaults);
    }

    tinCanObj.recordStores[0] = tinCanLRS;
    
    tinCanObj.sendStatement(stmt, function() {
        alert("Tin Can statement sent")
    });
    
}







