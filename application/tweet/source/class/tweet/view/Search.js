/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Displays details of Twitter users.
 */
qx.Class.define("tweet.view.Search", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    __control : null,
    __query : null,
    __button : null,
    __list : null,



    /*
    ---------------------------------------------------------------------------
      VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    getTitle : function(type, param) {
      return "Search";
    },
    

    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);
      layer.add(new unify.ui.mobile.TitleBar(this));

      // Create search pane
      var control = this.__control = new unify.ui.mobile.Content;
      control.add('<div class="search"><input type="search"/><button exec="search">Submit</button></div>');
      layer.add(control);
      this.__query = control.query("input");
      this.__button = control.query("button");

      // Create list
      var scrollview = this.__list = new unify.ui.mobile.ScrollView();
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
      return tweet.business.TwitterAnon.getInstance();
    },
    
    
    // overridden
    _getServiceName : function() {
      return "search";
    },
    
    
    // overridden
    _hasServiceRequestParams : function() {
      return this.__query.value.length > 0;
    },
    
    
    // overridden
    _getServiceParams : function() 
    {
      return { 
        query : encodeURIComponent(this.__query.value)
      };
    },    
    
    
    // overridden
    _renderData : function(data)
    {
      // Update list
      var html = "<ul>" + data.results.map(this.__renderItem, this).join("") + "</ul>";
      this.__list.replace(html);      
    },
    
    
    // overridden
    _isReadyForService : function() {
      return this.isCreated() && this.__query.value.length > 0;
    },
      
      


    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */      
      
    /**
     * Executed when clicking on the send button.
     * 
     * @param e {qx.event.type.Mouse} The mouse event
     */
    search : function(e) 
    {
      this.__list.clear();
      this.refresh();
    },
      



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /**
     * Converts an entry from the Twitter business layer to HTML markup which is
     * used to fill the list.
     * 
     * @param entry {Map} Single tweet entry
     */
    __renderItem : function(entry) 
    {
      var Twitter = tweet.util.Twitter;
      
      var html = "";
      html += '<li goto="status:' + entry.id + '">';
        html += '<img src="' + Twitter.getIcon(entry) + '"/>';
        html += '<div>'
          html += '<h3>' + entry.from_user + '</h3>';
          html += '<small>' + Twitter.getFormattedDate(entry) + '</small>';
          html += '<p>' + Twitter.getFormattedText(entry) + '</p>';
        html += '</div>';
      html += '</li>';
      
      return html;
    }
  }
});
