/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

core.Class("unify.theme.Theme", {
  construct : function(theme) {
    var colors = this.__colors = {};
    var fonts = this.__fonts = {};
    var styles = this.__styles = {};

    this.__styleCache = {};

    this._parse(theme, colors, fonts, styles);
  },
  
  members : {
    __styleCache : null,
    
    /* PUBLIC API */
    
    name : function() {
      return this.__name;
    },
    
    resolveColor : function(name) {
      var result = this.__colors[name] || null;
      if (core.Env.getValue("debug")) {
        if (!result) {
          console.warn("Color " + name + " not found!");
        }
      }
      return result;
    },
    
    resolveFont : function(name) {
      var result = this.__fonts[name] || null;
      if (core.Env.getValue("debug")) {
        if (!result) {
          console.warn("Font " + name + " not found!");
        }
      }
      return result;
    },
    
    __runFunctionsFromArray : function(arrayOrFnt, states) {
      var res;
      
      if (typeof(arrayOrFnt) == "function") {
        res = arrayOrFnt(states);
      } else {
        res = {};
        for (var i=0,ii=arrayOrFnt.length; i<ii; i++) {
          var aof = arrayOrFnt[i];
          
          if (aof) {
            var r = this.__runFunctionsFromArray(aof, states);
            var k = Object.keys(r);
            for (var j=0, jj=k.length; j<jj; j++) {
              var key = k[j];
              res[key] = r[key]
            }
          }
        }
      }
      
      return res;
    },
    
    resolveStyle : function(name, states) {
      states = states || {};
      var id = name + "-" + Object.keys(states).sort().join("-");
      var result = this.__styleCache[id];
      if (result) {
        return result;
      }
      
      var style = this.__styles[name];
      
      if (!style) {
        if (core.Env.getValue("debug") && style !== null) {
          console.log("No style '" + name + "' found");
        }
        return null;
      }
      
      var styles = this.__runFunctionsFromArray(style, states);
      
      var colorTags = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderLeftColor", "borderRightColor", "borderBottomColor"];
      for (var i=0,ii=colorTags.length; i<ii; i++) {
        var tag = colorTags[i];
        if (styles[tag]) {
          styles[tag] = this.resolveColor(styles[tag]);
        }
      }
      var textColor = styles.font && styles.font.textColor;
      var color = styles.font && styles.font.color;
      if (textColor) {
        styles.font.textColor = this.resolveColor(textColor);
      }
      if (color) {
        styles.font.color = this.resolveColor(color);
      }
      
      // Cache only if not in debug mode
      this.__styleCache[id] = styles;
      
      return styles;
    },
    
    getParsedTheme : function() {
      return {
        colors: this.__colors,
        fonts: this.__fonts,
        styles: this.__styles
      };
    },
    
    /* PRIVATE */
    
    __colors : null,
    __fonts : null,
    __styles : null,
    __name : null,
    
    _parse : function(theme, themeColors, themeFonts, themeStyles) {
      if (core.Env.getValue("debug")) {
        if (!theme) {
          throw new Error("No theme given!");
        }
      }
      
      var keys;
      var i;
      var ii;
      
      var name = theme.name;
      if (name) {
        this.__name = name;
      }
      
      if (theme.include) {
        var includedTheme = theme.include.getParsedTheme();
        var colors = includedTheme.colors;
        var fonts = includedTheme.fonts;
        var styles = includedTheme.styles;
        var key;
        
        for (key in colors) {
          themeColors[key] = colors[key];
        }
        for (key in fonts) {
          themeFonts[key] = fonts[key];
        }
        for (key in styles) {
          themeStyles[key] = styles[key];
        }
      }
      
      var colors = theme.colors;
      if (colors) {
        keys = Object.keys(colors);
        var colorMap = themeColors;
        
        for (i=0,ii=keys.length; i<ii; i++) {
          var colorName = keys[i];
          var color = colors[colorName];
          
          colorMap[colorName] = color;
        }
      }
      
      var fonts = theme.fonts;
      if (fonts) {
        keys = Object.keys(fonts);
        var fontMap = themeFonts;
        
        for (i=0,ii=keys.length; i<ii; i++) {
          var fontName = keys[i];
          var font = this.__parseFont(fonts[fontName]);
          
          fontMap[fontName] = font;
        }
      }
      
      var styles = theme.styles;
      if (styles) {
        this.__parseStyles(styles, themeStyles);
      }
    },
    
    __parseFont : function(font) {
      var def = {
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "none",
        lineHeight: 1.0
      };
      
      if (font.family) {
        def.fontFamily = font.family;
      }
      if (font.size) {
        def.fontSize = font.size + "px";
      }
      if (font.style) {
        def.fontStyle = font.style;
      }
      if (font.weight) {
        def.fontWeight = font.weight;
      }
      if (font.decoration) {
        def.textDecoration = font.decoration;
      }
      if (font.lineHeight) {
        def.lineHeight = font.lineHeight;
      }
      if (font.src) {
        def.fontObject = new lowland.bom.Font(font.src);
      }
      
      return def;
    },
    
    __parseStyles : function(styles, themeStyles) {
      var styleMap = themeStyles;
      
      var includeHelper = [];
      var includes = {};
      var childControls = [];
      
      var keys = Object.keys(styles);
      for (var i=0,ii=keys.length; i<ii; i++) {
        var key = keys[i];
        var value = styles[key];
        
        var slashPos = key.indexOf("/");
        if (slashPos > -1) {
          var first = key.substring(0, slashPos);
          var second = key.substring(slashPos+1);
          
          childControls.push({main: first, control: second});
        }
        
        if (typeof value == "string") {
          // construct is "a" : "b"
          
          includeHelper.push({
            key: key,
            include: value
          });
        } else {
          if (value.include) {
            includeHelper.push({
              key: key,
              include: value.include
            });
          }
          if (value.style) {
            if (styleMap[key]) {
              styleMap[key] = [styleMap[key], value.style];
            } else {
              styleMap[key] = value.style;
            }
          } else {
            styleMap[key] = null;
          }
        }
      }
      
      var task;
      
      for (i=0,ii=includeHelper.length; i<ii; i++) {
        task = includeHelper[i];
        
        if (includes[task.include]) {
          includes[task.include].push(task.key);
        } else {
          includes[task.include] = [task.key];
        }
        
        var keyFnt = styleMap[task.key];
        if (keyFnt) {
          styleMap[task.key] = [styleMap[task.include], keyFnt];
        } else {
          styleMap[task.key] = styleMap[task.include];
        }
      }
      
      for (i=0,ii=childControls.length; i<ii; i++) {
        task = childControls[i];
        var nFnt = styleMap[task.main + "/" + task.control];
        
        var incl = includes[task.main];
        if (incl) {
          for (var j=0,jj=incl.length; j<jj; j++) {
            var origName = incl[j] + "/" + task.control;
            var sm = styleMap[origName];
            
            if (!sm) {
              // Set only if no styling is set by developer
              styleMap[origName] = nFnt;
            }
          }
        }
      }
    }
    
    
  }
});