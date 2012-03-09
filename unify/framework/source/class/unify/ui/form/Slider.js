/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com
    Copyright: 2011, Alexander Wunschik, Mainz, Germany, http://wunschik.it

*********************************************************************************************** */

/**
 * Slider widget
 */
 
core.Class("unify.ui.form.Slider", {
  include : [unify.ui.container.Composite, unify.ui.core.MInteractionState, unify.ui.core.MChildControl],

  properties: {
    // overridden
    appearance : {
      init: "slider"
    },
    
    // overridden
    focusable : {
      init: true
    },
    
    /** {Float} Percentual value (0.0 to 1.0) */
    value : {
      //check : "!isNaN(value) && value >= 0.0 && value <= 1.0",
      apply : function(value, old) { this._applyValue(value, old); },
      fire : "changeValue",
      init: 0.0
    },
    
    /** {String} Direction of slider (horizontal or vertical) */
    direction : {
      type: ["horizontal", "vertical"],
      apply : function(value, old) { this._applyDirection(value, old); },
      init: "horizontal"
    }
  },
  
  events : {
    /** Fired when user clicks on bar */
    clickOnBar: lowland.events.DataEvent //"qx.event.type.Data"
  },
  
  construct : function() {
    unify.ui.container.Composite.call(this, new unify.ui.layout.Canvas());
    unify.ui.core.MChildControl.call(this);
    
    this._forwardStates = {
      "hover" : true,
      "pressed" : true,
      "horizontalDirection" : true,
      "verticalDirection" : true
    };
    
    this.addState(this.getDirection() + "Direction");
    
    this._setLayout(new unify.ui.layout.Canvas());
    this._showChildControl("bar");
    this._showChildControl("knob");
    
    lowland.bom.Events.listen("tap", this.__onTap.bind(this));
    this.addListener("resize", this.__onResize, this);
    
  },
  
  members: {
    /* {Map} Forward states for child controls */
    _forwardStates : null,
    
    /**
     * Create child controls
     *
     * @param id {String} id of child
     */
    _createChildControlImpl : function(id) {
      var control = null;
      
      switch(id) {
        case "knob":
          control = new unify.ui.basic.Content();
          this.__touchStartWrapper = this.__touchStart.bind(this);
          lowland.bom.Events.listen(control.getElement(), "touchstart", this.__touchStartWrapper, this);
          
          this._add(control);
          break;
        case "bar":
          control = new unify.ui.basic.Content();
          
          this._add(control, {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          });
          break;
      }

      return control || this.base(arguments, id);
    },
    
    _createElement : function() {
      var e = document.createElement("div");
      
      return e;
    },
    
    __touchLeft : null,
    __touchTop : null,
    __calcWidth : null,
    __calcHeight : null,
    __calcLeft : null,
    __knob : null,
    __value : null,
    
    /**
     * Resize handler
     */
    __onResize : function() {
      this._recalculateKnobPosition();
    },
    
    /**
     * Returns avail slider width
     *
     * @return {Integer} Avail width of slider
     */
    __getAvailSliderWidth : function() {
      var knob = this.getChildControl("knob");
      var knobPosInfo = knob.getPositionInfo();
      var bar = this.getChildControl("bar");
      var posInfo = bar.getPositionInfo();
      
      return posInfo.width - posInfo.padding.left - posInfo.padding.right - posInfo.border.left - posInfo.border.right - Math.round(knobPosInfo.width / 2);
    },
    
    /**
     * Returns avail slider height
     *
     * @return {Integer} Avail height of slider
     */
    __getAvailSliderHeight : function() {
      var knob = this.getChildControl("knob");
      var knobPosInfo = knob.getPositionInfo();
      var bar = this.getChildControl("bar");
      var posInfo = bar.getPositionInfo();
      
      return posInfo.height - posInfo.padding.top - posInfo.padding.bottom - posInfo.border.top - posInfo.border.bottom - Math.round(knobPosInfo.height / 2);
    },
    
    __touchMoveWrapper : null,
    __touchEndWrapper : null,
    
    /**
     * Event handler for touch start
     *
     * @param e {Event} Touch event
     */
    __touchStart : function(e) {
      var root = unify.core.Init.getApplication().getRoot().getEventElement();
      this.__touchMoveWrapper = this.__touchMove.bind(this);
      this.__touchEndWrapper = this.__touchEnd.bind(this);
      lowland.bom.Events.listen(root, "touchmove", this.__touchMoveWrapper);
      lowland.bom.Events.listen(root, "touchend", this.__touchEndWrapper);
      
      this.__knob = this.getChildControl("knob");
      
      if (this.getDirection() == "horizontal") {
        var calcWidth = this.__calcWidth = this.__getAvailSliderWidth();
        
        this.__calcLeft = calcWidth * this.getValue();
        this.__touchLeft = e.touches[0].pageX; //e.getScreenLeft();
      } else {
        var calcHeight = this.__calcHeight = this.__getAvailSliderHeight();
        
        this.__calcTop = calcHeight * this.getValue();
        this.__touchTop = e.touches[0].pageY; //e.getScreenTop();
      }
    },
    
    
    /**
     * Event handler for touch move
     *
     * @param e {Event} Touch event
     */
    __touchMove : function(e) {
      var horizontal = this.getDirection() == "horizontal";
      var diff;
      var calcVal;
      if (horizontal) {
        diff = this.__calcLeft + e.touches[0].pageX /*e.getScreenLeft()*/ - this.__touchLeft;
        calcVal = this.__calcWidth;
      } else {
        diff = this.__calcTop + e.touches[0].pageY /*e.getScreenTop()*/ - this.__touchTop;
        calcVal = this.__calcHeight;
      }
      if (diff < 0 || diff > calcVal) {
        return;
      }
      var transform;
      if (horizontal) {
        transform = unify.bom.Transform.accelTranslate(Math.round(diff)+"px", 0);
      } else {
        transform = unify.bom.Transform.accelTranslate(0, Math.round(diff)+"px");
      }
      this.__knob.setOwnStyle({
        transform: transform
      });
      
      var value = this.__value = diff / calcVal;
      this.setValue(value);
    },
    
    /**
     * Event handler for touch end
     */
    __touchEnd : function() {
      var root = unify.core.Init.getApplication().getRoot().getEventElement();
      lowland.bom.Events.unlisten(root, "touchmove", this.__touchMoveWrapper);
      lowland.bom.Events.unlisten(root, "touchend", this.__touchEndWrapper);

      this.__knob = null;
    },
    
    /**
     * Recalculate the absolute position of the knob on the sliderbar
     */
    _recalculateKnobPosition : function() {
      var value = this.getValue();
      var horizontal = this.getDirection() == "horizontal";
      var posInfo = this.getChildControl("bar").getPositionInfo();
      var knobPosInfo = this.getChildControl("knob").getPositionInfo();
      var mod;
      var avail;
      var transform;
      
      if (horizontal) {
        mod = posInfo.padding.left;
        avail = this.__getAvailSliderWidth();
        transform = "translate(" + Math.round(avail * value + mod) + "px, 0)";
      } else {
        mod = posInfo.padding.top + posInfo.border.top;
        avail = this.__getAvailSliderHeight();
        transform = "translate(0, " + Math.round(avail * value + mod) + "px)";
      }
      this.getChildControl("knob").setOwnStyle({
        transform: transform
      });
    },
    
    /**
     * Apply value to knob positioning setting
     *
     * @param value {Float} Percentage position value
     */
    _applyValue : function(value) {
      if (value != this.__value) {
        this.__value = value;
        this._recalculateKnobPosition();
      }
    },
    
    /**
     * Apply direction
     *
     * @param value {String} New value
     * @param oldvalue {String} Old value
     */
    _applyDirection : function(value, oldValue) {
      if (oldValue) {
        this.removeState(oldValue + "Direction");
      }
      if (value) {
        this.addState(value + "Direction");
      }
    },
    
    /**
     * Tap event to change value of slider
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      var horizontal = this.getDirection() == "horizontal";
      
      var overall;
      var bar;
      var clickedPos;
      var mod;
      
      var elemPos = lowland.bom.Element.getLocation(this.getElement());
      
      if (horizontal) {
        overall = this.getPositionInfo().width;
        bar = this.getChildControl("bar").getPositionInfo().width;
        mod = Math.round((bar - overall) / 2);
        
        
        clickedPos = e.getViewportLeft() - elemPos.left + mod;
      } else {
        overall = this.getPositionInfo().height;
        bar = this.getChildControl("bar").getPositionInfo().height;
        mod = Math.round((bar - overall) / 2);
        
        clickedPos = e.getViewportTop() - elemPos.top + mod;
      }

      if (clickedPos < 0) {
        clickedPos = 0;
      } else if (clickedPos > bar) {
        clickedPos = bar;
      }
      
      this.fireEvent("clickOnBar", clickedPos / bar);
    }
  }
});
