qx.Class.define("widgets.Theme", {
  extend: unify.ui.widget.styling.Theme,
  
  construct : function() {
    var styles = {
      test : {
        backgroundColor: "yellow",
        borderColor: "green green green green",
        children :  {
          test1 : {
            backgroundColor : "orange"
          },
          test2 : {
            backgroundColor : "purple"
          }
        }
      }
    };
    
    this.base(arguments, styles);
  }
});
