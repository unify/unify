/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Shows owner details of the selected photo
 */
qx.Class.define("flicky.view.Owner",
{
  extend : unify.view.ServiceView,
  type : "singleton",

  members :
  {
    __content : null,
    __template : null,
    
    
    // overridden
    getTitle : function(type) {
      return "Owner";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
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
        html += "<li><label>Name</label><span>{realname}</span></li>";
        html += "<li><label>Nick</label><span>{username}</span></li>";
        html += "</ul>";
        
        template = this.__template = new qx.util.Template(html);
      }
      
      var owner = data.query.results.photo.owner;
      this.__content.replace(template.run(owner));
    }    
  }
});
