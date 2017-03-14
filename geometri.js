
/************************************
 *			 VECTER CLASS			*
/************************************/

	function Vector(x, y, z)
	{
		var _this = this;

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

		this.sub = function(s)
		{
			if(s instanceof Vector)
			{
				return new Vector(_this.x - s.x, _this.y - s.y, _this.z - s.z);
			}
			else
			{
				return new Vector(_this.x - s, _this.y - s, _this.z - s);
			}
		}

		this.add = function(s)
		{
			if(s instanceof Vector)
			{
				return new Vector(_this.x + s.x, _this.y + s.y, _this.z + s.z);
			}
			else
			{
				return new Vector(_this.x + s, _this.y + s, _this.z + s);
			}
		}

		this.mult = function(s)
		{
			if(s instanceof Vector)
			{
				return new Vector(_this.x * s.x, _this.y * s.y, _this.z * s.z);
			}
			else
			{
				return new Vector(_this.x * s, _this.y * s, _this.z * s);
			}
		}

		// this.scale = function(s)
		// {
		// 	if(s instanceof Vector)
		// 	{
		// 		_this.x *= s.x;
		// 		_this.y *= s.y;
		// 		_this.z *= s.z;	
		// 	}
		// 	else
		// 	{
		// 		_this.x *= s;
		// 		_this.y *= s;
		// 		_this.z *= s;
		// 	}
		// }

		this.projectionOn = function(A, B)
		{
			var AB = B.sub(A);
			var AC = _this.sub(A);

			var dotPro = AC.dot(AB);
			var length = AB.mag();
			var skalar = dotPro/Math.pow(length, 2);
			
			return AB.mult(skalar).add(A);
		};

		this.dot = function(other)
		{
			return (_this.x * other.x) + (_this.y * other.y) + (_this.z * other.z);
		};

		this.mag = function()
		{
			return Math.sqrt((_this.x * _this.x) + (_this.y * _this.y));
		};

		this.dist = function(other)
		{
			var diff = _this.sub(other);
			return diff.mag();
		};

		this.isBetween = function(A, B)
		{
			var AB = B.sub(A);
			var AC = _this.sub(A);

			var DAB = AC.dot(AB);
			var DAC = AC.dot(AC);

			if (DAC < 0 || DAC > DAB)
			{
				return false;
			}
			return true;
		};

		this.getUnitVector = function()
		{
			if(_this.mag() > 0)
			{	
				return _this.mult(1/_this.mag());
			}
			return 0; 
		}

		this.equals = function(other)
		{
			return _this.x == other.x && _this.y == other.y && _this.z == other.z;
		}

		this.cross = function(other)
		{
			var x = (_this.y * other.z) - (_this.z * other.y);
			var y = (_this.z * other.x) - (_this.x * other.z);
			var z = (_this.x * other.y) - (_this.y * other.x);

			return new Vector(x, y, z);
		}

		this.rotate = function(degrees)
		{
			var x = (_this.x * Math.cos(degrees * Math.PI / 180)) - (_this.y * Math.sin(degrees * Math.PI / 180));
			var y = (_this.y * Math.cos(degrees * Math.PI / 180)) + (_this.x * Math.sin(degrees * Math.PI / 180));

			return new Vector(x, y);
		}

		this.angleBetween180 = function(other, inRadians)
		{
			var radians = Math.acos(_this.dot(other) / (_this.mag() * other.mag()));
			
			if(!inRadians)
				return radians * (180 / Math.PI );
			
			return parseFloat(radians);
		}

		this.angleBetween360 = function(other, inRadians)
		{
			var theta 	= _this.angleBetween180(other, inRadians);
			var zCross 	= (_this.cross(other)).z;

			if (zCross >= 0)
			{
				if(inRadians)
					return ( 2 * Math.PI) - theta;
	
				return 360 - theta;
			}

			return theta;
		}

		this.angle = function(inRadians)
		{
			return _this.angleBetween360(new Vector(1,0,0), inRadians);
		}

		this.toString = function()
		{
			return '(' + _this.x.toFixed(1) + ', ' + _this.y.toFixed(1) + ', ' + _this.z.toFixed(1) + ')';
		}

		this.draw = function(ctx)
		{
			ctx.beginPath();
			ctx.arc(_this.x, _this.y, .5, 0, 2*Math.PI);
			ctx.stroke();
		}
	};

	/*
	 * STATIC METHODS
	 */

	Vector.from2DAngle = function(theta)
	{
		var x = Math.cos(theta * Math.PI / 180);
		var y = Math.sin(theta * Math.PI / 180);
		var z = 0;

		return new Vector(x,y,z);
	}

	Vector.right = function()
	{
		return new Vector(1,0,0);
	}

	Vector.left = function()
	{
		return new Vector(-1,0,0);
	}

	Vector.up = function()
	{
		return new Vector(0,-1,0);
	}

	Vector.down = function()
	{
		return new Vector(0,1,0);
	}

	Vector.one = function()
	{
		return new Vector(1,1,1);
	}

