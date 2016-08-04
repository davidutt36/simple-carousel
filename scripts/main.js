var sliders = new Array();
window.onload = function() {
	var options = {};
	var slidersElements = document.querySelectorAll('.slider');


	slidersElements.forEach(function(e,i,a){
		sliders.push( new simpleCarousel(e,{transitionTime:(i+1)*500}) );
	});
	sliders.forEach(function(el){
		el.initialize();
	});
}
