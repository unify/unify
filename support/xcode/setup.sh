#!/bin/bash

echo ">>> Creating link to Unify templates for XCode..."
cd `dirname $0`
mkdir -p ~/Library/Application\ Support/Developer/Shared/Xcode/Project\ Templates
rm -f ~/Library/Application\ Support/Developer/Shared/Xcode/Project\ Templates/Unify
ln -s `pwd`/templates ~/Library/Application\ Support/Developer/Shared/Xcode/Project\ Templates/Unify

echo ">>> Configuring XCode preferences..."
cd ../../../
WORKSPACE=`pwd`
defaults write ~/Library/Preferences/com.apple.Xcode PBXApplicationwideBuildSettings -dict-add WORKSPACE "$WORKSPACE"
defaults write ~/Library/Preferences/com.apple.Xcode PBXSourceTreeDisplayNames -dict-add WORKSPACE "Unify Workspace"

echo ">>> Done"
