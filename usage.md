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
    
There is a client auto detection built into the included index.html. You might to override
your user agent string or just use the HTML file of the version you prefer to load. For
example: to open the mobile version on a desktop browser just open "mobile.html" directly.

Tutorials
---------

Tutorials can be found at http://www.unify-training.com
