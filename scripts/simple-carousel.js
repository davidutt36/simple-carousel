function simpleCarousel(carouselElement, options){
	if ( (function(){
		//validate options
		return true;
	})(options) ){
		this.options = options;
	}else{
		this.options = {// set defaults
			transitionTime : 500
		}
	}
	this.carousel = carouselElement;
	this.slides = [];
	this.sliderContentHolder = this.carousel.querySelector('.slider-content');
	this.currentSlideIndex;

}

simpleCarousel.prototype.initialize= function(){
	this.evaluateSlides();
	this.registerControlsHandlers();
	this.setOptions();
};
simpleCarousel.prototype.setOptions = function(){
	this.slides[0].el.style.marginLeft = '0px';
	this.slides[0].el.style.transition = `margin-left ${this.options.transitionTime}ms`;
}
simpleCarousel.prototype.evaluateSlides = function(){
	var self = this;

	var slideElements = this.carousel.querySelectorAll('.slider-content > img');
	var sliderControlsListElement = this.carousel.querySelector('.slider-controls > ul');

	sliderControlsListElement.innerHTML = "";

	for(var i = 0; i < slideElements.length; i++) {
		var liControl = document.createElement('li');

		var reference = `${i}`;
		liControl.dataset.slideId = reference;
		slideElements[i].dataset.controlId = reference;

		if( i === 0 )
			liControl.classList.add('current');

		sliderControlsListElement.appendChild(liControl);
		self.slides.push({el:slideElements[i],c:liControl,ref:reference});
	}

	this.currentSlideIndex = 0;
}

simpleCarousel.prototype.registerControlsHandlers= function(){
	var self = this;
	for(var i = 0 ; i< this.slides.length ; i++) {
		this.slides[i].c.addEventListener('click',function(evnt){
			self.moveTo(parseInt(evnt.target.dataset.slideId));
		},false);
	}
}
simpleCarousel.prototype.moveTo = function(nextIndex){
	var self = this;
	var sliderWidth = this.sliderContentHolder.clientWidth;

	window.setTimeout(function(){
		self.slides[self.currentSlideIndex].c.classList.remove('current');
		self.slides[nextIndex].c.classList.add('current');
		self.currentSlideIndex= nextIndex;
	},this.options.transitionTime);

	this.slides[0].el.style.marginLeft = `-${nextIndex*sliderWidth}px`;
}
