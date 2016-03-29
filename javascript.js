function dotMaker(canvas_context,coordinateX, coordinateY, Color, Size, id, error_code)
{
	this.x = coordinateX;
	this.y = coordinateY;
	this.color = Color;
	this.size = Size;
	this.id = id;
	this.error_code = error_code;
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
function showInfo(object, color, id, status, maintenance)
{
	document.getElementById("error_code").innerHTML = object.error_code;
    document.getElementById("status_id").innerHTML = id;
    document.getElementById("status_state").innerHTML = status;
    document.getElementById("next_maintenance").innerHTML = maintenance;
    object.color=color;
    object.drawDot();
}
window.onload = function() {

	//global variables
	var c = document.getElementById("map");
	var ctx = c.getContext("2d");
    var img = document.getElementById("mapimg");
    ctx.drawImage(img, 0, 0);
    var mousePos;
    var clickeventcontrol = 
    {
    	inside_check : false,
    	object_id : -1,
    };
    //event listeners
    c.addEventListener('mousemove', function mo(evt) 
    {
    mousePos = getMousePos(c, evt);
    if (mousePos.x < 500)
    {
    	for(i=0; i<6; i++)
    	{
    		if (isInside(mousePos, dotsarray[i]))
    			{
    				showInfo(dotsarray[i],"red","Machine ID: "+(i+1),"Working Status: This machine is working properly","Next maintenance: No maintenace is scheduled");
    				clickeventcontrol.inside_check = true;
    				clickeventcontrol.object_id = i;
    				return;
    			}
    		else {
    			showInfo(dotsarray[i],"orange","Machine ID: Unselected","Working Status: Unselected", "Next maintenance: Not found");
    			clickeventcontrol.inside_check = false;
    			clickeventcontrol.object_id = -1;
    		}

    	}
    }
    else clickeventcontrol.inside_check=false;
    if (mousePos.x > 1000)
    {
    	for(i=5; i<8; i++)
    	{
    		if (isInside(mousePos, dotsarray[i]))
    			{
    				showInfo(dotsarray[i],"red","Machine ID: "+(i+1),"Working Status: This machine is working properly", "Next maintenance: No maintenace is scheduled");
    				clickeventcontrol.inside_check = true;
    				clickeventcontrol.object_id = i;
    				return;
    			}
    		else {
    			showInfo(dotsarray[i],"orange","Machine ID: Unselected","Working Status: Unselected","Next maintenance: Not found");
    			clickeventcontrol.inside_check = false;
    			clickeventcontrol.object_id = -1;
    		}

    	}
    }
    else clickeventcontrol.inside_check=false;
	}
	);
    
    c.addEventListener("click", function (e) {
    if (clickeventcontrol.inside_check == true) {
    	$("#modaltrigger").trigger('click');
    }
    }
    );

    //reset
    $("#closemodal").click(
    	function()
    	{
    		showInfo(dotsarray[i],"orange","Machine ID: Unselected","Working Status: Unselected","Next maintenance: Not found");
    		clickeventcontrol.inside_check = false;
    		clickeventcontrol.object_id = -1;
    	}
    	)
    //coordinate constants
    var machine_coordinatex = [84,206,342,462,143,265,1048,1163];
    var machine_coordinatey = [77,77,77,77,203,287,420,428];
    var dotsarray = [];

    //dot makings
    for(var i=0; i<8; i++)
    {
    	//code for drawing dots
    	dotsarray[i] = new dotMaker(ctx,machine_coordinatex[i], machine_coordinatey[i], "orange", 15, "Machine ID: " + (i+1), "Error code: NO_ERROR");
    	dotsarray[i].drawDot();
    }
}
