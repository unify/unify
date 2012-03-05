/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * #break(unify.ui.layout.queue.Manager)
 */

(function() {
  
  var widgetQueue = [];
  var visibilityCache = [];

  core.Module("unify.ui.layout.queue.Visibility", {
    name : "visibility",
    
    add : function(widget) {
      widgetQueue.push(widget);
      unify.ui.layout.queue.Manager.run(unify.ui.layout.queue.Visibility.name);
    },
    
    flush : function() {
      for (var i=0,ii=widgetQueue.length; i<ii; i++) {
        var children = widgetQueue[i].getLayoutChildren();
        widgetQueue = widgetQueue.concat(children);
      }
      
      var widget;
      while ((widget = widgetQueue.shift())) {
        if (widget.getVisibility() == "visible") {
          if (!visibilityCache.contains(widget)) {
            visibilityCache.push(widget);
          }
        } else {
          visibilityCache.remove(widget);
        }
        widget.checkAppearanceNeeds();
      }
    },
    
    isVisible : function(widget) {
      return visibilityCache.contains(widget);
    }
  });

})();