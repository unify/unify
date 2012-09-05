core.Interface("unify.ui.container.scroll.IIndicator", {
	
	/*
	----------------------------------------------------------------------------
		 EVENTS
	----------------------------------------------------------------------------
	*/
	
	/*events : {
		indicatorMoveStart : lowland.events.DataEvent,
		indicatorMoveEnd : lowland.events.DataEvent,
		indicatorMove : lowland.events.DataEvent
	},*/
	
	properties : {
		/** Orientation of the scroll indicator */
		//orientation : { type : ["horizontal", "vertical"] },

		/** Whether the indicator is visible */
		visible : { type : "Boolean" },
		
		/** parent scroll container of this indicator */
		scroll : { /*type:"unify.ui.container.Scroll"*/ }
	},
	
	members : {
		render : function(scrollPosition) {},
		initRenderingCache : function(scroll) {}
	}
});