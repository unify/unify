qx.Mixin.define("unify.ui.widget.core.MRemoteChildrenHandling", {
  include : qx.ui.core.MRemoteChildrenHandling,

  members : {
    setStyle : function(map) {
      this.getChildrenContainer().setStyle(map);
    },

    getStyle : function(name, computed) {
      return this.getChildrenContainer().getStyle(name, computed);
    }
  }
});
