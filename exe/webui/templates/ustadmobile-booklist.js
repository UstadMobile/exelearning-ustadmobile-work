/*
 <!-- This file is part of Ustad Mobile.  
 
 Ustad Mobile Copyright (C) 2011-2013 Toughra Technologies FZ LLC.
 
 Ustad Mobile is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version with the following additional terms:
 
 All names, links, and logos of Ustad Mobile and Toughra Technologies FZ 
 LLC must be kept as they are in the original distribution.  If any new
 screens are added you must include the Ustad Mobile logo as it has been
 used in the original distribution.  You may not create any new 
 functionality whose purpose is to diminish or remove the Ustad Mobile 
 Logo.  You must leave the Ustad Mobile logo as the logo for the 
 application to be used with any launcher (e.g. the mobile app launcher).  
 
 If you want a commercial license to remove the above restriction you must
 contact us.  
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 
 Ustad Mobile is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 
 
 
 This program is free software.  It is licensed under the GNU GENERAL PUBLIC LICENSE ( http://www.gnu.org/copyleft/gpl.html ) with the following 
 
 GPL License Additional Terms
 
 All names, links, and logos of Ustad Mobile and Toughra Technologies FZ LLC must be kept as they are in the original distribution.  If any new screens are added you must include the Ustad Mobile logo as it has been used in the original distribution.  You may not create any new functionality whose purpose is to diminish or remove the Ustad Mobile Logo.  You must leave the Ustad Mobile logo as the logo for the application to be used with any launc   her (e.g. the mobile app launcher).  
 
 If you need a commercial license to remove these restrictions please contact us by emailing info@ustadmobile.com 
 
 -->
 
 */

/*
 Ustad Mobile Book List will scan a list of root directories for sub directories.
 Each sub directory will be queried for a marker file.  If that file exists it will
 be considered an EXE content directory and it will be displayed in a JQuery Mobile 
 UI list that the user can open a chosen content entry.


 Callback hell scheme is as follows:

  1. Call onBLDeviceReady on device ready: 
    foldersToScan is set to an array depending on the platform, does first call
    of populateNextDir
  2. populateNextDir will go through foldersToScan incrementing currentFolderIndex,
        call populate
  3. populate will call window.requestFileSystem for the path; if successful 
     calls dirReader, otherwise failbl (which will call populateNextDir)
     
     -> dirReader: calls either successDirectoryReader or failDirectoryReader - request entries
            -> successDirectoryReader: will put the paths in the directory into
                an array called *currentEntriesToScan*, then call 
                scanNextDirectoryIndex:

                -> findEXEFileMarkerSuccess : Put in coursesFound array
                -> findEXEFileMarkerFail : call scanNextDirectoryIndex to look at next dir

            -> failDirectoryReader

     -> failbl: simply logs and calls populateNextDir
    
 */

/*
 The file to look for in a sub directory to determine if it is EXE
 content or not
 */

/**
 * 
 * @module UstadMobileBookList
 */
var UstadMobileBookList;

/**
 * Stored instance of booklist object
 */
var ustadMobileBookListInstance;

/**
 * @class UstadMobileBookList
 * @constructor
 */
function UstadMobileBookList() {
    this.exeLastPage = "../";
    this.exeMenuPage = "ustadmobile_menupage_app.html";
    this.exeMenuPage2 = "ustadmobile_menupage_content.html";
    this.globalXMLListFolderName = "all";
    this.currentBookPath = "";
    this.exeContentFileName = "exetoc.html";
    this.jsLoaded = "false";


    //The file that should be present in a directory to indicate this is exe content
    //var exeFileMarker = "index.html";
    this.exeFileMarker = "exetoc.html";

    //not really used
    this.currentPath = "/ext_card/ustadmobile";
    this.umCLPlatform = null;
    this.foldersToScan = null;

    /* Folders that will be scanned */
    this.foldersToScan = [];
    
    //the index of foldersToScan which we are currently going through
    this.currentFolderIndex = 0;

    //the dir entries that we found inside currentFolderIndex
    this.currentEntriesToScan = null;

    //the current index number we are working on from currentEntriesToScan
    this.currentEntriesIndex = 0;

    //Reference to filesystem object
    this.fileSystem = null;


    /** Courses found */
    this.coursesFound = [];

    this.allBookFoundCallback = null;

    //track what we are waiting to look at
    this.fileSystemPathWaiting = null;
}

