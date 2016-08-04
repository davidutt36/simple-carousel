var sliders = new Array();
window.onload = function() {
	var options = {};
	var slidersElements = document.querySelectorAll('.slider');

	for(var i = 0 ; i < slidersElements.length ; i++) {
		sliders.push( new simpleCarousel(slidersElements[i],{transitionTime:(i+1)*500}) );
	}
	for(var i = 0; i < sliders.length; i++) {
		sliders[i].initialize();
	}
}
