#!/usr/bin/env python
# -*- coding: utf-8 -*-

import subprocess, os, sys, optparse

fullpath = os.path.join(os.getcwd(), os.path.dirname(sys.argv[0]))
capath = os.path.abspath(
    os.path.join(fullpath, "..", "..", "qooxdoo", "qooxdoo", "tool", "bin", "create-application.py")
)
skeletonpath = os.path.abspath(
    os.path.join(fullpath, "..", "application", "skeleton")
)

subprocess.call(["python", capath, "-p", skeletonpath, "-t", "unify"] + sys.argv[1:])