UstadMobileBookList.getInstance = function() {
    if(ustadMobileBookListInstance == null) {
        ustadMobileBookListInstance = new UstadMobileBookList();
    }
    
    return ustadMobileBookListInstance;
};


UstadMobileBookList.prototype = {
    
    /** 
      * Will run a scan when device is ready to do so... if running in Cordova
      * will wait for cordovaonready
      *
      *@method onBookListLoad
      */
    queueScan: function(queueCallback) {
        console.log("Checking if device is ready...");
        if(window.cordova) {
            debugLog("Running on mobile device needing listener and not desktop..");
            document.addEventListener("deviceready", 
                function() {
                    UstadMobileBookList.getInstance().scanCourses(queueCallback);
                }, false);
        }else {
            debugLog("Desktop Edition: ustadmobile-booklist.js: Triggering device ready..");
            UstadMobileBookList.getInstance().scanCourses(queueCallback);
        }
    },
    
    /**
     * @method scanCourses
     * @param {function} callback - callback to run when all scanning is done
     */
    scanCourses: function(callback) {
        var umBookListObj = UstadMobileBookList.getInstance();
        if(typeof callback !== "undefined" && callback != null) {
            umBookListObj.allBookFoundCallback = callback;
        }
        
        if (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("BB10") !== -1) {
            umBookListObj.umCLPlatform = "bb10";
            console.log("Detected Blackberry 10 device in Course List Scan.");
            blackberry.io.sandbox = false;
            var bbumfolder = blackberry.io.SDCard + "/ustadmobileContent";
            console.log("Added: " + bbumfolder + " to UM Course List Folders To Scan.");
            umBookListObj.foldersToScan = [
                "/ext_card/ustadmobile", "/ext_card/ustadmobileContent", 
                "/sdcard/ustadmobile", "/sdcard/ustadmobileContent", 
                "/ustadmobileContent/umPackages/", "/ustadmobileContent/", 
                bbumfolder];
        } else if (navigator.userAgent.indexOf("TideSDK") !== -1) {
            console.log("Desktop detected - TideSDK. ustadmobile-booklist.js . Updating folders to scan..");

            if (window.navigator.userAgent.indexOf("Windows") != -1) {
                console.log("TideSDK: You are using WINDOWS.");
                umBookListObj.foldersToScan = ["/ustadmobileContent", "/ustadmobileContent/umPackages"];
            } else {
                console.log("TideSDK: You are NOT using WINDOWS.");
                umBookListObj.foldersToScan = ["ustadmobileContent", "ustadmobileContent/umPackages"];
            }
        } else if (UstadMobile.getInstance().isNodeWebkit()) {
            umBookListObj.foldersToScan = [UstadMobile.getInstance().contentDirURI]
        }else {
            umBookListObj.foldersToScan = [
                "file:///sdcard/ustadmobileContent",
                "file:///ext_card/ustadmobile", 
                "file:///ext_card/ustadmobileContent", 
                "file:///sdcard/ustadmobile", 
                "file:///ustadmobileContent/umPackages/", 
                "file:///ustadmobileContent/"];
        }

        var usern = localStorage.getItem('username');
        var logome = '';
        if (usern != null)
        {
            logome = x_('Logout');
        }
        else {
            logome = x_('Home');
            usern = x_('Guest');
        }

        $.mobile.loading('show', {
            text: x_('Loading your books..'),
            textVisible: true,
            theme: 'b',
            html: ""});

        var posOfLastSlash = document.location.href.lastIndexOf("/");
        var mainPath = document.location.href.substring(0, posOfLastSlash);
        localStorage.setItem('baseURL', mainPath);

        $("#UMUsername").empty().append();
        $("#UMUsername").append(usern).trigger("create");

        $("#UMLogout").empty().append();
        $("#UMLogout").append(logome).trigger("create");

        $("#UMBookList").empty().append();
        
        umBookListObj.currentEntriesIndex = 0;
        umBookListObj.currentFolderIndex = 0;
        umBookListObj.populateNextDir();
    },
    
    /**
      *Log out function to set localStorage to null (remove) and redirect to 
      *login page from then.
      * @method umLogout    
    */
   umLogout: function() {
       localStorage.removeItem('username');
       localStorage.removeItem('password');
       $.mobile.changePage("index.html"); //BB10 specific changes.
   },
   
   /**
     *Called once a scan of a directory is done - go and look at
     *the next entry from foldersToScan if there are more...
     */
   populateNextDir: function() {
       var umBookListObj = UstadMobileBookList.getInstance();
       if (umBookListObj.currentFolderIndex < umBookListObj.foldersToScan.length) {
           console.log("In populateNextDir: for " 
                   + umBookListObj.currentFolderIndex + " : "
                   + umBookListObj.foldersToScan[umBookListObj.currentFolderIndex]);
           debugLog("Calling to populate the next folder..");
           umBookListObj.populate(
                   umBookListObj.foldersToScan[umBookListObj.currentFolderIndex++]);
       } else {
           console.log("populateNextDir: pos: " + umBookListObj.currentFolderIndex + 
                   "No more folders to scan for ustad mobile packages.");
           $.mobile.loading('hide');
           $("#UMBookList").append("<p><i>Click on Download Courses to get more courses from the online library</i></p>").trigger("create");
           if (umBookListObj.allBookFoundCallback != null) {
               if (typeof umBookListObj.allBookFoundCallback === "function") {
                   umBookListObj.allBookFoundCallback();
               }
           }
       }
   },
   
   /** 
    * When root dir reader fails
    * @param evt Error Object
    * @method failbl
    */
   failbl: function(evt) {
       //debugLog(evt.target.error.code);
       var umBookListObj = UstadMobileBookList.getInstance();
       console.log("Failed to read " + umBookListObj.fileSystemPathWaiting 
               + " at pos: " + umBookListObj.currentFolderIndex);
       //debugLog("Failed "
       umBookListObj.populateNextDir();
   },
   
   
    //Test function for TideSDK to download a file..
    tideSDKDownloadFile: function(path, filename) {
        var httpClient = Ti.Network.createHTTPClient();
        httpClient.open('GET', path);
        httpClient.receive(function(data) {
            var file = Ti.Filesystem.getFile(filename);
            var fileStream = file.open(Ti.Filesystem.MODE_APPEND);
            fileStream.write(data);
            fileStream.close();
            console.log("DONE DONE DONE DONE");
        });
    },
    
    
    //Test function for TideSDK to List all files in root directory..
    tideSDKListRootFiles: function() {
        console.log("TideSDK: Listing all files in Root directory..");

        // For Windows root has to start with /
        // For Linux: root doesn't start with / 
        var rootDir;
        if (window.navigator.userAgent.indexOf("Windows") != -1) {
            console.log("TideSDK: You are using WINDOWS.");
            rootDir = "/";
        } else {
            console.log("TideSDK: You are NOT using WINDOWS.");
            rootDir = "ustadmobileContent"

        }

        var destinationDir = Ti.Filesystem.getFile(rootDir);

        var dir_fofiles = destinationDir.getDirectoryListing();
        var dir_folders = new Array();
        for (var i = 1; i < dir_fofiles.length; i++) {
            console.log("File " + i + ": " + dir_fofiles[i].toString());
        }
    },
    
    /*For Desktop TideSDK Will check if folders exists. Will NOT create new folders if folder doesn't exist.
    //List directory contents within the main directory.
    //If able to list directory contents
    //store contents (directories) in array.
    //Check if directory/exeFileMarker file exists
    //If file exists
    //Append file to html
    //If file does NOT exist
    //check Next directory (populateNextDir())
    */
   tideSDKCheckDir: function(dir) {
       var umBooklistObj = UstadMobileBookList.getInstance();
       //Testing the file system
       umBooklistObj.tideSDKListRootFiles();
       console.log("TideSDK-Moving on from Root test..");

       var destinationDir = Ti.Filesystem.getFile(dir);
       if ((destinationDir.exists() == false)) {
           //alert('We could not find the directory: ' + dir + ' so we must abort.');
           //Y.Global.fire('download:error');
           return;
       } else {
           debugLog("Successfully found Courses Directory: " + dir + " in ustadmobile-booklist.js");


           console.log("TideSDK: Listing all files in the directory: " + dir);
           var dir_fofiles = destinationDir.getDirectoryListing();
           for (var k = 0; k < dir_fofiles.length; k++) {
               console.log("DIR: " + k + " " + dir_fofiles[k].toString());
           }

           var dir_folder_courses = new Array();
           for (var i = 0; i < dir_fofiles.length; i++) {
               //if(dir_fofiles[i].isDirectory()){
               //}
               console.log(" File " + i + ": " + dir_fofiles[i].toString());
               var dir2 = dir_fofiles[i].toString();
               console.log("  dir2" + i + ": " + dir2);
               var dir_folder = Ti.Filesystem.getFile(dir2);

               if (dir_folder.exists() == true && dir_folder.isDirectory() == true) {
                   console.log("TideSDK: Going to check: " + dir2 + '/' 
                           + umBooklistObj.exeFileMarker);
                   var dir_folder_course = Ti.Filesystem.getFile(dir2 + '/' 
                           + umBooklistObj.exeFileMarker);
                   if (dir_folder_course.exists() == true && dir_folder_course.isFile() == true) {

                       var coursePath = dir_folder_course.toString();
                       console.log("TideSDK: Found course folder!: " + dir_folder_course.toString());

                       var coursePathEsc = coursePath.replace(/\\/g, "\\\\");
                       console.log("coursePathEsc: " + coursePathEsc);

                       //Checking full path of course file in TideSDK file system.
                       console.log(" TideSDK: nativePath(): " + dir_folder_course.nativePath());
                       //console.log(" TideSDK: ");

                       var courseNameParts = null;
                       
                       if (window.navigator.userAgent.indexOf("Windows") != -1) {
                           console.log("TideSDK: You are using WINDOWS.");
                           courseNameParts = coursePath.split("\\"); //For Windows

                       } else {
                           console.log("TideSDK: You are NOT using WINDOWS.");
                           courseNameParts = coursePath.split("/"); //For Linux

                       }
                       //var courseNameParts = coursePath.split("\\"); //For Windows
                       //var courseNameParts = coursePath.split("/"); //For Linux
                       //For UNIX and others split by "/"

                       var courseName = courseNameParts[courseNameParts.length - 2];
                       console.log("TideSDK: course Name is: " + courseName);
                       $("#UMBookList").append(
                               "<a onclick='UstadMobileBookList.getInstance().openBLPage(\"" 
                               + coursePathEsc + "\" \, \"normal\" )' href=\"#\" "
                               + "data-role=\"button\" data-icon=\"star\" "
                               + "data-ajax=\"false\">" + courseName 
                               + "</a>").trigger("create");
                   }
               }

           }
       }
   },
   
   /*
    Looks for subdirectories of path that contain exe content - for each
    sub directory will look for the marker file.
    */
   populate: function(pathFrom) {
       debugLog("attempting to populate from: " + pathFrom);
       var umBookListObj = UstadMobileBookList.getInstance();
       try {
           if (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("BB10") !== -1) { //If blackberry 10 device
               blackberry.io.sandbox = false;
               window.webkitRequestFileSystem(window.PERSISTENT, 0, function(fs) {
                   umBookListObj.fileSystem = fs;
                   fs.root.getDirectory(pathFrom, {create: false, exclusive: false}, 
                   umBookListObj.dirReader, umBookListObj.failbl);
               }, umBookListObj.failbl);
           } else if (navigator.userAgent.indexOf("TideSDK") !== -1) {
               console.log("Detected Desktop - TideSDK when checking folders to Scan in ustadmobile-booklist.js . Checking folders now..");
               umBookListObj.tideSDKCheckDir(pathFrom);

               //For now..
               debugLog("Population incomplete for Desktop TideSDK.");
               umBookListObj.populateNextDir();

           }else if(UstadMobile.getInstance().isNodeWebkit()) {
               console.log("Detected NodeWebkit");
               var fs = require("fs");
               console.log("loaded fs");
               var bookListObjInt = umBookListObj;
               fs.readdir(pathFrom, function(err, dirEntries) {
                   if(dirEntries && dirEntries.length > 0) {
                       bookListObjInt.fileSystemPathWaiting = pathFrom;
                       UstadMobileBookList.getInstance().successDirectoryReader(
                               dirEntries);
                   }else {
                       UstadMobileBookList.getInstance().failDirectoryReader(err);
                   }
               });
               
               
           }else {  //If other platforms apart from blackberry 10
               window.resolveLocalFileSystemURL(pathFrom,
                 function(entry){
                     console.log("found" + entry);
                     UstadMobileBookList.getInstance().dirReader(entry);
                 },
                 function(evt) {
                     UstadMobileBookList.getInstance().failbl(evt);
                 }
               );
           }
       } catch (e) {
           //debugLog("populate exception: catch!: " + dump(e));
           debugLog("Populate exception." + dump(e));
           umBookListObj.populateNextDir();
       }
   },
   
   /*
    We have got a dirEntry from populate - now attempt to read entries...
    */
   dirReader: function(dirEntry) {
       var umBookListObj = UstadMobileBookList.getInstance();
       var directoryReader = dirEntry.createReader();
       console.log("dirReader OK for: " + dirEntry.fullPath);
       directoryReader.readEntries(umBookListObj.successDirectoryReader, 
           umBookListObj.failDirectoryReader);
   },

    
    /*
     Called when the filemarker is found - fileEntry represents
     the actual file itself found (e.g. path/exeFileMarker)
     */
    findEXEFileMarkerSuccess: function (fileEntry) {
        var umBookListObj = UstadMobileBookList.getInstance();
        if(UstadMobile.getInstance().isNodeWebkit()) {
            debugLog("NodeWebKit finds content in " + fileEntry);
            var lastSlashPos = fileEntry.lastIndexOf('/');
            var secondLastSlashPos = fileEntry.lastIndexOf('/', lastSlashPos -1);
            var folderName = fileEntry.substring(secondLastSlashPos+1, 
                lastSlashPos);
            var fileFullPath = "file://" + fileEntry;
            var courseEntryObj = new UstadMobileCourseEntry(folderName, "", 
                fileFullPath, null);
            umBookListObj.coursesFound.push(courseEntryObj);
            
            
            $("#UMBookList").append(
                        "<a onclick='UstadMobileBookList.getInstance().openBLPage(\"" 
                        + fileFullPath 
                        + "\" \, \"normal\" )' href=\"#\" data-role=\"button\" "
                        + "data-icon=\"star\" data-ajax=\"false\">" + folderName 
                        + "</a>").trigger("create");
        }else {
            var fileFullPath = fileEntry.toURL();
            debugLog("Found " + fileFullPath + " is an EXE directory - adding...");
            var folderName = fileEntry.getParent();
            fileEntry.getParent(function(parentEntry) {
                debugLog("Got a parent Book directory name");
                debugLog("The full path = " + parentEntry.fullPath);
                folderName = parentEntry.name;
                var courseEntryObj = new UstadMobileCourseEntry(folderName, "",
                    fileFullPath, null);
                umBookListObj.coursesFound.push(folderName);
                
                $("#UMBookList").append(
                        "<a onclick='UstadMobileBookList.getInstance().openBLPage(\"" 
                        + fileFullPath 
                        + "\" \, \"normal\" )' href=\"#\" data-role=\"button\" "
                        + "data-icon=\"star\" data-ajax=\"false\">" + folderName 
                        + "</a>").trigger("create");
            }, function(error) {
                debugLog("failed to get parent directory folderName: " + folderName 
                        + " with an error: " + error);
            }
            );
            debugLog("Before we scan the directory, the number of Books Found is: "
                    + umBookListObj.coursesFound.length);
            
        }
        umBookListObj.scanNextDirectoryIndex();
    },
    
    /*
    exeFileMarker was not found - just go for scanning the next directory
    */
    findEXEFileMarkerFail: function(fileEntry) {
       debugLog("failed to find file marker for " + fileEntry);
       UstadMobileBookList.getInstance().scanNextDirectoryIndex();
    },
    
    /*
    Now we have a directory content reader - for each subdirectory
    we found go and check if it has exeFileMarker or not
    */
   scanNextDirectoryIndex: function() {
       var umBookListObj = UstadMobileBookList.getInstance();
       console.log("\tscanNextDirectoryIndex: " 
               + umBookListObj.currentEntriesIndex);
       if (umBookListObj.currentEntriesIndex < umBookListObj.currentEntriesToScan.length) {
           
           if(UstadMobile.getInstance().isNodeWebkit()) {
               var fs = require("fs");
               
               var pathToCheck = umBookListObj.fileSystemPathWaiting + "/"
                    + umBookListObj.currentEntriesToScan[umBookListObj.currentEntriesIndex]
                    + "/" + umBookListObj.exeFileMarker;
        
               umBookListObj.currentEntriesIndex++;
                fs.exists(pathToCheck, function(existsResult) {
                    if(existsResult) {
                        UstadMobileBookList.getInstance().findEXEFileMarkerSuccess(pathToCheck);
                    }else {
                        UstadMobileBookList.getInstance().findEXEFileMarkerFail();
                    }
                });
           }else {           
                var pathToCheck = umBookListObj.currentEntriesToScan[umBookListObj.currentEntriesIndex].toURL() 
                        + "/" + umBookListObj.exeFileMarker;
                umBookListObj.currentEntriesIndex++;
                //remove file:// prefix (needed)
                //pathToCheck = pathToCheck.replace("file://", "");
                debugLog("pathtoCheck: " + pathToCheck);
                //scan and see if this is really an EXE Directory

                window.resolveLocalFileSystemURL(pathToCheck,
                    umBookListObj.findEXEFileMarkerSuccess, 
                    umBookListObj.findEXEFileMarkerFail);
           }
       } else {
           ///done looking at this directory - go to the next one
           debugLog("Scan next directory index is done");
           umBookListObj.populateNextDir();
       }
   },
   
   /*
    We got a direcotry reader - make a list of all sub directories
    to scan for exeFileMarker and put them currentEntriesToScan
    
    Note: in Cordova we entries is an array of objects representing the files
    In NodeJS its just an array of Strings
    */
   successDirectoryReader: function(entries) {
       var i;
       var umBookListObj = UstadMobileBookList.getInstance();
       debugLog("In successDirectoryReader path for " 
               + umBookListObj.fileSystemPathWaiting 
               + " entry num " + umBookListObj.currentFolderIndex);

       umBookListObj.currentEntriesToScan = new Array();
       umBookListObj.currentEntriesIndex = 0;

       for (i = 0; i < entries.length; i++) {
           if(UstadMobile.getInstance().isNodeWebkit()) {
               var fullPath = umBookListObj.fileSystemPathWaiting + "/" 
                       + entries[i];
               var fs = require("fs");
               var fStat = null;
               try {
                   var fdObj = fs.openSync(fullPath, 'r');
                   fStat = fs.fstatSync(fdObj);
               }catch(err) {
                   console.log("Error attempting to stat file : " + err);
               }
               
               if(fStat !== null && fStat.isDirectory()) {
                   umBookListObj.currentEntriesToScan.push(entries[i]);
               }
               
               try {
                   fStat.close();
               }catch(err2) {
                   console.log("Error attempting to close fs " + err2);
               }
           }else {
               if (entries[i].isDirectory) {
                    umBookListObj.currentEntriesToScan.push(entries[i]);
               }
           }
       }

       umBookListObj.scanNextDirectoryIndex();

   },
   
   /*
    Could not get a directory reader for this sub dir - go to the next one
    */
   failDirectoryReader: function(error) {
       var umBookListObj = UstadMobileBookList.getInstance();
       debugLog("Failed to list directory contents for " 
               + umBookListObj.fileSystemPathWaiting + 
               " code: " + error.code);
       umBookListObj.populateNextDir();
   },
   
   /*
    Simple Open page wrapper (+ sets language of the opened book ?)
    */
   openBLPage: function(openFile, mode) {
       var umBookListObj = UstadMobileBookList.getInstance();
       var bookpath = "";
       
       if (mode == "test") {
           CONTENT_MODE = mode;
           console.log("booklist: The CONTENT_MODE is: " + CONTENT_MODE);
       } else { //openBLPage will set mode to "normal" by default
           CONTENT_MODE = mode;
           console.log("booklist: The CONTENT_MODE is normal: " + CONTENT_MODE);
       }
       $.mobile.loading('show', {
           text: x_('Ustad Mobile: Loading..'),
           textVisible: true,
           theme: 'b',
           html: ""}
       );
       jsLoaded = false;
       if (navigator.userAgent.indexOf("TideSDK") !== -1) {
           console.log("Desktop - TideSDK detected. Adding file protocol to open Courses..");

           if (window.navigator.userAgent.indexOf("Windows") != -1) {
               console.log("TideSDK: You are using WINDOWS.");
               umBookListObj.currentBookPath = "file:\\\\" + openFile;	//For Windows..
               //Check the below for Windows vs Linux..
               bookpath = umBookListObj.currentBookPath.substring(0, 
                    umBookListObj.currentBookPath.lastIndexOf("\\"));
               console.log("TideSDK-The bookpath 1 is: " + bookpath);
               var bookpathSplit = bookpath.split('\\\\');
               bookpath = bookpathSplit[bookpathSplit.length - 1];
           } else {
               console.log("TideSDK: You are NOT using WINDOWS.");
               umBookListObj.currentBookPath = "file://" + openFile; 	//For Linux..
               //Check the below for Windows vs Linux..
               bookpath = umBookListObj.currentBookPath.substring(
                       0, umBookListObj.currentBookPath.lastIndexOf("/"));
               console.log("TideSDK-The bookpath 1 is: " + bookpath);
               var bookpathSplit = bookpath.split('//');
               bookpath = bookpathSplit[bookpathSplit.length - 1];
           }

           console.log("Book URL that UM is going to is: " 
                   + umBookListObj.currentBookPath);
           //1. We need to create a file: ustadmobile-settings.js
           //2. We need to put that file in that directory
           //3. We need to open the file.


           console.log("TideSDK: The bookpath is: " + bookpath);
           openFile = umBookListObj.currentBookPath;
       }else if(UstadMobile.getInstance().isNodeWebkit()) {
           window.open(openFile, "_self");
           return;
       }else {
           console.log("Mobile Device detected. Continuing..");
           umBookListObj.currentBookPath = openFile;
           console.log("Book URL that UM is going to is: " 
                   + umBookListObj.currentBookPath);
           //1. We need to create a file: ustadmobile-settings.js
           //2. We need to put that file in that directory
           //3. We need to open the file.
           bookpath = umBookListObj.currentBookPath.substring(0, 
                umBookListObj.currentBookPath.lastIndexOf("/"));
           console.log("The bookpath is: " + bookpath);
       }

       var userSetLanguage = localStorage.getItem('language');
       console.log("The user selected language is : " + userSetLanguage + " and the current Book Path is: " + bookpath);
       if (mode == "test") {
           userSetLanguageString = "var ustadlocalelang = \"" + userSetLanguage + "\"; console.log(\"DAFT PUNK GET LUCKY: \" + ustadlocalelang); var CONTENT_MODELS = \"test\"; console.log(\"CONTEN_MODELS is: \" + CONTENT_MODELS);"
           console.log("booklist: CONTENT_MODELS is set to test mode. ");
       } else {
           userSetLanguageString = "var ustadlocalelang = \"" + userSetLanguage + "\"; console.log(\"DAFT PUNK GET LUCKY: \" + ustadlocalelang);";
           console.log("booklist: CONTENT_MODELS is not set, You are in normal mode.");
       }
       localStorage.setItem('ustadmobile-settings.js', userSetLanguageString);
       localStorageToFile(bookpath, "ustadmobile-settings.js", openFile);  //Also is the function that opens the book.

   }

   
};


function UstadMobileCourseEntry(courseTitle, courseDesc, coursePath, coverImg) {
    this.courseTitle = courseTitle;
    
    this.courseDesc = courseDesc;
    
    this.coursePath = coursePath;
    
    this.coverImg = coverImg;
}


