/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * The label widget implements text representation in unify widget system
 */
qx.Class.define("unify.ui.basic.Label", {
  extend : unify.ui.core.Widget,

  statics : {
    LINEHEIGHT : null
  },

  /**
   * Creates a new instance of Label
   * @param text {String} Text content to use
   */
  construct : function(text) {
    this.base(arguments);

    var statics = this.self(arguments);
    if (!statics.LINEHEIGHT) {
      statics.LINEHEIGHT = qx.theme.manager.Appearance.getInstance().styleFrom("label", {}, null, "label").lineHeight || 1.4;
    }

    if (text) {
      this.setValue(text);
    }

    this._applyEllipsis(this.getEllipsis());
  },

  properties : {
    /** Contains the label content */
    value : {
      check: "String",
      apply: "_applyValue",
      event: "changeValue",
      nullable: true
    },

    /** Wheter the content is HTML or plain text */
    html : {
      check: "Boolean",
      init: true,
      event: "changeHtml"
    },

    // overridden
    allowGrowX : {
      refine : true,
      init : true
    },


    // overridden
    allowGrowY : {
      refine : true,
      init : false
    },

    // overridden
    allowShrinkY : {
      refine : true,
      init : true
    },
    
    // overridden
    allowShrinkY : {
      refine : true,
      init : false
    },
    
    // overridden
    appearance : {
      refine: true,
      init: "label"
    },

    /** Whether the label text overflow creates an ellipsis */
    ellipsis : {
      check: "Boolean",
      init: true,
      apply: "_applyEllipsis"
    },

    /** Whether the label text wraps to multi line or creates hidden overflow */
    wrap : {
      check: "Boolean",
      init: false,
      apply: "_applyWrap"
    },

    /** Wheter the label should calculate it's size */
    autoCalculateSize : {
      check: "Boolean",
      init: false
    }
  },

  members : {
    __contentSize : null,

    // overridden
    _createElement : function() {
      return qx.bom.Label.create(this.getValue(), this.getHtml());
    },

    // overridden
    _getContentHint : function()
    {
      var contentSize = this.base(arguments);

      if (this.getAutoCalculateSize()) {
        contentSize = this.__contentSize;
        if (!contentSize)
        {
          contentSize = this.__contentSize = this.__computeContentSize();
        }
      } else if (!this.getWrap()) {
        contentSize.height = Math.ceil(( parseInt(this.getFont().fontSize,10)||20 ) * this.self(arguments).LINEHEIGHT);
      }

      return {
        width : contentSize.width,
        height : contentSize.height
      };
    },

    // overridden
    _hasHeightForWidth : function() {
      return this.getAutoCalculateSize();
    },

    /**
     * Returns computed height for given width
     *
     * @param width {Integer} Width to match
     * @return {Integer} Height matching given width
     */
    _getContentHeightForWidth : function(width)
    {
      /*if (!this.getHtml() && !this.getWrap()) {
        return null;
      }*/
      return this.__computeContentSize(width).height;
    },

    /**
     * Internal utility to compute the content dimensions.
     *
     * @param width {Integer} Width of label
     * @return {Map} Content size
     */
    __computeContentSize : function(width)
    {
      var Label = qx.bom.Label;

      var styles = this.getFont();
      var content = this.getValue() || "A";

      var hint;
      if (this.getHtml()) {
        hint = Label.getHtmlSize(content, styles, width);
      } else {
        hint = Label.getTextSize(content, styles);
      }

      return hint;
    },

    /**
     * Applies text to element
     * @param value {String} New value to set
     */
    _applyValue : function(value) {
      this.__contentSize = null;
      this.invalidateLayoutChildren();
      qx.bom.Label.setValue(this.getElement(), value);
    },

    /**
     * Applies ellipsis text overflow to element
     * @param valuee {Boolean} Ellipsis overflow
     */
    _applyEllipsis : function(value) {
      if (value) {
        this.addState("ellipsis");
      } else {
        this.removeState("ellipsis");
      }
    },

    /**
     * Applies wrap to element
     * @param valuee {Boolean} Ellipsis overflow
     */
    _applyWrap : function(value) {
      if (value) {
        this.addState("wrap");
      } else {
        this.removeState("wrap");
      }
    }
  }
});
