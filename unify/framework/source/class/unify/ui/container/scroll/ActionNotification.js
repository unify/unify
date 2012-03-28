/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 *********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Action Notification widget for unify.ui.container.ActionScroll
 * 
 */
qx.Class.define("unify.ui.container.scroll.ActionNotification", {
  extend: unify.ui.container.Composite,
  include : [unify.ui.core.MChildControl],
  implement:  [unify.ui.container.scroll.IActionNotification],
  
  
  properties : {
    //location of the notification
    location:{
      check: ["top","bottom"],
      apply: "_applyLocation"
    },
    //phase of the notification
    phase : { 
      check : ["initial", "activated", "executing"],
      apply:"_applyPhase"
    },
    
    /** parent scroll container of this notification */
    scroll : { check:"unify.ui.container.ActionScroll" }
  },
  
  construct: function(scroll,location,layout){
    this._forwardStates=qx.lang.Object.merge(this._forwardStates||{},{
      initial:true,
      activated:true,
      executing:true
    });
    this.base(arguments,layout||new unify.ui.layout.HBox);
    this._showChildControl("pullicon");
    this._showChildControl("activityicon");
    this._showChildControl("label");
    this.setScroll(scroll);
    this.setPhase("initial");
    this.setLocation(location);
    this.__labelValues={};
    //TODO translate?
    this.setLabelValue("initial","pull to refresh ...");
    this.setLabelValue("activated","release to refresh ...");
    this.setLabelValue("executing","refreshing ...");

  },
  
  members : {
    
    //map of label values for phases
    __labelValues:null,

    /**
     * set label value for a phase
     * 
     * @param phase {String} one of "initial","activated","executing"
     * @param value {String} the notification text to set on label
     */
    setLabelValue: function(phase,value){
      this.__labelValues[phase]=value;
      if(phase==this.getPhase()){
        this.getChildControl("label").setValue(value);
      }
    },
    
    //overridden
    _createChildControlImpl: function(id){
      var child;
      switch(id){
        case "label":{
          child=new unify.ui.basic.Label((this.__labelValues)?(this.labelValues.initial):(""));
          this.addAt(child,2,{flex:1});
        }
        break;
        case "pullicon":{
          child=new unify.ui.basic.Content();
          this.addAt(child,0);
        }
        break;
        case "activityicon":{
          child=new unify.ui.basic.Content();
          this.addAt(child,1);
        }
        break;
        default:{
          throw new Error("invalid child control id: "+id);
        }
      }
      return child;
    },

    /**
     * called when apply property changes its value.
     * 
     * @param phase {String} new value for phase
     */
    _applyPhase : function(phase){
      var activityIcon=this.getChildControl("activityicon");
      var pullIcon=this.getChildControl("pullicon");
      switch(phase){
        case "initial":{
          pullIcon.show();
          activityIcon.exclude();
          this.addState("initial");
          this.removeState("activated");
          this.removeState("executing");
        }
        break;
        case "activated":{
          pullIcon.show();
          activityIcon.exclude();
          this.addState("activated");
          this.removeState("initial");
          this.removeState("executing");
        }
        break;
        case "executing":{
          pullIcon.exclude();
          activityIcon.show();
          this.addState("executing");
          this.removeState("initial");
          this.removeState("activated");
        }
        break;
        default:{
          throw new Error("qooxdoo property system broken, called apply with disallowed value: "+phase);
        }
      }
      if(this.__labelValues){
        var labelValue=this.__labelValues[phase];
        if(labelValue){
          this.getChildControl("label").setValue(labelValue);
        }
      }
    },

    /**
     * called when location property changes its value.
     * 
     * @param value {String} new value for location
     */
    _applyLocation: function(value){
      var height=this.getScroll().getNotificationHeight();
      switch(value){
        case "top":{
          this.setStyle({
            height:height,
            marginTop:-height
          });
          var layout=this.getLayout()
          if(layout.setAlignY){
            layout.setAlignY("bottom");
          }
        }
        break;
        case "bottom":{
          this.setStyle({
            height:height,
            marginBottom:-height
          });
          var layout=this.getLayout()
          if(layout.setAlignY){
            layout.setAlignY("top");
          }
        }
        break;
        default:{
          throw new Error("qooxdoo property system broken, called apply with disallowed value: "+value);
        }
      }
    }
  }
});