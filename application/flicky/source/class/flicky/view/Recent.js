/* ************************************************************************

  flicky

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Recent View
 */
qx.Class.define("flicky.view.Recent", {
  extend : unify.view.RemoteView,
  type : "singleton",

  members :
  {
    __content : null,


    // overridden
    getTitle : function(type, param) {
      return "Recent";
    },


    // overridden
    isFullScreen : function() {
      return true;
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      titlebar.add({ icon : true, exec : "refresh", target : "right" });
      layer.add(titlebar);

      var content = this.__content = new unify.ui.ScrollView;
      content.setEnableScrollX(false);
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
      var tmpl = '<img goto="photo:{$id}" src="http://farm{$farm}.static.flickr.com/{$server}/{$id}_{$secret}_s.jpg" alt="{$title}" />';

      return tmpl.replace(/{\$([a-z]+)}/g, function(match, key) {
        return entry[key];
      });
    }
  }
});
