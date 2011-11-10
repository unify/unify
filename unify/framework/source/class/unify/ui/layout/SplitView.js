/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.SplitView", {
  extend : qx.ui.layout.Abstract,
  
  construct : function(splitLevel) {
    this.base(arguments);
    
    if (splitLevel) {
      this.setSplitLevel(splitLevel);
    }
  },
  
  properties : {
    splitLevel : {
      init: 0.33
    }
  },
  
  members : {
    __left : null,
    __right : null,
    __title : null,
  
    renderLayout : function(availWidth, availHeight) {
      var children = this._getLayoutChildren();
      
      if (children.length != 2) {
        this.error("SplitView supports only exactly 2 children!");
      }
      
      var masterViewManager = children[0].getUserData("viewManager");
      if (availWidth < availHeight) {
        children[1].renderLayout(0, 0, availWidth, availHeight);
        if (masterViewManager) {
          masterViewManager.setDisplayMode("popover");
        }
      } else {
        var leftWidth = Math.round(availWidth * this.getSplitLevel());
        children[0].renderLayout(0, 0, leftWidth, availHeight);
        children[1].renderLayout(leftWidth, 0, availWidth-leftWidth, availHeight);
        if (masterViewManager) {
          masterViewManager.resetDisplayMode();
        }
      }
    }
  }
});
