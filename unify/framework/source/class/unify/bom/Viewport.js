core.Module("unify.bom.Viewport", {
  isLandscape : function() {
    return window.outerWidth > window.outerHeight;
  }
});