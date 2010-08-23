import os
import re
import cgi
import urllib
import urllib2
import logging
import base64

import wsgiref.handlers

from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app


class ProxyController(webapp.RequestHandler):
  
  #
  # List of currently allowed service URLs
  #
  allowedServers = [
    "twitter.com/",
    "search.twitter.com/",
    "feeds.t-online.de/",
    "themen.fussball.de/",
    "rss1.t-online.de/",
    "t-online.sport-dienst.de/",
    "t-imex.t-online.de/"
  ]
  
  # Hop-by-hop headers, which are meaningful only for a single
  # transport-level connection, and are not stored by caches or
  # forwarded by proxies.
  #
  # See also:
  # http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html
  hopByHop = [ 
    "connection", 
    "keep-alive", 
    "proxy-authenticate", 
    "proxy-authorization", 
    "te", 
    "trailers", 
    "transfer-encoding", 
    "upgrade" 
  ]


  #
  # Offer all HTTP methods supported by urlfetch
  #

  def get(self):
    self._send(urlfetch.GET)

  def post(self):
    self._send(urlfetch.POST)

  def head(self):
    self._send(urlfetch.HEAD)

  def put(self):
    self._send(urlfetch.PUT)

  def delete(self):
    self._send(urlfetch.DELETE)



  #
  # Make options allow cross domain communication
  #

  def options(self):
    logging.info("Options request: Allowing cross domain requests")
    self._addResponseHeaders()


    
  #
  # Common routines to process requests
  #
  
  def _addResponseHeaders(self):
    # See also: https://developer.mozilla.org/En/HTTP_Access_Control
    
    # Allow requests from all locations
    self.response.headers["access-control-allow-origin"] = "*"

    # Allow all methods supported by urlfetch
    self.response.headers["access-control-allow-methods"] = "GET, POST, HEAD, PUT, DELETE"
    
    # Allow cache-control and our custom headers
    self.response.headers["access-control-allow-headers"] = "Cache-Control, X-Proxy-Authorization, X-Requested-With"    
    
    # Cache allowence for cross domain for 7 days
    self.response.headers["access-control-max-age"] = "604800"
    

  def _send(self, method):
    # Cut off leading "/"
    url = self.request.path[1:]
    
    # Whether the service is supported
    supported = False
    for entry in self.allowedServers:
      if url.startswith(entry):
        supported = True
        break

    if not supported:
      logging.error("Service not supported: %s" % url)
      self.response.out.write("Service not supported: %s" % url)
      return

    # Prepare headers
    headers = {}

    # Apply headers for basic HTTP authentification
    if "X-Proxy-Authorization" in self.request.headers:
      headers["Authorization"] = self.request.headers["X-Proxy-Authorization"]

    # Add query string to url
    url = "http://" + url
    if self.request.query_string != "":
      url += "?" + self.request.query_string

    # Prepare payload
    payload = None
    if self.request.body:
      payload = self.request.body
      
    # Start request
    try:
      logging.debug("Fetching URL: %s" % url)
      result = urlfetch.fetch(url=url, method=method, headers=headers, payload=payload)
    except:
      logging.error("Failed to request: %s" % url)
      self.response.set_status(500)
      self.response.out.write('{"error":true,"url":"' + url + '"}')
      return

    # Sync headers (filter hop-by-hop headers)
    for key in result.headers:
      if not key.lower() in self.hopByHop:
        self.response.headers[key] = result.headers[key]

    # Allow cross site access
    self._addResponseHeaders()
    
    # Sync HTTP between request and response
    self.response.set_status(result.status_code)
    self.response.out.write(result.content)



if __name__ == '__main__':
  application = webapp.WSGIApplication([
    ('/.*', ProxyController)
  ], debug=True)

  wsgiref.handlers.CGIHandler().run(application)
