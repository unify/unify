qx.Class.define("unify.ui.widget.core.Layer", {
  extend : unify.ui.widget.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],
  
  /**
   * @param layer {unify.ui.Layer} Base layer for widget system
   */
  construct : function(layer) {
    this.base(arguments);
    
    this._setLayout(new qx.ui.layout.Basic());
    
    this.__layer = layer;
    this.__elem = layer.getContentElement();
    
    layer.getView().addListener("appear", this.__viewAppear, this);
    layer.getView().addListener("disappear", this.__viewDisappear, this);
  },
  
  members: {
    __elem : null,
    __layer : null,
    
    isRootWidget : function() {
      return true;
    },
    
    _createElement : function() {
      return this.__elem;
    },
    
    __viewAppear : function() {
      this.renderChildren();
    },
    
    getSizeHint : function() {
      var Dimension = qx.bom.element2.Dimension;
      
      var e = this.getElement();

      var ret = {
        width: Dimension.getContentWidth(e),
        height: Dimension.getContentHeight(e)
      };
      
      return ret;
    },
    
    __viewDisappear : function() {
      this.setVisibility("hidden");
    }
  },
  
  destruct : function() {
    this.__layer.getView().removeListener("appear", this.__viewAppear);
    this.__layer.getView().removeListener("disappear", this.__viewDisappear);
  }
});
