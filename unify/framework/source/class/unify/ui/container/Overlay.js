/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Overlay container widget
 */
core.Class("unify.ui.container.Overlay", {
  include : [unify.ui.container.Composite, unify.ui.core.MChildControl], //, unify.ui.core.MRemoteChildrenHandling],
  implement : [unify.ui.core.IPopOver],
  
  events : {
    /** Event thrown if overlay visibility is changed to hidden */
    "hidden" : unify.event.type.Event, //"qx.event.type.Event",
    
    /** Event thrown if overlay visibility is changed to shown */
    "shown" : unify.event.type.Event //"qx.event.type.Event"
  },
  
  properties : {
    // overridden
    appearance : {
      init: "overlay"
    },
    
    /** Paint arrow */
    hasArrow : {
      type: "Boolean",
      init: true,
      apply: this._applyHasArrow
    },

    /** relative position of the arrow on its axis
     *
     * may be "left,right,center,top,bottom, a percentage of the axis size or a pixel value (relative to axis start)
     */
    relativeArrowPosition : {
      init: "left",
      nullable: true
    },
    
    /** optional reference to widget that triggers show/hide of this overlay */
    trigger : {
      type: "unify.ui.core.Widget",
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
      type: "Boolean",
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
    unify.ui.container.Composite.call(this, new unify.ui.layout.special.OverlayLayout());
    unify.ui.core.MChildControl.call(this);
    
    this.addListener("appearance", this.__syncAppearance, this);
    
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
     * Appearance queue hit widget, so check if arrow is needed
     */
    __syncAppearance : function() {
      if (this.getHasArrow()) {
        this._showChildControl("arrow");
      }
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;

      if (id == "arrow") {
        control = new unify.ui.other.Arrow();
        this._addAt(control, 1, {
          type: "arrow"
        });
      } else if (id == "container") {
        control = new unify.ui.container.Composite(new unify.ui.layout.Canvas());
        this._addAt(control, 0);
      }
      
      return control;
    },

    /**
     * shows/hides the arrow element depending on value
     * @param value {Boolean} new hasArrow value
     */
    _applyHasArrow : function(value) {
      if (value) {
        this._showChildControl("arrow");
      } else {
        this._excludeChildControl("arrow");
      }
    },
    
    //overridden, calculate overlaysize as content size + arrow size depending on arrow direction
    _computeSizeHint: function(){
      
      var hint=unify.ui.container.Composite.prototype._computeSizeHint.call(this);
      
      if(this.getHasArrow()){
        var arrow=this.getChildControl("arrow");
        var arrowHint=arrow.getSizeHint();
        var direction=arrow.getDirection();
        if(direction=="left"||direction=="right"){
          hint.width+=arrowHint.width;
        } else if(direction=="top"||direction=="bottom"){
          hint.height+=arrowHint.height;
        }
      }
      
      return hint;
    },
    
    /**
     * Calculates a position hint to align overlay to trigger widget
     *
     * if the overlay has an arrow, the arrows pointing edge is used as reference
     */
    getPositionHint : function() {
      unify.ui.layout.queue.Manager.flush(); // make sure appearance is applied
      
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
      
      var isString = false;
      
      var staticPosition = this.getStaticPosition();
      if (staticPosition && (typeof(staticPosition.left) == "string" || typeof(staticPosition.top) == "string")) {
        isString = true;
      }
      
      var arrow=this.getChildControl("arrow", true);
      if(arrow && !isString){
        var thisSize=this.getSizeHint();
        var arrowPosition=this.calculateArrowPosition(thisSize.height,thisSize.width);

        left-=arrowPosition.left;
        top-=arrowPosition.top;
        var arrowDirection=arrow.getDirection();

        //now account for arrow pointing edge offset
        //TODO at the moment we assume the pointing edge is in the middle, refactor into arrow class to allow arbitraty points
        var arrowSize=arrow.getSizeHint();
        if(arrowDirection=="left"||arrowDirection=="right"){
          top-=Math.round(arrowSize.height/2);
        } else if (arrowDirection=="bottom"||arrowDirection=="top"){
          left-=Math.round(arrowSize.width/2);
        }
      }

      return {
        left: left,
        top: top
      };
    },

    /**
     * calculate the left/top position of the arrow element on the overlay .
     *
     * this function is used by the layout and by __getPositionHint
     * @param height {Number} height of the overlay content
     * @param width {Number} width of the overlay content
     */
    calculateArrowPosition : function(height,width){
      var GAP = 6;//TODO use border width +1?
      var arrow = this.getChildControl("arrow");
      var arrowLeft=0;
      var arrowTop=0;

      if(arrow){
        var arrowWidth=arrow.getWidth();
        var arrowHeight=arrow.getHeight();
        var arrowDirection=arrow.getDirection();
        var arrowPosition=this.getRelativeArrowPosition();

        if(arrowDirection=="left" || arrowDirection=="right"){
          var relativeOffset=this._toPixelValue(height,arrowPosition);
          if(arrowPosition=="top"){
            arrowTop=GAP;
          } else if(arrowPosition=="bottom"){
            arrowTop = height - arrowHeight - GAP;
          } else if(arrowPosition=="center"){
            arrowTop = Math.round(height / 2 - arrowHeight/2);
          } else {
            arrowTop = relativeOffset - Math.round(arrowHeight/2);
          }
        } else if (arrowDirection=="top" || arrowDirection=="bottom"){
          var relativeOffset=this._toPixelValue(width,arrowPosition);
          if(arrowPosition=="left"){
            arrowLeft=GAP;
          } else if(arrowPosition=="right"){
            arrowLeft = width - arrowWidth - GAP;
          } else if(arrowPosition=="center"){
            arrowLeft = Math.round(width / 2 - arrowWidth/2);
          } else {
            arrowLeft = relativeOffset - Math.round(arrowWidth/2);
          }
        }
      }

      return {
        left: arrowLeft,
        top: arrowTop
      }
    },

    //overridden, calculate overlaysize as content size + arrow size depending on arrow direction
    _computeSizeHint: function(){
      return this.getChildrenContainer().getSizeHint();
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
      unify.ui.container.Composite.prototype.show.call(this);
      
      var trigger = this.getTrigger();
      if(trigger){
        trigger.addListener("move",this.__onTriggerMove,this);
        trigger.addListener("resize",this.__onTriggerMove,this);
      }
    },
    
    /**
     * Hides overlay
     */
    hide : function() {
      unify.ui.container.Composite.prototype.hide.call(this);
      
      var trigger = this.getTrigger();
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
        var posHint = this.getPositionHint();
        this.getParentBox().add(this, posHint);
      }
    }
  }
});