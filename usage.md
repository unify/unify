Usage
=====

* Download qooxdoo (from http://github.com/unify/qooxdoo)
* Download Unify (from http://github.com/unify/unify)

* Create an application:
  
    $ unify/framework/tool/create-application.py -n $appname
    $ cd $appname

* Prepare development version (re-run after major changes)

    $ ./generate.py source-mobile
    $ ./generate.py source-desktop
    
* Create deployment version

    $ ./generate build-mobile
    $ ./generate build-desktop
    
