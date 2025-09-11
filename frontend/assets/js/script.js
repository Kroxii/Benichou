(function($) {
  "use strict";
  var initPreloader = function() {
    $(document).ready(function($) {
      var Body = $('body');
      Body.addClass('preloader-site');
    });
    
    // Remplacer .load() obsolète par la nouvelle méthode
    $(window).on('load', function() {
      $('.preloader-wrapper').fadeOut();
      $('body').removeClass('preloader-site');
    });
  }
	var initChocolat = function() {
		// Vérifier si Chocolat est disponible et s'il y a des éléments à traiter
		if (typeof Chocolat !== 'undefined') {
			var imageLinks = document.querySelectorAll('.image-link');
			if (imageLinks.length > 0) {
				Chocolat(imageLinks, {
					imageSize: 'contain',
					loop: true,
				});
			}
		}
	}
  var initSwiper = function() {
    // Vérifier si Swiper est disponible
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper library not loaded');
      return;
    }

    // Main swiper - vérifier si l'élément existe
    var mainSwiperEl = document.querySelector(".main-swiper");
    if (mainSwiperEl) {
      var swiper = new Swiper(".main-swiper", {
        speed: 500,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }

    // Category carousel - vérifier si l'élément existe
    var categorySwiperEl = document.querySelector(".category-carousel");
    if (categorySwiperEl) {
      var category_swiper = new Swiper(".category-carousel", {
        slidesPerView: 6,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: ".category-carousel-next",
          prevEl: ".category-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 6,
          },
        }
      });
    }

    // Brand carousel - vérifier si l'élément existe
    var brandSwiperEl = document.querySelector(".brand-carousel");
    if (brandSwiperEl) {
      var brand_swiper = new Swiper(".brand-carousel", {
        slidesPerView: 4,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: ".brand-carousel-next",
          prevEl: ".brand-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 3,
          },
          1500: {
            slidesPerView: 4,
          },
        }
      });
    }

    // Products carousel - vérifier si l'élément existe
    var productsSwiperEl = document.querySelector(".products-carousel");
    if (productsSwiperEl) {
      var products_swiper = new Swiper(".products-carousel", {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: ".products-carousel-next",
          prevEl: ".products-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 6,
          },
        }
      });
    }
  }
  var initProductQty = function(){
    // Vérifier si jQuery est disponible et si les éléments existent
    if (typeof $ !== 'undefined' && $('.product-qty').length > 0) {
      $('.product-qty').each(function(){
        var $el_product = $(this);
        var quantity = 0;
        
        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val()) || 0;
            $el_product.find('#quantity').val(quantity + 1);
        });
        
        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val()) || 0;
            if(quantity > 0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });
      });
    }
  }
  var initJarallax = function() {
    // Vérifier si Jarallax est disponible
    if (typeof jarallax !== 'undefined') {
      var jarallaxElements = document.querySelectorAll(".jarallax");
      if (jarallaxElements.length > 0) {
        jarallax(jarallaxElements);
      }
      
      var jarallaxKeepImgElements = document.querySelectorAll(".jarallax-keep-img");
      if (jarallaxKeepImgElements.length > 0) {
        jarallax(jarallaxKeepImgElements, {
          keepImg: true,
        });
      }
    }
  }
  var initCartManagement = function() {
    // Le panier est maintenant géré par le script inline dans index.html
    // Cette fonction est gardée pour la compatibilité
    // console.log('Cart management initialized - Simple cart system active'); // Commenté pour la production
  };

  // Initialisation avec protection contre les erreurs
  if (typeof $ !== 'undefined') {
    $(document).ready(function() {
      try {
        initPreloader();
        initSwiper();
        initProductQty();
        initJarallax();
        initChocolat();
        initCartManagement();
        // console.log('✅ All scripts initialized successfully'); // Commenté pour la production
      } catch (error) {
        console.error('❌ Error during script initialization:', error);
      }
    });
  } else {
    // Fallback si jQuery n'est pas disponible
    document.addEventListener('DOMContentLoaded', function() {
      try {
        initSwiper();
        initJarallax();
        initChocolat();
        initCartManagement();
        // console.log('✅ Scripts initialized without jQuery'); // Commenté pour la production
      } catch (error) {
        console.error('❌ Error during vanilla script initialization:', error);
      }
    });
  } 
})(jQuery);
