function simpleCarousel(id,carouselElement, options){
	this.id = id;
	if ( (function(){
		//validate options
		return true;
	})(options) ){
		this.options = options;
	}else{
		this.options = {// set defaults
			transitionTime : 500,
			touchTransitionTime : 300
		};
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

	if( this.evaluateSlides() > 0 ){
		this.registerClickHandlers();
		this.registerTouchHandlers();
	}

	this.setOptions();
};
simpleCarousel.prototype.setOptions = function(){

};
simpleCarousel.prototype.evaluateSlides = function(){
	var self = this;

	var slideElements = this.carousel.querySelectorAll('.slider-content > img');
	var sliderControlsListElement = this.carousel.querySelector('.slider-controls > ul');

	sliderControlsListElement.innerHTML = "";
	if( !slideElements ){
		console.warn('Slides couldn\'t be found! in Carousel #'+this.id);
		return -1;
	}
	if( slideElements.length > 1){
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
		this.slides[0].el.style.marginLeft = '0px';
		this.slides[0].el.style.transition = `margin-left ${this.options.transitionTime}ms`;

		return 1;
	}
	console.warn('No more than 1 slide found! in Carousel #'+this.id);
	return 0;
};

simpleCarousel.prototype.registerClickHandlers= function(){
	var self = this;
	for(var i = 0 ; i< this.slides.length ; i++) {
		this.slides[i].c.addEventListener('click',function(evnt){
			evnt.stopPropagation();
			self.moveToIndex(parseInt(evnt.target.dataset.slideId));
		},false);
	}
};
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
};

simpleCarousel.prototype.startTouch = function(evnt){
	var self = this;

	this.isLongTouch = false;
	window.setTimeout(function(){
		self.isLongTouch = true;
	}, 250);

	this.touchStartPosition.x = evnt.touches[0].pageX;
	this.touchStartPosition.y = evnt.touches[0].pageY;
};
simpleCarousel.prototype.moveTouch = function(evnt){

	this.touchLatestPosition.x =  evnt.touches[0].pageX;
	this.touchLatestPosition.y =  evnt.touches[0].pageY;

	this.dragDistance.x = this.touchLatestPosition.x - this.touchStartPosition.x;

	var newLeftMargin = this.currentSlideIndex * this.sliderContentHolderWidth - this.dragDistance.x;
	this.slides[0].el.style.transition = 'none';
	this.slides[0].el.style.marginLeft = `-${newLeftMargin}px`;
};
simpleCarousel.prototype.endTouch = function(){
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
};
simpleCarousel.prototype.moveToIndex = function(nextIndex){
	var self = this;
	var sliderWidth = this.sliderContentHolderWidth;

	window.setTimeout(function(){
		self.slides[self.currentSlideIndex].c.classList.remove('current');
		self.slides[nextIndex].c.classList.add('current');
		self.currentSlideIndex= nextIndex;
	},this.options.transitionTime);
	this.slides[0].el.style.marginLeft = `-${nextIndex*sliderWidth}px`;
};
