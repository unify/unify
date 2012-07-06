import webbrowser, http.server, os, multiprocessing
from jasy.core import Project

appcache_project = Project.getProjectByName("appcache")
exec(compile(open(os.path.realpath(os.path.abspath(appcache_project.getPath() + "/jasyhelper.py"))).read(), "jasyhelper.py", 'exec'))

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
        
        
def run_server(port):
  Handler = http.server.SimpleHTTPRequestHandler
  httpd = http.server.HTTPServer(("",port), Handler)
  print("Serve on 8095")
  httpd.serve_forever()



@task("Open help in browser")
def help():
    # Clearing cache
    webbrowser.open("http://unify-training.com/")

@task("Start webserver on localhost")
def server(port=8000):
    p = multiprocessing.Process(target=run_server, args=(port,))
    p.start()
    webbrowser.open("http://localhost:%d/" % port)

    