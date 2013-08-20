

var suite = new core.testrunner.Suite("core/BasicWidget");

var spy = function(obj, name, msg, callback) {
	var defaultFnt = obj[name];
	obj[name] = function() {
		console.log(msg, JSON.stringify(core.Array.fromArguments(arguments)));
		if (callback) {
			callback(this, arguments);
		}
		defaultFnt.apply(this, arguments);
	};
};

var unifyStartUp = function(context, callback, members) {
	members = members || {};
	members.main = core.Function.bind(callback, context);
	core.Class("testchild.Application", {
		include: [unify.core.Init],

		members: members
	});
	jasy.Env.define('application', "testchild");
	unify.core.Init.startUp();
};

suite.test("test child in canvas layout", function() {
	//spy(unify.ui.layout.queue.Manager, "run", "Run");

	var layoutrenderings = 0;

	var rootElement = document.body;
	var rootEventElement = document.documentElement;
	var viewportElement = rootElement;

	var canvasLayout = new unify.ui.layout.Canvas();
	spy(canvasLayout, "renderLayout", "Render Layout", function() {
		layoutrenderings ++;
	});

	var root = new unify.view.Root(rootElement, rootEventElement, viewportElement, canvasLayout);
	var rootWidth = root.getSizeHint().width;
	var rootHeight = root.getSizeHint().height;

	var widget = new unify.ui.basic.Content();
	spy(widget, "renderLayout", "Rendering layout on widget");

	root.add(widget, {
		left: 0, right: 0, top: 0, bottom: 0
	});

	core.Function.timeout(function() {
		this.isIdentical(rootWidth, widget.getBounds().width);
		this.isIdentical(rootHeight, widget.getBounds().height);
		this.isIdentical(layoutrenderings, 1);
		this.done();
	}, this, 100);
}, 3, 1000);

suite.test("test child in scroller layout", function() {
	//spy(unify.ui.layout.queue.Manager, "run", "Run");

	var layoutrenderings = 0;

	var rootElement = document.body;
	var rootEventElement = document.documentElement;
	var viewportElement = rootElement;

	unifyStartUp(this, function() {
		var canvasLayout = new unify.ui.layout.Canvas();
		spy(canvasLayout, "renderLayout", "Render Layout", function() {
			layoutrenderings ++;
		});

		var root = new unify.view.Root(rootElement, rootEventElement, viewportElement, canvasLayout);
		var rootWidth = root.getSizeHint().width;
		var rootHeight = root.getSizeHint().height;

		var scroller = new unify.ui.container.Scroll(new unify.ui.layout.Canvas());
		scroller.set({
			enableScrollX: true
		});
		//spy(scroller, "renderLayout", "Rendering layout on scroller");
		
		root.add(scroller, {
			left: 0, right: 0, top: 0, bottom: 0
		});

		var widget = new unify.ui.basic.Content();
		widget.set({
			allowGrowX: false,
			allowGrowY: false,
			allowShrinkX: false,
			allowShrinkY: false,
			width: 600,
			height: 100
		});
		scroller.add(widget, {
			top: 10,
			left: 10
		});
		//spy(widget, "renderLayout", "Rendering layout on widget");

		core.Function.timeout(function() {
			this.isIdentical(10+600, scroller.getContentWidth());
			this.isIdentical(10+100, scroller.getContentHeight());
			this.isIdentical(600, widget.getBounds().width);
			this.isIdentical(100, widget.getBounds().height);

			var widget2 = new unify.ui.basic.Content();
			widget2.set({
				allowGrowX: false,
				allowGrowY: false,
				allowShrinkX: false,
				allowShrinkY: false,
				width: 1000,
				height: 300
			});
			scroller.add(widget2, {
				top: 50,
				left: 50
			});
			//spy(widget2, "renderLayout", "Rendering layout on widget2");

			core.Function.timeout(function() {
				this.isIdentical(50+1000, scroller.getContentWidth());
				this.isIdentical(50+300, scroller.getContentHeight());
				this.isIdentical(1000, widget2.getBounds().width);
				this.isIdentical(300, widget2.getBounds().height);
				this.isIdentical(layoutrenderings, 1);
				this.done();
			}, this, 100);
		}, this, 100);
	}, {
		getRoot : function() {
			return rootElement;
		}
	});

}, 9, 1000);