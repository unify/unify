/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, TELEKOM AG

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */

qx.Class.define("unify.ui.basic.KeyframeAnimatedImage", {
  extend: unify.ui.basic.Image,

  properties:{
    /** Duration of rotation */
    animateRotateDuration:{
      init:1500,
      check:"Integer"
    }
  },

  construct : function(source) {
    this.__source=source;
    this.base(arguments);
    this.addListener("changeVisibility", this.__onChangeVisibility, this);
  },

  members : {
    _createElement: function(){
      //use a backgroundimage div because android (at least on motorola xoom with 3.1) has problems rotating images around their center
      var elem= document.createElement('div');
      qx.bom.element.Style.setStyles(elem,{
        backgroundColor:"transparent",
        backgroundPosition:"center center",
        backgroundRepeat:"no-repeat",
        backgroundImage:"url("+qx.util.ResourceManager.getInstance().toUri(this.__source)+")",
        transformOriginX:"50%",
        transformOriginY:"50%"
      });
      return elem;
    },
    _applySource : function(value) {
      this.setStyle({backgroundImage:"url("+qx.util.ResourceManager.getInstance().toUri(value)+")"});
    },
    /**
     * Event handler for visibility changes
     *
     * @param e {qx.event.type.Data} Change event
     */
    __onChangeVisibility : function(e) {
      if (e.getData() == "visible") {
        this.__startRotate();
      } else {
        this.__stopRotate();
      }
    },

    /**
     * starts rotation by adding the required css styles
     */
    __startRotate : function(){
      this.setStyle({
          animationName: "KAI_rotateZ",
          animationDuration: this.getAnimateRotateDuration()+"ms",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear"
      });
    },

    /**
     * stops rotation by removing the required css styles
     */
    __stopRotate : function(){
      this.setStyle({
        animationName: "",
        animationDuration: "",
        animationIterationCount: "",
        animationTimingFunction: ""
      });
    }
  },
  defer: function(){
    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    //TODO write keyframe rule with correct prefix depending on browser engine
    var rules = document.createTextNode(
        '@-webkit-keyframes KAI_rotateZ{' +//use a unique name to avoid overriding other keyframe definitions
          'from{' +
            '-webkit-transform:rotate3d(0,0,1,0deg)}' +
          'to{' +
            '-webkit-transform:rotate3d(0,0,1,360deg)' +
          '}' +
        '}');
    styleNode.appendChild(rules);
    document.getElementsByTagName("head")[0].appendChild(styleNode);
  }
});