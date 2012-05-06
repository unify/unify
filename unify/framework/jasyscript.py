# Unify project builder
# Copyright 2012 Sebastian Fastner, Mainz, Germany

import webbrowser

@task("Open help in browser")
def help():
    # Clearing cache
    webbrowser.open("http://unify-training.com/")
