/* ************************************************************************

  flicky

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("flicky.view.mobile.Recent", {
  extend : unify.view.mobile.RemoteView,
  type : "singleton",

  members : 
  {
    __content : null,
  

    // overridden
    getTitle : function(type, param) {
      return "Recent";
    },

    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);
      var titlebar = new unify.ui.mobile.TitleBar(this);
      layer.add(titlebar);
      
      var content = this.__content = new unify.ui.mobile.Content;
      content.add("Hello World");
      layer.add(content);

      return layer;
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return flicky.business.Flickr.getInstance();
    },
    
    
    // overridden
    _getServiceName : function() {
      return "recent";
    },
    
    
    // overridden
    _getRenderVariant : function() {
      return "recent";
    },
    
    
    // overridden
    _renderData : function(data)
    {
      alert(data);
      
    }
  }
});
