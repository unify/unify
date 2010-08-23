/* ************************************************************************

	bookshelf

	Copyright:
		2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("bookshelf.view.mobile.Two", {
	extend : unify.view.mobile.RemoteView,
	type : "singleton",

	members : 
	{
		__content : null,
		__inTouch : null,
		__elementPos : null,
		__moveElement : null,
		
		__bookStack : null,
		__board : null,
		__boardPosition : null,
	
	
		_getBusinessObject : function() {
			return unify.business.YqlData.getInstance();
		},
	
		_getServiceName : function() {
			return "yql";
		},
		
		_getServiceParams : function() 
		{
			return {
				query : encodeURIComponent("select * from flickr.photos.interestingness(4)")
			};
		},
		
		_getRenderVariant : function() {
			return "interestingness(4)";
		},
	

		// overridden
		getTitle : function(type, param) {
			return "2D CSS";
		},

		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);
			var titlebar = new unify.ui.mobile.TitleBar(this);
			titlebar.add({href:'sys-info', label:'System-Info', target:'right'});
			layer.add(titlebar);
			
			var content = this.__content = new unify.ui.mobile.Content;
			content.add("Loading...");
			layer.add(content);

			return layer;
		},
		
		
		_getQuad : function()
		{
			var board = document.createElement("div");
			board.className = "board";
			board.innerHTML = '<div class="top"></div><div class="front"></div><div class="right"></div><div class="back"></div><div class="left"></div><div class="bottom"></div>'
			return board;
		},
		
		
		
		// overridden
		_renderData : function(data)
		{
			var fragment = document.createDocumentFragment();
			
			var root = document.createElement("div");
			root.className = "root";
			fragment.appendChild(root);
			
			var board1 = document.createElement("div");
			board1.className = "board";
			root.appendChild(board1);
			
			var results = data.query.results.photo;
			var fragment = document.createDocumentFragment();
			var item, imageUrl, elem;
			
			this.__bookStack = [];
			this.__board = board1;
			
			//Registration.addListener(root, "touchstart", this.__onTouchStart, this);
			//Registration.addListener(document.documentElement, "touchmove", this.__onTouchMove, this);
			//Registration.addListener(root, "touchend", this.__onTouchEnd, this);
			
			var bookContainer = document.createElement("div");
			bookContainer.className = "bookcontainer";
			
			for (var i=0, l=results.length; i<l; i++)
			{
				item = results[i];
				imageUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
				
				imageElem = new Image;
				imageElem.src = imageUrl;
				
				//bookElem = this._getQuad();
				bookElem = imageElem; //document.createElement("div");
				//bookElem.style.left = (130+60*i) + "px";
				bookElem.className = "book active";
				//bookElem.childNodes[2].appendChild(imageElem);
				
				bookElem2 = document.createElement("div");
				bookElem2.innerHTML = "<div>Buch " + (i+1) + "</div>";
				bookElem2.className = "cover";
				//bookElem2.style.left = (130+60*i) + "px";

				this.__bookStack.push({
					element : bookElem,
					cover: bookElem2
				});
				
				//bookElem.style.WebkitTransform = "translateY(-14px)";
				
				if (i == 0) {
					//bookElem.className="book first";
					//bookElem.style.marginLeft = "204px"
				} else
				if (i==14) {
					this.__elementPos = 0;
					this.__moveElement = bookElem;
				}
				
				bookContainer.appendChild(bookElem);
				bookContainer.appendChild(bookElem2);
			}
			root.appendChild(bookContainer);
			
			var Registration = qx.event.Registration;
			Registration.addListener(bookContainer, "tap", this.__onTap, this);
			
			this.__content.replace(root);
		},
		
		__onTap : function(e)
		{
			var target = e.getTarget();
			var Class = qx.bom.element.Class;
			var Style = qx.bom.element.Style;
			
			while (!Class.has(target.parentNode, "bookcontainer")) {
				target = target.parentNode;
			}
			
			var cover;
			var book;
			if (Class.has(target, "cover")) {
				cover = target;
				book = target.previousSibling;
				
				Style.set(cover, "display", "none");
				Style.set(book, "display", "inline-block");
			} else {
				book = target;
				cover = target.nextSibling;
				
				Style.set(cover, "display", "inline-block");
				Style.set(book, "display", "none");
			}
			
			console.log("tap", target, book, cover);
		},
		
		__onTouchStart : function(e)
		{
			this.__inTouch = e.getScreenLeft();
			this.__boardPosition = qx.bom.element.Location.get(this.__board);
			for (var i=0,len=this.__bookStack.length;i<len;i++) {
				this.__bookStack[i].position = qx.bom.element.Location.get(this.__bookStack[i].element);
			}
		},
		
		__draw : function(book, diff) {
			var element = book.element;
			if (diff != 0) {
				var pos = this.__elementPos = diff;
				if (pos < 0) {
					pos = this.__elementPos = 0;
				} else if (pos > 140) {
					pos = this.__elementPos = 140;
				}
				
				var percent = pos / 140.0;
				var rot;
				if (percent <= 0.5) {
					rot = -180.0 * percent;
				} else {
					rot = - 180.0 * (1.0-percent);
				}
				element.style.WebkitTransform = "translateY(-14px) translateZ(60px) rotateY(" + rot + "deg) translateZ(-60px)";
				var left;
				if (percent <= 0.5) {
					left = Math.floor(200*percent) + 4;
				} else {
					left = 204 - (Math.floor(200*percent) + 4);
				}
				element.style.marginLeft = left + "px";
				//element.style.marginRight = (208-left) + "px";
			}
		},
		
		__onTouchMove : function(e)
		{
			var oldLeft = this.__inTouch;
			if (oldLeft) {
				var newLeft = this.__inTouch = e.getScreenLeft();
				var pos = this.__boardPosition;
				var mousePos = e.getScreenLeft();
				var pos2 = qx.bom.element.Location.get(this.__moveElement);
				//console.log(pos2.left, pos2.top);
				//console.log(e.getScreenLeft(), e.getViewportLeft(), e.getDocumentLeft());
				
				var bookStack = this.__bookStack;
				var mouseLeft = e.getScreenLeft();
				
				for (var i=0,len=bookStack.length; i<len; i++) {
					var book = bookStack[i];
					if ( (mouseLeft > (book.position.left-120)) && (mouseLeft < (book.position.left + 120)) ) {
						this.__draw(book, 160 - (mouseLeft - book.position.left + 80));
					}
				}
				
				//this.__draw(this.__moveElement, newLeft - oldLeft);
			}
		},
		
		__onTouchEnd : function(e)
		{
			this.__inTouch = null;
		}
	}
});
