
@task
def source():
    """Generates source (development) version of test runner"""
    core.test_source()

@task
def build():
    """Generates build (deployment) version of test runner"""
    core.test_build()
    
@task
def clean():
    """Cleans up project environment"""
    
    session.clean()
    Repository.clean()

@task
def distclean():
    """Cleans up project environment with removing all non-repository files"""

    session.clean()
    Repository.distclean()

@task 
def test(target="source", tool="phantom", browsers=None):
    """Automatically executes tests in either PhantomJS, NodeJS or Testem CI"""
    
    core.test(target, tool, browsers)
