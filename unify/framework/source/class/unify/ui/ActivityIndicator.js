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
  //TODO implement as widget
  extend : qx.core.Object,//unify.ui.Overlay,
  type : "singleton",


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __elem : null,
    
    /**
     * sets the text on the element
     * @param text
     */
    setText: function(text){

       console.log('AI settext: '+text);//this.getElement().innerHTML='<div></div>'+text;
    },

    show : function(){
      console.log('AI show');
    },

    hide : function(){
      console.log('AI hide');
    },
    // overridden
    _createElement : function()
    {
      var elem = this.__elem=this.base(arguments);

      elem.innerHTML = '<div></div>Loading Data...';
      elem.id = "activity";

      return elem;
    },
    getElement: function(){
      return null;
    }
  }
});
