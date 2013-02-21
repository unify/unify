core.Interface("unify.ui.container.scroll.IIndicator", {
	
	/*
	----------------------------------------------------------------------------
		 EVENTS
	----------------------------------------------------------------------------
	*/
	
	events : {
		indicatorMoveStart : core.event.Simple,
		indicatorMoveEnd : core.event.Simple,
		indicatorMove : core.event.Simple
	},
	
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