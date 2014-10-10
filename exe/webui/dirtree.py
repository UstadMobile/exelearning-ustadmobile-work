# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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

import sys
import logging
from exe.webui.renderable import RenderableResource
from twisted.web.resource import Resource
from exe.engine.path import Path
from exe import globals as G
from exe.engine.config import Config
from urllib import unquote
import json
import mimetypes
import os
from exe.webui.webservice.exebackendservice import EXEBackEndService

log = logging.getLogger(__name__)

if sys.platform[:3] == "win":
    FILE_ATTRIBUTE_DIRECTORY = 16
    FILE_ATTRIBUTE_REPARSE_POINT = 1024
    REPARSE_FOLDER = (FILE_ATTRIBUTE_DIRECTORY | FILE_ATTRIBUTE_REPARSE_POINT)
    import string
    from win32api import SetErrorMode
    SetErrorMode(1)
    from win32file import GetFileAttributes, GetLogicalDrives, GetDriveType


def iswinlink(fpath):
    if sys.platform[:3] == "win":
        if GetFileAttributes(fpath) & REPARSE_FOLDER == REPARSE_FOLDER:
            return True

    return False


def get_drives():
    drives = []
    bitmask = GetLogicalDrives()
    for letter in string.uppercase:
        if bitmask & 1:
            drives.append(letter + ":")
        bitmask >>= 1

    return drives


def getname(d):
    if sys.platform[:3] == "win" and d.isdir():
        from win32com.shell.shell import SHGetFileInfo

        return Path(SHGetFileInfo(d.abspath(), 0, 0x200)[1][3])
    return d.name


def is_readable(d):
    if sys.platform[:3] == "win" and d.isdir():
        try:
            d.listdir()
        except:
            return False
        return True
    return d.access(os.R_OK)


def is_writable(d):
    if sys.platform[:3] == "win" and d.isdir():
        import tempfile
        try:
            tempfile.TemporaryFile(dir=d.abspath())
        except:
            return False
        return True
    return d.access(os.W_OK)


