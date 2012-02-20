(function(global) {

  var Visibility = unify.ui.layout.queue.Visibility;
  var Appearance = unify.ui.layout.queue.Appearance;
  var Layout = unify.ui.layout.queue.Layout;

  lowland.QueueManager.register(Visibility.name, Visibility.flush);
  lowland.QueueManager.register(Appearance.name, Appearance.flush, null, Visibility.name);
  lowland.QueueManager.register(Layout.name, Layout.flush, null, [Visibility.name, Appearance.name]);

  core.Module("unify.ui.layout.queue.Manager", {
    flush : function() {
      lowland.QueueManager.flush();
    },
    
    run : function(name) {
      lowland.QueueManager.run(name);
    }
  });

})(this);