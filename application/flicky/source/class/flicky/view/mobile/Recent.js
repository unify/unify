/* ************************************************************************

  flicky

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Recent View
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
      var photos = data.query.results.photo;
      var html = [];
      
      for (var i=0, l=photos.length; i<l; i++) {
        html.push(this.__createImage(photos[i]))
      }
      
      this.__content.replace(html.join(""));
    },
    
    __createImage : function(entry)
    {
      var tmpl = '<img src="http://farm{$farm}.static.flickr.com/{$server}/{$id}_{$secret}_s.jpg" alt="{$title}" />';
      
      return tmpl.replace(/{\$([a-z]+)}/g, function(match, key) {
        return entry[key];
      });
    }
  }
});
