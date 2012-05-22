# Unify application build script
# Part of Unify
# Copyright (C) 2012 Sebastian Fastner, Mainz, Germany

# Import unify build helper
from jasy.core import Project
unify_project = Project.getProjectByName("unify")
exec(compile(open(os.path.realpath(os.path.abspath(unify_project.getPath() + "/../support/jasy/unify.py"))).read(), "unify.py", 'exec'))




NAMESPACE = "${NAMESPACE}"

session.permutateField("debug")
session.permutateField("es5")
session.setField("application", NAMESPACE)

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

@task("Source version")
def source():
    unify_source()


@task("Build version")
def build():
    unify_build()
