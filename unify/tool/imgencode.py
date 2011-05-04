#!/usr/bin/python

import base64
import sys

for arg in sys.argv[1:]:
  mime = ""
  if arg.endswith(".gif"):
    mime = "image/gif"
  elif arg.endswith(".png"):
    mime = "image/png"
  elif arg.endswith(".jpg") or arg.endswith(".jpeg"):
    mime = "image/jpeg"
  else:
    mime = "text/plain"

  content = open(arg).read()
  encoded = base64.standard_b64encode(content)
  print "url(data:" + mime + ";base64," + encoded + ")"
