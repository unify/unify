/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.theme.Theme", {
  construct : function(theme) {
    this.__colors = {};
    this.__fonts = {};
    this.__styles = {};

    this._parse(theme);
  },
  
  members : {
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
    
    resolveStyle : function(name, states) {
      var style = this.__styles[name];
      
      if (!style) {
        return null;
      }
      
      if (!states) {
        states = {};
      }
      
      var res = {};
      if (typeof style == "function") {
        res = style(states);
      } else {
        for (var j=0,jj=style.length; j<jj; j++) {
          if (style[j]) {
            var newStyles = style[j](states);
            var newKeys = Object.keys(newStyles);
            for (var i=0,ii=newKeys.length; i<ii; i++) {
              var k = newKeys[i];
              res[k] = newStyles[k];
            }
          }
        }
      }
      
      return res;
    },
    
    /* PRIVATE */
    
    __colors : null,
    __fonts : null,
    __styles : null,
    __name : null,
    
    _parse : function(theme) {
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
      
      var colors = theme.colors;
      if (colors) {
        keys = Object.keys(colors);
        var colorMap = this.__colors;
        
        for (i=0,ii=keys.length; i<ii; i++) {
          var colorName = keys[i];
          var color = colors[colorName];
          
          colorMap[colorName] = color;
        }
      }
      
      var fonts = theme.fonts;
      if (fonts) {
        keys = Object.keys(fonts);
        var fontMap = this.__fonts;
        
        for (i=0,ii=keys.length; i<ii; i++) {
          var fontName = keys[i];
          var font = this.__parseFont(fonts[fontName]);
          
          fontMap[fontName] = font;
        }
      }
      
      var styles = theme.styles;
      if (styles) {
        this.__parseStyles(styles);
      }
    },
    
    __parseFont : function(font) {
      var def = {
        fontFamily: "serif",
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
    
    __parseStyles : function(styles) {
      var styleMap = this.__styles;
      
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
            styleMap[key] = value.style;
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