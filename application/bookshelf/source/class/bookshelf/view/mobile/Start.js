/* ************************************************************************

	bookshelf

	Copyright:
		2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("bookshelf.view.mobile.Start", {
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
				query : encodeURIComponent("select * from flickr.photos.interestingness(5)")
			};
		},
		
		_getRenderVariant : function() {
			return "interestingness(5)";
		},
	

		// overridden
		getTitle : function(type, param) {
			return "Start";
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
			
			var board1 = this._getQuad();
			board1.className = "board";
			root.appendChild(board1);
			
			var results = data.query.results.photo;
			var fragment = document.createDocumentFragment();
			var item, imageUrl, elem;
			
			this.__bookStack = [];
			this.__board = board1;
			
			var Registration = qx.event.Registration;
			Registration.addListener(root, "touchstart", this.__onTouchStart, this);
			Registration.addListener(document.documentElement, "touchmove", this.__onTouchMove, this);
			Registration.addListener(root, "touchend", this.__onTouchEnd, this);
			
			for (var i=0, l=results.length; i<l; i++)
			{
				item = results[i];
				imageUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
				
				imageElem = new Image;
				imageElem.src = imageUrl;
				
				bookElem = this._getQuad();
				bookElem.className = "book";
				bookElem.childNodes[2].appendChild(imageElem);
				bookElem.childNodes[1].innerHTML = "Buch " + (i+1);

				this.__bookStack.push({
					element : bookElem,
					margin : (i==0)?204:4
				});
				
				bookElem.style.WebkitTransform = "translateY(-14px)";
				
				if (i == 0) {
					bookElem.className="book first";
					//bookElem.style.marginLeft = "204px"
				} else
				if (i==2) {
					this.__elementPos = 0;
					this.__moveElement = bookElem;
				}
				
				board1.appendChild(bookElem);
			}
			
			this.__content.replace(root);
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
				
				var bookStack = this.__bookStack;
				var mouseLeft = e.getScreenLeft();
				
				for (var i=0,len=bookStack.length; i<len; i++) {
					var book = bookStack[i];
					if ( (mouseLeft > (book.position.left-120)) && (mouseLeft < (book.position.left + 120)) ) {
						this.__draw(book, 160 - (mouseLeft - book.position.left + 80));
					}
				}
			}
		},
		
		__onTouchEnd : function(e)
		{
			this.__inTouch = null;
		}
	}
});
