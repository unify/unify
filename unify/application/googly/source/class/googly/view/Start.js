/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Start View
 */
qx.Class.define("googly.view.Start", 
{
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Googly";
    },

    
    // overridden
    _createView : function() 
    {
      var navigationBar = new unify.widget.container.NavigationBar(this);
      this.add(navigationBar);
      
      var text = "Welcome to Googly - The Ultimate Google Experience";
      
      var content = new unify.widget.basic.Label(text);
      this.add(content);
      content.set({
        width: 500,
        height: 50
      });
      content.setStyle({
        paddingLeft: "10px",
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBottom: "10px"
      });
    }
  }
});
