qx.Class.define("unify.ui.widget.styling.Theme", {
  extend: qx.core.Object,

  /**
   * new unify.ui.styling.Theme({
   *   "label" : {
   *     "borderLeft" : "1px solid red",
   *     "children" : {
   *       "mouseover" : {
   *         "borderLeft" : "3px solid green"
   *       }
   *     }
   *   }
   * });
   */
  construct : function(style) {
    this.__style = style;
  },
  
  members: {
    __style : null,
    
    getStyles : function(key) {
      var args = key.split(".");
      
      var styles = this.__style;
      var widgetStyle = {};
      
      for (var i=0,ii=args.length; styles && (i<ii); i++) {
        var arg = args[i];
        styles = styles[arg];
        if (!styles) {
          break;
        }
        
        qx.lang.Object.merge(widgetStyle, styles, true);
        styles = styles.children;
      }
      
      delete widgetStyle.children;
      
      return widgetStyle;
    }
  },
  
  destruct : function() {
    this.__style = null;
  }
});