/************************************
 *			LINE CLASS				*
/************************************/

	function Line(A, B)
	{
		var _this = this;
		this.A = A || new Vector();
		this.B = B || new Vector();

		this.draw = function(ctx)
		{
			ctx.save();
			
			ctx.beginPath();
			ctx.moveTo(_this.A.x, _this.A.y);
			ctx.lineTo(_this.B.x, _this.B.y);
			ctx.strokeStyle = '#ff0000';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.restore();
		}

		this.getIntersectionPoint = function(other)
		{
			var lineConst1 = _this.getLineConstants();
			var lineConst2 = other.getLineConstants();

			if(lineConst1.a == lineConst2.a)
			{
				return null;
			}
			else
			{
				return new Vector(
					(lineConst2.b - lineConst1.b) / (lineConst1.a - lineConst2.a),
					(lineConst1.a * (lineConst2.b - lineConst1.b) / (lineConst1.a - lineConst2.a)) + lineConst1.b
					);
			}
		};

		this.getLineConstants = function()
		{
			var a = (_this.B.y - _this.A.y) / (_this.B.x - _this.A.x);
			var b = _this.A.y - (a * _this.A.x);

			return {a : a, b : b};
		};

		this.angle = function(inRadians)
		{
			var v = B.sub(A);
 			var a = v.angle(inRadians);

 			return a;
		}

		this.lengthOf = function()
		{
			return _this.A.dist(_this.B);
		}
	};


/************************************
 *			RECTANGLE CLASS			*
/************************************/

	function Rectangle(A, B, C, D)
	{
		this.A = A || new Vector();
		this.B = B || new Vector();
		this.C = C || new Vector();
		this.D = D || new Vector();

		var f = new Path2D();
		var s = new Path2D();

		this.updateDrawLine = function(l)
		{
			f.moveTo(this.B.x, this.B.y);
			f.lineTo(this.C.x, this.C.y);
			f.lineTo(this.D.x, this.D.y);
			f.lineTo(this.A.x, this.A.y);
			f.closePath();

			s.moveTo(this.A.x, this.A.y);
			s.lineTo(this.B.x, this.B.y);
			s.lineTo(this.C.x, this.C.y);
			s.lineTo(this.D.x, this.D.y);
			s.closePath();
		}

		this.drawStroke = function(ctx)
		{
			ctx.stroke(s);
		}

		this.drawFill = function(ctx)
		{
			ctx.fill(f);
		}

		this.intersectsWidthPoint = function(point)
		{
			var AProjBC 		= this.A.projectionOn(this.B, this.C);
			var parlEdgeDist 	= AProjBC.dist(this.A);

			var pointProjAB = point.projectionOn(this.A, this.B);
			var pointProjBC = point.projectionOn(this.B, this.C);
			var pointProjCD = point.projectionOn(this.C, this.D);
			var pointProjDA = point.projectionOn(this.D, this.A);

			if(	pointProjAB.dist(point) <= parlEdgeDist+1
			&&	pointProjBC.dist(point) <= parlEdgeDist+1
			&&	pointProjCD.dist(point) <= parlEdgeDist+1
			&&	pointProjDA.dist(point) <= parlEdgeDist+1)
			{
				return true;
			}
			return false;
		}

		this.lengthOf = function(A, B)
		{
			return this[A].dist(this[B]);
		}
	};
