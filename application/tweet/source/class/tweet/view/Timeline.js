/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Shows Twitter timelines e.g. the friends or user timeline.
 */
qx.Class.define("tweet.view.Timeline",
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members :
  {
    __content : null,
    

    /*
    ---------------------------------------------------------------------------
      VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    getDefaultSegment : function() {
      return "updates";
    },
    

    // overridden
    getTitle : function(type, param) 
    {
      if (type == "tab-bar") {
        return "Timeline";
      }
      
      if (!param) {
        param = this.getSegment();
      }      
      
      return param == "sent" ? "Sent" : "Updates";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);

      var toolbar = new unify.ui.ToolBar(this);
      toolbar.add({ icon : true, exec : "refresh", target : "left" });
      toolbar.add({ label : "New", jump : "compose", target : "right" });
      
      var segmented = new unify.ui.Segmented(this);
      segmented.add({ label : "Updates", segment : "updates" });
      segmented.add({ label : "Sent", segment : "sent" });
      toolbar.add(segmented);      

      layer.add(toolbar);
      
      var scrollview = this.__content = new unify.ui.ScrollView();
      scrollview.setEnableScrollX(false);
      layer.add(scrollview);
      
      return layer;   
    },
    
    
    
    /*
    ---------------------------------------------------------------------------
      SERVICE VIEW INTERFACE
    ---------------------------------------------------------------------------
    */
    
    // overridden
    _getBusinessObject : function() {
      return tweet.business.TwitterAnon.getInstance();
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
      console.debug("DATA", data);
      
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
     * Converts an entry from the Twitter business layer to HTML markup
     * which is used to fill the list.
     *
     * @param entry {Map} Single tweet entry
     */
    _renderItem : function(entry)
    {
      var Twitter = tweet.util.Twitter;
      var html = "";

      html += '<li goto="status:' + entry.id + '">';
        html += '<img src="' + Twitter.getIcon(entry) + '"/>';
        html += '<div>'
          html += '<h3>' + entry.user.name + '</h3>';
          html += '<small>' + Twitter.getFormattedDate(entry) + '</small>';
          html += '<p>' + Twitter.getFormattedText(entry) + '</p>';
        html += '</div>';
      html += '</li>';

      return html;
    }
  }
});
