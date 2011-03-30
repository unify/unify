qx.Class.define("unify.ui.widget.layout.NavigationBar", {
  extend : qx.ui.layout.Abstract,
  
  statics : {
    SPACER : 6,
  },
  
  members : {
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var left = this.__left;
      var right = this.__right;
      var title = this.__title;
      
      var SPACER = this.self(arguments).SPACER;
      var i,ii,e,hint,leftx=SPACER,rightx=availWidth-SPACER,top;
      
      for (i=0,ii=left.length;i<ii;i++) {
        e = left[i];
        hint = e.getSizeHint();

        top = availHeight / 2 - hint.height / 2;
        e.renderLayout(leftx, top, hint.width, hint.height);
        leftx += hint.width + SPACER;
      }
      
      for (i=right.length-1;i>=0;i--) {
        e = right[i];
        hint = e.getSizeHint();
        
        rightx -= hint.width + SPACER;
        top = availHeight / 2 - hint.height / 2;
        e.renderLayout(rightx, top, hint.width, hint.height);
      }
      
      var availTitleWidth = rightx - leftx;
      hint = title.getSizeHint();
      var titleTop = Math.floor((availHeight / 2) - (hint.height / 2));
      if (hint.width > availTitleWidth) {
        title.renderLayout(leftx, titleTop, availTitleWidth, hint.height);
      } else {
        leftx = Math.floor((availTitleWidth / 2) - (hint.width / 2));
        title.renderLayout(leftx, titleTop, hint.width, hint.height);
      }
    },
    
    __rebuildCache : function() {
      var all = this._getLayoutChildren();
      var left = [];
      var right = [];
      var title = null;
      
      for (var i=0,ii=all.length; i<ii; i++) {
        var child = all[i];
        
        var position = child.getLayoutProperties().position;
        if (position == "title") {
          if (title) {
            throw new Error("It is not allowed to have more than one child aligned to 'title'!");
          }
          title = child;
        } else if (position == "left") {
          left.push(child);
        } else if (!position || position == "right") {
          right.push(child);
        } else {
          throw new Error("Position '"+position+"' is not supported!");
        }
      }
      
      this.__left = left;
      this.__right = right;
      this.__title = title;
    }
  }
});
