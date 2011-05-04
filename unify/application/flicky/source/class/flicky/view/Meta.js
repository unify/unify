/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Shows meta data of selected photo
 */
qx.Class.define("flicky.view.Meta",
{
  extend : unify.view.ServiceView,
  type : "singleton",

  properties :
  {
    // overridden
    modal : 
    {
      refine : true,
      init : true
    }
  },

  members :
  {
    __content : null,
    __template : null,
    
    
    // overridden
    getTitle : function(type) {
      return "Meta Data";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      navigationBar.setRightItems([{label:"Done", rel:"close", kind:"button"}]);
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
      if(!data){
        this.__content.clear();
        return;
      }
      var template = this.__template;
      if (!template)
      {
        var html = "<ul>";
        html += "<li><label>Title</label><span>{title}</span></li>";
        html += "<li><label>ID</label><span>{id}</span></li>";
        html += "<li goto=\"owner\"><label>Owner</label><hr/></li>";
        html += "<li goto=\"location\"><label>Location</label><hr/></li>";
        html += "<li><label>Description</label><span>{description}</span></li>";
        html += "<li><label>Comments</label><span>{comments}</span></li>";
        html += "</ul>";
        
        template = this.__template = new qx.util.Template(html);
      }
      
      var photo = data.query.results.photo;
      this.__content.replace(template.run(photo));
    }    
  }
});
