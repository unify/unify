# Unify application build script
# Part of Unify
# Copyright (C) 2012 Sebastian Fastner, Mainz, Germany

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
    # Permutation independend config
    formatting.enable("comma")
    formatting.enable("semicolon")
    optimization.disable("privates")
    optimization.disable("variables")
    optimization.disable("declarations")
    optimization.disable("blocks")
    
    # Assets
    asset = AssetManager(Resolver().addClassName("%s.Application" % NAMESPACE).getIncludedClasses())
    
    # Store loader script
    includedByKernel = storeKernel("script/kernel.js", assets=asset.exportSource())
    
    # Process every possible permutation
    for permutation in session.permutate():
        # Resolving dependencies
        resolver = Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Building class loader
        storeLoader("script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), Sorter(resolver).getSortedClasses(), bootCode="unify.core.Init.startUp();")


@task("Build version")
def build():
  
    # Assets
    asset = AssetManager(Resolver().addClassName("%s.Application" % NAMESPACE).getIncludedClasses())
    
    # Store loader script
    includedByKernel = storeKernel("script/kernel.js", assets=asset.exportBuild())
    
    # Copy files from source
    updateFile("source/index.html", "index.html")
    
    # Process every possible permutation
    for permutation in session.getPermutations():
        # Resolving dependencies
        resolver = Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Compressing classes
        storeCompressed("script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), Sorter(resolver).getSortedClasses(), bootCode="unify.core.Init.startUp();")

