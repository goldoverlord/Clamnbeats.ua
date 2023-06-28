$('.js-slick-slider').slick({
  dots: true,
  infinite: false,
  lazyLoad: 'ondemand',
  swipeToSlide: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});

$(document).ready(function() {
  const canvasElements = $('.js-canvas');
  const starsCtxList = [];

  let screen, starsElements, starsParams = { speed: 0, number: 100, extinction: 4 };

  function setupStars(starsCanvas, starsCtx) {
    screen = {
      w: window.innerWidth,
      h: window.innerHeight,
      c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
    };
    starsCanvas.width = screen.w;
    starsCanvas.height = screen.h;
    starsParams.speed = Math.min(screen.w, screen.h) / 200; // Залежність швидкості від розміру екрану
    starsParams.number = Math.floor(screen.w * screen.h / 3000); // Залежність кількості точок від розміру екрану
    starsElements = [];
    for (let i = 0; i < starsParams.number; i++) {
      starsElements[i] = new Star(starsCanvas, starsCtx);
    }
  }

  function Star(starsCanvas, starsCtx) {
    this.x = Math.random() * starsCanvas.width;
    this.y = Math.random() * starsCanvas.height;
    this.z = Math.random() * starsCanvas.width;

    this.move = function() {
      this.z -= starsParams.speed;
      if (this.z <= 0) {
        this.z = starsCanvas.width;
      }
    };

    this.show = function() {
      let x, y, rad, opacity;
      x = (this.x - screen.c[0]) * (starsCanvas.width / this.z);
      x = x + screen.c[0];
      y = (this.y - screen.c[1]) * (starsCanvas.width / this.z);
      y = y + screen.c[1];
      rad = starsCanvas.width / this.z;
      opacity = (rad > starsParams.extinction) ? 1.5 * (2 - rad / starsParams.extinction) : 1;

      starsCtx.beginPath();
      starsCtx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
      starsCtx.arc(x, y, rad, 0, Math.PI * 2);
      starsCtx.fill();
    };
  }

  function updateStars(starsCanvas, starsCtx) {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    starsElements.forEach(function(s) {
      s.show();
      s.move();
    });
    window.requestAnimationFrame(() => updateStars(starsCanvas, starsCtx));
  }

  canvasElements.each(function(index, canvas) {
    const starsCtx = canvas.getContext('2d');
    starsCtxList.push(starsCtx);
    setupStars(canvas, starsCtx);
    updateStars(canvas, starsCtx);
  });

  $(window).resize(function() {
    canvasElements.each(function(index, canvas) {
      setupStars(canvas, starsCtxList[index]);
    });
  });
});
