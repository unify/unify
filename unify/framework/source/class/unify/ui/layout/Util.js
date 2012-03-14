core.Module("unify.ui.layout.Util", {
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
    var border = widget.getBorder();
    return border.left + widget.getMarginLeft() + border.right + widget.getMarginRight() || 0;
  },
  
  calculateVerticalGap : function(widget) {
    var border = widget.getBorder();
    return border.top + widget.getMarginTop() + border.bottom + widget.getMarginBottom() || 0;
  }
});