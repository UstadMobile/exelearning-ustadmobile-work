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
Ext.define('eXe.controller.Publish', {
    extend: 'Ext.app.Controller',
    requires: [
               'eXe.view.forms.PublishPanel'
            ],
    
    init: function() {
        this.control({
            '#publish_umcloud': {
            	click:this.toolsPublish
            },
            '#publish_login_and_upload': {
            	click:this.checkFileUpload
            },
            '#publish_epub': {
            	click:this.epubExport
            },
            '#publish_pdf_print': {
            	click:this.pdfPrint
            }
        });
	},

    toolsPublish: function() {
    	var publish = new Ext.Window ({
	          height: '70%', 
	          width: '540px', 
	          modal: true,
	          autoScroll: true,
	          id: 'publishwin', //PUBlish WINdow
	          title: _("Publish"),
	          //style: "overflow: auto;",
	          layout: 'fit',
	          items: [{
	        	  //xtype is from PublishPanel.js's alias
	              xtype: 'publishpanel'
	          }]
	        }),
          formpanel = publish.down('form');
	      publish.show();        
    },
    
    /*
     * Checks if file is saved and loaded.
     */
    checkFileUpload: function() { 
		var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
		//getPackageFileName gets the file name of the project and calls the last param.
		nevow_clientToServerEvent('getPackageFileName', this, '', 'eXe.app.getController("Publish").startUpload', '');
    },
    
    /*
     * Checks if iDevices closed, saved and file updated. Then starts Upload.
     */
    startUpload: function(filename, onDone) {
		var userName = Ext.getCmp('umcloudusernameinput').getValue();
  		var pswd = Ext.getCmp('umcloudpasswordinput').getValue();
  		var url = Ext.getCmp('umcloudserverurlinput').getValue();
  		var forceNew = Ext.getCmp('forceNew').getValue();
  		var noAutoassign = Ext.getCmp('noAutoassign').getValue();
  		
  		 if (filename) {
  			 //submits any open iDevices.
  			eXe.app.getController("Toolbar").saveWorkInProgress();	
            Ext.Msg.wait(new Ext.Template(_('Saving package to: {filename}')
            								).apply({filename: filename}));
 	        if (onDone) {	//saves the package
 	            nevow_clientToServerEvent('savePackage', this, '', '', onDone);
 	        } else {
 	            nevow_clientToServerEvent('savePackage', this, '');
 	        }
 	    } else { //save as
 	    	eXe.app.getController("Toolbar").fileSaveAs(onDone)
 	    }

  		//nevow_clientToServerEvent('EVENT', this, 'client', 'onDONE', 'onDoneParam', filename);
   		Ext.Msg.wait(_('Uploading package:') + filename + _(" to server.."));
  		var umupload_retmsg = nevow_clientToServerEvent(
  		 	'startUMUpload', this, '', '', '', filename, 
  		 		userName, pswd, url, forceNew, noAutoassign);
	},
	
	epubExport: function() {
		console.log("wazup?");
	},
	
	pdfPrint: function() { 
		console.log("How you doin?");
	}
});