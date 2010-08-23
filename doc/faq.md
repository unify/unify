FAQ
===

Your first Unify application
----------------------------

* Unzip a Unify release and rename the folder to "unify"
* It is suggested to place "unify" in the same folder as your application
* Go to the folder where you would like to create the application (creates an sub-folder for the application)
* Open a terminal and executing the following script "unify/tool/create-application.py -n $YOURAPPNAME"
* The script creates the application $YOURAPPNAME into your current working directory
* It is suggested to give all applications a *lowercase* name without special characters or white spaces



Modifying the path to Unify
---------------------------

* In your application: 
  * config.json needs to be modified for the values of `UNIFY_PATH` and `QOOXDOO_PATH`. Typically the `QOOXDOO_PATH` begins with the `UNIFY_PATH` as qooxdoo itself is an integral part of the Unify framework. Because of limitiations of qooxdoo's tool chain it is currently not possible for us to make this process any simpler.
  * If you make use of SASS templates from Unify you need to update your SASS stylesheet to fix the wrong include statements. Take a look under "source/resource/$APPNAME/mobile/" for files ending with ".sass" and update the include statements. The path is relative to each SASS file.

* XCode support:
  * Re-run the script "support/xcode/setup.sh" for updating the UNIFY source tree in XCode. All applications which were created using the Unify XCode project template make use of this "Source Trees" configuration in the XCode preferences. Alternatively it is possible to modify this setting by hand in XCode itself. XCode must not run during executing this script.

