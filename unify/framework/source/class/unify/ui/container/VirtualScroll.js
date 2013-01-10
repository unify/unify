core.Class("unify.ui.container.VirtualScroll", {
	include : [unify.ui.container.Scroll],
	
	construct : function(elementWidth, elementHeight, widgetFactory, widgetUpdater, layout) {
		unify.ui.container.Scroll.call(this, layout);
		
		this.addListener("scroll", this.__onVirtualScroll, this);
		this.__elementHeight = elementHeight;
		this.__elementWidth = elementWidth;
		
		this.__widgetFactory = widgetFactory;
		this.__widgetUpdater = widgetUpdater;
		
		this.__widgetPool = [];
		this.__widgetMap = [];
		
		this.addListener("resize", function() {
			this.__onVirtualScroll();
		}, this);
	},
	
	properties : {
		model : {
			init: null,
			nullable: true,
			apply: function(value) { this.__applyModel(value); }
		},
		
		columns : {
			init: 1,
			type: "integer"
		}
	},
	
	members : {
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
			var startRow = Math.floor(currentPos / maxElementHeight);
			var endRow = Math.floor((currentPos + currentHeight) / maxElementHeight);
			
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
			
			// If new rows appears that have no rendered widgets, do it
			for (var row = startRow; row <= endRow; row++) {
				var columns = this.getColumns();
				for (var i=0; i<columns; i++) {
					if ((!widgetMap[row]) || (!widgetMap[row][i])) {
						this.__createWidget(i, row);
					}
				}
			}
			
		},
		
		__createWidget : function(column, row) {
			var widgetUpdater = this.__widgetUpdater;
			var widget = this.__getWidgetFromPool();
			
			widgetUpdater(widget, column, row, false);
			this.add(widget);
			
			widget.overrideLayoutTransform(column*this.__elementWidth, row*this.__elementHeight);
			
			if (!this.__widgetMap[row]) {
				this.__widgetMap[row] = {};
			}
			this.__widgetMap[row][column] = widget;
			
			var pos = column * this.getColumns() + row;
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
		},
	}
});