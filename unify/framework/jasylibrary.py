import webbrowser, http.server, os, multiprocessing

from jasy.asset.Manager import AssetManager
from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.js.Resolver import Resolver
from jasy.http.Server import Server


@share
def source(session, config):
	name = config.get("name")
	assetManager = AssetManager(session)
	outputManager = OutputManager(session, assetManager, 0, 1)

	assetManager.addSourceProfile()
	includedByKernel = outputManager.storeKernel("$prefix/script/kernel.js")

	for permutation in session.permutate():
		# Resolving dependencies
		resolver = Resolver(session).addClassName("%s.Application" % name)
		#.excludeClasses(includedByKernel)
		
		# Building class loader
		outputManager.storeLoader(resolver.getSortedClasses(), "$prefix/script/%s-$permutation.js" % name, "unify.core.Init.startUp();")
		

@share
def build(session, config, cdnPrefix="asset", compressionLevel=2, formattingLevel=0):
	name = config.get("name")
	assetManager = AssetManager(session)
	outputManager = OutputManager(session, assetManager, compressionLevel, formattingLevel)
	fileManager = FileManager(session)
	
	# Assets
	assetManager.addBuildProfile(cdnPrefix)
	assetManager.deploy(Resolver(session).addClassName("%s.Application" % name).getIncludedClasses())
	
	# Store loader script
	outputManager.storeKernel("$prefix/script/kernel.js")
	
	# Copy files from source
	fileManager.updateFile("source/index.html", "$prefix/index.html")    
	
	# Process every possible permutation
	for permutation in session.permutate():
		# Resolving dependencies
		resolver = Resolver(session).addClassName("%s.Application" % name)
		
		# Compressing classes
		outputManager.storeCompressed(resolver.getSortedClasses(), "$prefix/script/%s-$permutation.js" % name, "unify.core.Init.startUp();")


@share
def serve():
	Server().start()


