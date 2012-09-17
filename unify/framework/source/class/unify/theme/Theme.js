/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Theme
 */
core.Class('unify.theme.Theme', {

  /**
   * Constructor
   *
   * Creates new theme instance
   *
   * @param theme {Object} Theme configuration
   */
  construct: function(theme) {
    // Initialize configuration
    var colors = this.__colors = { };
    var fonts = this.__fonts = { };
    var styles = this.__styles = { };

    // Initialize style cache
    this.__styleCache = { };

    // Parse theme configuration
    this._parse(theme, colors, fonts, styles);
  },

  /*
   ******************************************************************************
   MEMBERS
   ******************************************************************************
   */

  members: {

    /*
     ----------------------------------------------------------------------------
     PRIVATE
     ----------------------------------------------------------------------------
     */

    /**
     * {String} Theme name
     */
    __name: null,

    /**
     * {Object} Color definitions
     */
    __colors: null,

    /**
     * {Object} Font definitions
     */
    __font: null,

    /**
     * {Object} Style definitions
     */
    __styles: null,

    /**
     * {Object} Style cache
     */
    __styleCache: null,


    /**
     * Extend object
     *
     * Simple helper method to extend one object with the properties of
     * another object (non recursive).
     *
     * @param base {Object} The object to extend
     * @param extend {Object} The object that should be added to the base object
     * @return {Object} The extended object
     */
    __extendObject: function(base, extend) {
      if (extend instanceof Object) {
        for (key in extend) {
          base[key] = extend[key];
        }
      }

      return base;
    },


    /**
     * Resolve style helper
     *
     * This method does the heavy lifting for creating CSS styles. It
     * parses all the includes for a style definitions and executes the style
     * functions.
     *
     * @param styleDef {Array} List of style definitions
     * @param states {Object} Map of states that should be passed to each
     *                        style function
     * @return {Object} Map of CSS style definitions
     */
    __resolveStyleHelper: function(styleDef, states) {
      var result = { };

      for (var i = 0, ii = styleDef.length; i < ii; i++) {
        var obj = styleDef[i];

        // Processing include(s)
        for (var j = 0, jj = obj.includes.length; j < jj; j++) {
          var includedStyle = this.__styles[obj.includes[j]];
          var temp = this.__resolveStyleHelper(includedStyle, states);
          result = this.__extendObject(result, temp);
        }

        // Processing style function(s)
        for (var k = 0, kk = obj.styles.length; k < kk; k++) {
          if (obj.styles[k] != null) {
            var temp = obj.styles[k](states);
            result = this.__extendObject(result, temp);
          } else {
            result = { };
          }
        }
      }

      return result;
    },


    /**
     * Parse font definition
     *
     * @param font {Object} The raw font definition
     * @return {Object} The parsed font definition
     */
    __parseFont: function(font) {
      var def = {
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 1.0,
        textDecoration: 'none'
      };

      if (font.decoration) {
        def.textDecoration = font.decoration;
      }
      if (font.family) {
        def.fontFamily = font.family;
      }
      if (font.lineHeight) {
        def.lineHeight = font.lineHeight;
      }
      if (font.size) {
        def.fontSize = font.size + 'px';
      }
      if (font.style) {
        def.fontStyle = font.style;
      }
      if (font.weight) {
        def.fontWeight = font.weight;
      }
      if (font.src) {
        def.fontObject = new lowland.bom.Font(font.src);
      }

      return def;
    },


    /**
     * Parse styles
     *
     * @param styles {Object} The raw style definitions
     * @param themeStyles {Object} Reference to the parsed style definitions
     */
    __parseStyles: function(styles, themeStyles) {

      var keys = Object.keys(styles);
      for (var i = 0, ii = keys.length; i < ii; i++) {
        var key = keys[i];
        var value = styles[key];
        var obj = { theme: this.__name, key: key, includes: [ ], styles: [ ] };

        // @todo Where do these properties come from?
        if (key == 'moduleName' || key == 'toString' || key == 'valueOf' ||
          key == '__isModule') {
          continue;
        }

        // Check whether there is already a style defined by that name/key
        if (!themeStyles[key]) {
          themeStyles[key] = [ ];
        }

        if (typeof value === 'string') {
          // e.g. 'button': 'baseButton' (take all styles from baseButton)
          obj.includes.push(value);
        } else {
          // e.g. 'button': { include: ..., style: ... }
          if (value.include) {
            if (typeof value.include === 'string') {
              value.include = [ value.include ];
            }

            for (var j = 0, jj = value.include.length; j < jj; j++) {
              obj.includes.push(value.include[j]);
            }
          }

          if (value.style) {
            obj.styles.push(value.style);
          } else {
            if (!value.include) {
              obj.styles.push(null);
            }

          }
        }

        themeStyles[key].push(obj);
      }
    },


    /*
     ----------------------------------------------------------------------------
     PROTECTED
     ----------------------------------------------------------------------------
     */

    /**
     * Parse the theme definition
     *
     * @param theme {Object} The theme definition to parse
     * @param themeColors {Object} Reference to theme's colors
     * @param themeFonts {Object} Reference to theme's fonts
     * @param themeStyles {Object} Reference to theme's styles
     */
    _parse: function(theme, themeColors, themeFonts, themeStyles) {
      // Check whether ot not theme configuration was provided
      if (!theme && core.Env.getValue('debug')) {
        throw new Error('No theme given!');
      }

      // Counter variables
      var i;
      var ii;
      var key;

      // Set theme name
      var name = theme.name;
      if (name) {
        this.__name = name;
      }

      // Check for other themes to include
      if (theme.include) {
        var themesToInclude = theme.include instanceof Array ?
          theme.include : [ theme.include ];

        for (i = 0, ii = themesToInclude.length; i < ii; i++) {
          var includedTheme = themesToInclude[i].getParsedTheme();
          var includedColors = includedTheme.colors;
          var includedFonts = includedTheme.fonts;
          var includedStyles = includedTheme.styles;

          for (key in includedColors) {
            themeColors[key] = includedColors[key];
          }
          for (key in includedFonts) {
            themeFonts[key] = includedFonts[key];
          }
          for (key in includedStyles) {
            themeStyles[key] = includedStyles[key];
          }
        }
      }

      // Set colors
      var colors = theme.colors;
      if (colors) {
        var keys = Object.keys(colors);
        for (i = 0, ii = keys.length; i < ii; i++) {
          var colorName = keys[i];
          var color = colors[colorName];

          themeColors[colorName] = color;
        }
      }

      // Set fonts
      var fonts = theme.fonts;
      if (fonts) {
        var keys = Object.keys(fonts);
        for (i = 0, ii = keys.length; i < ii; i++) {
          var fontName = keys[i];
          var font = this.__parseFont(fonts[fontName]);

          themeFonts[fontName] = font;
        }
      }

      // Set styles
      var styles = theme.styles;
      if (styles) {
        this.__parseStyles(styles, themeStyles);
      }
    },


    /*
     ----------------------------------------------------------------------------
     PUBLIC
     ----------------------------------------------------------------------------
     */

    /**
     * Get theme name
     *
     * @return {String} The name of the theme
     */
    name: function() {
      return this.__name;
    },


    /**
     * Get parsed theme
     *
     * @return {Object} The parsed theme with color, font and style definitions
     */
    getParsedTheme: function() {
      return {
        colors: this.__colors,
        fonts: this.__fonts,
        styles: this.__styles
      }
    },


    /**
     * Get color by name
     *
     * @param name {String} The name of the color definition
     * @return {String|null} The color
     */
    resolveColor: function(name) {
      var result = this.__colors[name] || null;

      if (!result && core.Env.getValue('debug')) {
        console.warn('Color "' + name + '" not found!');
      }

      return result;
    },


    /**
     * Get font by name
     *
     * @param name {String} The name of the font definition
     * @return {Object|null} The font
     */
    resolveFont: function(name) {
      var result = this.__fonts[name] || null;

      if (!result && core.Env.getValue('debug')) {
        console.warn('Font "' + name + '" not found!');
      }

      return result;
    },


    /**
     * Get style by name
     *
     * @param name {String} The name of the style definition
     * @param states {Object} Map of states to apply
     * @return {Object} Map of CSS styles
     */
    resolveStyle: function(name, states) {
      states = states || { };
      var id = name + '-' + Object.keys(states).sort().join('-');

      // Check, whether or not the styles are already in the cache
      var result = this.__styleCache[id];
      if (result) {
        return result;
      }

      // Check, whether or not the style is available
      var styleDef = this.__styles[name];

      if (!styleDef) {
        if (core.Env.getValue('debug')) {
          console.warn('No style "' + name + '" found!');
        }
        return null;
      }

      // Execute style functions
      var styles = this.__resolveStyleHelper(styleDef, states);

      // Resolve colors
      var colorTags = [
        'backgroundColor', 'borderColor', 'borderBottomColor',
        'borderLeftColor', 'borderRightColor', 'borderTopColor',
        'color'
      ];
      for (var i = 0, ii = colorTags.length; i < ii; i++) {
        var tag = colorTags[i];
        if (styles[tag]) {
          styles[tag] = this.resolveColor(styles[tag]);
        }
      }

      // Cache styles
      this.__styleCache[id] = styles;

      return styles;
    }
  }

});
