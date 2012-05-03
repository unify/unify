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

  core.Module("unify.ui.layout.queue.Appearance", {
    name : "appearance",
    
    add : function(widget) {
      widgetQueue.push(widget);
      unify.ui.layout.queue.Manager.run(unify.ui.layout.queue.Appearance.name);
    },
    
    flush : function() {
      var widget;
      
      while ((widget = widgetQueue.shift())) {
        widget.syncAppearance();
      }
    }
  });

})();