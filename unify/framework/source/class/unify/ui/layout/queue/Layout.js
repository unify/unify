/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * #break(unify.ui.layout.queue.Manager)
 */

(function() {
  
  var widgetQueue = [];
  var name = "layout";
  
  var sortWidgets = function(a,b) {
    if (!a) {
      return 1;
    }
    if (!b) {
      return -1;
    }
    return a.getNestingLevel() - b.getNestingLevel();
  };
  
  core.Module("unify.ui.layout.queue.Layout", {
    name : name,
    
    add : function(widget) {
      widgetQueue.push(widget);
      unify.ui.layout.queue.Manager.run(name);
    },
    
    flush : function() {
      widgetQueue.sort(sortWidgets);
      for (var i=0,ii=widgetQueue.length; i<ii; i++) {
        for (var j=i-1;j>=0;j--) {
          if (widgetQueue[i] === widgetQueue[j]) {
            widgetQueue[i]  = null;
          }
        }
      }
      
      var widget;
      while ((widget = widgetQueue.shift())) {
        var bounds = widget.getBounds();

        if (bounds) {
          widget.renderLayout(bounds.left, bounds.top, bounds.width, bounds.height);
        }
      }
    }
  });

})();