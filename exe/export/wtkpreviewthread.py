#
# wtkpreviewthread.py Copyright (C) Toughra Technologies FZ LLC
#
# eXe
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

'''
Designed to launch the Oracle Wireless Toolkit (WTK) J2ME emulator
It will launch it from the configured path (config.wtkemulatorpath)
and then read the stdout to figure out the storage path of the emualator

It will copy the contents of the package just exported to
storagepath/filesystem/root1/exepreview


@author: Mike Dawson <mike@toughra.com>
'''
import threading
import subprocess
import os
from exe                         import globals as G
from exe.engine.path          import Path, TempDirPath
import logging


class WTKPreviewThread(threading.Thread):
    '''
    classdocs
    '''


    """
    Where exportedPath is the directory it got exported to (e.g. /tmp/foo)
    self.packageName is the name of the package itself
    """
    def __init__(self, exportedPath, packageName):
        '''
        Constructor
        '''
        threading.Thread.__init__(self)
        self.exportedPath = exportedPath
        self.packageName = packageName
        
    def copyFilesToPhoneStorage(self, phoneStoragePath):
        destDir = phoneStoragePath/self.packageName
        if destDir.isdir():
            destDir.rmtree()
        
        self.exportedPath.copytree(destDir)
    
    """
    Run using Sun WTK3.4
    """
    def runWTK3(self):
        log = logging.getLogger(__name__)
        log.info("Starting WTK3")
        
        javaMePath = WTKPreviewThread.winGetJavaMEPath()
        emulatorPath = javaMePath + "\\bin\\emulator"
        print "Emualtor path = " + emulatorPath
        jarPath = G.application.config.webDir/"templates"/"EXEMobile2.jar"

        phoneName = "JavaMEPhone1"
        storagePath = os.path.expanduser("~") + os.path.sep + "javame-sdk"  + os.path.sep + "3.4" \
            + os.path.sep + "work" + os.path.sep + phoneName \
            + os.path.sep + "appdb" + os.path.sep + "filesystem" + os.path.sep +  "root1"
        
        self.copyFilesToPhoneStorage(Path(storagePath))
        
        cmd = [emulatorPath, "-Xdomain:manufacturer", "-Xdescriptor:%s" % jarPath, "-Dcom.ustadmobile.packagedir=%s" % self.packageName]
        subprocess.call(cmd) 

    """
    Run using Sun WTK 2.5.2 - this is what we have on Linux...
    """
    def runWTK25(self):
        jadPath = G.application.config.webDir/"templates"/"EXEMobile2.jad"
        
        
        cmd = [G.application.config.wtkemulatorpath, "-Xdescriptor:%s" % jadPath, "-Xdomain:manufacturer", "-Dcom.ustadmobile.packagedir=%s" % self.packageName]
        wtkProcess = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        foundStorageRoot = False
        
        #the line WTK will output to tell us where storage is
        storageHintString = "Running with storage root "
        
        while True:
            line = wtkProcess.stdout.readline()
            
            if foundStorageRoot is False:
                if line[0:len(storageHintString)] == storageHintString:
                    foundStorageRoot = True
                    destDir = line[len(storageHintString):].strip()
                    phoneStorageDir = Path(destDir)/"filesystem"/"root1"
                    self.copyFilesToPhoneStorage(phoneStorageDir)
                    
                    wtkProcess.wait()
                    break
                    
                    #now we should copy the directory
            if line is None:
                    
                break
    
        print "Finished executing WTK Emulator"
        
    def run(self):
        if os.name == "posix":
            self.runWTK25()
        elif os.name[0:3] == "win" or os.name == "nt":
            self.runWTK3()
    
    """
    See if this setup actually can run J2ME
    """
    @classmethod
    def canRunWTK(cls):
        if os.name[0:3] == "win" or os.name == "nt":
            j2mePath = cls.winGetJavaMEPath()
            if j2mePath is None:
                return False
            else:  
                return True
        elif os.name == "posix":
            return True  
        else:
            return False
    
    """
    Use windows registry to find the Java Micro Edition Path
    """
    @classmethod
    def winGetJavaMEPath(cls):
        try:
            from  _winreg import *
            aReg = ConnectRegistry(None,HKEY_LOCAL_MACHINE)
            aKey = OpenKey(aReg, r"SOFTWARE\Oracle America, Inc.\Java(TM) ME Platform SDK 3.4")
            if aKey:
                #as per python docs tuple comes back with the value itself in pos 0
                #see http://docs.python.org/2/library/_winreg.html
                dirPath = QueryValueEx(aKey, "InstallDir")
                return dirPath[0]
            else:
                return None
        except:
            print "Exception trying to find Java ME 3.4 here"
            return None
    