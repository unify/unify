core.Module("unify.ui.layout.Util", {
  calculateLeftGap : function(widget) {
    return widget.getBorder().left + widget.getMarginLeft() || 0;
  },

  calculateTopGap : function(widget) {
    return widget.getBorder().top + widget.getMarginTop() || 0;
  },
  
  calculateRightGap : function(widget) {
    return widget.getBorder().right + widget.getMarginRight() || 0;
  },
  
  calculateBottomGap : function(widget) {
    return widget.getBorder().bottom + widget.getMarginBottom() || 0;
  },
  
  calculateHorizontalGap : function(widget) {
    var border = widget.getBorder();
    return border.left + widget.getMarginLeft() + border.right + widget.getMarginRight() || 0;
  },
  
  calculateVerticalGap : function(widget) {
    var border = widget.getBorder();
    return border.top + widget.getMarginTop() + border.bottom + widget.getMarginBottom() || 0;
  },
  
  /**
     * Computes the flex offsets needed to reduce the space
     * difference as much as possible by respecting the
     * potential of the given elements (being in the range of
     * their min/max values)
     *
     * @param flexibles {Map} Each entry must have these keys:
     *   <code>id</code>, <code>potential</code> and <code>flex</code>.
     *   The ID is used in the result map as the key for the user to work
     *   with later (e.g. upgrade sizes etc. to respect the given offset)
     *   The potential is an integer value which is the difference of the
     *   currently interesting direction (e.g. shrinking=width-minWidth, growing=
     *   maxWidth-width). The flex key holds the flex value of the item.
     * @param avail {Integer} Full available space to allocate (ignoring used one)
     * @param used {Integer} Size of already allocated space
     * @return {Map} A map which contains the calculated offsets under the key
     *   which is identical to the ID given in the incoming map.
     */
    computeFlexOffsets : function(flexibles, avail, used) {
      var child, key, flexSum, flexStep;
      var grow = avail > used;
      var remaining = Math.abs(avail - used);
      var roundingOffset, currentOffset;


      // Preprocess data
      var result = {};
      for (key in flexibles)
      {
        child = flexibles[key];
        result[key] =
        {
          potential : grow ? child.max - child.value : child.value - child.min,
          flex : grow ? child.flex : 1 / child.flex,
          offset : 0
        }
      }


      // Continue as long as we need to do anything
      while (remaining != 0)
      {
        // Find minimum potential for next correction
        flexStep = Infinity;
        flexSum = 0;
        for (key in result)
        {
          child = result[key];

          if (child.potential > 0)
          {
            flexSum += child.flex;
            flexStep = Math.min(flexStep, child.potential / child.flex);
          }
        }


        // No potential found, quit here
        if (flexSum == 0) {
          break;
        }


        // Respect maximum potential given through remaining space
        // The parent should always win in such conflicts.
        flexStep = Math.min(remaining, flexStep * flexSum) / flexSum;


        // Start with correction
        roundingOffset = 0;
        for (key in result)
        {
          child = result[key];

          if (child.potential > 0)
          {
            // Compute offset for this step
            currentOffset = Math.min(remaining, child.potential, Math.ceil(flexStep * child.flex));

            // Fix rounding issues
            roundingOffset += currentOffset - flexStep * child.flex;
            if (roundingOffset >= 1)
            {
              roundingOffset -= 1;
              currentOffset -= 1;
            }

            // Update child status
            child.potential -= currentOffset;

            if (grow) {
              child.offset += currentOffset;
            } else {
              child.offset -= currentOffset;
            }

            // Update parent status
            remaining -= currentOffset;
          }
        }
      }

      return result;
    }
});