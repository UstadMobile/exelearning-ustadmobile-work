'''
Created on Nov 10, 2013

@author: mike
'''
import threading
import subprocess
from exe                         import globals as G

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
            #if line == '' and wtkProcess.poll() != None:
            #    print "WTKProcess is over"
            #    break
            
            if foundStorageRoot is False:
                if line[0:len(storageHintString)] == storageHintString:
                    destDir = line[len(storageHintString):].strip()
                    foundStorageRoot = True
                    #now we should copy the directory
                    
            if line is None:
                break
    
        print "Finished executing WTK Emulator"
        
    