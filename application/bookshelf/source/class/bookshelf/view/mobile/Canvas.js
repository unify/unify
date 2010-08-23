/* ************************************************************************

	bookshelf

	Copyright:
		2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("bookshelf.view.mobile.Canvas", {
	extend : unify.view.mobile.RemoteView,
	type : "singleton",

	members : 
	{
		__context : null,
		__images : null,
		__imageCounter : null,
		
		__angle : null,
		
		
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
				query : encodeURIComponent('select source from flickr.photos.sizes where height="75" and photo_id in (select id from flickr.photos.search where has_geo="true" and text="germany") limit 4')
			};
		},
		
		_getRenderVariant : function() {
			return "interestingness(4)";
		},
	

		// overridden
		getTitle : function(type, param) {
			return "Canvas";
		},

		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);
			var titlebar = new unify.ui.mobile.TitleBar(this);
			titlebar.add({href:'sys-info', label:'System-Info', target:'right'});
			layer.add(titlebar);
			

			var canvas = document.createElement("canvas");
			
			canvas.style.width = "320px";
			canvas.width = 200;
			canvas.style.height = "330px";
			canvas.height = 330;
			
			var ctx = this.__context = canvas.getContext("2d");
			
			layer.add(canvas);
			
			var Registration = qx.event.Registration;
			Registration.addListener(canvas, "touchstart", this.__onTouchStart, this);
			Registration.addListener(document.documentElement, "touchmove", this.__onTouchMove, this);
			Registration.addListener(canvas, "touchend", this.__onTouchEnd, this);
			
			return layer;
		},	
		
		// overridden
		_renderData : function(data)
		{
			console.log(data);
			var results = data.query.results.size;
			this.__images = [];
			this.__imageCounter = 0;
			
			this.__angle = 40;
			
			for (var i=0,len=results.length; i<len; i++) {
				var item = results[i];
				var imgObj = new Image();
				//var url = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
				var url = item.source;
				var boundCallback = qx.lang.Function.listener(this.__imageLoaded, this, imgObj, url);
				this.__imageCounter++;
				imgObj.onload = boundCallback;
				imgObj.src = url;
				var imagesObject = {
					name : "Buch #" + (i+1),
					image:imgObj,
					position: 0.1*i,
					mypos : i
				};
				this.__images.push(imagesObject);
			}
			
			var ctx = this.__context;
		},
		
		__imageLoaded : function() {
			this.__imageCounter--;
			
			if (this.__imageCounter == 0) {
				this.__allImagesLoaded();
			}
		},
		
		__canvasImageSkew : function(context, img, angle, xPos, marker) {
			var grid = 1;
			
			var cos = Math.cos(angle * Math.PI / 180);
			if (cos <= 0) return;
			
			var w = img.width;
			var h = img.height;
			
			var w2 = w * cos;
			if (w2 < 1) return;
			
			var scalingFactor     = 0.6 + 0.4 * cos;
			var sliceNum          = w2 / grid;
			var sliceWidthOrigin  = w / sliceNum;                    
			
			var sliceWidthDest    = sliceWidthOrigin * w2 / w;
			var heightDelta       = h * ((1 - scalingFactor) / sliceNum);

			for(var n = 0; n < sliceNum; n++) {
				sx = Math.floor(sliceWidthOrigin * n);
				sy = 0;
				sw = Math.floor(sliceWidthOrigin);
				sh = h;
				
				dx = n * sliceWidthDest;
				dy = (angle > 0) ? ((heightDelta * n) / 3) : heightDelta * sliceNum / 3 - heightDelta * n /3; 
				dw = sliceWidthDest;
				dh = (angle > 0) ? h - (heightDelta * n) : h * scalingFactor + heightDelta * n;
				
				try {
					if (unify.bom.client.System.ANDROID) {
						context.drawImage(img, sx, sy, sw, sh, (dx+xPos)/1.5, dy/1.5, dw/1.5, dh/1.5);
					} else {
						context.drawImage(img, sx, sy, sw, sh, (dx+xPos), dy, dw, dh);
					}
				} catch (e) {
				}
			}
	    },
		
		__canvasBackside : function(ctx, i, angle, realx, marker) {
			var cos = Math.cos(angle * Math.PI / 180);
			var cosMod = 1.0 - cos;
			var width = Math.round(15 * cosMod);
			var mod = 3 * cos;
			
			ctx.fillStyle = "brown";  
			ctx.beginPath();
			ctx.moveTo(realx-width, 0+mod);
			ctx.lineTo(realx-width, 75-mod);
			ctx.lineTo(realx, 75);
			ctx.lineTo(realx, 0);
			ctx.lineTo(realx-width, 0+mod);
			ctx.fill();

			ctx.fillStyle = '#fff';
			var text = i.name;
			ctx.font = '10px sans-serif';
			var textMetric = ctx.measureText(text);
			if (cosMod >= 0.15) {
				ctx.save();
				var rad = -90 * Math.PI / 180;
				ctx.scale(cosMod, 1);
				ctx.rotate(rad);
				ctx.textBaseline = 'top';
				ctx.fillText(text, (-75 / 2) - (textMetric.width / 2), (realx - width) / cosMod);
				
				ctx.restore();
			} else {
				if (cosMod >= 0.05) {
					ctx.beginPath();
					var x = realx - (width / 2);
					var y = (75 / 2) - (textMetric.width / 2);
					ctx.moveTo(x, y);
					ctx.lineTo(x, y + textMetric.width);
					ctx.lineTo(x + 1, y + textMetric.width);
					ctx.lineTo(x + 1, y);
					ctx.lineTo(x, y);
					ctx.fill();
				}
			}
		},
		
		__allImagesLoaded : function() {
			var ctx = this.__context;
			var images = this.__images;
			
			/*this.__canvasImageSkew(ctx, images[0].image, this.__angle, 0);
			this.__canvasImageSkew(ctx, images[1].image, this.__angle, 25);
			this.__canvasImageSkew(ctx, images[2].image, this.__angle, 50);
			this.__canvasImageSkew(ctx, images[3].image, this.__angle, 75);*/
			this.__draw(20);
		},
		
		__drawImage : function(i, diff, myPos, maxPos) {
			//if (myPos != 1) return;
			var ctx = this.__context;
			var realx = i.realx;
			var angle = 80.0*(Math.abs(0.5-i.position)*2);
			ctx.save();
			this.__canvasImageSkew(ctx, i.image, angle, realx, myPos==1);
			ctx.restore();
			ctx.save();
			this.__canvasBackside(ctx, i, angle, realx, myPos == 1);
			ctx.restore();
		},
		
		__draw : function(leftPosition) {
			var ctx = this.__context;
			var images = this.__images;
			
			ctx.fillStyle = "rgb(35,35,35)";  
			ctx.fillRect(0, 0, 319, 329);
			
			var percent = leftPosition / 320.0;
			for (var i = 0, len = 4; i < len; i++) {
				var img = images[i];
				img.position += percent;
				if (img.position < 0) {
					img.position = 0;
				}
				if (img.position > 1) {
					img.position = 1;
				}
				var x = Math.floor(200*img.position) + 40*img.mypos;
				img.realx = x;
			}
			for (var i=0,len=4; i<len; i++) {
				this.__drawImage(images[i], percent, images[i].mypos, 4);
			}
		},
		
		__onTouchStart : function(e)
		{
			this.__inTouch = e.getScreenLeft();
		},
		
		__onTouchMove : function(e)
		{
			var oldLeft = this.__inTouch;
			if (oldLeft) {
				var newLeft = this.__inTouch = e.getScreenLeft();
				var diff = newLeft - oldLeft;
				this.__draw(diff);
			}
		},
		
		__onTouchEnd : function(e)
		{
			this.__inTouch = null;
		}
	}
});
