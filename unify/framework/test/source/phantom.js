#!/usr/bin/env phantomjs

var page = require("webpage").create();

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onAlert = function(msg) {
  console.warn("Alert: " + msg);
};

page.onCallback = function(data) 
{
  if (data.action == "finished") {
    phantom.exit(data.status ? 0 : 1);       
  }
};

page.open("index.html");
