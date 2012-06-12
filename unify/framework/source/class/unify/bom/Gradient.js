/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com
    
    Based upon former work of A. Wunschik

===============================================================================================
*/
/**
 * Creates browser specific gradients
 */
core.Module('unify.bom.Gradient', {
  
  /*
  ----------------------------------------------------------------------------
    STATICS
  ----------------------------------------------------------------------------
  */

  /**
   * Create a browser specific gradient
   *
   * For more information, see http://www.w3.org/TR/css3-images/#gradients
   * 
   * @param options {Map} Gradient options
   * @return {String} The created gradient
   */
  createGradient: function(options) {
    /**
     * INTERNAL FUNCTION
     * 
     * Generate a string value "0%" to "100%" from a number "0.0" to "1.0"
     * 
     * @param percent {string|number} The percentage numer or string
     * @returns {string} A string from "0%" to "100%"
     */
    var _generatePercentageString = function(percent) {
      if (typeof(percent) == "string") {
        var regexp = /([+]?\d*%)/ig;
        var isPercentage = regexp.exec(percent);
        
        if (isPercentage) return percent;
      } else if ((percent >= 0.0) && (percent <= 1.0)) {
        return Math.round(percent*100) + "%";
      }
      //not a valid percentage
      throw "invalid percentage value: " + percent;
    }
    
    // Set options
    options = options || { };
    options.type = options.type || 'linear';
    options.angle = options.angle || 'to bottom';  // could also be 45deg
    options.colorStops = options.colorStops || [ ];
    
    if (core.Env.getValue("debug")) {
      if (options.type != "linear") {
        throw "Gradient type " + options.type + " is not allowed";
      }
    }
    
    var gradientFirstPos;
    var gradientSecondPos;
    
    var regexp = /([+-]?\d+deg)/ig;
    var angle = options.angle;
    var isAngle = regexp.exec(angle);
    if (!isAngle) {
      var angleMap = {
        "left" : {
          "top" : 315,
          "bottom" : 225,
          "none" : 270
        },
        "right" :  {
          "top" : 45,
          "bottom" : 135,
          "none" : 90
        },
        "none" : {
          "top" : 0,
          "bottom" : 180,
          "none" : 180
        }
      };
      var vertical = (angle.indexOf("top") > -1) ? "top" : (angle.indexOf("bottom") > -1) ? "bottom" : "none";
      var horizontal = (angle.indexOf("left") > -1) ? "left" : (angle.indexOf("right") > -1) ? "right" : "none";
      
      angle = angleMap[horizontal][vertical];
    } else {
      angle = parseInt(angle, 10);
    }
    
    var gradient;
    if (core.Env.isSet("engine", "webkit")) {
      var g = [];
      
      var startX;
      var endX;
      var startY;
      var endY;
      
      angle = (540 - angle) % 360;
      
      var quadrant = Math.ceil(angle/90.0);
      if (angle == 0 || quadrant == 1) {
        startX = 0;
        startY = 0;
        
        var myAngle = angle;
        if (myAngle == 45) {
          endX = 100-startX;
          endY = 100-startY;
        } else if (myAngle < 45) {
          endX = Math.round(Math.tan( (myAngle) * Math.PI / 180) * 100);
          endY = 100;
        } else {
          endX = 100;
          endY = Math.round(Math.tan( (90-myAngle) * Math.PI / 180) * 100);
        }
      } else if (quadrant == 2) {
        startX = 0;
        startY = 100;
        
        var myAngle = angle-90;
        if (myAngle == 45) {
          endX = 100-startX;
          endY = 100-startY;
        } else if (myAngle < 45) {
          endX = 100;
          endY = Math.round(Math.tan( (myAngle) * Math.PI / 180) * 100);
        } else {
          endX = Math.round(Math.tan( (90-myAngle) * Math.PI / 180) * 100);
          endY = 0;
        }
      } else if (quadrant == 3) {
        startX = 100;
        startY = 100;
        
        var myAngle = angle-180;
        if (myAngle == 45) {
          endX = 100-startX;
          endY = 100-startY;
        } else if (myAngle < 45) {
          endX = 100 - Math.round(Math.tan( (myAngle) * Math.PI / 180) * 100);
          endY = 0;
        } else {
          endX = 0;
          endY = 100 - Math.round(Math.tan( (90-myAngle) * Math.PI / 180) * 100);
        }
      } else if (quadrant == 4) {
        startX = 100;
        startY = 0;
        
        var myAngle = angle-270;
        if (myAngle == 45) {
          endX = 100-startX;
          endY = 100-startY;
        } else if (myAngle < 45) {
          endX = 0;
          endY = 100 - Math.round(Math.tan( (myAngle) * Math.PI / 180) * 100);
        } else {
          endX = 100 - Math.round(Math.tan( (90-myAngle) * Math.PI / 180) * 100);
          endY = 100;
        }
      }

      g.push(startX + "% " + startY + "%");
      g.push(endX + "% " + endY + "%");
      
      var colorStops = [];
      for (var i=0,ii=options.colorStops.length;i<ii;i++) {
        var colorStop = options.colorStops[i];
        
        colorStops.push("color-stop(" +colorStop.position + "," + colorStop.color + ")");
      }
      
      g = g.concat(colorStops);
      
      gradient = "-webkit-gradient(linear," + g.join(",") + ")";
    }
    if (core.Env.getValue("engine") == "gecko") {
      var geckoAngle = 90 - angle;
      if (geckoAngle < -90) {
        geckoAngle += 180;
      }
      
      var colorStops = [];
      for (var i=0,ii=options.colorStops.length;i<ii;i++) {
        var colorStop = options.colorStops[i];
        
        colorStops.push(colorStop.color + " " + _generatePercentageString(colorStop.position));
      }
      
      gradient = "-moz-linear-gradient(" + geckoAngle + "deg, " + colorStops.join(",") + ")";
    }
    if (core.Env.getValue("engine") == "presto") {
      var version = /MSIE.(\d+)/.exec(navigator.userAgent);
      if (version[1] && parseInt(version[1],10) < 9) {
        return null;
      }
      
      var geckoAngle = 90 - angle;
      if (geckoAngle < -90) {
        geckoAngle += 180;
      }
      
      var g = [];
      var colorStops = [];
      for (var i=0,ii=options.colorStops.length;i<ii;i++) {
        var colorStop = options.colorStops[i];
        
        colorStops.push(colorStop.color + " " + _generatePercentageString(colorStop.position));
      }
      
      gradient = "-o-linear-gradient(" + geckoAngle + "deg, " + colorStops.join(",") + ")";
    }
    if (core.Env.getValue("engine") == "trident") {
      var geckoAngle = 90 - angle;
      if (geckoAngle < -90) {
        geckoAngle += 180;
      }
      
      var g = [];
      var colorStops = [];
      for (var i=0,ii=options.colorStops.length;i<ii;i++) {
        var colorStop = options.colorStops[i];
        
        colorStops.push(colorStop.color + " " + _generatePercentageString(colorStop.position));
      }
      
      gradient = "-ms-linear-gradient(" + geckoAngle + "deg, " + colorStops.join(",") + ")";
      
      //"filter: progid:DXImageTransform.Microsoft.Gradient" is supported on older IEs
      //@see http://msdn.microsoft.com/en-us/library/ms532997(VS.85,loband).aspx
      //@todo implement!
    }
    
    return gradient;
  }
});