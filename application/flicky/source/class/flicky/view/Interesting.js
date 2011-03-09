/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Interesting View
 */
qx.Class.define("flicky.view.Interesting", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members :
  {
    __content : null,


    // overridden
    getTitle : function(type) {
      return "Interesting";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      navigationBar.setItems([{ icon : true, exec : "refresh"}]);
      layer.add(navigationBar);

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
      return "interesting";
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


    /**
     * Converts a data entry into a HTML fragment for an image element
     *
     * @param entry {Map} Data structure
     * @return {String} HTML string
     */
    __createImage : function(entry)
    {
      var tmpl = '<img goto="photo:{$id}" src="http://farm{$farm}.static.flickr.com/{$server}/{$id}_{$secret}_s.jpg" alt="{$title}" />';

      return tmpl.replace(/{\$([a-z]+)}/g, function(match, key) {
        return entry[key];
      });
    }
  }
});
