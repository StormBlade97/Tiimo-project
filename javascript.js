function dotMaker(canvas_context,coordinateX, coordinateY, Color, Size, Message)
{
	this.x = coordinateX;
	this.y = coordinateY;
	this.color = Color;
	this.size = Size;
	this.message = Message;
	this.drawDot = function () 
	{
		canvas_context.beginPath();
        canvas_context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
       	canvas_context.closePath();
        canvas_context.fillStyle = this.color;
        canvas_context.fill();
	}
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
        };
}
function isInside(mouse_object, dotobject)
{
	var x = Math.abs(mouse_object.x - dotobject.x);
	var y =	Math.abs(mouse_object.y - dotobject.y);
	if (x < dotobject.size && y < dotobject.size) return true;
	else return false;
}
window.onload = function() {

	//global variables
	var c = document.getElementById("map");
	var ctx = c.getContext("2d");
    var img = document.getElementById("mapimg");
    ctx.drawImage(img, 0, 0);

    //event listener
    c.addEventListener('mousemove', function mo(evt) 
    {
    var mousePos = getMousePos(c, evt);
    if (mousePos.x < 500)
    {
    	for(i=0; i<6; i++)
    	{
    		if (isInside(mousePos, dotsarray[i]))
    			{
    				document.getElementById("error_code").innerHTML = dotsarray[i].message;
    				dotsarray[i].color="red";
    				dotsarray[i].drawDot();
    			}
    		else {
    			document.getElementById("error_code").innerHTML = "Unknown";
    		    dotsarray[i].color="green";
    		    dotsarray[i].drawDot();}

    	}
    }
    if (mousePos.x > 1000)
    {
    	for(i=5; i<8; i++)
    	{
    		if (isInside(mousePos, dotsarray[i]))
    			{
    				document.getElementById("error_code").innerHTML = dotsarray[i].message;
    				dotsarray[i].color="red";
    				dotsarray[i].drawDot();
    			}
    		else {
    			document.getElementById("error_code").innerHTML = "Unknown";
    		    dotsarray[i].color="green";
    		    dotsarray[i].drawDot();}

    	}
    }
    document.getElementById("status_id").innerHTML = mousePos.x;
    document.getElementById("status_state").innerHTML = mousePos.y;
	}
	);

    //coordinate constants
    var machine_coordinatex = [84,206,342,462,143,265,1048,1163];
    var machine_coordinatey = [77,77,77,77,203,287,420,428];
    var dotsarray = [];

    //dot makings
    for(var i=0; i<8; i++)
    {
    	//code for drawing dots
    	dotsarray[i] = new dotMaker(ctx,machine_coordinatex[i], machine_coordinatey[i], "green", 10, "nothing");
    	dotsarray[i].drawDot();
    }
}
