qx.Class.define("unify.ui.layout.Util", {
  type: "static",
  
  statics: {
    calculateLeftGap : function(widget) {
      return widget.getBorder().left + widget.getMarginLeft() || 0;
    },
    
    calculateTopGap : function(widget) {
      return widget.getBorder().top + widget.getMarginTop() || 0;
    },
    
    calculateRightGap : function(widget) {
      return widget.getBorder().right + widget.getMarginRight() || 0;
    },
    
    calculateBottomGap : function(widget) {
      return widget.getBorder().bottom + widget.getMarginBottom() || 0;
    },
    
    calculateHorizontalGap : function(widget) {
      return unify.ui.layout.Util.calculateLeftGap(widget) + 
             unify.ui.layout.Util.calculateRightGap(widget);
    },
    
    calculateVerticalGap : function(widget) {
      return unify.ui.layout.Util.calculateTopGap(widget) +
             unify.ui.layout.Util.calculateBottomGap(widget); 
    }
  }
});