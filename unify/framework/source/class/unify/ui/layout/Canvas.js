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
        
        var left = 0;
        var top = 0;
        var right = 0;
        var bottom = 0;

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
            left = Math.round(availWidth / 2 - size.width / 2);
            cright = null;
          } else if (typeof(cleft) == "string" && cleft.indexOf("%") > -1) {
            left = Math.round(availWidth * parseInt(cleft, 10) / 100);
          } else {
            left = parseInt(cleft, 10);
          }
        }
        
        if (ctop) {
          if (ctop == "center") {
            top = Math.round(availHeight / 2 - size.height / 2);
            cbottom = null;
          } else if (typeof(ctop) == "string" && ctop.indexOf("%") > -1) {
            top = Math.round(availHeight * parseInt(ctop, 10) / 100);
          } else {
            top = parseInt(ctop, 10);
          }
        }
        
        if (cright) {
          if (typeof(cright) == "string" && cright.indexOf("%") > -1) {
            right = Math.round(availWidth * parseInt(ctop, 10) / 100);
          } else {
            right = parseInt(cright, 10);
          }
        }
        
        if (cbottom) {
          if (typeof(cbottom) == "string" && cbottom.indexOf("%") > -1) {
            bottom = Math.round(availWidth * parseInt(ctop, 10) / 100);
          } else {
            bottom = parseInt(cbottom, 10);
          }
        }
        
        widget.renderLayout(left, top, availWidth - right, availHeight - bottom);
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