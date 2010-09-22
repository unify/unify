/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Profile screen
 */
qx.Class.define("tweet.view.mobile.Profile",
{
  extend : unify.view.mobile.StaticView,
  type : "singleton",

  members :
  {
    /*
    ---------------------------------------------------------------------------
      VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    getTitle : function(type, param) {
      return "Profile";
    },    

    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);      

      var titlebar = new unify.ui.mobile.TitleBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.mobile.Content;
      layer.add(content);

      var html = '';
      html += '<ul>';
        html += '<li goto="search"><label>Search</label><hr/></li>';
      html += '</ul>';
      html += '<ul>';
        html += '<li goto="profile"><label>My Profile</label><hr/></li>';
        html += '<li goto="favorites"><label>My Favorites</label><hr/></li>';
        html += '<li goto="lists"><label>My Lists</label><hr/></li>';
      html += '</ul>';
      html += '<ul>';
        html += '<li><label>A list item with text</label><hr/></li>';
        html += '<li><label>A list item with really nice long text which do not fit the available space</label><hr/></li>';
        html += '<li><label>A list item with really nice long text which do not fit the available space</label><em>300</em><hr/></li>';
      html += '</ul>';             
      content.add(html);
    
      return layer;
    }     
  }
});
