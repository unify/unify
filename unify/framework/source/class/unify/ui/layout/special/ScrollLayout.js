/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.ui.layout.special.ScrollLayout", {
  include : [unify.ui.layout.Base],
  
  construct : function() {
    unify.ui.layout.Base.call(this);
  },

  members : {
    __content : null,
    __indicatorX : null,
    __indicatorY : null,

    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }

      var indicatorX = this.__indicatorX;
      if(indicatorX){
        var indicatorXSize = indicatorX.getSizeHint();
        var indicatorXProp = this.__indicatorXProp;
        indicatorX.renderLayout(0, availHeight-indicatorXSize.height-indicatorXProp.distance,
                                availWidth-indicatorXProp.distance,indicatorXSize.height);
      }


      var indicatorY = this.__indicatorY;
      if(indicatorY){
        var indicatorYSize = indicatorY.getSizeHint();
        var indicatorYProp = this.__indicatorYProp;
        indicatorY.renderLayout(availWidth-indicatorYSize.width-indicatorYProp.distance, 0,
                                indicatorYSize.width, availHeight-indicatorYProp.distance);
      }


      var content = this.__content;
      var contentSizeHint = content.getSizeHint();

      var widget = this._getWidget();
      var enableScrollX = widget.getEnableScrollX();
      var enableScrollY = widget.getEnableScrollY();

      var contentWidth = enableScrollX ? Math.max(availWidth, contentSizeHint.width) : availWidth;
      var contentHeight = enableScrollY ? Math.max(availHeight, contentSizeHint.height) : availHeight;

      content.renderLayout(0, 0, contentWidth, contentHeight);
    },

    /**
     * Rebuild children cache
     */
    __rebuildCache : function() {
      var widgets = this._getLayoutChildren();

      for (var i=0,ii=widgets.length; i<ii; i++) {
        var child = widgets[i];

        var childProp = child.getLayoutProperties();
        var type = childProp.type;

        if (type == "content") {
          this.__content = child;
          this.__contentProp = childProp;
        } else if (type == "indicatorX") {
          this.__indicatorX = child;
          this.__indicatorXProp = childProp;
        } else if (type == "indicatorY") {
          this.__indicatorY = child;
          this.__indicatorYProp = childProp;
        } else {
          throw "Unknown type " + type;
        }
      }
    }
  }
});