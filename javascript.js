function dotMaker(canvas_context, coordinateX, coordinateY, id, status, nextmaintenance, error_code)
{
	/* 	This function is the constructor of the dot objects
			the following variables are properties of the dots which are the x & y coordinates,
			the ids, status and various information regarding the machine the dots represent.
		Plese notes that in this script, they are initiated by hand, however when a database is used, these information should be
			fetched from the database /server
	*/
	this.x = coordinateX;
	this.y = coordinateY;
	this.id = id; 
	this.status = status;
	this.nextmaintenance = nextmaintenance;
	this.error_code = error_code;
	this.size = 10;
	//the following function decides the color and the size of the dots based on status
	this.visual_representation = function()
	{
		if(this.error_code==0) switch (this.status)
							  	{
							  		//status can have three stage: broken, approaching maintenance, or working fine, if
							  		//there is no error (which means they are not broken) the broken case is not counted.
							  		case 0: {return "orange"; break;} // fine but approching maintenance
							  		case 1: {return "green"; break;} // working properly, no need to worry about
							  	}
		else 
			{
				//the status now is -1, and the dots will then be red. Note that now status is dependant on error
				//the server should automatically change status of machine to -1 in the event of ERROR
				return "red";
			}
	}
	this.drawDot = function (initiate, ismouseover) 
	{	
		if(initiate)
		{	
			canvas_context.beginPath();
		    canvas_context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		    canvas_context.closePath();
		    canvas_context.fillStyle = this.visual_representation();
		    canvas_context.fill();
		    return;
		}
		if(ismouseover)
		{
			canvas_context.beginPath();
		    canvas_context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		    canvas_context.closePath();
		    canvas_context.fillStyle = "white";
		    canvas_context.fill();
		    return;
		}
		else
		{
			canvas_context.beginPath();
		    canvas_context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		    canvas_context.closePath();
		    canvas_context.fillStyle = this.visual_representation();
		    canvas_context.fill();
		}
	}
	this.showInfo = function()
	{
		if (this.error_code == 0) //no error
				$("#error_code").css("display","none");
		else 	
			{
				$("#error_code").css("display","inline").text("ERROR CODE: " + this.error_code);
			}
	    document.getElementById("status_id").innerHTML = "Machine ID: " + this.id;
	    switch(this.status)
	    {
	    	case 0: {document.getElementById("status_state").innerHTML = "Status: This machine is working properly but needs maintenance soon"; break;}
	    	case 1: {document.getElementById("status_state").innerHTML = "Status: This machine is working properly"; break;}
	    	case -1: {document.getElementById("status_state").innerHTML = "Status: This machine is not working properly, please call admin"; break;}
	    }
	    document.getElementById("next_maintenance").innerHTML = "Next maintenance: " + this.nextmaintenance;
	    this.drawDot(false,true);
	}
	
}
//functions enabling interaction with canvas
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

//-----------------------------------------------------------------------------------------------------------------------------------
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
    //coordinate constants, which should be feed directly from a database. Since I dont have database, it is written as a global variables
    var machine_coordinatex = [84,206,342,462,143,265,1048,1163];
    var machine_coordinatey = [77,77,77,77,203,287,420,428];
    var dotsarray = [];

    //show the dots
    for(var i=0; i<8; i++)
    {
    	//create dots objects
        dotsarray[i] = new dotMaker(ctx, machine_coordinatex[i], machine_coordinatey[i], (i + 1), 1, "Unknown", 0);
    	//mass-produced object, to be changed by database info
    	dotsarray[i].drawDot(true, false);
    }
    	dotsarray[6].error_code = 4;
    	dotsarray[6].status = -1;
    	dotsarray[6].drawDot(true,false);
    //event listeners
    c.addEventListener('mousemove', function mo(evt) 
    {
    mousePos = getMousePos(c, evt);
    if (mousePos.x < 500) //since there is a loop which invokes multiple functions, we use this master condition to reduce the steps
    {
    	for(i=0; i<6; i++)
    	{
    		if (isInside(mousePos, dotsarray[i]))
    			{
    				dotsarray[i].drawDot(false,true);
    				clickeventcontrol.inside_check = true;
    				clickeventcontrol.object_id = i;
    				return; // if it detects the mouse already inside a dot, there is no need to scan for any other dots because dots dont overlap.
    			}
    		else { //change back the dots to the original state after doing something
    			dotsarray[i].drawDot(false,false);
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
    				dotsarray[i].drawDot(false, true);
    				clickeventcontrol.inside_check = true;
    				clickeventcontrol.object_id = i;
    				return;
    			}
    		else {
    			dotsarray[i].drawDot(false, false);
    			clickeventcontrol.inside_check = false;
    			clickeventcontrol.object_id = -1;
    		}

    	}
    }
    else clickeventcontrol.inside_check=false;
	}
	);
    
    c.addEventListener("click", function (e) {
    if (clickeventcontrol.inside_check) {
    	dotsarray[clickeventcontrol.object_id].showInfo();
    	$("#modaltrigger").trigger('click');
    }
    }
    );

    //reset after closing modal
    $("#closemodal").click(
    	function()
    	{
    		dotsarray[clickeventcontrol.object_id].drawDot(true, false);
    		clickeventcontrol.inside_check = false;
    		clickeventcontrol.object_id = -1;

    	}
    	)
    
}
