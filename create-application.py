#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Create skeleton application for Unify
# Copyright (C) 2012 Sebastian Fastner, Mainz, Germany
# License: MIT or Apache2

import os, sys, shutil

print("Unify create skeleton")
print("(C) 2012 Sebastian Fastner, Mainz, Germany")
print()

if (len(sys.argv) != 2):
    print("Syntax: %s <namespace>" % os.path.basename(sys.argv[0]))
    exit(1)

NAMESPACE = sys.argv[1]

UNIFYPATH = os.path.join(os.getcwd(), os.path.dirname(sys.argv[0]))
SKELETONPATH = os.path.abspath(
    os.path.join(UNIFYPATH, "unify", "application", "skeleton", "unify")
)
TARGETPATH = os.path.abspath(os.path.join(os.getcwd(), NAMESPACE))

REPLACEMENTS = {
    "NAMESPACE" : NAMESPACE,
    "UNIFYPATH" : os.path.relpath(UNIFYPATH, TARGETPATH)
}

if os.path.exists(TARGETPATH):
    print("Path %s exists. Aborting." % TARGETPATH)
    exit(2)
    
shutil.copytree(SKELETONPATH, TARGETPATH)

def patch_line(line):
    for key in REPLACEMENTS:
        check = "${" + key + "}"
        line = line.replace(check, REPLACEMENTS[key])
    return line

def handle_file(directory, filename):
    outfile_name = os.path.join(directory, filename.replace(".tmpl", ""))
    infile_name = os.path.join(directory, filename)
    with open(outfile_name, "w") as outfile:
        with open(infile_name) as infile:
            for line in infile:
                outfile.write(patch_line(line))
    os.remove(infile_name)
    
def handle_dir(directory):
    shutil.move(directory, directory[:-6] + NAMESPACE)

for root, dirs, files in os.walk(TARGETPATH,topdown=False):
    for file in files:
        if ".tmpl." in file:
            handle_file(root, file)
            
    if root.endswith("custom"):
        handle_dir(root)

print("Creat application skeleton in %s ... done" % TARGETPATH)