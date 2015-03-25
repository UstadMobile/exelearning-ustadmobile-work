// ===========================================================================
// eXe
// This file: Copyright 2014, Mike Dawson, UstadMobile Inc
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



/**
 * The PreviewIframePanel - makes an iframe to show a preview
 * 
 * Uses property previewURL
 * 
 */
var idevicep = Ext.define('eXe.view.forms.PreviewIframePanel', {
    extend: 'Ext.panel.Panel',
    id: 'previewiframepanel',
    alias: 'widget.previewiframepanel',
    requires: ["Ext.ux.IFrame"],
    
    layout : "fit",
    
    constructor: function () {
          this.callParent(arguments);
    },

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items: [{
        		xtype: 'uxiframe',
                itemId: 'previewFrame',
                src: me.previewURL,
        	}]
        });
            
        me.callParent(arguments);     
    }
});  
