/**
 * 
 */

var readabilityWriterPanel = Ext.define('eXe.view.forms.ReadabilityWriterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.readabilitywriterpanel',
    
    collapsible: true,
    
    title: "Readability",
    
    layout: { 
    	type: "vbox",
    	align: "stretch"
    },
    
    initComponent: function() {
		var me = this;
		
		Ext.applyIf(me, {
            items: [
                {
                	xtype: "label",
                	padding: 6,
                	text: _("Level:")
                },
                {
                	xtype: "toolbar",
                	items: [ 
            	        {
            	        	xtype: "button",
                        	itemId: "writer_panel_level_button",
                        	scale: "medium",
                        	text: "Selected Level",
                        	menu: {
                        		xtype: "menu",
                        		itemId : "writer_panel_levelmenu",
                        		items: [{
                        			xtype: "menuitem",
                        			itemId : "writer_panel_dummylevel",
                        			text: " "
                        		}]
                        	}
            	        },
            	        {
            	        	xtype: "button",
                        	itemId: "writer_panel_level_setup",
                        	scale: "medium",
                        	text: "Setup"
                        	
            	        },
        	        ]
                }
            ]
		});
		
		this.callParent(arguments);
    }
    
});

