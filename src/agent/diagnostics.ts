// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/// <reference path="./definitions/node.d.ts"/>

var fs = require('fs');
import path = require('path');
import os = require("os");
import cm = require('./common');
var shell = require('shelljs');

//
// Synchronouse FileLogWriter
// This is a synchronous client app running synchronous tasks so not an issue. 
// Would not want to use this on a server
//
export class DiagnosticFileWriter implements cm.IDiagnosticWriter  {
    
    constructor(level: cm.DiagnosticLevel, fullPath: string, fileName: string) {
        this.level = level;
        shell.mkdir('-p', fullPath);
        shell.chmod(775, fullPath);

        // TODO: handle failure cases.  It throws - Error: ENOENT, open '/nopath/somefile.log'
        //       we probably shouldn't handle - fail to start with good error - better than silence ...
        this._fd = fs.openSync(path.join(fullPath, fileName), 'a');  // append, create if not exist
    }

    public level: cm.DiagnosticLevel;
    private _fd: any;

    public write(message: string): void {
        fs.writeSync(this._fd, message);
    }

    public writeError(message: string): void {
        fs.writeSync(this._fd, message);
    }   

    divider() {
        this.write('----------------------------------------');
    }

    public end(): void {
        
    }               
}

export class DiagnosticConsoleWriter implements cm.IDiagnosticWriter {
    constructor(level: cm.DiagnosticLevel) {
        this.level = level;
    }

    public level: cm.DiagnosticLevel;

    public write(message: string): void {
        process.stdout.write(message, 'utf8');      
    }

    public writeError(message: string): void {
        process.stderr.write(message, 'utf8');
    }   

    public end(): void {
        
    }       
}

