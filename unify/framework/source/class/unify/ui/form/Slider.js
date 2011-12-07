/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Slider widget
 */
 
qx.Class.define("unify.ui.form.Slider", {
  extend: unify.ui.container.Composite,
  include : [unify.ui.core.MInteractionState, unify.ui.core.MChildControl],

  properties: {
    // overridden
    appearance : {
      refine: true,
      init: "slider"
    },
    
    // overridden
    focusable : {
      refine: true,
      init: true
    },
    
    /** {Float} Percentual value (0.0 to 1.0) */
    value : {
      apply : "_applyValue",
      event : "changeValue",
      init: 0.0
    },
    
    /** {String} Direction of slider (horizontal or vertical) */
    direction : {
      check: ["horizontal", "vertical"],
      apply : "_applyDireciton",
      init: "horizontal"
    }
  },
  
  events : {
    clickOnBar: "qx.event.type.Data"
  },
  
  construct : function() {
    this.base(arguments);
    
    this._forwardStates = {
      "hover" : true,
      "pressed" : true
    };
    
    this._setLayout(new unify.ui.layout.Canvas());
    this._showChildControl("bar");
    this._showChildControl("knob");
    
    this.addListener("tap", this.__onTap, this);
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
      var control;
      
      switch(id) {
        case "knob":
          control = new unify.ui.basic.Content();
          control.addListener("touchstart", this.__touchStart, this);

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
    __calcWidth : null,
    __calcLeft : null,
    __knob : null,
    __value : null,
    
    /**
     * Event handler for touch start
     *
     * @param e {Event} Touch event
     */
    __touchStart : function(e) {
      var root = qx.core.Init.getApplication().getRoot();
      root.addListener("touchmove", this.__touchMove, this);
      root.addListener("touchend", this.__touchEnd, this);
      
      var knob = this.__knob = this.getChildControl("knob");
      var knobPosInfo = knob.getPositionInfo();
      var posInfo = this.getPositionInfo();
      var calcWidth = this.__calcWidth = posInfo.width - posInfo.padding.left - posInfo.padding.right - knobPosInfo.width;
      this.__calcLeft = calcWidth * this.getValue();
      
      this.__touchLeft = e.getScreenLeft();
    },
    
    
    /**
     * Event handler for touch move
     *
     * @param e {Event} Touch event
     */
    __touchMove : function(e) {
      var diff = this.__calcLeft + e.getScreenLeft() - this.__touchLeft;
      var calcWidth = this.__calcWidth;
      
      if (diff < 0 || diff > calcWidth) {
        return;
      }
      
      this.__knob.setStyle({
        transform: "translate(" + Math.round(diff) + "px, 0)"
      });
      
      var value = this.__value = diff / calcWidth;
      this.setValue(value);
    },
    
    /**
     * Event handler for touch end
     */
    __touchEnd : function() {
      var root = qx.core.Init.getApplication().getRoot();
      root.removeListener("touchmove", this.__touchMove, this);
      root.removeListener("touchend", this.__touchEnd, this);

      this.__knob = null;
    },
    
    /**
     * Apply value to knob positioning setting
     *
     * @param value {Float} Percentage position value
     */
    _applyValue : function(value) {
      if (value != this.__value) {
        var posInfo = this.getChildControl("bar").getPositionInfo();
        var knobPosInfo = this.getChildControl("knob").getPositionInfo();
        var modLeft = posInfo.padding.left + posInfo.border.left;
        var availWidth = posInfo.width - posInfo.padding.right - posInfo.border.right - modLeft - (knobPosInfo.width/2);

        this.getChildControl("knob").setStyle({
          transform: "translate(" + Math.round(availWidth * value + modLeft) + "px, 0)"
        });
        this.__value = value;
      }
    },
    
    /**
     * Tap event to change value of slider
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      var overallWidth = this.getPositionInfo().width;
      var barWidth = this.getChildControl("bar").getPositionInfo().width;
      
      var left = e.getViewportLeft();
      var element = this.getElement();
      var leftElement = qx.bom.element.Location.getLeft(element);
      
      var mod = Math.round((barWidth - overallWidth) / 2);
      
      var clickedPos = left - leftElement + mod;
      if (clickedPos < 0) {
        clickedPos = 0;
      } else if (clickedPos > barWidth) {
        clickedPos = barWidth;
      }
      
      this.fireDataEvent("clickOnBar", clickedPos / barWidth);
    }
  }
});
