/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Recent View
 */
qx.Class.define("flicky.view.Photo", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members :
  {
    __content : null,
    __title : "Loading...",


    // overridden
    getTitle : function(type) {
      return this.__title;
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      navigationBar.setItems([{label:"Info", show:"mmeta", kind:"button"}]);
      layer.add(navigationBar);

      var content = this.__content = new unify.ui.ScrollView;
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
    _renderData : function(data)
    {
      var results = data.query.results;
      if (results == null)
      {
        delete this.__title;
        this.__content.replace("Unknown Image!");
      }
      else
      {
        this.__title = results.photo.title;
        this.__content.replace(this.__createImage(results.photo));
        this.fireEvent("changeTitle");
        unify.view.ViewManager.get('mmeta').reset();
      }
    },


    /**
     * Converts a data entry into a HTML fragment for an image element
     *
     * @param entry {Map} Data structure
     * @return {String} HTML string
     */
    __createImage : function(entry)
    {
      var tmpl = '<img src="http://farm{$farm}.static.flickr.com/{$server}/{$id}_{$secret}_b.jpg" alt="{$title}" />';

      return tmpl.replace(/{\$([a-z]+)}/g, function(match, key) {
        return entry[key];
      });
    }
  }
});
