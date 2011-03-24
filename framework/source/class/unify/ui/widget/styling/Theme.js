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
      var styles = this.__style;
      var widgetStyle = styles[key];

      return widgetStyle;
    }
  },
  
  destruct : function() {
    this.__style = null;
  }
});