class DirTreePage(RenderableResource):
    name = "dirtree"

    def __init__(self, parent, package=None, config=None):
        RenderableResource.__init__(self, parent, package, config)

    def getChild(self, path, request):
        if path == "":
            return self
        return Resource.getChild(self, path, request)

    def get_dirpath_for_request(self, request, dirpath):
        """
        Return the dirpath adjusted if required for the session username
        e.g. /path/to/userfiles/username
        """
        if G.application.config.appMode == Config.MODE_DESKTOP:
            #get the user root from the webservice
            return dirpath
        else:
            username = request.getSession().webservice_user
            return  EXEBackEndService.get_instance(\
                               ).adjust_relative_path_for_user(
                                               username, dirpath)
            
    def abs_to_user_path(self, abspath, request):
        """
        Return an absolute path to a relative path for the user
        if running in WebAppMode, otherwise return the original
        
        Parameters
        abspath : str
            The absolute path to adjust
        request : Request
            Request object used to get session username
        """
        if G.application.config.appMode != Config.MODE_WEBAPP:
            return abspath
        else:
            username = request.getSession().webservice_user
            return EXEBackEndService.get_instance(\
                      ).abs_path_to_user_path(username, abspath)

    def render(self, request):
        if "sendWhat" in request.args:
            if request.args['sendWhat'][0] == 'dirs':
                #Because this might be absolute and mess up...
                
                
                path_dir_str = unquote(request.args['node'][0].decode('utf-8'))
                path_dir_str = self.get_dirpath_for_request(
                                                request, path_dir_str)
                pathdir = Path(path_dir_str)
                
                
                l = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for d in get_drives():
                        try:
                            if is_readable(Path(d)):
                                icon = None
                            else:
                                icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                            l.append({"realtext": d, "text": d, "id": d + '\\', "icon": icon})
                        except:
                            pass
                else:
                    for d in pathdir.dirs():
                        try:
                            if not d.name.startswith('.') or sys.platform[:3] == "win":
                                if not iswinlink(d.abspath()):
                                    if is_readable(d):
                                        icon = None
                                    else:
                                        icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                                    l.append({"realtext": d.name, "text": getname(d), "id": self.abs_to_user_path(d.abspath(), request), "icon": icon})
                        except:
                            pass
            elif request.args['sendWhat'][0] == 'both':
                req_pathdir_str = unquote(request.args['dir'][0].decode('utf-8'))
                pathdir_str = self.get_dirpath_for_request(
                                               request, req_pathdir_str)
                pathdir = Path(pathdir_str)
                items = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for drive in get_drives():
                        d = Path(drive + '\\')
                        items.append({"name": drive, "realname": drive + '\\', "size": 0, "type": 'directory', "modified": 0,
                                      "is_readable": is_readable(d),
                                      "is_writable": is_writable(d)})
                else:
                    parent = pathdir.parent
                    if (parent == pathdir):
                        realname = '/'
                    else:
                        realname = self.abs_to_user_path(parent.abspath(), request)
                    items.append({"name": '.', "realname": self.abs_to_user_path(pathdir.abspath(), request), "size": pathdir.size, "type": "directory", "modified": int(pathdir.mtime),
                                  "is_readable": is_readable(pathdir),
                                  "is_writable": is_writable(pathdir)})
                    items.append({"name": '..', "realname": realname, "size": parent.size, "type": "directory", "modified": int(parent.mtime),
                                  "is_readable": is_readable(parent),
                                  "is_writable": is_writable(parent)})
                    try:
                        for d in pathdir.listdir():
                            try:
                                if not d.name.startswith('.') or sys.platform[:3] == "win":
                                    if not iswinlink(d.abspath()):
                                        if d.isdir():
                                            pathtype = "directory"
                                        elif d.isfile():
                                            if is_readable(d):
                                                pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                                            else:
                                                pathtype = "file"
                                        elif d.islink():
                                            pathtype = "link"
                                        else:
                                            pathtype = "None"
                                        items.append({"name": getname(d), "realname": self.abs_to_user_path(d.abspath(), request), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                          "is_readable": is_readable(d),
                                          "is_writable": is_writable(d)})
                            except:
                                pass
                        #this was before just pathdir - check this
                        if G.application.config.appMode != Config.MODE_WEBAPP:
                            G.application.config.lastDir = pathdir
                        else:
                            self.session.webservice_config.lastDir = req_pathdir_str
                    except:
                        pass
                l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        elif "query" in request.args:
            query = request.args['query'][0]
            path_dir_str = unquote(request.args['dir'][0].decode('utf-8'))
            path_dir_str = self.get_dirpath_for_request(request,path_dir_str)
            pathdir = Path(path_dir_str)
            items = []
            if pathdir == '/' and sys.platform[:3] == "win":
                for d in get_drives():
                    items.append({"name": d, "realname": d + '\\', "size": 0, "type": 'directory', "modified": 0})
            else:
                parent = pathdir.parent
                if (parent == pathdir):
                    realname = '/'
                else:
                    realname = self.abs_to_user_path(parent.abspath(), request)
                for d in pathdir.listdir():
                    try:
                        if d.isdir():
                            pathtype = "directory"
                        elif d.isfile():
                            if is_readable(d):
                                pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                            else:
                                pathtype = "file"
                        elif d.islink():
                            pathtype = "link"
                        else:
                            pathtype = "None"
                        if d.name.startswith(query):
                            items.append({"name": getname(d), "realname": self.abs_to_user_path(d.abspath(), request), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                          "is_readable": is_readable(d),
                                          "is_writable": is_writable(d)})
                    except:
                        pass

            l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        elif "uploadfileaction" in request.args:
            filename = request.args["upload_file_name"][0]
            current_dir = request.args["upload_current_dir"][0]
            save_path = os.path.join(current_dir, filename)
            file_path =  self.get_dirpath_for_request(
                                                request, save_path)
            file = open(file_path, "wb")
            file.write(request.args['upload_file'][0])
            file.close()
            
            result = {"success" : True}
            return json.dumps(result).encode('utf-8')
        return ""
