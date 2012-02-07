/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Overlay container widget
 */
qx.Class.define("unify.ui.container.SimpleOverlay", {
  extend : unify.ui.container.Composite,
  
  include : [unify.ui.core.MChildControl, qx.ui.core.MRemoteChildrenHandling],
  
  events : {
    /** Event thrown if overlay visibility is changed to hidden */
    "hidden" : "qx.event.type.Event",
    
    /** Event thrown if overlay visibility is changed to shown */
    "shown" : "qx.event.type.Event"
  },
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "simpleoverlay"
    },
    
    /** optional reference to widget that triggers show/hide of this overlay */
    trigger : {
      check: "unify.ui.core.Widget",
      init: null,
      nullable: true
    },

     /** optional strategy to ponsition overlay relative to trigger
      * must be a map containing a value for x and y axis
      * the value can be "left,right,center,top,bottom, a percentage of the axis size or a pixel value (relative to axis start)
      */
    relativeTriggerPosition : {
      init: {y:"bottom",x:"center"},
      nullable: true
    },
    
    modal : {
      check: "Boolean",
      init: true
    },
    
    staticPosition : {
      init: null,
      nullable: true
    }
  },

  
  /**
   * @param noArrow {Boolean?} set to true if overlay should not have an arrow element
   */
  construct : function(noArrow) {
    this.base(arguments, new unify.ui.layout.special.OverlayLayout());
    
    this._showChildControl("container");
    //this.setHasArrow(!noArrow);//applyHasArrow creates the arrow if required
  },
  
  members : {
    
    /**
     * Gets inner content container
     *
     * @return {unify.ui.core.Widget} Content widget
     */
    getChildrenContainer : function() {
      return this.getChildControl("container");
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "container") {
        control = new unify.ui.container.Composite(new unify.ui.layout.Canvas());
        this._addAt(control, 0);
      }
      
      return control || this.base(arguments, id);
    },

    //overridden, calculate overlaysize as content size + arrow size depending on arrow direction
    _computeSizeHint: function(){
      return this.getChildrenContainer().getSizeHint();
    },
    
    /**
     * Calculates a position hint to align overlay to trigger widget
     *
     * if the overlay has an arrow, the arrows pointing edge is used as reference
     */
    _getPositionHint : function() {
      qx.ui.core.queue.Manager.flush();//make sure appearance is applied
      
      var left = 0;
      var top = 0;
      
      var staticPosition = this.getStaticPosition();
      if (staticPosition) {
        left = staticPosition.left;
        top = staticPosition.top;
      }
      
      var trigger=this.getTrigger();
      var relativeTriggerPosition=this.getRelativeTriggerPosition();

      if(trigger && relativeTriggerPosition){
        var triggerPoint=this.__resolveRelative(trigger.getPositionInfo(),relativeTriggerPosition);
        left = triggerPoint.left;
        top=triggerPoint.top;
      }

      return {
        left: left,
        top: top
      };
    },

    /**
     * helper function that calculates the absolute position values of a relativePos in elemPos
     * @param elemPos {Object}  a map containing the elements current position and dimensions (top,left,width,height)
     * @param relativePos {Object} a map containing relative position values as keys x and y e.g. {x:"center",y:"bottom"}
     */
    __resolveRelative: function(elemPos,relativePos){
      return {
        top: (elemPos.top||0)+this._toPixelValue(elemPos.height,relativePos.y),
        left:(elemPos.left||0)+this._toPixelValue(elemPos.width,relativePos.x)
      }
    },

    /**
     * calculates the pixel value of relativePosition in relation to baseSize
     *
     * @param baseSize {Number} size value to
     * @param relativePosition {String|Number} left,right,top,bottom,center, a percentage string, a px string or a Number
     * @return {Number} calculated value
     */
    _toPixelValue : function(baseSize,relativePosition){
      if(relativePosition=="left" || relativePosition == "top"){
        return 0;
      } else if (relativePosition == "center"){
        return Math.round(baseSize/2);
      } else if (relativePosition=="right" || relativePosition == "bottom"){
        return baseSize;
      } else if(typeof relativePosition == "string"){
        if(relativePosition.substring(relativePosition.length-1)=="%"){
          return Math.round(baseSize*(parseInt(relativePosition,10)/100));
        } else if(relativePosition.substring(relativePosition.length-2)=="px"){
          return parseInt(relativePosition,10);
        } else {
          //value is a string but cannot be parsed
          this.error("invalid relative value: "+relativePosition);
          return 0;
        }
      } else if(typeof relativePosition == "number") {
        return relativePosition;
      }
    },
    
    /**
     * Shows overlay
     */
    show : function() {
      this.base(arguments);
      
      var posHint = this._getPositionHint();
      this.getLayoutParent().add(this, posHint);
      this.fireEvent("shown");
      var trigger=this.getTrigger();
      if(trigger){
        trigger.addListener("move",this.__onTriggerMove,this);
        trigger.addListener("resize",this.__onTriggerMove,this);
      }
    },
    
    /**
     * Hides overlay
     */
    hide : function() {
      this.base(arguments);
      
      this.fireEvent("hidden");
      var trigger=this.getTrigger();
      if(trigger){
        trigger.removeListener("move",this.__onTriggerMove,this);
        trigger.removeListener("resize",this.__onTriggerMove,this);
      }
    },

    /**
     * event handler for trigger move event.
     * 
     * repositions the overlay to the new trigger position if the overlay is visible
     * 
     * @param e {Event} event object
     */
    __onTriggerMove: function(e){
      if(this.isVisible()){
        var posHint = this._getPositionHint();
        this.getLayoutParent().add(this, posHint);
      }
    }
  }
});