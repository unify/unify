#!/usr/bin/env jasy

NAMESPACE = "kitchensink"


# Setup session
session = Session()

session.addProject(Project("../../support/core/"))
session.addProject(Project("../../support/lowland/"))
session.addProject(Project("../../unify/framework/"))
session.addProject(Project("."))

session.permutateField("debug")
#session.permutateField("es5")
#session.permutateField("engine")
session.permutateField("locale", ["de"])
session.setField("application", NAMESPACE)



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
    
    # Get projects
    projects = session.getProjects()
    
    # Assets
    resolver = Resolver(projects)
    resolver.addClassName("%s.Application" % NAMESPACE)
    assets = Asset(session, resolver.getIncludedClasses()).exportSource()
    
    # Store loader script
    includedByKernel = storeKernel("source/script/loader.js", session, assets)
    
    # Resolving dependencies
    resolver = Resolver(projects)
    resolver.addClassName("%s.Application" % NAMESPACE)
    resolver.excludeClasses(includedByKernel)
    classes = resolver.getIncludedClasses()

    # Compressing classes
    classes = Sorter(resolver).getSortedClasses()
    compressedCode = storeSourceLoader("source/script/%s.js" % NAMESPACE, classes, session, bootCode="null")


def test(name, startclass):
    # Permutation independend config
    optimization = Optimization("unused", "privates", "variables", "declarations", "blocks")
    formatting = Formatting("comma", "semicolon")
    
    # Store loader script
    includedByKernel = storeKernel("test/script/loader.js", session)
    
    # Get projects
    projects = session.getProjects()

    # Resolving dependencies
    resolver = Resolver(projects)
    resolver.addClassName(startclass)
    resolver.excludeClasses(includedByKernel)
    classes = resolver.getIncludedClasses()

    # Compressing classes
    classes = Sorter(resolver).getSortedClasses()
    compressedCode = storeSourceLoader("test/script/%s.js" % name, classes, session, bootCode="null")

@task("Test version")
def testlowland():
    test("lowland", "lowland.test.Main")

@task("Test version")
def testunify():
    test("unify", "unify.test.Main")

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
            
            
