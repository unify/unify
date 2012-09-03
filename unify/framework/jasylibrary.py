import webbrowser, http.server, os, multiprocessing

@share
def unify_source(state, NAMESPACE):
    # Permutation independend config
    state.jsFormatting.enable("comma")
    state.jsFormatting.enable("semicolon")
    state.jsOptimization.disable("privates")
    state.jsOptimization.disable("variables")
    state.jsOptimization.disable("declarations")
    state.jsOptimization.disable("blocks")
    
    # Assets
    state.assetManager.addSourceProfile()
    
    # Store loader script
    includedByKernel = state.storeKernel("script/kernel.js")
    
    # Process every possible permutation
    for permutation in state.session.permutate():
        # Resolving dependencies
        resolver = state.Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Building class loader
        state.storeLoader(resolver.getSortedClasses(), "script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), "unify.core.Init.startUp();")

@share
def unify_build(state, NAMESPACE, cdnPrefix="asset"):
    # Assets
    state.assetManager.addBuildProfile(cdnPrefix)
    state.assetManager.deploy(state.Resolver().addClassName("%s.Application" % NAMESPACE).getIncludedClasses())
    
    # Store loader script
    includedByKernel = state.storeKernel("script/kernel.js")
    
    # Copy files from source
    state.updateFile("source/index.html", "index.html")    
    
    # Process every possible permutation
    for permutation in state.session.getPermutations():
        # Resolving dependencies
        resolver = state.Resolver().addClassName("%s.Application" % NAMESPACE).excludeClasses(includedByKernel)

        # Compressing classes
        state.storeCompressed(resolver.getSortedClasses(), "script/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), "unify.core.Init.startUp();")
        
        
