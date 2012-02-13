/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Global activity indicator manager managing multiple activities on one indicator
 */
qx.Class.define("unify.ui.manager.ActivityIndicatorManager", {
  type : "singleton",
  extend: qx.core.Object,
  
  construct : function() {
    this.base(arguments);
    
    this.__activeMap = {};
    this.__activeIds = [];
  },
  
  members : {
    __activityIndicator : null,
    __activeMap : null,
    __activeIds : null,
    
    _getActivityIndicator : function() {
      var ai = this.__activityIndicator;
      if (ai) {
        return ai;
      }
      
      ai = this.__activityIndicator  = new unify.ui.other.ActivityIndicator();
      ai.set({
        width: 300,
        height: 300
      });
      ai.setStyle({
        marginLeft: -150,
        marginTop: -150
      });
      
      return ai;
    },
    
    show : function(id) {
      if (!id) id = "undef";
      var am = this.__activeMap;
      if (!am[id]) {
        this.__activeIds.push(id);
        am[id] = 0;
        var overlay = this._getActivityIndicator();
        unify.ui.core.PopOverManager.getInstance().show(overlay, "center");
      }
      am[id]++;
    },
    
    hide : function(id) {
      if (!id) id = "undef";
      var am = this.__activeMap;
      if (qx.core.Environment.get("qx.debug")) {
        if (!am[id]) {
          throw new Error("Activity indicator " + id + " is not shown!");
        }
      }
      am[id]--;
      if (am[id] == 0) {
        qx.lang.Array.remove(this.__activeIds, id);
      }
      
      if (this.__activeIds.length <= 0) {
        var overlay = this._getActivityIndicator();
        unify.ui.core.PopOverManager.getInstance().hide(overlay);
      }
    }
  }
});