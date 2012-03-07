Unify Project 2.0
=================

Native-like applications for smartphones, tablets and desktops
--------------------------------------------------------------

Unify was built to improve the development efficiency of apps for smartphones. Currently it supports smartphones based on the platforms iOS, Android and WebOS. There is support for deskop operating systems like Windows or Mac OS as well.

Unify is made available under a dual license: MIT + Apache, Version 2.0. For details take a look at the individual license files.

Setup
-----

You only need 4 steps to set up unify.

1. <code> git clone https://github.com/unify/unify.git </code>
2. <code> cd unify </code>
3. <code> git submodule update --recursive --init </code>
4. <code> cd .. </code>
5. <code> unify/create-application.py -n myapp </code>
6. <code> cd myapp </code>
7. <code> ./generate.py source </code>
8. Load files in myapp/source in browser

Happy coding.
