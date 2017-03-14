/************************************
*		      CANVAS CLASS			*
/************************************/

	function Canvas(w, h)
	{
		var _this 	= this;
		var _dom	= document.createElement('canvas');
		var _ctx 	= _dom.getContext('2d');
		var _w 		= w;
		var _h 		= h;

		var _construct = function()
		{
			var _ratio 			= _getRatio();

			_dom.width 			= _w * _ratio;
			_dom.height 		= _h * _ratio;
			_dom.style.width 	= _w + 'px';
			_dom.style.height 	= _h + 'px';

			_ctx.setTransform(_ratio, 0, 0, _ratio, 0, 0);
			// _ctx.translate(_w / 4, _h / 4);
		};

		var _getRatio = function()
		{
			var dpr = 	window.devicePixelRatio 			|| 1;
			var bsr = 	_ctx.webkitBackingStorePixelRatio 	||
						_ctx.mozBackingStorePixelRatio 		||
						_ctx.msBackingStorePixelRatio 		||
						_ctx.oBackingStorePixelRatio 		||
						_ctx.backingStorePixelRatio 		|| 1;

			return dpr / bsr;
		};

		this.clearRect = function(x, y, w, h)
		{
			_ctx.clearRect(x, y, w, h);
		};

		this.clear = function()
		{
			_this.clearRect(0, 0, _w, _h);
		}

		this.getContext = function()
		{
			return _ctx;
		};

		this.getWidth = function()
		{
			return _w;
		};

		this.getHeight = function()
		{
			return _h;
		};

		this.getDom = function()
		{
			return _dom;
		};

		this.setContext = function(options, callback)
		{
			_ctx.save();

			for (var prop in options)
			{
				if (options.hasOwnProperty(prop))
				{
					_ctx[prop] = options[prop];
				}
			}

			callback();

			_ctx.restore();
		}

		this.draw = function(drawable)
		{
			drawable.draw(_ctx);
		}

		_construct();
	}

