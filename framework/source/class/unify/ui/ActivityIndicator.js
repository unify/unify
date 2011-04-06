/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Activity indicator to show activities like loading of data
 */
qx.Class.define("unify.ui.ActivityIndicator",
{
  extend : unify.ui.Overlay,
  type : "singleton",


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * sets the text on the element
     * @param text
     */
    setText: function(text){
       this.getElement().innerHTML=text;
    },
    // overridden
    _createElement : function()
    {
      var elem = this.__elem=this.base(arguments);

      elem.innerHTML = "Loading data...";
      elem.id = "activity";

      return elem;
    }
  }
});
