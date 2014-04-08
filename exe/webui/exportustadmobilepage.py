# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
The exportustadmobilepage is responsible for managing eXe wizard
"""

import logging
import json
from twisted.web.resource      import Resource
from exe.webui.renderable      import RenderableResource
import mywebbrowser
from exe.engine.path import Path
import os.path
import re
import subprocess
import dbus

#import win32api #For usb detection in windows.


log = logging.getLogger(__name__)

class ExportUstadMobilePage(RenderableResource):
    """
    The exportustadmobilepage is responsible for managing exportustadmobilep
    """
    name = 'exportustadmobilep'
    
    browsersAvalaibles = []

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)


    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)
    
    def convert_bytes(self, Filebytes):
        Filebytes = float(Filebytes)
        if Filebytes >= 1099511627776:
            terabytes = Filebytes / 1099511627776
            size = '%.2fT' % terabytes
        elif Filebytes >= 1073741824:
            gigabytes = Filebytes / 1073741824
            size = '%.2fG' % gigabytes
        elif Filebytes >= 1048576:
            megabytes = Filebytes / 1048576
            size = '%.2fM' % megabytes
        elif Filebytes >= 1024:
            kilobytes = Filebytes / 1024
            size = '%.2fK' % kilobytes
        else:
            size = '%.2fb' % bytes
        return size
    
    
    def render_GET(self, request):
        """Render the exportustadmobilep"""
        
        log.debug("render_GET")
        #print("render_GET");
        #If Linux
        bus = dbus.SystemBus()
        ud_manager_obj = bus.get_object("org.freedesktop.UDisks", "/org/freedesktop/UDisks")
        ud_manager = dbus.Interface(ud_manager_obj, 'org.freedesktop.UDisks')
        #print("Printing all the usb devices found, one by one:")
        new_data = []
        for dev in ud_manager.EnumerateDevices():
                    device_obj = bus.get_object("org.freedesktop.UDisks", dev)
                    device_props = dbus.Interface(device_obj, dbus.PROPERTIES_IFACE)
                    current_vendor = device_props.Get('org.freedesktop.UDisks.Device', "DriveVendor")
                    current_path = device_props.Get('org.freedesktop.UDisks.Device', "DeviceMountPaths")
                    #print device_props.Get('org.freedesktop.UDisks.Device', "DriveSerial")
                    current_size = device_props.Get('org.freedesktop.UDisks.Device', "PartitionSize")
                        
                    try:
                        current_path_string = current_path[0]
                        if(len(current_path_string) > 3):
                            #print current_path_string
                            #print current_vendor
                            #print current_size
                            #Add these values to the JSON
                            #current_capacity = convert_bytes(self, current_size)
                            Filebytes = float(current_size)
                            if Filebytes >= 1099511627776:
                                terabytes = Filebytes / 1099511627776
                                size = '%.2fTB' % terabytes
                            elif Filebytes >= 1073741824:
                                gigabytes = Filebytes / 1073741824
                                size = '%.2fGB' % gigabytes
                            elif Filebytes >= 1048576:
                                megabytes = Filebytes / 1048576
                                size = '%.2fMB' % megabytes
                            elif Filebytes >= 1024:
                                kilobytes = Filebytes / 1024
                                size = '%.2fKB' % kilobytes
                            else:
                                size = '%.2fb' % bytes
                            new_data.append({'removabledrivepath': current_path_string, 'removabledrivevendor' : current_vendor, 'removabledrivesize' : size})
                            #print json.dumps(new_data)
                    except IndexError:
                        a="x"

        return json.dumps(new_data) 
        
        #If OSX
        
        #If Win32
        
        
    def render_POST(self, request):
        """
        function replaced by nevow_clientToServerEvent to avoid POST message
        """
        log.debug("render_POST " + repr(request.args))
        data = {}
        try:
            locale = request.args['locale'][0]
            self.config.locale = locale
            self.config.locales[locale].install(unicode=True)
            self.config.configParser.set('user', 'locale', locale)
            internalAnchors = request.args['internalAnchors'][0]
            self.config.internalAnchors = internalAnchors
            self.config.configParser.set('user', 'internalAnchors', internalAnchors)
            browser = request.args['browser'][0]
            if browser == "None":
                browser = None
            try:
                self.config.browser = mywebbrowser.get(browser)
            except Exception as e:
                browser_path = Path(browser)
                if browser_path.exists():
                    mywebbrowser.register('custom-browser' , None, mywebbrowser.BackgroundBrowser(browser_path.abspath()), -1)
                    self.config.browser = mywebbrowser.get('custom-browser')
                else:
                    raise e
            self.config.configParser.set('system', 'browser', browser)
            showWizardOnStart = request.args['showWizardOnStart'][0]
            self.config.showWizardOnStart = showWizardOnStart
            self.config.configParser.set('user', 'showWizardOnStart', showWizardOnStart)
        except Exception as e:
            log.exception(e)
            return json.dumps({'success': False, 'errorMessage': _("Failed to save preferences wizard")})
        return json.dumps({'success': True, 'data': data})

    def getSelectedLanguage(self):
        """
        It would be the TinyMCE lang
        """
        return self.config.locale
