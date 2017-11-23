//preview at  http://www.stefanobovio.com/archive/randomMap/
// r:218,g:191,b:117
function randomMap(id, r, g, b, sea, contour, scale){

	this.c = document.getElementById(id);
	this.ctx = this.c.getContext("2d");
	this.elevation = [];
	this.minElevation = 0;
	this.maxElevation = 0;
	this.sideValue = 32;
	this.side = this.sideValue;
	this.c.setAttribute("width", 512);
	this.c.setAttribute("height", 512);
	this.row = this.c.getAttribute("height")/this.side;
	this.col = this.c.getAttribute("width")/this.side;
	this.seed = 0;
	this.delta = 100;
	this.cStep = 10;
	this.sizeArray = [128,256,512,1024,2048];

	this.resize = function(width,height){

		var tmpWidth = 512;
		var factor = 1;
		var check = width;

		if(width > height){
			check = height;

		}else{
			check = width;
		}

		for(var i = 0; i < this.sizeArray.length-1; i++){

			if(check > this.sizeArray[i]
			&& check <= this.sizeArray[i+1]){
				tmpWidth = this.sizeArray[i];
				factor = this.sizeArray[i]/512;
				break;
			}
		}

		this.side = this.sideValue*factor;
		this.c.setAttribute("width",tmpWidth);
		this.c.setAttribute("height",tmpWidth);
		this.c.style.marginLeft = (width-tmpWidth)/2 + "px";
		this.c.style.marginTop = (height-tmpWidth)/2 + "px";
		this.row = this.c.getAttribute("height")/this.side;
		this.col = this.c.getAttribute("width")/this.side;
		this.seed = 0;
		this.delta = 100;
		this.cStep = 10;
	}

	this.set = function(){
		this.elevation = [];
		this.diamond(this.elevation,this.seed,this.delta);
		this.maxElevation = max(this.elevation);
		this.minElevation = min(this.elevation);
	}

	this.draw = function(){

		for(var y = 0; y < this.row; y++){
			for(var x = 0; x < this.col; x++){
				var v = Math.floor(map(this.elevation[x][y],this.minElevation,this.maxElevation, 0, 255));

                if (scale) {
                    const keys = Object.keys(scale);
                    keys.forEach((a, idx) => {
                        if (idx !== keys.length - 1) {
                            if (v >= parseFloat(a) && v < parseFloat(keys[idx + 1])) {
                                // this.ctx.fillStyle = multColor({r: scale[a].r, g: scale[a].g, b: scale[a].b },{r:v,g:v,b:v},1);
                                this.ctx.fillStyle = 'rgba(' + scale[a].r + ', ' + scale[a].g + ', ' + scale[a].b + ', 1)';
                            }
                        }
                    });

                } else if (r !== null) {
                    this.ctx.fillStyle = multColor({r:r,g:g,b:b},{r:v,g:v,b:v},1);
                } else {
                    this.ctx.fillStyle = 'rgba(' + v + ', ' + v + ', ' + v + ', 1)';
                }

				this.ctx.fillRect(x*this.side,y*this.side,this.side,this.side);
			}
		}

        if (sea) {
            this.ctx.fillStyle = "rgba(10,200,200,0.2)";

    		for(var y = 0; y < this.row; y++){
    			for(var x = 0; x < this.col; x++){

    				if(this.elevation[x][y] < 0){
    					this.ctx.fillRect(x*this.side,y*this.side,this.side,this.side);
    				}
    			}
    		}
        }


        if (contour) {
		contourLine(this.elevation, this.maxElevation, this.minElevation,this.side,this.ctx,"rgba(100,100,100,0.4)",1,this.cStep);

		for(var i =0; i < 8; i++){

			var step = this.c.getAttribute("width")/8;

			line(this.ctx,step/2+step*i,0,step/2+step*i,this.c.getAttribute("height"),"rgba(242,242,242,0.2)",0.5);
			line(this.ctx,0,step/2+step*i,this.c.getAttribute("width"),step/2+step*i,"rgba(242,242,242,0.2)",0.5);
		}

		line(this.ctx,this.side*2,this.side*2,this.c.getAttribute("width")-this.side*2,this.side*2,"rgba(242,242,242,1)",2);
		line(this.ctx,this.side*2,this.c.getAttribute("height")-this.side*2,this.c.getAttribute("height")-this.side*2,this.c.getAttribute("width")-this.side*2,"rgba(242,242,242,1)",2);
		line(this.ctx,this.side*2,this.side*2,this.side*2,this.c.getAttribute("height")-this.side*2,"rgba(242,242,242,1)",2);
		line(this.ctx,this.c.getAttribute("width")-this.side*2,this.side*2,this.c.getAttribute("width")-this.side*2,this.c.getAttribute("height")-this.side*2,"rgba(242,242,242,1)",2);
        }

	}

	this.update = function(){

		this.set();
		this.draw();

	}

	this.diamond = function(data,seed,delta){

		for(var y = 0; y < this.row+1; y++){

			var tmp = [];

			for(var x = 0; x < this.col+1; x++){
				tmp.push(0);
			}

			data.push(tmp);
			tmp = null;
		}

		data[0][0] = seed + (Math.random()*2*delta) - delta;
		data[0][this.col] = seed + (Math.random()*2*delta) - delta;
		data[this.row][this.col] = seed + (Math.random()*2*delta) - delta;
		data[this.row][0] = seed + (Math.random()*2*delta) - delta;

		for(var lenghtS = this.col; lenghtS >= 2; lenghtS /=2, delta/= 2.0){

			var halfLenghtS = lenghtS/2;

			for(var y = 0; y < this.row; y += lenghtS){

				for(var x=0;x< this.col; x += lenghtS){

					var average = data[y][x] + data[y][x+lenghtS] + data[y+lenghtS][x] + data[y+lenghtS][x+lenghtS];

					average /= 4.0;

					average = average + (Math.random()*2*delta) - delta;

					data[y+halfLenghtS][x+halfLenghtS] =  average;
				}
			}

			for(var y = 0; y <= this.row; y += halfLenghtS){

				for(var x = (y+halfLenghtS)%lenghtS; x <= this.col; x += lenghtS){

					var average = 0;

					if(x > 0 && x < this.col && y > 0 && y < this.row){

						average = data[y][(x-halfLenghtS)] + data[y][(x+halfLenghtS)] + data[(y+halfLenghtS)][x] + data[(y-halfLenghtS)][x];
						average /= 4.0;

					}else{

						if(y == 0){
							average = data[y][(x-halfLenghtS)] + data[y][(x+halfLenghtS)] + data[(y+halfLenghtS)][x] ;
						}

						if(x == 0){
							average = data[y][(x+halfLenghtS)] + data[(y+halfLenghtS)][x]+ data[(y-halfLenghtS)][x];
						}

						if(x == this.col){
							average = data[y][(x-halfLenghtS)] + data[(y+halfLenghtS)][x] + data[(y-halfLenghtS)][x];
						}

						if(y == this.row){
							average = data[y][(x-halfLenghtS)] + data[y][(x+halfLenghtS)] + data[(y-halfLenghtS)][x];
						}

						average /= 3.0;
					}

					average = average + (Math.random()*2*delta) - delta;

					data[y][x] = average;
				}
			}
		}

	}

	function contourLine(data, max, min, side, ctx, color, width, cStep){

		var isoArray = [];
		var start = Math.ceil(min);
		for(var i = (start - start%cStep) ; i < Math.ceil(max); i += cStep){
			isoArray.push(i);
		}

		for(var i = 0; i < isoArray.length;i++){

			var iso = isoArray[i];

			for(var y = 0; y < data.length-1; y++){

				for(var x = 0; x < data.length-1; x++){

					if(data[x][y] > iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side,y*side+side/2, x*side+side/2,y*side+side,color,width);

					}else if(data[x][y] > iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] > iso){

						line(ctx,x*side+side/2,y*side+side,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] > iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side,y*side+side/2,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] > iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] > iso){

						line(ctx,x*side+side/2,y*side,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] > iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] > iso){

						line(ctx,x*side+side/2,y*side,x*side+side/2,y*side+side,color,width);

					}else if(data[x][y] > iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side+side/2,y*side,x*side,y*side+side/2,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] > iso){

						line(ctx,x*side+side/2,y*side,x*side,y*side+side/2,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side+side/2,y*side,x*side+side/2,y*side+side,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side+side/2,y*side,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] > iso){

						line(ctx,x*side,y*side+side/2,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] <= iso){

						line(ctx,x*side+side/2,y*side+side,x*side+side,y*side+side/2,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] > iso){

						line(ctx,x*side,y*side+side/2,x*side+side/2,y*side+side,color,width);

					}else if(data[x][y] <= iso
					&& data[x+1][y] > iso
					&& data[x+1][y+1] <= iso
					&& data[x][y+1] > iso){

						if( (data[x][y] + data[x+1][y] + data[x+1][y+1] + data[x][y+1])/4 <= iso){

							line(ctx,x*side,y*side+side/2,x*side+side/2,y*side+side,color,width);
							line(ctx,x*side+side/2,y*side,x*side+side,y*side+side/2,color,width);

						}else{
							line(ctx,x*side,y*side+side/2,x*side+side/2,y*side,color,width);
							line(ctx,x*side+side/2,y*side+side,x*side+side,y*side+side/2,color,width);
						}

					}else if(data[x][y] > iso
					&& data[x+1][y] <= iso
					&& data[x+1][y+1] > iso
					&& data[x][y+1] <= iso){

						if( (data[x][y] + data[x+1][y] + data[x+1][y+1] + data[x][y+1])/4 > iso){

							line(ctx,x*side,y*side+side/2,x*side+side/2,y*side+side,color,width);
							line(ctx,x*side+side/2,y*side,x*side+side,y*side+side/2,color,width);

						}else{
							line(ctx,x*side,y*side+side/2,x*side+side/2,y*side,color,width);
							line(ctx,x*side+side/2,y*side+side,x*side+side,y*side+side/2,color,width);
						}

					}
				}
			}
		}
	}

	function line(ctx,x1,y1,x2,y2,color,width){
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	function max(array){

		var value = array[0][0];

		for(var y = 0; y < array.length;y++){
			for(var x = 0; x < array[0].length; x++){
				if(array[x][y] > value){
					value = array[x][y];
				}
			}
		}

		return value;
	}

	function min(array){

		var value = array[0][0];

		for(var y = 0; y < array.length;y++){
			for(var x = 0; x < array[0].length; x++){
				if(array[x][y] < value){
					value = array[x][y];
				}
			}
		}

		return value;
	}

	function multColor(f,b,a){
		return "rgba("+Math.floor((f.r*b.r)/255)+","+Math.floor((f.g*b.g)/255)+","+Math.floor((f.b*b.b)/255)+","+a+")";
	}

	function map(value, v1, v2, v3, v4) {
		return v3 + (v4 - v3) * ((value - v1) / (v2 - v1));
	}
}

module.exports = randomMap;
