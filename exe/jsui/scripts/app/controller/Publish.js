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
            '#tools_publish': {
            	click:this.toolsPublish
            },
        });
	},

    toolsPublish: function() {
    	var publish = new Ext.Window ({
	          height: '80%', 
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
    }
	
});