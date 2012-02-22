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
  
  var sortWidgets = function(a,b) {
    return a.getNestingLevel() - b.getNestingLevel();
  };
  
  core.Module("unify.ui.layout.queue.Layout", {
    name : "layout",
    
    add : function(widget) {
      widgetQueue.push(widget);
      unify.ui.layout.queue.Manager.run(unify.ui.layout.queue.Layout.name);
    },
    
    flush : function() {
      console.log("LAYOUT: ", widgetQueue.length);
      widgetQueue.sort(sortWidgets);
      for (var i=0,ii=widgetQueue.length; i<ii; i++) {
        for (var j=i-1;j>=0;j--) {
          if (widgetQueue[i] === widgetQueue[j]) {
            widgetQueue[i]  = null;
          }
        }
      }
      
      for (i=0,ii=widgetQueue.length; i<ii; i++) {
        if (widgetQueue[i]) {
          console.log(i, widgetQueue[i].constructor);
        }
      }
      
      var widget;
      while ((widget = widgetQueue.shift())) {
        var sizeHint = widget.getSizeHint(true);
        if (widget.isRootWidget()) {
          console.log("R1 ", widget.constructor);
          widget.renderLayout(0, 0, sizeHint.width, sizeHint.height);
        } else {
          var bounds = widget.getBounds();
          console.log("R2 ", widget.constructor);
          widget.renderLayout(bounds.left, bounds.top, bound.width, bounds.height);
        }
      }
    }
  });

})();