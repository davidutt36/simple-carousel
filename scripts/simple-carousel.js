function simpleCarousel(carouselElement, options){
	if ( (function(){
		//validate options
		return true;
	})(options) ){
		this.options = options;
	}else{
		this.options = {// set defaults
			transitionTime : 500,
			touchTransitionTime : 300
		}
	}
	this.carousel = carouselElement;
	this.slides = [];
	this.sliderContentHolder = this.carousel.querySelector('.slider-content');
	this.sliderContentHolderWidth = this.sliderContentHolder.clientWidth;
	this.currentSlideIndex = 0;

	this.isLongTouch = 0;
	this.touchStartPosition = {};
	this.touchLatestPosition = {};
	this.dragDistance = {};

}

simpleCarousel.prototype.initialize= function(){
	this.evaluateSlides();
	this.setOptions();
	this.registerClickHandlers();
	this.registerTouchHandlers();
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
}

simpleCarousel.prototype.registerClickHandlers= function(){
	var self = this;
	for(var i = 0 ; i< this.slides.length ; i++) {
		this.slides[i].c.addEventListener('click',function(evnt){
			evnt.stopPropagation();
			self.moveToIndex(parseInt(evnt.target.dataset.slideId));
		},false);
	}
}
simpleCarousel.prototype.registerTouchHandlers = function(){
	var self = this;
	this.sliderContentHolder.addEventListener('touchstart',function(evnt){
		evnt.stopPropagation();
		evnt.preventDefault();
		self.startTouch(evnt);
	},false);
	this.sliderContentHolder.addEventListener('touchmove',function(evnt){
		evnt.stopPropagation();
		evnt.preventDefault();

		self.moveTouch(evnt);
	},false);
	this.sliderContentHolder.addEventListener('touchend',function(evnt){
		evnt.stopPropagation();
		evnt.preventDefault();
		self.endTouch(evnt);
	},false);
}

simpleCarousel.prototype.startTouch = function(evnt){
	var self = this;

	this.isLongTouch = false;
	window.setTimeout(function(){
		self.isLongTouch = true;
	}, 250);

	this.touchStartPosition.x = evnt.touches[0].pageX;
	this.touchStartPosition.y = evnt.touches[0].pageY;
}
simpleCarousel.prototype.moveTouch = function(evnt){

	this.touchLatestPosition.x =  event.touches[0].pageX;
	this.touchLatestPosition.y =  event.touches[0].pageY;

	this.dragDistance.x = this.touchLatestPosition.x - this.touchStartPosition.x;

	var newLeftMargin = this.currentSlideIndex * this.sliderContentHolderWidth - this.dragDistance.x;
	this.slides[0].el.style.transition = 'none';
	this.slides[0].el.style.marginLeft = `-${newLeftMargin}px`;
}
simpleCarousel.prototype.endTouch = function(evnt){
	var self = this;
	var nextIndex = this.currentSlideIndex;
	if(Math.abs(this.dragDistance.x) > this.sliderContentHolderWidth/2 || this.isLongTouch === false) {
		if(this.dragDistance.x > 0 &&  this.currentSlideIndex > 0) {
			nextIndex = this.currentSlideIndex - 1;
		}else if(this.dragDistance.x < 0 && this.currentSlideIndex < this.slides.length - 1) {
			nextIndex = this.currentSlideIndex + 1;
		}
	}
	this.slides[0].el.style.transition = `margin-left ${this.options.touchTransitionTime}ms`;

	window.setTimeout(function(){
		self.slides[self.currentSlideIndex].c.classList.remove('current');
		self.slides[nextIndex].c.classList.add('current');
		self.currentSlideIndex= nextIndex;
		self.slides[0].el.style.transition = `margin-left ${self.options.transitionTime}ms`;
	},this.options.touchTransitionTime);
	this.slides[0].el.style.marginLeft = `-${nextIndex*this.sliderContentHolderWidth}px`;
}
simpleCarousel.prototype.moveToIndex = function(nextIndex){
	var self = this;
	var sliderWidth = this.sliderContentHolderWidth;

	window.setTimeout(function(){
		self.slides[self.currentSlideIndex].c.classList.remove('current');
		self.slides[nextIndex].c.classList.add('current');
		self.currentSlideIndex= nextIndex;
	},this.options.transitionTime);
	this.slides[0].el.style.marginLeft = `-${nextIndex*sliderWidth}px`;
}
