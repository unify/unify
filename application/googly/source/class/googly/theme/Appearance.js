/* ************************************************************************
  
  PagePlace HTML5 Client
  
  Copyright
    2010-2011 Deutsche Telekom AG, Germany, http://telekom.com
 
************************************************************************ */

/**
 * The gray PagePlace HTML5 client design "Reader Light"
 */
qx.Theme.define("googly.theme.Appearance", {
  extend: unify.theme.dark.Appearance,
  
  appearances : {
    "input" : {
      base: true,
      
      style : function() {
        return {
          font: "20px",
          padding: "10px",
          margin: "10px 8px"
        };
      }
    },
    
    "button" : {
      base : true,
      
      style : function() {
        return {
          margin: "10px",
          padding: "10px"
        };
      }
    },
    
    "label" : {
      base : true,
      
      style : function() {
        return {
          paddingLeft: "10px",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingBottom: "10px"
        };
      }
    }
  }
});