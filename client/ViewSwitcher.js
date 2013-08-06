var b = document.querySelector('button');
var a = document.querySelector('.app');
var flag = 'off';
b.onclick = function(){

	if(flag === 'off'){
		flag = 'on';
		a.className += " slide";
	} else {
		flag = 'off';
		a.className = 'app';
	}
}
