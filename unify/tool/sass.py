#!/usr/bin/env python
# -*- coding: utf-8 -*-

import subprocess, os, sys, optparse

def which_os(program):
    import os
    def is_exe(fpath):
        return os.path.exists(fpath) and os.access(fpath, os.X_OK)

    fpath, fname = os.path.split(program)
    if fpath:
        if is_exe(program):
            return program
    else:
        for path in os.environ["PATH"].split(os.pathsep):
            exe_file = os.path.join(path, program)
            if is_exe(exe_file):
                return exe_file

    return None

def which(program):
    ex = which_os(program)
    if ex != None:
        return ex
    else:
        prog = program + ".exe"
        ex = which_os(prog)
        return ex

def main():
    basepath = os.getcwd() 
    unifypath = basepath + "/" + os.path.dirname(sys.argv[0]) + "/unify-sass"
    
    jarpath = os.path.normpath(unifypath + "/sasscss.jar")
    unifysasspath = os.path.normpath(unifypath + "/unify-sass.rb")
    sourcepath = os.path.normpath(basepath + "/" + sys.argv[1])
    targetpath = os.path.normpath(basepath + "/" + sys.argv[2])
    
    ruby_exec = which("ruby")
    if ruby_exec != None:
        arg = [ruby_exec, unifysasspath, sourcepath, targetpath]
    else:
        arg = ["java", "-Xms512M", "-Xmx512M", "-jar", jarpath, "-X-C", unifysasspath, sourcepath, targetpath]
    
    subprocess.call(arg, cwd=unifypath)

if __name__ == '__main__':
    try:
        main()

    except KeyboardInterrupt:
        print
        print "Keyboard interrupt!"
        sys.exit(1)