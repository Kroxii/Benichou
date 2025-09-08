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
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}
  var initSwiper = function() {
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
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));
    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }
  var initCartManagement = function() {
    let cart = JSON.parse(localStorage.getItem('cardmaster_cart')) || [];
    let cartTotal = 0;
    function saveCart() {
      localStorage.setItem('cardmaster_cart', JSON.stringify(cart));
    }
    function generateProductId(title, price) {
      return title.toLowerCase().replace(/\s+/g, '-') + '-' + price.replace(/[^\d]/g, '');
    }
    function formatPrice(priceText) {
      try {
        if (!priceText || typeof priceText !== 'string') {
          console.warn('⚠️ Prix invalide (non-string):', priceText);
          return 0;
        }
        const cleanPrice = priceText
          .trim()
          .replace(/[€$£¥₹]/g, '') 
          .replace(/[\s,]/g, '.') 
          .replace(/[^\d.]/g, ''); 
        const numericPrice = parseFloat(cleanPrice);
        if (isNaN(numericPrice) || numericPrice < 0) {
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('⚠️ Prix invalide après nettoyage:', {
              original: priceText,
              cleaned: cleanPrice,
              parsed: numericPrice
            });
          }
          return 0;
        }
        return Math.round(numericPrice * 100) / 100; 
      } catch (error) {
        console.error('❌ Erreur lors du formatage du prix:', error);
        return 0;
      }
    }
    function displayPrice(price) {
      return price.toFixed(2).replace('.', ',') + ' €';
    }
    function updateCartDisplay() {
      const cartItemsContainer = document.getElementById('cart-items');
      const cartItemCount = document.querySelector('.cart-item-count');
      const cartTotalElement = document.querySelector('.cart-total');
      const checkoutBtn = document.getElementById('checkout-btn');
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = '';
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <li class="list-group-item d-flex justify-content-between">
            <span class="text-muted">Votre panier est vide</span>
          </li>
        `;
        if (cartItemCount) cartItemCount.textContent = '0';
        if (cartTotalElement) cartTotalElement.textContent = '0,00 €';
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.classList.remove('btn-primary');
          checkoutBtn.classList.add('btn-secondary');
          checkoutBtn.textContent = 'Panier vide';
        }
        return;
      }
      cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between lh-sm';
        listItem.setAttribute('data-item', item.id);
        listItem.innerHTML = `
          <div class="d-flex flex-column flex-grow-1">
            <h6 class="my-0">${item.title}</h6>
            <small class="text-body-secondary">${item.description}</small>
            <div class="d-flex align-items-center mt-2">
              <button class="btn btn-sm btn-outline-secondary me-2 decrease-qty" data-index="${index}">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2 increase-qty" data-index="${index}">+</button>
              <button class="btn btn-sm btn-outline-danger ms-auto remove-item" data-index="${index}">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
          <span class="text-body-secondary">${displayPrice(item.price * item.quantity)}</span>
        `;
        cartItemsContainer.appendChild(listItem);
      });
      const totalItem = document.createElement('li');
      totalItem.className = 'list-group-item d-flex justify-content-between bg-light';
      totalItem.innerHTML = `
        <div class="text-success">
          <h6 class="my-0">Total (TTC)</h6>
          <small>Frais de port inclus</small>
        </div>
        <span class="text-success fw-bold" id="total-amount">${displayPrice(cartTotal)}</span>
      `;
      cartItemsContainer.appendChild(totalItem);
      if (cartItemCount) cartItemCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartTotalElement) cartTotalElement.textContent = displayPrice(cartTotal);
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('btn-secondary');
        checkoutBtn.classList.add('btn-primary');
        checkoutBtn.textContent = 'Continuer vers la commande';
      }
      addCartItemEvents();
    }
    function addCartItemEvents() {
      document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          cart[index].quantity += 1;
          saveCart();
          updateCartDisplay();
          showCartMessage('Quantité mise à jour', 'success');
        });
      });
      document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            saveCart();
            updateCartDisplay();
            showCartMessage('Quantité mise à jour', 'success');
          }
        });
      });
      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          const item = cart[index];
          cart.splice(index, 1);
          saveCart();
          updateCartDisplay();
          showCartMessage(`${item.title} retiré du panier`, 'info');
        });
      });
    }
    function addToCart(button) {
      try {
        const productCard = button.closest('.product-card') || button.closest('.card');
        if (!productCard) {
          showCartMessage('Erreur: Produit non trouvé', 'danger');
          return;
        }
        const titleElement = productCard.querySelector('.card-title') || 
                           productCard.querySelector('h5') || 
                           productCard.querySelector('h4') ||
                           productCard.querySelector('[class*="title"]');
        const descriptionElement = productCard.querySelector('.card-text') || 
                                 productCard.querySelector('p') ||
                                 productCard.querySelector('[class*="text-muted"]');
        const priceElement = productCard.querySelector('.fw-bold') || 
                           productCard.querySelector('.price') ||
                           productCard.querySelector('[class*="fs-5"]');
        if (!titleElement) {
          showCartMessage('Erreur: Titre du produit non trouvé', 'danger');
          return;
        }
        if (!priceElement) {
          showCartMessage('Erreur: Prix du produit non trouvé', 'danger');
          return;
        }
        const title = titleElement.textContent.trim();
        const description = descriptionElement ? descriptionElement.textContent.trim() : 'Produit TCG CardMaster';
        const priceText = priceElement.textContent.trim();
        const price = formatPrice(priceText);
        if (price <= 0) {
          showCartMessage('Erreur: Prix invalide', 'danger');
          logger.warn('Prix invalide détecté:', priceText, 'converti en:', price);
          return;
        }
        if (!title) {
          showCartMessage('Erreur: Titre invalide', 'danger');
          return;
        }
        const productId = generateProductId(title, priceText);
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
          showCartMessage(`${title} - Quantité mise à jour (${cart[existingItemIndex].quantity})`, 'success');
        } else {
          cart.push({
            id: productId,
            title: title,
            description: description,
            price: price,
            quantity: 1
          });
          showCartMessage(`${title} ajouté au panier`, 'success');
        }
        saveCart();
        updateCartDisplay();
        animateButton(button);
      } catch (error) {
        logger.error('Erreur lors de l\'ajout au panier:', error);
        showCartMessage('Erreur lors de l\'ajout au panier', 'danger');
      }
    }
    function animateButton(button) {
      const originalText = button.textContent;
      button.textContent = 'Ajouté !';
      button.classList.add('btn-success');
      button.classList.remove('btn-primary');
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        button.disabled = false;
      }, 1500);
    }
    function clearCart() {
      if (cart.length === 0) {
        showCartMessage('Le panier est déjà vide', 'info');
        return;
      }
      if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showCartMessage('Panier vidé avec succès', 'success');
      }
    }
    function showCartMessage(message, type) {
      const toast = document.createElement('div');
      toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed`;
      toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <svg width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toast);
      const bsToast = new bootstrap.Toast(toast);
      bsToast.show();
      toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
      });
    }
    function initCartEvents() {
      document.addEventListener('click', function(e) {
        if (e.target.matches('button') && 
            (e.target.textContent.includes('Ajouter au panier') || 
             e.target.classList.contains('add-to-cart-btn'))) {
          e.preventDefault();
          addToCart(e.target);
        }
      });
      const clearCartBtn = document.getElementById('clear-cart-btn');
      if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
      }
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
          if (cart.length === 0) {
            showCartMessage('Votre panier est vide', 'warning');
            return;
          }
          showCartMessage('Redirection vers la commande...', 'info');
        });
      }
      enhanceProductButtons();
    }
    function enhanceProductButtons() {
      const addToCartButtons = document.querySelectorAll('button:not(.add-to-cart-enhanced)');
      addToCartButtons.forEach(button => {
        if (button.textContent.includes('Ajouter au panier')) {
          button.classList.add('add-to-cart-btn', 'add-to-cart-enhanced');
          const productCard = button.closest('.product-card') || button.closest('.card');
          if (productCard && !productCard.hasAttribute('data-product-id')) {
            const title = productCard.querySelector('.card-title')?.textContent.trim();
            if (title) {
              const productId = title.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              productCard.setAttribute('data-product-id', productId);
              const currentPath = window.location.pathname;
              let category = 'tcg';
              if (currentPath.includes('pokemon')) category = 'pokemon';
              else if (currentPath.includes('yugioh')) category = 'yugioh';
              else if (currentPath.includes('magic')) category = 'magic';
              else if (currentPath.includes('lorcana')) category = 'lorcana';
              else if (currentPath.includes('altered')) category = 'altered';
              else if (currentPath.includes('riftbound')) category = 'riftbound';
              else if (currentPath.includes('accessoires')) category = 'accessoires';
              productCard.setAttribute('data-category', category);
            }
          }
          button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
          });
          button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
          });
        }
      });
    }
    const logger = {
      isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      info: function(message, data = null) {
        if (this.isDev) {
          console.log('ℹ️', message, data || '');
        }
      },
      warn: function(message, data = null) {
        if (this.isDev) {
          console.warn('⚠️', message, data || '');
        }
      },
      error: function(message, error = null) {
        console.error('❌', message, error || '');
      },
      success: function(message, data = null) {
        if (this.isDev) {
          console.log('✅', message, data || '');
        }
      }
    };
    updateCartDisplay();
    initCartEvents();
    logger.info('Système de panier CardMaster initialisé');
    logger.info('Articles dans le panier:', cart.length);
    setTimeout(() => {
      const cartButtons = document.querySelectorAll('button');
      const addToCartButtons = Array.from(cartButtons).filter(btn => 
        btn.textContent.includes('Ajouter au panier')
      );
      logger.info(`${addToCartButtons.length} boutons "Ajouter au panier" détectés`);
      if (addToCartButtons.length === 0) {
        logger.warn('Aucun bouton "Ajouter au panier" trouvé sur cette page');
      } else {
        let validProducts = 0;
        addToCartButtons.forEach((btn, index) => {
          const productCard = btn.closest('.product-card') || btn.closest('.card');
          if (productCard) {
            const title = productCard.querySelector('.card-title') || productCard.querySelector('h5');
            const price = productCard.querySelector('.fw-bold') || productCard.querySelector('[class*="fs-5"]');
            if (title && price) {
              validProducts++;
            } else {
              logger.warn(`Produit ${index + 1}: Structure invalide - titre:${!!title}, prix:${!!price}`);
            }
          }
        });
        logger.success(`${validProducts}/${addToCartButtons.length} produits ont une structure valide`);
      }
      if (logger.isDev) {
        window.CartMasterTest = {
          addTestProduct: () => {
            const testProduct = {
              id: 'test-product-' + Date.now(),
              title: 'Produit de Test',
              description: 'Test du système de panier',
              price: 9.99,
              quantity: 1
            };
            cart.push(testProduct);
            saveCart();
            updateCartDisplay();
            showCartMessage('Produit de test ajouté', 'info');
          },
          clearCart: () => {
            cart = [];
            saveCart();
            updateCartDisplay();
            showCartMessage('Panier vidé (test)', 'info');
          },
          showCartContent: () => {
            console.log('📦 Contenu du panier:', cart);
            return cart;
          },
          simulateAddToCart: (buttonIndex = 0) => {
            const buttons = document.querySelectorAll('button');
            const addToCartButtons = Array.from(buttons).filter(btn => 
              btn.textContent.includes('Ajouter au panier')
            );
            if (addToCartButtons[buttonIndex]) {
              addToCartButtons[buttonIndex].click();
              logger.info('Simulation d\'ajout au panier effectuée');
            } else {
              logger.error('Aucun bouton d\'ajout au panier trouvé à l\'index', buttonIndex);
            }
          }
        };
        logger.info('Fonctions de test disponibles dans window.CartMasterTest');
      }
    }, 1000);
  }
  $(document).ready(function() {
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    initCartManagement();
  }); 
})(jQuery);
