/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Search for a name of a city to lookup weather for.
 */
qx.Class.define("googly.view.WeatherSearch", 
{
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Search";
    },
    
    
    // overridden
    isModal : function() {
      return false;
      return true;
    },
    
    
    // overridden
    _createView : function() 
    {
      var navigationBar = new unify.ui.widget.container.NavigationBar(this);
      this.add(navigationBar);

      var searchField = this.__searchField = new unify.ui.widget.form.Input();
      searchField.setHeight(50);
      //searchField.setStyle(inputStyles);
      
      this.add(searchField);
    },
    
    
    // overridden
    _resumeView : function()
    {
      this.base(arguments);
      
      this.__searchField.value = unify.bom.Storage.get("weather/city");
    },
    
    
    // overridden
    _pauseView : function() 
    {
      this.base(arguments);
      
      if (this.__searchField.value != unify.bom.Storage.get("weather/city")) {
        unify.bom.Storage.set("weather/city", this.__searchField.value);
      }
    }
  }
});
