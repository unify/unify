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
  var name = "appearance";

  core.Module("unify.ui.layout.queue.Appearance", {
    name : name,
    
    add : function(widget) {
      widgetQueue.push(widget);
      unify.ui.layout.queue.Manager.run(name);
    },
    
    flush : function() {
      var widget;
      
      while ((widget = widgetQueue.shift())) {
        widget.syncAppearance();
      }
    }
  });

})();