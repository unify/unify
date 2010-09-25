/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * List of all people who the current user is following or are following her/him.
 */
qx.Class.define("tweet.view.mobile.Userlist",
{
  extend : unify.view.mobile.RemoteView,
  type : "singleton",

  members :
  {
    __content : null,

    
    
    /*
    ---------------------------------------------------------------------------
      ABSTRACT VIEW INTERFACE
    ---------------------------------------------------------------------------
    */
    
    // overridden
    getDefaultSegment : function() {
      return "followers";
    },
        
    
    // overridden
    getTitle : function(type, param) 
    {
      if (type == "tab-bar") {
        return "Users";
      }
      
      if (!param) {
        param = this.getSegment();
      }
            
      return param === "friends" ? "Friends" : "Followers"; 
    },

        
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);

      var toolbar = new unify.ui.mobile.ToolBar(this);
      toolbar.add({ icon : true, exec : "refresh", target : "left" });
      layer.add(toolbar);

      var segmented = new unify.ui.mobile.Segmented(this);
      segmented.add({ label : "Friends", segment : "friends" });
      segmented.add({ label : "Followers", segment : "followers" });
      toolbar.add(segmented);      
      
      var scrollview = this.__content = new unify.ui.mobile.ScrollView();
      scrollview.setEnableScrollX(false);
      layer.add(scrollview);
      
      return layer;
    },
    
    
    
    
    /*
    ---------------------------------------------------------------------------
      BUSINESS LAYER VIEW INTERFACE
    ---------------------------------------------------------------------------
    */    
    
    // overridden
    _getBusinessObject : function() {
      return tweet.business.TwitterAuth.getInstance();
    },
    
    
    // overridden
    _getServiceName : function() {
      return this.getSegment();
    },
    
    
    // overridden
    _getRenderVariant : function() {
      return this.getSegment();
    },
    

    // overridden
    _renderData : function(data)
    {
      var html = data.map(this._renderItem, this).join("");
      this.__content.replace("<ul>" + html + "</ul>");
    },  


    // overridden
    _errorHandler : function(reason, detail) {
      this.error("Could not load data: " + reason + ": " + detail);
    },

    
    

    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */      
    
    /**
     * Creates the markup for a single contact entry
     *
     * @param item {Map} Item data
     */
    _renderItem : function(item)
    {
      return '<li goto="user:' + item.screen_name + '">' +
        '<img src="' + item.profile_image_url + '"/>' +
        '<label>' + item.name + '</label><hr/></li>';
    }
  }
});
