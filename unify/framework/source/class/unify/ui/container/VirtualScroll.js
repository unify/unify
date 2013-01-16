core.Class("unify.ui.container.VirtualScroll", {
	include : [unify.ui.container.Scroll],
	
	construct : function(elementWidth, elementHeight, widgetFactory, widgetUpdater, prerenderRows) {
		unify.ui.container.Scroll.call(this, new unify.ui.layout.Basic());
		
		this.addListener("scroll", this.__onVirtualScroll, this);
		this.__elementHeight = elementHeight;
		this.__elementWidth = elementWidth;
		
		this.__widgetFactory = widgetFactory;
		this.__widgetUpdater = widgetUpdater;
		
		this.__prerenderRows = prerenderRows || 0;
		
		this.__widgetPool = [];
		this.__widgetMap = [];
		
		this.addListener("resize", function() {
			//this.__onVirtualScroll();
		}, this);
	},
	
	properties : {
		model : {
			init: null,
			nullable: true,
			apply: function(value) { this.__applyModel(value); },
			fire: "changeModel"
		},
		
		columns : {
			init: 1,
			type: "integer"
		},
		
		offsetX : {
			init: 0,
			apply : function() { this.__onVirtualScroll() }
		},
		
		offsetY : {
			init: 0,
			apply : function() { this.__onVirtualScroll() }
		}
	},
	
	events : {
		changeModel: lowland.events.Event
	},
	
	members : {
		__prerenderRows : 0,
		__elementHeight : 100,
		__elementWidth : null,
		__widgetPool : null,
		__widgetFactory : null,
		__widgetUpdater : null,
		__widgetMap : null,
		__isInit : null,
		
		__applyModel : function(model) {
			this.getChildrenContainer().setHeight(Math.ceil(model.length / this.getColumns()) * this.__elementHeight);
			this.__isInit = true;
			
			var widgetMap = this.__widgetMap;
			for (var row in widgetMap) {
				var widgetRow = widgetMap[row];
				for (var col in widgetRow) {
					this.__pushWidgetToPool(widgetRow[col]);
				}
			}
			this.__widgetMap = [];
			
			this.__onVirtualScroll();
		},
		
		__oldOffsetX : null,
		__oldOffsetY : null,
		
		__onVirtualScroll : function() {
			if (!this.__isInit) {
				return;
			}
			
			var currentPos = this.getScrollTop();
			if(currentPos < 0 || currentPos > this.getContentHeight()){
				return; // no need to do anything on overshoot
			}
			
			var currentHeight = this._getClientHeight();
			
			var widgetMap = this.__widgetMap;
			
			var maxElementHeight = this.__elementHeight;
			var startRow = Math.floor(currentPos / maxElementHeight) - this.__prerenderRows;
			var endRow = Math.floor((currentPos + currentHeight) / maxElementHeight) + this.__prerenderRows;
			
			// Move all widgets not shown anymore to widget pool
			for (var row in widgetMap) {
				if (row < startRow || row > endRow) {
					var widgets = widgetMap[row];
					delete widgetMap[row];
					for (var col in widgets) {
						this.__pushWidgetToPool(widgets[col]);
					}
				}
			}
			
			var offsetX = this.getOffsetX();
			var offsetY = this.getOffsetY();
			var changedOffset = false;
			
			if ((offsetX != this.__oldOffsetX) || (offsetY != this.__oldOffsetY)) {
				this.__oldOffsetX = offsetX;
				this.__oldOffsetY = offsetY;
				
				changedOffset = true;
			}
			
			var elementWidth = this.__elementWidth;
			var elementHeight = this.__elementHeight;
			
			// If new rows appears that have no rendered widgets, do it
			for (var row = startRow; row <= endRow; row++) {
				var columns = this.getColumns();
				for (var i=0; i<columns; i++) {
					if ((!widgetMap[row]) || (!widgetMap[row][i])) {
						this.__createWidget(i, row, offsetX, offsetY);
					} else if (changedOffset) {
						var widget = widgetMap[row][i];
						var left = i*elementWidth+offsetX;
						var top = row*elementHeight+offsetY;
						widget.overrideLayoutTransform(left, top);
					}
				}
			}
			
		},
		
		__createWidget : function(column, row, offsetX, offsetY) {
			var widgetUpdater = this.__widgetUpdater;
			var widget = this.__getWidgetFromPool();
			
			this.add(widget);
			
			var left = column*this.__elementWidth+offsetX;
			var top = row*this.__elementHeight+offsetY;
			widget.overrideLayoutTransform(left, top);
			
			if (!this.__widgetMap[row]) {
				this.__widgetMap[row] = {};
			}
			this.__widgetMap[row][column] = widget;
			
			var pos = row * this.getColumns() + column;
			widgetUpdater.lazy(this, widget, column, row, this.getModel()[pos]);
		},
		
		__getWidgetFromPool : function() {
			var widgetPool = this.__widgetPool;
			if (widgetPool.length > 0) {
				return widgetPool.pop();
			} else {
				return this.__widgetFactory();
			}
		},
		
		__pushWidgetToPool : function(widget) {
			widget.overrideLayoutTransform(0, -100000);
			this.__widgetPool.push(widget);
			this.__widgetUpdater(widget, null, null, false);
		},
	}
});