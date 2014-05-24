// ===========================================================================
// eXe
// Copyright 2014, Varuna Singh, Ustad Mobile
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

/*
This panel makes a big idevice list with graphical icons to help the
author decide what idevice they want to use.
*/


function getRecent(){	 	//If needed. Used for testing.
	var recentList = new Array();
	Ext.Ajax.request({
		url: location.pathname + '/recentMenu',
		scope: this,
		success: function(response) {
			var recList = new Array();
			var rm = Ext.JSON.decode(response.responseText),
					menu, text, item, pre
						
			for (i in rm){
				console.log("i: " + rm[i]);
			}
		}
	});
	return recentJSON;
}


function getTemplates(){	//If needed. Used for testing.
		var templateList = new Array();
		Ext.Ajax.request({
			url: location.pathname + '/styleMenu',
			scope: this,
			success: function(response) {	
				var styles = Ext.JSON.decode(response.responseText),
						menu, i, item;
				for (i = styles.length-1; i >= 0; i--) {
					templateList[i] = styles[i];
				}
			}
		});
	return templateList;
}

function testgetRecent(){
	
	if (recentJSON){
		var rms = Ext.JSON.decode(recentJSON.responseText);
		//alert(rms[1]);
		for (i in rms) {		
			var text = rms[i].num + ". " + rms[i].path;
			console.log("Found recent project rms: " + rms[i].path);
			
		}
	}else{
		console.log("else");
	}
}


function updateTemplate(){	//For updating the Styles list
	var stylepanel = Ext.getCmp('showstylepanel'); //showstylepanel
	stylepanel.removeAll();
	Ext.Ajax.request({
		url: location.pathname + '/styleMenu',
		scope: this,
		success: function(response) {
			var styles = Ext.JSON.decode(response.responseText),
					menu, i, item;
			stylepanel.add(
		    		 {	//For intendation purposes.
		 	        	xtype: 'component',
		 	        	flex: 1
		 	        })
			for (i = styles.length-1; i >= 0; i--) {
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
        		stylepanel.add({
        			xtype: 'button',
    	        	text: _(styles[i].label),
    	        	margin: 10,
    	        	width : 128,
    	            height : 64,
    	            itemid: 'test_button'
        		})
			}
		}
	});
}

//To Create the IDevice Panel.
var idevicep = Ext.define('eXe.view.forms.IDevicePanel', {
    extend: 'Ext.tab.Panel',
    id: 'idevicepanel',
    alias: 'widget.idevicep',
    refs: [
           //{
	       	//ref: 'wizardStylesMenu',
	       	//selector: '#wizard_styles_menu'
	       //}
        //{
	    	//ref: 'stylesWizard',
	    	//selector: '#styles_wizard'
        //}
    ],
    constructor: function () {
    	  //yourStuffBefore();
    	  //this.callParent(arguments);
    	  //initComp();
    	  this.callParent(arguments);
    	  //yourStuffAfter();

    	},

    initComponent: function() {
		var me = this;
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'idevicep',		//declared by wizardpage.py
            items: [	//This is the whole Panel start
                	
            ]
    }); //End of ExtApplyIf
        
    me.callParent(arguments);
         
},	 //end of initComponent


});	 //end of Ext.define the panel form.


	
	
