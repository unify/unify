/**
 * CompositeInteractive
 *
 * Generic container widget with additional interaction behaviour.
 */
core.Class('unify.ui.container.CompositeInteractive', {
  include: [
    unify.ui.container.Composite,
    unify.ui.core.MInteractionState
  ],

  /**
   * Constructor
   *
   * @param layout {unify.ui.layout.Base?null} The layout for this container
   */
  construct : function(layout) {
    unify.ui.container.Composite.call(this);
    unify.ui.core.MInteractionState.call(this);

    if (layout) {
      this._setLayout(layout);
    }
  }
});
