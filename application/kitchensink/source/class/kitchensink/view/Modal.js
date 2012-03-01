/* ***********************************************************************************************

    Kitchen Sink

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Modal View
 */
core.Class("kitchensink.view.Modal", {
  include : [unify.view.StaticView],

  construct : function() {
    unify.view.StaticView.call(this);
  },

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Modal";
    },

    
    // overridden
    _createView : function() 
    {
      var content = new unify.ui.basic.Label("Hello World, this is a modal view");
      this.add(content);
      
      var b = new unify.ui.basic.NavigationButton("Close");
      b.set({relation: "close"});
      this.add(b);
    }
  }
});

unify.core.Singleton.annotate(kitchensink.view.Modal);