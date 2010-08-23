#!/bin/bash

NAME=unify
VER=$1
BUGFIX=$2
THISSCRIPT=`pwd`/$0
DIST=${NAME}-${VER}

cd `dirname $THISSCRIPT`/../.. || exit 1
TOPDIR=`pwd`

if [ "$VER" == "" ]; then
  echo ">>> First parameter needs to be a valid version number!"
  echo ">>> -bugfix could be used to overwrite already released version with a bugfix version"
  echo ""
  echo ">>> Syntax: $0 <version number> [-bugfix]"
  exit 1
fi

echo ">>> Building release:"
if [ "$BUGFIX" != "-bugfix" ]; then
  echo "  - Version: $VER"
else
  echo "  - Bugfix: $VER"
fi
echo "  - Workspace: $TOPDIR"
echo "  - Destination: $DIST"
echo ">>> Press <ENTER> if this is correct, otherwise <CTRL>+C"
read

echo ">>> Syncing repository..."
cd $TOPDIR || exit 1
cd lib.${NAME}
svn up || exit 1
if [ "$BUGFIX" != "-bugfix" ]; then
	if [ -e ${DIST} ]; then
		echo ">>> Oops, destination file does already exist!"
		exit 1
	fi
else
	if [ ! -e ${DIST} ]; then
		echo ">>> Oops, destination file does not exist! Maybe no bugfix release?"
		exit 1
	fi
fi

echo ">>> Updating version file..."
echo $VER > $TOPDIR/$NAME/version.txt
echo `pwd`
svn ci -m "Updated version file to $VER" $TOPDIR/$NAME/version.txt

echo ">>> Syncing externals..."
cd $NAME/external  || exit 1
cd $TOPDIR || exit 1
bash checkout.sh || exit 1

echo ">>> Copying files (to $TOPDIR/$DIST)..."
cd $TOPDIR || exit 1
rm -rf $TEMP/$DIST
rsync --recursive --human-readable --exclude ".*" --exclude build --exclude cache --exclude api \ 
  --exclude *~.nib --exclude *.so --exclude *.pbxuser --exclude *.mode* --exclude *.perspective* \
  ${NAME}/* $TOPDIR/$DIST || exit 1

echo ">>> Creating archive ($TOPDIR/lib.${NAME}/${DIST}/${DIST}.zip)..."
cd $TOPDIR || exit 1
mkdir -p lib.${NAME}/${DIST}
zip -qr lib.${NAME}/${DIST}/${DIST}.zip $DIST || exit 1
if [ `which md5sum` ]; then
  md5sum lib.${NAME}/${DIST}/${DIST}.zip | cut -d" " -f1 > lib.${NAME}/${DIST}/${DIST}.zip.md5 || exit 1
elif [ `which md5` ]; then
  md5 -q lib.${NAME}/${DIST}/${DIST}.zip > lib.${NAME}/${DIST}/${DIST}.zip.md5 || exit 1
fi

echo ">>> Deleting raw copy..."
cd $TOPDIR || exit 1
rm -rf $DIST

echo ">>> Adding new archive to repository..."
cd $TOPDIR/lib.${NAME} || exit 1
if [ "$BUGFIX" != "-bugfix" ]; then
	svn add ${DIST} || exit 1
fi

echo ">>> Sending new archives to server..."
if [ "$BUGFIX" != "-bugfix" ]; then
	svn ci -m "Added release ${DIST}.zip" || exit 1
else
	svn ci -m "Updated release ${DIST}.zip" || exit 1
fi

echo ">>> Done"
