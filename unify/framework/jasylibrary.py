import webbrowser, http.server, os, multiprocessing

from jasy.asset.Manager import AssetManager
from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.js.Resolver import Resolver
from jasy.http.Server import Server
import jasy


@share
def source(session, config):
	name = config.get("name")
	assetManager = AssetManager(session)
	outputManager = OutputManager(session, assetManager, 0, 1)

	session.setField("unify.application.namespace", name)

	assetManager.addSourceProfile()
	if jasy.__version__ < "1.1":
		outputManager.storeKernel("$prefix/script/kernel.js", classes=["unify.Kernel"])
	else:
		outputManager.storeKernel("$prefix/script/kernel.js", "unify.Kernel")

	for permutation in session.permutate():
		# Resolving dependencies
		resolver = Resolver(session).addClassName("%s.Application" % name)
		
		# Building class loader
		outputManager.storeLoader(resolver.getSortedClasses(), "$prefix/script/%s-$permutation.js" % name, "unify.core.Init.startUp();")
		

@share
def build(session, config, cdnPrefix="asset", compressionLevel=2, formattingLevel=0):
	name = config.get("name")
	assetManager = AssetManager(session)
	outputManager = OutputManager(session, assetManager, compressionLevel, formattingLevel)
	fileManager = FileManager(session)
	
	session.setField("unify.application.namespace", name)

	# Assets
	assetManager.addBuildProfile(cdnPrefix)
	assetManager.deploy(Resolver(session).addClassName("%s.Application" % name).getIncludedClasses())
	
	# Store loader script
	if jasy.__version__ < "1.1":
		outputManager.storeKernel("$prefix/script/kernel.js", classes=["unify.Kernel"])
	else:
		outputManager.storeKernel("$prefix/script/kernel.js", "unify.Kernel")
	
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


