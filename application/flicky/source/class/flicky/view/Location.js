/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Shows meta data of selected photo
 */
qx.Class.define("flicky.view.Location",
{
  extend : unify.view.ServiceView,
  type : "singleton",

  members :
  {
    __content : null,
    __template : null,
    
    
    // overridden
    getTitle : function(type) {
      return "Location";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      layer.add(titlebar);

      var content = this.__content = new unify.ui.Content;
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
    _getRenderVariant : function() {
      return flicky.view.Photo.getInstance().getParam();
    },
    
    
    // overridden
    _getServiceParams : function() 
    {
      return {
        "photo" : flicky.view.Photo.getInstance().getParam()
      };      
    },
    
    
    // overridden
    _renderData : function(data) 
    {
      var template = this.__template;
      if (!template)
      {
        var html = "<ul>";
        html += "<li><label>Longitude</label><span>{longitude}</span></li>";
        html += "<li><label>Latitude</label><span>{latitude}</span></li>";
        html += "<li><label>Accuracy</label><span>{accuracy}</span></li>";
        html += "</ul>";
        
        template = this.__template = new qx.util.Template(html);
      }
      
      var photo = data.query.results.photo.location;
      this.__content.replace(template.run(location));
    }    
  }
});
