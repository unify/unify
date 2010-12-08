/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

qx.Class.define("unify.view.SplitViewManager",
{
  extend : qx.core.Object,

  construct : function(mainViewManager, detailViewManager)
  {
    this.base(arguments);

    this.__mainViewManager = mainViewManager;
    this.__detailViewManager = detailViewManager;
  },

  members :
  {
    getElement : function()
    {
      var elem = this.__element;
      if (!elem)
      {
        var elem = this.__element = document.createElement("div");
        elem.className = "split-view";
        elem.appendChild(this.__mainViewManager.getElement());
        elem.appendChild(this.__detailViewManager.getElement());
      }

      return elem;
    }
  }
});