/************************************
 *			DRAWING CLASS 			*
/************************************/

	function Drawing()
	{
		var _this = this;
		var _canvas = new Canvas(800,600);
 		var __dom 	= document.createElement('div');
 		var _cornerDetector = new CornerDetector();

 		var _mouseDown = false;

 		var _lines = [];
 		var _line = [];

 		var _corners = [];

 		var _construct = function()
 		{
			document.body.appendChild(__dom);
			__dom.appendChild(_canvas.getDom());

			__dom.addEventListener('mousedown', function(e)
			{
				_mouseDown = true;
			});

			__dom.addEventListener('mouseup', function(e)
			{
				var v = new Vector(e.offsetX, e.offsetY);
				_line.push(v);

				// console.log(_lines);
				_mouseDown = false;
			});
		
			__dom.onmousemove = function(e)
			{
				if(_mouseDown)
				{
					var v = new Vector(e.offsetX, e.offsetY);
					_line.push(v);
					// console.log('{x: '+e.offsetX+', y: '+e.offsetY+'}');
				}
			}

			__dom.onmouseleave = function(e)
			{
				_mouseDown = false;
			}
 		}

		var points = [
			{x: 154, y: 189},
			{x: 157, y: 189},
			{x: 160, y: 192},
			{x: 170, y: 199},
			{x: 174, y: 202},
			{x: 181, y: 202},
			{x: 191, y: 205},
			{x: 197, y: 209},
			{x: 207, y: 212},
			{x: 221, y: 219},
			{x: 231, y: 222},
			{x: 244, y: 229},
			{x: 254, y: 229},
			{x: 261, y: 232},
			{x: 271, y: 232},
			{x: 275, y: 236},
			{x: 278, y: 239},
			{x: 285, y: 242},
			{x: 288, y: 242},
			{x: 298, y: 242},
			{x: 301, y: 246},
			{x: 305, y: 246},
			{x: 312, y: 246},
			{x: 322, y: 246},
			{x: 325, y: 246},
			{x: 332, y: 243},
			{x: 342, y: 233},
			{x: 352, y: 230},
			{x: 362, y: 220},
			{x: 369, y: 213},
			{x: 375, y: 206},
			{x: 379, y: 196},
			{x: 382, y: 193},
			{x: 385, y: 190},
			{x: 389, y: 183},
			{x: 389, y: 173},
			{x: 392, y: 173},
			{x: 396, y: 169},
			{x: 399, y: 163},
			{x: 402, y: 159},
			{x: 409, y: 149},
			{x: 412, y: 146},
			{x: 416, y: 142},
			{x: 416, y: 136},
			{x: 419, y: 132},
			{x: 419, y: 129},
			{x: 419, y: 126},
			{x: 419, y: 122},
			{x: 422, y: 119},
			{x: 422, y: 116},
			{x: 422, y: 112},
			{x: 422, y: 109},
			{x: 422, y: 106},
			{x: 422, y: 99},
			{x: 422, y: 95},
			{x: 420, y: 92},
			{x: 417, y: 92},
			{x: 407, y: 85},
			{x: 400, y: 85},
			{x: 390, y: 82},
			{x: 383, y: 82},
			{x: 373, y: 82},
			{x: 360, y: 82},
			{x: 353, y: 79},
			{x: 346, y: 79},
			{x: 336, y: 79},
			{x: 329, y: 75},
			{x: 326, y: 75},
			{x: 323, y: 72},
			{x: 319, y: 69},
			{x: 316, y: 69},
			{x: 313, y: 69},
			{x: 313, y: 65}
		];

		for (var i = 0; i < points.length; i++)
		{
			var v = new Vector(points[i].x, points[i].y);
			_line.push(v);
		}
		
		_canvas.clear();
		
		for (var i = 0; i < _line.length; i++)
		{
			_canvas.draw(_line[i]);
		}

		// setInterval(function()
 			// {
 				_canvas.clear();
		
 				for (var i = 0; i < _line.length; i++)
 				{
					_canvas.draw(_line[i]);
 				}

 			
			
 			// }, 1000/24);

 		this.show = function()
 		{
 			var c = new Vector(0,0);
 			_canvas.draw(c);

 			var v1 = (Vector.from2DAngle(0)).mult(100);
 			var v2 = (Vector.from2DAngle()).mult(100);

			var vr = (Vector.right()).mult(100);

			// _canvas.draw(v1);
			_canvas.draw(v2);
			// _canvas.draw(vr);
  		}

 		this.findCorners = function()
		{
			// for (var i = 0; i < _lines.length; i++)
			// {
				_cornerDetector.searchForCorners(_line);
				// console.log();

				var chunks = _cornerDetector.getLineChunks();
				_corners = _cornerDetector.getCorners();

				console.log(_corners);

				for (var j = 0; j < chunks.length; j++)
				{
					var v1 = chunks[j][0];
					var v2 = chunks[j][chunks[j].length-1];
					var l = new Line(v1, v2);
					_canvas.draw(l);
				}

				_canvas.setContext({
					strokeStyle : 'blue',
					lineWidth : 10
				}, function()
				{
					for (var i = 0; i < _corners.length; i++)
					{
						var c = _corners[i];
						_canvas.draw(c);
					}
				});
			// }
			
			/*var chunkSize = 5;
			var chunks = [];
			var meanAngles = [];

			var angles = [];

			for (var i = 0; i < _line.length; i++)
			{
				var point = _line[i];

				if(i % chunkSize == 0)
				{
					chunks.push([]);
				}

				var chunkIndex = Math.floor(i / chunkSize);

				var chunk = chunks[chunkIndex];
				chunk.push(point);
			}

			for (var i = 0; i < chunks.length; i++)
			{
				var points = chunks[i];

				var angleSinSum = 0;
				var angleCosSum = 0;

				angles.push([]);

				for (var j = 0; j < points.length-1; j++)
				{
					var v1 = points[j];
					var v2 = points[j+1];

					var l = new Line(v1, v2);

					angles[i].push(l.angle());

					angleSinSum += Math.sin(l.angle(true));
					angleCosSum += Math.cos(l.angle(true));

					_canvas.draw(l);
				}

				var meanAngle = 180 / Math.PI * Math.atan2(angleSinSum, angleCosSum);

				if(meanAngle < 0)
					meanAngle+= 360;

				meanAngles[i] = meanAngle;
			}

			// console.log(angles);

			console.log(meanAngles);

			var threshold = 50;

			for (var i = 0; i < meanAngles.length-1; i++)
			{
				var m1 = meanAngles[i];
				var m2 = meanAngles[i+1];

				var max = Math.max(m1, m2);
				var min = Math.min(m1, m2);

				var diff = max - min;

				console.log(diff);

				if(diff > threshold)
				{
					console.log(i);
					console.log(i+1);

					var v1 = chunks[i-1][0];
					var v2 = chunks[i-1][chunks[i-1].length-1];
					var v3 = chunks[i+1][0];
					var v4 = chunks[i+1][chunks[i+1].length-2];

					var l1 = new Line(v1, v2);
					var l2 = new Line(v3, v4);

					var vi = l1.getIntersectionPoint(l2);
		
					_canvas.setContext(function(_ctx)
					{
						_ctx.strokeStyle = 'blue';
						_ctx.lineWidth = 10;
					});

					_canvas.draw(vi);
				}
			}*/
		}

 		_construct();
	}



	var d = new Drawing();

	d.show();

	window.addEventListener('keydown', function(e)
	{
		switch(e.code)
		{
			case('Space'):
				d.findCorners();
			break;
		}
	});

	function sum(a) {
		s = 0;
		for (var i in a) s += a[i];
		return s;
	} 

	function degToRad(a) {
		return Math.PI/180*a;
	}

	function meanAnglesDeg(a) {
		return 180/Math.PI*Math.atan2(
			sum(
				a.map(degToRad).map(Math.sin)
				) / a.length ,
			sum(
				a.map(degToRad).map(Math.cos)
				) / a.length);
	}

		var a = [30, 20, 10], b = [90, 180, 270, 360],  c =[10, 20, 30];
		// console.log(meanAnglesDeg(a));
		// console.log(meanAnglesDeg(b));
		// console.log(meanAnglesDeg(c));

	function CornerDetector()
	{
		var _this 		= this;
		var _chunks 	= [];
		var _corners 	= [];
		var _chunkSize 	= 3;
		
		this.searchForCorners = function(points)
		{
			var meanAngles = [];

			var angles = [];

			for (var i = 0; i < points.length; i++)
			{
				var point = points[i];  

				if(i % _chunkSize == 0)
				{
					_chunks.push([]);
				}

				var chunkIndex = Math.floor(i / _chunkSize);

				var chunk = _chunks[chunkIndex];
				chunk.push(point);
			}

			for (var i = 0; i < _chunks.length; i++)
			{
				var points = _chunks[i];

				var angleSinSum = 0;
				var angleCosSum = 0;

				angles.push([]);

				for (var j = 0; j < points.length-1; j++)
				{
					var v1 = points[j];
					var v2 = points[j+1];

					var l = new Line(v1, v2);

					angles[i].push(l.angle());

					angleSinSum += Math.sin(l.angle(true));
					angleCosSum += Math.cos(l.angle(true));

					//_canvas.draw(l);
				}

				var meanAngle = 180 / Math.PI * Math.atan2(angleSinSum, angleCosSum);

				if(meanAngle < 0)
					meanAngle+= 360;

				meanAngles[i] = meanAngle;
			}

			// console.log(angles);

			// console.log(meanAngles);

			var threshold = 60;

			var refMean = meanAngles[0];

			for (var i = 1; i < meanAngles.length; i++)
			{
				var m = meanAngles[i];

				if(Math.abs(m - refMean) > threshold)
				{
					refMean = meanAngles[i+1];

					try{

						var v1 = _chunks[i-1][0];
						var v2 = _chunks[i-1][_chunks[i-1].length-1];
						var v3 = _chunks[i+1][0];
						var v4 = _chunks[i+1][_chunks[i+1].length-2];

						var l1 = new Line(v1, v2);
						var l2 = new Line(v3, v4);

						var c = l1.getIntersectionPoint(l2);
						_corners.push(c);
					}  
					catch (e)
					{

					}
				}
			}

			// for (var i = 0; i < meanAngles.length-1; i++)
			// {
			// 	var m1 = meanAngles[i];
			// 	var m2 = meanAngles[i+1];

			// 	var max = Math.max(m1, m2);
			// 	var min = Math.min(m1, m2);

			// 	var diff = max - min;

			// 	// console.log(diff);

			// 	if(diff > threshold)
			// 	{
			// 		// console.log(i);
			// 		// console.log(i+1);

			// 		var v1 = _chunks[i-1][0];
			// 		var v2 = _chunks[i-1][_chunks[i-1].length-1];
			// 		var v3 = _chunks[i+1][0];
			// 		var v4 = _chunks[i+1][_chunks[i+1].length-2];

			// 		var l1 = new Line(v1, v2);
			// 		var l2 = new Line(v3, v4);

			// 		var c = l1.getIntersectionPoint(l2);

			// 		_corners.push(c);
			// 		// _canvas.setContext(function(_ctx)
			// 		// {
			// 		// 	_ctx.strokeStyle = 'blue';
			// 		// 	_ctx.lineWidth = 10;
			// 		// });

			// 		// _canvas.draw(vi);
			// 	}
			// }
		}

		this.getCorners = function()
		{
			return _corners;
		}

		this.getLineChunks = function()
		{
			return _chunks;
		}
	}