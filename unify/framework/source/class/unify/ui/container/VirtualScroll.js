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
		this.__modelHashes = {};

		this.__debouncedReflow = core.Function.debounce(this.__reflow, 10);
		
		this.addListener("resize", function() {
			this.__debouncedReflow();
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
			apply : function() { this.__debouncedReflow(); }
		},
		
		offsetY : {
			init: 0,
			apply : function() { this.__debouncedReflow(); }
		},
		
		elementWidth : {
			init: 50,
			apply: function() { this.__debouncedReflow(); }
		},
		
		elementHeight : {
			init: 100,
			apply: function() { this.__debouncedReflow(); }
		}
	},
	
	events : {
		changeModel: core.event.Simple
	},
	
	members : {
		__prerenderRows : 0,
		__widgetPool : null,
		__widgetFactory : null,
		__widgetUpdater : null,
		__widgetMap : null,
		__maximalRows : 0,
		__isInit : null,
		
		/** Map used to find requested model/widget combinations to speed up model layout */
		__modelHashes : null,

		getCurrentWidgets : function() {
			return this.__widgetMap;
		},
		
		__applyModel : function(model) {
			var rows = Math.ceil(model.length / this.getColumns());
			this.getChildrenContainer().setHeight(rows * this.getElementHeight());
			this.__debouncedReflow();
		},

		__applyColumns : function(columns) {
			var model = this.getModel();
			if (model && columns > 0) {
				var rows = Math.ceil(model.length / columns);
				this.getChildrenContainer().setHeight(rows * this.getElementHeight());
				this.__debouncedReflow();
			}
		},

		__debouncedReflow : function() { this.__reflow(); },

		__reflow : function() {
			var model = this.getModel();
			if (!model) {
				return;
			}
			this.__isInit = true;
			
			this.__maximalRows = Math.ceil(model.length / this.getColumns());
			
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
			var row;
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
			for (row in widgetMap) {
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
			for (row = startRow; row <= endRow; row++) {
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
			var pos = row * this.getColumns() + column;
			var model = this.getModel();
			var widgetConfig = this.__getWidgetFromPool(model[pos]);
			var widget = widgetConfig.widget;
			if (!widgetConfig.fromPool) {
				this.add(widget);
				widget.forceAccelerated();
			}
			
			var left = column*this.getElementWidth()+offsetX;
			var top = row*this.getElementHeight()+offsetY;
			widget.overrideLayoutTransform(left, top);
			
			if (!this.__widgetMap[row]) {
				this.__widgetMap[row] = {};
			}
			this.__widgetMap[row][column] = widget;
			
			if (pos >= model.length) {
				//widget.hide();
				widget.overrideLayoutTransform(0, -100000);
			} else {
				//widget.show();
				//this.__widgetUpdater.lazy(this, widget, column, row, model[pos]);
				var widgetUpdater = lowland.Function.curryBind(this.__widgetUpdater, this, widget, column, row, model[pos]);
				core.Function.immediate(widgetUpdater);
			}
		},
		
		__getWidgetFromPool : function(model) {
			var widgetPool = this.__widgetPool;
			var adler32 = core.crypt.Adler32;
			var modelHash = adler32.checksum(JSON.stringify(model));
			var hashMap = this.__modelHashes;
			var widget;
			var widgetHash;

			if (widgetPool.length > 0) {

				//Here we check if there is a widget already defined with this model
				if(hashMap[modelHash]){
					
					//now get the corresponding widget from the array...urgs
					for(var i = 0; i<widgetPool.length; i++){
						if(lowland.ObjectManager.getHash(widgetPool[i]) === hashMap[modelHash]){
							return {
								//get widget and remove item from array
								widget: widgetPool.splice(i,1)[0],
								fromPool: true
							};
						}
					}
					//Iterated but no luck ? Return any widget and(!) delete entry from hashmap
					hashMap[modelHash] = null;

					//Of course, save the hash for this one...might come handy later
					widget = widgetPool.pop();
					widgetHash = lowland.ObjectManager.getHash(widget);
					hashMap[modelHash] = widgetHash;
					return {
						widget: widget,
						fromPool: true
					};

				//No widget with this model. Fine, take any widget!
				} else {

					//Save the hash for later use
					widget = widgetPool.pop();
					widgetHash = lowland.ObjectManager.getHash(widget);
					hashMap[modelHash] = widgetHash;

					return {
						widget: widget,
						fromPool: true
					};
				}

			//There is no widget ? Create one !
			} else {
				widget = this.__widgetFactory();
				widgetHash = lowland.ObjectManager.getHash(widget);
				//Store the modelhash as key for the widgethash which already has this model
				hashMap[modelHash] = widgetHash;
				return {
					widget: widget,
					fromPool: false
				};
			}
		},
		
		__pushWidgetToPool : function(widget) {
			widget.overrideLayoutTransform(0, -100000);
			this.__widgetPool.push(widget);
			this.__widgetUpdater(widget, null, null, false);
		}
	}
});
