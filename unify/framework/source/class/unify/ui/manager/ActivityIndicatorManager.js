qx.Class.define("unify.ui.manager.ActivityIndicatorManager", {
  type : "singleton",
  extend: qx.core.Object,
  
  members : {
    __activityIndicator : null,
    
    _getActivityIndicator : function() {
      var ai = this.__activityIndicator;
      if (ai) {
        return ai;
      }
      
      ai = this.__activityIndicator  = new unify.ui.container.SimpleOverlay();
      ai.set({
        width: 300,
        height: 300
      });
      ai.setStyle({
        marginLeft: -150,
        marginTop: -150
      });
      
      ai.add(new unify.ui.other.ActivityIndicator());
      
      return ai;
    },
    
    show : function(id) {
      var overlay = this._getActivityIndicator();
      unify.ui.core.PopOverManager.getInstance().show(overlay);
    },
    
    hide : function(id) {
      var overlay = this._getActivityIndicator();
      unify.ui.core.PopOverManager.getInstance().hide(overlay);
    }
  }
});