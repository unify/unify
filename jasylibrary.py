import webbrowser, http.server, os, multiprocessing

@share
def unify_source():
    # Permutation independend config
    jsFormatting.enable("comma")
    jsFormatting.enable("semicolon")
    jsOptimization.disable("privates")
    jsOptimization.disable("variables")
    jsOptimization.disable("declarations")
    jsOptimization.disable("blocks")
    
    # Assets
    assetManager.addSourceProfile()
    
    # Store loader script
    includedByKernel = storeKernel("script/kernel.js")
    
    # Process every possible permutation
    for permutation in session.permutate():
        # Resolving dependencies
        resolver = Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Building class loader
        storeLoader(resolver.getSortedClasses(), "script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), "unify.core.Init.startUp();")

@share
def unify_build(cdnPrefix="asset"):
    # Assets
    assetManager.addBuildProfile(cdnPrefix)
    assetManager.deploy(Resolver().addClassName("%s.Application" % NAMESPACE).getIncludedClasses())
    
    # Store loader script
    includedByKernel = storeKernel("script/kernel.js")
    
    # Copy files from source
    updateFile("source/index.html", "index.html")    
    
    # Process every possible permutation
    for permutation in session.getPermutations():
        # Resolving dependencies
        resolver = Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Compressing classes
        storeCompressed(resolver.getSortedClasses(), "script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), "unify.core.Init.startUp();")
        
        
