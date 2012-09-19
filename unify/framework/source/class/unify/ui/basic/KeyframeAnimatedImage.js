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

    var transformProperty= qx.lang.String.hyphenate(qx.bom.element.Style.property('transform'));
    var keyframeRules = 'KAI_rotateZ{' +//use a unique name to avoid overriding other keyframe definitions
    'from{'+ transformProperty+':'+unify.bom.Transform.rotate(0)
    +'} to {' + transformProperty+':'+unify.bom.Transform.rotate(360)+'}' +
    '}';
    var keyframeName;
    switch(unify.bom.client.Engine.NAME){
      case "webkit":
        keyframeName="@-webkit-keyframes";
        break;
      case "gecko":{
        keyframeName="@-moz-keyframes";
        break;
      }
      case "trident":
        keyframeName="@-ms-keyframes";
        break;
      case "opera":{
        keyframeName="@-o-keyframes";
        break;
      }
      default:
        keyframeName="@keyframes";
        break;
    }
    var rules = document.createTextNode(keyframeName+" "+keyframeRules );
    styleNode.appendChild(rules);
    document.getElementsByTagName("head")[0].appendChild(styleNode);
  }
});