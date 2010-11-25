/* ************************************************************************

  flicky

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Placeholder View
 */
qx.Class.define("flicky.view.mobile.Info", 
{
  extend : unify.view.mobile.StaticView,
  type : "singleton",
  
  members : 
  {
    __content : null,
  

    // overridden
    getTitle : function(type, param) {
      return "Info";
    },

    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);
      var titlebar = new unify.ui.mobile.TitleBar(this);
      layer.add(titlebar);
      
      var content = this.__content = new unify.ui.mobile.Content;
      content.add("No photo selected!");
      layer.add(content);

      return layer;
    }
  }
});
