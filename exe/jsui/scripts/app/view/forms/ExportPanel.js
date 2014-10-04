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

Ext.define('eXe.view.forms.ExportPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.export',

    requires: ['eXe.view.forms.HelpContainer'],
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,            
            items: [
                {
                    xtype: 'fieldset',
                    title: _('Global Options'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'combobox',
                                inputId: 'pp_exportMetadataType',
                                labelWidth: 150,
                                fieldLabel: _('Metadata Type'),
                                store: [
                                      ["DC", _("Dublin Core")],
                                      ["LOM", _("LOM v1.0")],
                                      ["LOMES", _("LOM-ES v1.0")]
                                ],
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Metadata Type'),
                                anchor: '100%'
                            },
                            flex: 0,
                            help: _('Metadata Type')
                        },{
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
                                inputId: 'pp_exportSource',
                                boxLabel: _('Create editable export?'),
                                inputValue: true,
                                uncheckedValue: false,
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Checking this option, the exported component will be editable with eXeLearning.')
                            },
                            flex: 0,
                            help: _('Checking this option, the exported component will be editable with eXeLearning.')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
		    // JRF - bug no. 2009 (https://forja.cenatic.es/tracker/?func=detail&atid=883&aid=2009&group_id=197)
                    // title: _('SCORM Options (1.2, 2004 and Agrega)'),
		    title: _('SCORM Options (1.2 and 2004)'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
                                inputId: 'pp_scolinks',
                                boxLabel: _('Add Previous/Next links within SCOs?'),
                                inputValue: true,
                                uncheckedValue: false,
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Checking this box will cause eXe to add Previous and Next links to individual pages within your SCO. The LMS will also still add this kind of functionality.')
                            },
                            flex: 0,
                            help: _('Checking this box will cause eXe to add Previous and Next links to individual pages within your SCO.  This requires a non-standard extension to SCORM 1.2 and is only known to work with some versions of Moodle.')
                        },{
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
                                inputId: 'pp_scowsinglepage',
                                boxLabel: _('Include Single Page export file?'),
                                inputValue: true,
                                uncheckedValue: false,
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Checking this option the exported SCORM file will include a file named "singlepage_index.html" containing the result of exporting this eXe package as a single page.')
                            },
                            flex: 0,
                            help: _('Checking this option the exported SCORM file will include a file named "singlepage_index.html" containing the result of exporting this eXe package as a single page.')
                        },{
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
                                inputId: 'pp_scowwebsite',
                                boxLabel: _('Include Web Site export files?'),
                                inputValue: true,
                                uncheckedValue: false,
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Checking this option the exported SCORM file will include the result of exporting this eXe package as Web Site. All the html files will have the "website_" prefix to differentiate them from their SCORM equivalent.')
                            },
                            flex: 0,
                            help: _('Checking this option the exported SCORM file will include the result of exporting this eXe package as Web Site. All the html files will have the "website_" prefix to differentiate them from their SCORM equivalent.')
                        }
                    ]
                },
             
                {
                    xtype: 'fieldset',
                    title: _('Ustad Mobile'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
                                inputId: 'pp_ustadMobileAutoOpen',
                                boxLabel: _('Auto open first page'),
                                inputValue: true,
                                uncheckedValue: false,
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            flex: 0,
                            help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                        },
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'combobox',
                                inputId: 'pp_ustadMobileImageResizeStrategy',
                                labelWidth: 150,
                                fieldLabel: _('Default Image Resize Strategy'),
                                store: [
                                      ["scalefit", _("Scale to fit")],
                                      ["stretch", _("Stretch")],
                                      ["none", _("None")]
                                ],
                                dirtyCls: 'property-form-dirty',
                                tooltip: _('Metadata Type'),
                                anchor: '100%'
                            },
                            flex: 0,
                            help: _('Metadata Type')
                        },
                        {
                            xtype: 'fieldset',
                            title: _('Audio Formats'),
                            margin: 10,
                            items
                            : [
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileAudioWAV',
                                    boxLabel: _('WAV'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include WAV audio : used for emulator on computer')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileAudioMP3',
                                    boxLabel: _('MP3'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include MP3: used on most phones')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileAudioOGG',
                                    boxLabel: _('OGG'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include OGG: free and open source audio codec')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: _('Video Formats'),
                            margin: 10,
                            items
                            : [
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileVideoMPG',
                                    boxLabel: _('MPEG'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include MPEG video : used for emulator on computer')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileVideoMP4',
                                    boxLabel: _('MP4'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include MP4: used on most phones')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileVideoOGV',
                                    boxLabel: _('OGV'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include OGV: free and open source video codec')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileVideo3GP',
                                    boxLabel: _('3GP'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include 3GP: used on basic feature phones')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: _('Pre Resized Images'),
                            margin: 10,
                            items
                            : [
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileIncRes100x100',
                                    boxLabel: _('100x100'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include WAV audio : used for emulator on computer')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileIncRes320x240',
                                    boxLabel: _('320x240'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include MP3: used on most phones')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileIncRes240x320',
                                    boxLabel: _('240x320'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include OGG: free and open source audio codec')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileIncRes640x480',
                                    boxLabel: _('640x480'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include OGG: free and open source audio codec')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            },
                            {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'checkboxfield',
                                    inputId: 'pp_ustadMobileIncRes480x640',
                                    boxLabel: _('480x640'),
                                    inputValue: true,
                                    uncheckedValue: false,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Include OGG: free and open source audio codec')
                                },
                                flex: 0,
                                help:_('If this is checked when the book is first opened instead of showing the table of contents the first page will open')
                            }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    inputId: 'pp_inlineImageResizeFormula',
                    fieldLabel: _('HTML Inline image resize formula'),
                    tooltip: _('This is a python expression evaluated to determine what the size of an image will be when it appears in an HTML area on the device'),
                    anchor: '100%'
                },
                {
                    xtype: 'button',
                    text: _('Save'),
                    margin: 10,
                    itemId: 'save_properties'
                },
                {
                    xtype: 'button',
                    text: _('Clear'),
                    itemId: 'clear_properties',
                    margin: 10
                },
                {
                    xtype: 'button',
                    text: _('Reset'),
                    itemId: 'reset_properties',
                    margin: 10
                }
            ]
        });

        me.callParent(arguments);
    }

});
