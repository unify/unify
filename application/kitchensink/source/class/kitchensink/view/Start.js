/* ***********************************************************************************************

    Kitchen Sink

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Start View
 */
qx.Class.define("kitchensink.view.Start", {
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Start";
    },

    
    // overridden
    _createView : function() 
    {
      var content = new unify.ui.basic.Label("Hello World");
      this.add(content);
    }
  }
});
