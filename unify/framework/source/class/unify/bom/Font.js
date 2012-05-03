/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 - 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

core.Class("unify.bom.Font", {
  members : {
    // TODO
  }
});

core.Main.addStatics("unify.bom.Font", {
  /** {Integer} Base font size to calculate relative font sizes from */
  BaseFontSize : 16,
  
  /** {Map} Font size map to map from font size names to font size numbers */
  FontSizeMap : {
    "xx-small" : 9,
    "x-small" : 10,
    "small" : 13,
    "medium" : 16,
    "large" : 18,
    "x-large" : 24,
    "xx-large" : 32
  },
  
  /**
   * Resolve font size of relative name
   *
   * @param fontSizeName {String} Name of relative font size
   * @return {Integer} Pixel value as string
   */
  resolveRelativeSize : function(fontSizeName) {
    var self = unify.bom.Font;
    
    var fontSize = null;
    if (fontSizeName.indexOf("%") > -1) {
      fontSize = Math.round(self.BaseFontSize * (parseInt(fontSizeName.split("%")[0], 10) / 100));
    } else {
      fontSize = self.FontSizeMap[fontSizeName];
    }
    
    return fontSize || self.BaseFontSize;
  }
});