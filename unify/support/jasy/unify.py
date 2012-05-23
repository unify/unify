import webbrowser, http.server, os, multiprocessing

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

    