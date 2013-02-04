core.Class("unify.ui.container.VirtualScroll", {
	include : [unify.ui.container.Scroll],
	
	construct : function(widgetFactory, widgetUpdater, prerenderRows) {
		unify.ui.container.Scroll.call(this, new unify.ui.layout.Basic());
		
		this.addListener("scroll", this.__onVirtualScroll, this);
		
		this.__widgetFactory = widgetFactory;
		this.__widgetUpdater = widgetUpdater;
		
		this.__prerenderRows = prerenderRows || 0;
		
		this.__widgetPool = [];
		this.__widgetMap = [];
		
		this.addListener("resize", function() {
			this.__reflow();
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
			type: "Integer",
			apply: function(value) { this.__applyColumns(value); }
		},
		
		offsetX : {
			init: 0,
			apply : function() { this.__onVirtualScroll(); }
		},
		
		offsetY : {
			init: 0,
			apply : function() { this.__onVirtualScroll(); }
		},
		
		elementWidth : {
			init: 50,
			apply: function() { this.__reflow(); }
		},
		
		elementHeight : {
			init: 100,
			apply: function() { this.__reflow(); }
		}
	},
	
	events : {
		changeModel: lowland.events.Event
	},
	
	members : {
		__prerenderRows : 0,
		__widgetPool : null,
		__widgetFactory : null,
		__widgetUpdater : null,
		__widgetMap : null,
		__maximalRows : 0,
		__isInit : null,
		
		getCurrentWidgets : function() {
			return this.__widgetMap;
		},
		
		__applyModel : function(model) {
			var rows = Math.ceil(model.length / this.getColumns());
			this.getChildrenContainer().setHeight(rows * this.getElementHeight());
			this.__reflow();
		},

		__applyColumns : function(columns) {
			var model = this.getModel();
			if (model && columns > 0) {
				var rows = Math.ceil(model.length / columns);
				this.getChildrenContainer().setHeight(rows * this.getElementHeight());
				this.__reflow();
			}
		},

		__reflow : function() {
			if (!this.getModel()) {
				return;
			}
			this.__isInit = true;
			
			this.__maximalRows = Math.ceil(this.getModel().length / this.getColumns());
			
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
			
			var maxElementHeight = this.getElementHeight();
			var startRow = Math.floor(currentPos / maxElementHeight) - this.__prerenderRows;
			var endRow = Math.floor((currentPos + currentHeight) / maxElementHeight) + this.__prerenderRows;
			
			if (startRow < 0) {
				startRow = 0;
			}
			var maxEndRow = this.__maximalRows;
			if (endRow >= maxEndRow) {
				endRow = maxEndRow-1;
			}
			
			
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
			
			var elementWidth = this.getElementWidth();
			var elementHeight = this.getElementHeight();
			
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
			
			var left = column*this.getElementWidth()+offsetX;
			var top = row*this.getElementHeight()+offsetY;
			widget.overrideLayoutTransform(left, top);
			
			if (!this.__widgetMap[row]) {
				this.__widgetMap[row] = {};
			}
			this.__widgetMap[row][column] = widget;
			
			var pos = row * this.getColumns() + column;
			var model = this.getModel();
			
			if (pos >= model.length) {
				//widget.hide();
				widget.overrideLayoutTransform(0, -100000);
			} else {
				//widget.show();
				widgetUpdater.lazy(this, widget, column, row, model[pos]);
			}
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
		}
	}
});
