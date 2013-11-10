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
from exe                         import globals as G
from exe.engine.path          import Path, TempDirPath

class WTKPreviewThread(threading.Thread):
    '''
    classdocs
    '''


    def __init__(self, exportedPath):
        '''
        Constructor
        '''
        threading.Thread.__init__(self)
        self.exportedPath = exportedPath
        
    def run(self):
        jadPath = G.application.config.webDir/"templates"/"EXEMobile2.jad"
        cmd = [G.application.config.wtkemulatorpath, "-Xdescriptor:%s" % jadPath, "-Xdomain:manufacturer"]
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
                    destDirPath = Path(destDir)/"filesystem"/"root1"/"exepreview"
                    srcPathFiles = self.exportedPath/"nokia"
                    
                    if not destDirPath.isdir():
                        destDirPath.makedirs()
                    
                    srcPathFiles.copyfiles(destDirPath)
                    
                    wtkProcess.wait()
                    break
                    
                    #now we should copy the directory
                    
            if line is None:
                break
    
        print "Finished executing WTK Emulator"
        
    