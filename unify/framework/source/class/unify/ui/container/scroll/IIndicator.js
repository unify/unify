qx.Interface.define("unify.ui.container.scroll.IIndicator", {
  
  statics : {
    /** {Integer} Size of the scroll indicator */
    THICKNESS : 5,

    /** {Integer} Size of the end pieces */
    ENDSIZE : 3,

    /** {Integer} Distance from edges */
    DISTANCE : 2
  },
  
  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */
  
  events : {
    indicatorMoveStart : "qx.event.type.Data",
    indicatorMoveEnd : "qx.event.type.Data",
    indicatorMove : "qx.event.type.Data"
  },
  
  properties : {
    /** Orientation of the scroll indicator */
    orientation : { check : ["horizontal", "vertical"] },

    /** Whether the indicator is visible */
    visible : { check : "Boolean" },
    
    /** parent scroll container of this indicator */
    scroll : { check:"unify.ui.container.Scroll" }
  },
  
  members : {
    render : function(scrollPosition) {},
    initRenderingCache : function(scroll) {}
  }
});