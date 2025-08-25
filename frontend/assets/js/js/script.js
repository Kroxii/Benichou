(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

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

  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          if(quantity>0){
            $el_product.find('#quantity').val(quantity - 1);
          }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // init Cart Management
  var initCartManagement = function() {
    // Fonction pour vider le panier
    function clearCart() {
      // Sélectionner les éléments du panier (sans le total)
      const cartItems = document.querySelectorAll('#cart-items li[data-item]');
      const cartCount = document.getElementById('cart-count');
      const totalAmount = document.getElementById('total-amount');
      const checkoutBtn = document.getElementById('checkout-btn');
      const cartTotal = document.querySelector('.cart-total');
      
      // Confirmation avant de vider le panier
      if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        // Supprimer tous les articles du panier avec une animation
        cartItems.forEach(function(item, index) {
          setTimeout(function() {
            item.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
            
            setTimeout(function() {
              item.remove();
            }, 300);
          }, index * 100);
        });
        
        // Mettre à jour le compteur du panier
        setTimeout(function() {
          cartCount.textContent = '0';
          cartCount.classList.remove('bg-primary');
          cartCount.classList.add('bg-secondary');
          
          // Mettre à jour le total
          totalAmount.textContent = '0,00€';
          
          // Mettre à jour le total dans l'en-tête si il existe
          if (cartTotal) {
            cartTotal.textContent = '0,00€';
          }
          
          // Désactiver le bouton de commande
          checkoutBtn.disabled = true;
          checkoutBtn.classList.remove('btn-primary');
          checkoutBtn.classList.add('btn-secondary');
          checkoutBtn.textContent = 'Panier vide';
          
          // Afficher un message de confirmation
          showCartMessage('Votre panier a été vidé avec succès !', 'success');
        }, cartItems.length * 100 + 300);
      }
    }
    
    // Fonction pour afficher un message dans le panier
    function showCartMessage(message, type) {
      const cartContainer = document.querySelector('#offcanvasCart .offcanvas-body .order-md-last');
      const existingMessage = cartContainer.querySelector('.cart-message');
      
      // Supprimer le message existant s'il y en a un
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Créer le nouveau message
      const messageDiv = document.createElement('div');
      messageDiv.className = `alert alert-${type} cart-message fade show`;
      messageDiv.innerHTML = `
        <svg width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        ${message}
      `;
      
      // Insérer le message en haut du panier
      cartContainer.insertBefore(messageDiv, cartContainer.firstChild);
      
      // Supprimer le message après 3 secondes
      setTimeout(function() {
        messageDiv.classList.remove('show');
        setTimeout(function() {
          if (messageDiv.parentNode) {
            messageDiv.remove();
          }
        }, 150);
      }, 3000);
    }
    
    // Ajouter l'événement au bouton "Vider le panier"
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Fonction pour ajouter des effets au panier
    function addCartInteractions() {
      const cartItems = document.querySelectorAll('#cart-items li[data-item]');
      
      cartItems.forEach(function(item) {
        // Ajouter un effet hover
        item.addEventListener('mouseenter', function() {
          this.style.transition = 'background-color 0.2s ease';
          this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '';
        });
      });
    }
    
    // Initialiser les interactions du panier
    addCartInteractions();
    
    // Fonction pour calculer le nouveau total (si on veut ajouter d'autres fonctionnalités)
    function updateCartTotal() {
      const cartItems = document.querySelectorAll('#cart-items li[data-item]');
      let total = 0;
      
      cartItems.forEach(function(item) {
        const priceText = item.querySelector('.text-body-secondary').textContent;
        const price = parseFloat(priceText.replace('€', '').replace(',', '.'));
        total += price;
      });
      
      const totalAmount = document.getElementById('total-amount');
      if (totalAmount) {
        totalAmount.textContent = total.toFixed(2).replace('.', ',') + '€';
      }
      
      // Mettre à jour aussi le total dans l'en-tête
      const cartTotal = document.querySelector('.cart-total');
      if (cartTotal) {
        cartTotal.textContent = total.toFixed(2).replace('.', ',') + '€';
      }
    }
  }

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    initCartManagement();

  }); // End of a document

})(jQuery);