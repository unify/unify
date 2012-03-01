/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.ui.layout.Basic", {
  include : [unify.ui.layout.Base],
  
  members : {
    __childrenCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      var children = this._getLayoutChildren();
      
      var widget;
      var size;
      var props;
      var left;
      var top;
      
      for (var i=0,ii=children.length; i<ii; i++) {
        widget = children[i];
        size = widget.getSizeHint();
        props = widget.getLayoutProperties();
        
        left = unify.ui.layout.Util.calculateLeftGap(widget) + (props.left || 0);
        top = unify.ui.layout.Util.calculateTopGap(widget) + (props.top || 0);
        
        widget.renderLayout(left, top, size.width, size.height);
      }
    },
    
    _computeSizeHint : function() {
      var children = this._getLayoutChildren();
      
      var widget;
      var size;
      var props;
      var width;
      var height;
      var childWidth = 0;
      var childHeight = 0;
      
      for (var i=0,ii=children.length; i<ii; i++) {
        widget = children[i];
        size = widget.getSizeHint();
        props = widget.getLayoutProperties();
        
        childWidth = unify.ui.layout.Util.calculateHorizontalGap(widget) + size.width + (props.left || 0);
        childHeight = unify.ui.layout.Util.calculateVerticalGap(widget) + size.height + (props.top || 0);
        
        if (childWidth > width) {
          width = childWidth;
        }
        if (childHeight > height) {
          height = childHeight;
        }
      }
      
      return {
        width: width,
        height: height
      };
    }
  }
});