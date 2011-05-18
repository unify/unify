qx.Class.define("unify.ui.widget.core.QueueManager", {
  statics : {
    /** {Map} Internal data structure for the current job list */
    __jobs : {},
    
    /**
     * Schedule a deferred flush of all queues.
     *
     * @param job {String} The job, which should be performed. Valid values are
     *     <code>layout</code>, <code>decoration</code> and <code>element</code>.
     * @return {void}
     */
    scheduleFlush : function(job) {
      unify.ui.widget.core.QueueManager.__jobs[job] = true;
    },
    
    hasJob : function(job) {
      return !!unify.ui.widget.core.QueueManager.__jobs[job];
    },
    
    deleteJob : function(job) {
      delete unify.ui.widget.core.QueueManager.__jobs[job];
    },
    
    flush : function(baseWidget) {
      var jobs = unify.ui.widget.core.QueueManager.__jobs;
      while (jobs.visibility || jobs.widget || jobs.appearance || jobs.layout) {
        // No else blocks here because each flush can influence the following flushes!
        if (jobs.widget)
        {
          delete jobs.widget;
          qx.ui.core.queue.Widget.flush();
        }
  
        if (jobs.visibility)
        {
          delete jobs.visibility;
          qx.ui.core.queue.Visibility.flush();
        }
  
        if (jobs.appearance)
        {
          delete jobs.appearance;
          qx.ui.core.queue.Appearance.flush();
        }
  
        // Defer layout as long as possible
        if (jobs.widget || jobs.visibility || jobs.appearance) {
          continue;
        }
  
        if (jobs.layout)
        {
          delete jobs.layout;
          qx.ui.core.queue.Layout.flush();
        }
      }
    }
  },
  
  defer : function(statics) {
    qx.ui.core.queue.Manager.scheduleFlush = statics.scheduleFlush;
  }
});