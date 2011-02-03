#!/bin/bash

root=`dirname $0`
echo ">>> Path: $root"
cd $root || exit 1
version=`cat ../version.txt`

echo ">>> Version: $version"
echo ">>> If there is an error tagging the project you might to increment the version counter"

echo ">>> Tagging unify $version"
git tag -a -m "Tagged unify $version" $version || exit 1

echo ">>> Pushing tag $version..."
git push origin $version || exit 1

echo ">>> Sleeping for 30 seconds"
sleep 30

echo ">>> Preparing release..."
mkdir ../qts-release/unify-$version || exit 1
cd ../qts-release/unify-$version || exit 1

echo ">>> Downloading archive unify-$version.zip..."
wget -O unify-$version.zip http://github.com/unify/unify/zipball/$version || exit 1

echo ">>> Tagging unify $version in SVN..."
cd .. || exit 1
svn add unify-$version
svn ci -m "Tagged unify $version" unify-$version || exit 1

echo ">>> Done"
