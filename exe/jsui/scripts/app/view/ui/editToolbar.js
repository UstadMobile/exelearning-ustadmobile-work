// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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
					    icon: '/images/stock-save.png', //Added
					    itemId: 'file_save'
					},
					{
                        xtype: 'button',
                        itemId: 'tools_preview_smartphone',
                        icon: '/images/smartphone.png',
                        accesskey: 'm',
                        text: _('Preview Smartphone')
                    },
                    /*
					{
                        xtype: 'button',
                        text: _('Export to Ustad Mobile (Disk)'),
                        accesskey: 'x',
                        icon: '/images/icon-16-vldpi.png', //Added
                        itemId: 'file_export_mxml'
                    },
                    */
                    {
                        xtype: 'button',
                        text: _('Export to Ustad Mobile'),
                        //accesskey: 'x',
                        icon: '/images/icon-16-vldpi.png', //Added
                        itemId: 'export_ustadmobile'
                    },
                    {
                        xtype: 'button',
                        text: _('Wizard'),
                        //accesskey: 'x',
                        icon: '/images/tools-wizard-2.png', //Added
                        itemId: 'tools_wizard'
                    },
		            {
		                xtype: 'accesskey_button',
		                text: _('Help'),
		                itemId: 'help',
		                icon: '/images/help.gif', 
		                accesskey: 'h',
		                menu: {
		                    xtype: 'menu',
		                    items: [
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_tutorial',
		                            accesskey: 't',
		                            text: _('eXe Tutorial')
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_manual',
		                            accesskey: 'm',
		                            text: _('eXe Manual')
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_notes',
		                            accesskey: 'n',
		                            text: _('Release Notes')
		                        },
		                        {
		                            xtype: 'menuseparator'
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_website',
		                            accesskey: 'w',
		                            text: _('eXe Web Site')
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_issue',
		                            accesskey: 'r',
		                            text: _('Report an Issue')
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_forums',
		                            accesskey: 'f',
		                            text: _('eXe Forums')
		                        },
		                        {
		                            xtype: 'menuseparator'
		                        },
		                        {
		                            xtype: 'accesskey_menuitem',
		                            itemId: 'help_about',
		                            accesskey: 'a',
		                            text: _('About eXe')
		                        }
		                    ]
		                }
		            },
		           
		            { //Added for Wizard test
		                xtype: 'button',
		                itemId: 'tools_idevicep',
		                icon: '/images/plusbutton.png',
		                accesskey: 'w',
		                text: _('Add IDevices'),
		                height: 30	//30 is default
		            },
		            /*
		            {
                        xtype: 'button',
                        text: _('UMCloud'),
                        //accesskey: 'x',
                        icon: '/images/weather-clouds-2.png', //Added
                        itemId: 'tools_umcloud'
                    },
                    */
                    {
                        xtype: 'button',
                        text: _('UMCloud'),
                        //accesskey: 'x',
                        icon: '/images/weather-clouds-2.png', //Added
                        itemId: 'toolbar_umcloud_login'
                    },
               
            ]
        });

        me.callParent(arguments);
    }
});
