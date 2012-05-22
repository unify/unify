
def unify_source():
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

def unify_build():
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