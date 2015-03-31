// ===========================================================================
// eXe
// Copyright 2014 Ustad Mobile, Varuna Singh
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

Ext.define('eXe.view.ui.TitleToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.titletoolbar',

    initComponent: function() {
        var me = this;
        var projectTitle =  _('Untitled Project');
        
        Ext.applyIf(me, {
            items: [
                {
                	xtype: 'button',
                	itemId: 'tools_wizard',
                	icon: '/images/eXe_icon.ico',
                	text: '',
                	tooltip: _('Click me to open the wizard'),
                	scale: 'large'
                },
				{
				    xtype: 'button',
				    text: projectTitle,
				    itemId: 'title_button',
				    id: 'title_button',
				    scale: "large"
				},
				{
					xtype: 'tbfill',
				},
		         {
		        	xtype: 'button',
		    		text : _('Preview'),
		    		icon: '/images/preview-icon.png',
		    		scale: 'large',
		    		menu: {
                        xtype: 'menu',
                        items: [
                            {
                            	xtype: 'buttongroup',
                            	columns: 1,
                            	defaults: {
                            		xtype: 'button',
                            		scale: 'large',
                            		width: 200
                            	},
                            	items: [
									{
									    itemId: 'titletoolbar_preview_smartphone',
									    icon: '/images/smartphone.png',
									    text: _('Smartphone'),
									},
									{
									    itemId: 'titletoolbar_preview_featurephone',
									    icon: '/images/featurephone.png',
									    text: _('Feature Phone'),
									},
									{
										itemId: 'titletoolbar_preview_print',
										icon: '/images/stock-print.png',
									    text: _('Print'),
									},
									{
									    itemId: 'titletoolbar_preview_website',
									    icon: '/images/globe-icon.png',
									    text: _('Website')
									},
                    	        ]
                            }
                        ]
		    		}
		         },
		         {
		        	 xtype: 'button',
		        	 text: _('Publish'),
		        	 scale: 'large',
		        	 icon: '/images/icon-publish.png',
	        		 menu: {
                         xtype: 'menu',
                         items: [
                            {
                            	xtype: 'buttongroup',
                            	columns: 1,
                            	defaults: {
                            		xtype: 'button',
                            		scale: 'large',
                            		width: 250
                            	},
                            	items: [
                        	        {
                        	        	itemId : "publish_umcloud",
                        	        	icon: '/images/weather-clouds-2.png',
                        	        	text : _("Ustad Mobile Cloud")
                        	        },
                        	        {
                        	        	itemId : "file_export_mxml",
                        	        	icon: '/images/stock-export.png',
                        	        	text : _("Export to EPUB")
                        	        },
                        	        {
                        	        	itemId : "file_print",
                        	        	icon: '/images/stock-print.png',
                        	        	text : _("PDF/Print")
                        	        },
                    	        ]
                            }
                         ]
	        		 }		
		         }				
            ]
        });

        me.callParent(arguments);
    }
});	