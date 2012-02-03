#!/usr/bin/env jasy


# Setup session
session = Session()

session.addProject(Project("../../support/core/"))
session.addProject(Project("../../unify/framework/"))
session.addProject(Project("."))

session.permutateField("debug")
#session.permutateField("es5")
#session.permutateField("engine")
session.permutateField("locale", ["de"])

NAMESPACE = "coretest"



@task("Clear Cache")
def clear():
    # Clearing cache
    logging.info("Clearing cache...")
    session.clearCache()



@task("Source version")
def source():
    # Permutation independend config
    optimization = Optimization("unused", "privates", "variables", "declarations", "blocks")
    formatting = Formatting("comma", "semicolon")
    
    # Store loader script
    includedByKernel = storeKernel("source/script/loader.js", session)
    
    # Get projects
    projects = session.getProjects()

    # Resolving dependencies
    resolver = Resolver(projects)
    resolver.addClassName("%s.Application" % NAMESPACE)
    classes = resolver.getIncludedClasses()

    # Compressing classes
    classes = Sorter(resolver).getSortedClasses()
    compressedCode = storeSourceLoader("source/script/%s.js" % NAMESPACE, classes, session, bootCode="null")


@task("Test version")
def test():
    # Permutation independend config
    optimization = Optimization("unused", "privates", "variables", "declarations", "blocks")
    formatting = Formatting("comma", "semicolon")
    
    # Store loader script
    includedByKernel = storeKernel("test/script/loader.js", session)
    
    # Get projects
    projects = session.getProjects()

    # Resolving dependencies
    resolver = Resolver(projects)
    resolver.addClassName("unify.test.Application")
    classes = resolver.getIncludedClasses()

    # Compressing classes
    classes = Sorter(resolver).getSortedClasses()
    compressedCode = storeSourceLoader("test/script/%s.js" % NAMESPACE, classes, session, bootCode="null")



@task("Build version")
def build():   
    # Permutation independend config
    optimization = Optimization() #"unused", "privates", "variables", "declarations", "blocks")
    formatting = Formatting("comma", "semicolon")

    # Store loader script
    includedByKernel = storeKernel("build/loader.js", session)
    
    # Process every possible permutation
    for permutation in session.getPermutations():
        # Get projects
        projects = session.getProjects()

        # Resolving dependencies
        resolver = Resolver(projects, permutation)
        resolver.addClassName("%s.Application" % NAMESPACE)
        resolver.excludeClasses(includedByKernel)
        classes = resolver.getIncludedClasses()

        # Compressing classes
        #translation = session.getTranslation(permutation.get("locale"))
        translation=None
        classes = Sorter(resolver, permutation).getSortedClasses()
        compressedCode = storeCompressed("build/%s-%s.js" % (NAMESPACE, permutation.getChecksum()), classes, 
            permutation=permutation, translation=translation, optimization=optimization, formatting=formatting)
            
            
