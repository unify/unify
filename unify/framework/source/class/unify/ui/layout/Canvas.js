/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.ui.layout.Canvas", {
  include : [unify.ui.layout.Base],
  
  construct : function() {
    unify.ui.layout.Base.call(this);
  },
  
  members : {
    __childrenCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        var leftGap = unify.ui.layout.Util.calculateLeftGap(widget);
        var rightGap = unify.ui.layout.Util.calculateRightGap(widget);
        var topGap = unify.ui.layout.Util.calculateTopGap(widget);
        var bottomGap = unify.ui.layout.Util.calculateBottomGap(widget);
        
        var left = 0;
        var top = 0;
        var right = -1;
        var bottom = -1;

        if (calc.edge) {
          calc.left = edge;
          calc.top = edge;
          calc.right = edge;
          calc.bottom = edge;
        }
        
        var cleft = calc.left;
        var ctop = calc.top;
        var cright = calc.right;
        var cbottom = calc.bottom;
        
        if (cleft) {
          if (cleft == "center") {
            left = Math.round(availWidth / 2 - (size.width+leftGap+rightGap) / 2);
            cright = null;
          } else if (typeof(cleft) == "string" && cleft.indexOf("%") > -1) {
            left = Math.round(availWidth * parseInt(cleft, 10) / 100) + leftGap;
          } else {
            left = parseInt(cleft, 10) + leftGap;
          }
        }
        
        if (ctop) {
          if (ctop == "center") {
            top = Math.round(availHeight / 2 - (size.height+topGap+bottomGap) / 2);
            cbottom = null;
          } else if (typeof(ctop) == "string" && ctop.indexOf("%") > -1) {
            top = Math.round(availHeight * parseInt(ctop, 10) / 100) + topGap;
          } else {
            top = parseInt(ctop, 10) + topGap;
          }
        }
        
        if (cright) {
          if (typeof(cright) == "string" && cright.indexOf("%") > -1) {
            right = Math.round(availWidth * parseInt(ctop, 10) / 100) - rightGap;
          } else {
            right = parseInt(cright, 10) - rightGap;
          }
        }
        
        if (cbottom) {
          if (typeof(cbottom) == "string" && cbottom.indexOf("%") > -1) {
            bottom = Math.round(availWidth * parseInt(ctop, 10) / 100) - bottomGap;
          } else {
            bottom = parseInt(cbottom, 10) - bottomGap;
          }
        }
        
        var width;
        var height;
        
        if (right == -1) {
          if (size.width > 0) {
            width = size.width;
          } else {
            width = availWidth;
          }
        } else {
          width = availWidth - right;
        }
        
        if (bottom == -1) {
          if (size.height > 0) {
            height = size.height;
          } else {
            height = availHeight;
          }
        } else {
          height = availHeight - bottom;
        }
        
        widget.renderLayout(left, top, width, height);
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
      }
      
      return null;
    },
    
    __rebuildChildrenCache : function() {
      this.__childrenCache = this._getLayoutChildren();
    }
  }
});