# Library build script
# Part of PagePlace
# Copyright (C) 2012 Deutsche Telekom

@task("Clear build cache")
def clean():
    session.clean()


@task("Clear caches and build results")
def distclean():
    session.clean()
    removeDir("build")
    removeDir("external")
    removeDir("source/script")

@task("Build the full api viewer into api folder")
def api():
    ApiWriter().write("data")
    # Generates API browser into api folder
    runTask("apibrowser", "build")

