$('#bg').fadeOut(0);

$('#backgroundImage').ready(function() {
    $('#bg').css('background-image','url(https://apodnasa.herokuapp.com/)');
    $('#bg').fadeIn(2000);
});

colors = ['8296F1','4AFBC2','B2E553','FCC555','F25B4C'];
color1="#"+colors[Math.floor(Math.random()*5)];

do{
	color2="#"+colors[Math.floor(Math.random()*5)];
}while(color2==color1);

function mousemove (e) {
	var x1 = Math.round(window.innerWidth / 2 - e.clientX)/10,
		y1 = Math.round(window.innerHeight / 2 - e.clientY)/10;
	bg.style.backgroundPosition = "calc(50% + "+ x1 +"px) calc(50% + "+ (y1-10) +"px)";
}

document.addEventListener('mousemove', mousemove, false);

var bg = document.getElementById('bg'),
	text = document.getElementById('title'),
	menu = document.getElementById('menu'),
	body = document.body;

followMouse.add(text,color1,30,40,10,40,false);
followMouse.add(menu,color2,20,50,10,45,false);
followMouse.activate();

