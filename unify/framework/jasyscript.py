# Unify project builder
# Copyright 2012 Sebastian Fastner, Mainz, Germany

import webbrowser, http.server, os, multiprocessing




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
    