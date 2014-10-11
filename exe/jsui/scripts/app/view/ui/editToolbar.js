// ===========================================================================
// eXe
// Copyright 201, Pedro Peña Pérez, Open Phoenix IT
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

Ext.define('eXe.view.ui.button', {
    extend: 'Ext.button.Button',
    alias: 'widget.accesskey_button',

    accesskey: null,

    beforeRender: function() {
        var me = this, pat, rep, key;

        if (me.accesskey) {
            pat = new RegExp(me.accesskey,'i');
            key = pat.exec(me.text);
            if (key) {
                rep = "<u>" + key + "</u>";
                me.text = me.text.replace(pat, rep);
            }
        }

        me.callParent();
    }
});

Ext.define('eXe.view.ui.menuitem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.accesskey_menuitem',

    accesskey: null,

    beforeRender: function() {
        var me = this, pat, rep, key, keymap;

        if (me.accesskey) {
            pat = new RegExp(me.accesskey,'i');
            key = pat.exec(me.text);
            if (key) {
	            rep = "<u>" + key + "</u>";
	            me.text = me.text.replace(pat, rep);
            }
	        keymap = new Ext.util.KeyMap({
	            target: me.up().el,
	            binding: {
	                key: me.accesskey,
	                fn: function() {
                        if (me.menu) {
                            me.activate();
                            me.expandMenu(0);
                            me.up().on({'beforeshow': function () { me.deactivate(); } });
                        }
                        else
                            me.onClick(Ext.EventObject);
                    },
	                defaultEventAction: 'stopEvent'
	            }
	        });
        }
        me.callParent();
    }
});

Ext.define('eXe.view.ui.editToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.edittoolbar',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
					{
					    xtype: 'button',
					    text: _('Open'),
					    accesskey: 'o',
					    tooltip: 'Ctrl+O',
					    icon: '/images/stock-open.png', //Added
					    itemId: 'file_open'
					},
					{
					    xtype: 'button',
					    text: _('Save'),
					    accesskey: 's',
					    tooltip: 'Ctrl+S',
					    icon: '/images/document-save.png',
					    itemId: 'file_save'
					},
					
					{
						xtype: 'accesskey_button',
		                text: _('Preview'),
		                itemId: 'preview_dropdown',
		                icon: '/images/smartphone.png', 
		                menu: {
		                	xtype: "menu",
		                	items: [
									{
									    xtype: 'accesskey_menuitem',
									    itemId: 'tools_preview_smartphone',
									    icon: '/images/smartphone.png',
									    accesskey: 'm',
									    text: _('Preview Smartphone')
									},
									{
		                                xtype: 'accesskey_menuitem',
		                                itemId: 'tools_preview_featurephone',
		                                icon: '/images/featurephone.png',
		                                accesskey: 'm',
		                                text: _('Preview Feature Phone')
		                            },
		                            {
		                                xtype: 'accesskey_menuitem',
		                                itemId: 'tools_preview',
		                                accesskey: 'v',
		                                icon: '/images/globe-icon.png',
		                                text: _('Preview Website')
		                            },
		                	        ]
		                }
					},
					{ 
		                xtype: 'button',
		                itemId: 'tools_idevicep',
		                icon: '/images/plusbutton.png',
		                accesskey: 'w',
		                text: _('Add Widget'),
		                height: 30	
		            },
		            {
		            	xtype: 'button',
		            	text: _('Readability'),
		            	itemId: "toolbar_readability",
		            	icon: "/images/readability.png"
		            },
                    {
                        xtype: 'button',
                        text: _('Publish via Ustad Mobile'),
                        //accesskey: 'x',
                        icon: '/images/icon-16-vldpi.png', //Added
                        itemId: 'export_ustadmobile'
                    },
                    {
                        xtype: 'button',
                        text: _('Start Page'),
                        //accesskey: 'x',
                        icon: '/images/tools-wizard-2.png', //Added
                        itemId: 'tools_wizard'
                    }
            ]
        });

        me.callParent(arguments);
    }
});
