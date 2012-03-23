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
      console.log("===============");
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        var leftGap = widget.getMarginLeft(); //unify.ui.layout.Util.calculateLeftGap(widget);
        var rightGap = widget.getMarginRight(); //unify.ui.layout.Util.calculateRightGap(widget);
        var topGap = widget.getMarginTop(); //unify.ui.layout.Util.calculateTopGap(widget);
        var bottomGap = widget.getMarginBottom(); //unify.ui.layout.Util.calculateBottomGap(widget);
        
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
        
        if (cleft != null) {
          if (cleft == "center") {
            left = Math.round(availWidth / 2 - (size.width+leftGap+rightGap) / 2);
            cright = null;
          } else if (typeof(cleft) == "string" && cleft.indexOf("%") > -1) {
            left = Math.round(availWidth * parseInt(cleft, 10) / 100) + leftGap;
          } else {
            left = parseInt(cleft, 10) + leftGap;
          }
        }
        
        if (ctop != null) {
          if (ctop == "center") {
            top = Math.round(availHeight / 2 - (size.height+topGap+bottomGap) / 2);
            cbottom = null;
          } else if (typeof(ctop) == "string" && ctop.indexOf("%") > -1) {
            top = Math.round(availHeight * parseInt(ctop, 10) / 100) + topGap;
          } else {
            top = parseInt(ctop, 10) + topGap;
          }
        }
        
        if (cright != null) {
          if (typeof(cright) == "string" && cright.indexOf("%") > -1) {
            right = Math.round(availWidth * parseInt(ctop, 10) / 100) - rightGap;
          } else {
            right = parseInt(cright, 10) + rightGap;
          }
        }
        
        if (cbottom != null) {
          if (typeof(cbottom) == "string" && cbottom.indexOf("%") > -1) {
            bottom = Math.round(availWidth * parseInt(ctop, 10) / 100) - bottomGap;
          } else {
            bottom = parseInt(cbottom, 10) + bottomGap;
          }
        }
        
        var width;
        var height;

        if (right == -1) {
          var swidth = size.width;
          if (swidth > 0 && swidth < availWidth) {
            width = size.width;
          } else {
            width = availWidth;
          }
        } else {
          width = availWidth - right - left;
        }
        
        if (bottom == -1) {
          var sheight = size.height;
          if (sheight > 0 && sheight < availHeight) {
            height = size.height;
          } else {
            height = availHeight;
          }
        } else {
          height = availHeight - bottom - top;
        }

        if (this._getWidget().constructor == "[class ppbase.ui.NavigationControls]") {
          console.log(widget.constructor, left, top, width, height, widget.getAppearance());
        }
        widget.renderLayout(left, top, width, height);
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var width = 0;
      var height = 0;
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        width = Math.max(width, size.minWidth);
        height = Math.max(height, size.minHeight);
      }
      
      return {
        width: width,
        height: height
      };
    },
    
    __rebuildChildrenCache : function() {
      this.__childrenCache = this._getLayoutChildren();
    }
  }
});