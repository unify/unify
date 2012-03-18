core.Interface("unify.ui.container.scroll.IIndicator", {
  
  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */
  
  events : {
    indicatorMoveStart : lowland.events.DataEvent,
    indicatorMoveEnd : lowland.events.DataEvent,
    indicatorMove : lowland.events.DataEvent
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