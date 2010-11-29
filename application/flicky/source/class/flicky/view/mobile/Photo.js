/* ************************************************************************

  flicky

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Recent View
 */
qx.Class.define("flicky.view.mobile.Photo", {
  extend : unify.view.mobile.RemoteView,
  type : "singleton",

  members : 
  {
    __content : null,
  

    // overridden
    getTitle : function(type, param) {
      return "Photo: " + param;
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
      return "info";
    },
    
    
    // overridden
    _getServiceParams : function() 
    {
      return {
        "photo" : this.getParam()
      };
    },
    
    
    // overridden
    _getRenderVariant : function() {
      return this.getParam();
    },
    
    
    // overridden
    isFullScreen : function() {
      return true;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      var photo = data.query.results.photo;
      
      this.__content.replace(this.__createImage(photo));
    },
    
    __createImage : function(entry)
    {
      var tmpl = '<img src="http://farm{$farm}.static.flickr.com/{$server}/{$id}_{$secret}_m.jpg" alt="{$title}" />';
      
      return tmpl.replace(/{\$([a-z]+)}/g, function(match, key) {
        return entry[key];
      });
    }
  }
});
