/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Global activity indicator manager managing multiple activities on one indicator
 */
core.Class("unify.ui.manager.ActivityIndicatorManager", {
  include: [unify.core.Object],
  
  construct : function() {
    unify.core.Object.call(this);
    
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
      if (core.Env.getValue("debug")) {
        if (!am[id]) {
          throw new Error("Activity indicator " + id + " is not shown!");
        }
      }
      am[id]--;
      // TODO !!
      if (true || am[id] == 0) {
        this.__activeIds.remove(id);
      }
      
      if (this.__activeIds.length <= 0) {
        var overlay = this._getActivityIndicator();
        unify.ui.core.PopOverManager.getInstance().hide(overlay);
      }
    }
  }
});

unify.core.Singleton.annotate(unify.ui.manager.ActivityIndicatorManager);