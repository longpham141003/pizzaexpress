(function(jQuery) {
    jQuery(document).ready(function() {
        
        if (jQuery('#festi-cart-pop-up-content').height() > jQuery(window).height()) {
            jQuery('#festi-cart-pop-up-content').css("position", "absolute");
        }
        if (typeof fesiWooCart === "undefined") {
            var fesiWooCart = fesiWooCartAdditional
        }
        var lastUsedShowProducts;

        var productsListSelector = '.festi-cart-products';

        var festiSetTimeout;

        //Icon Actions on Hover

        jQuery('body').on('mouseenter touchend', 'a.festi-cart', function() {
            showOnHoverIcon(this);
        });

        jQuery('body').on('mouseleave', 'a.festi-cart', function() {
            hideOnHoverIcon(this);
        });

        function showOnHoverIcon(selector)
        {
            if (jQuery(selector).find('.festi-cart-icon').length == 0
                || jQuery(selector).find('.festi-cart-icon.festi-on-hover').length == 0) {
                return true;
            }

            jQuery(selector).find('.festi-cart-icon').hide();
            jQuery(selector).find('.festi-cart-icon.festi-on-hover').show();
            
            jQuery('.festi-cart-products').addClass('festi-cart-products-active');
        }

        function hideOnHoverIcon(selector) {
            if (jQuery(selector).find('.festi-cart-icon').length == 0) {
                return true;
            }

            if (jQuery(productsListSelector).css('display') == 'block') {
                return true;
            }

            jQuery(selector).find('.festi-cart-icon').show();
            jQuery(selector).find('.festi-cart-icon.festi-on-hover').hide();

            jQuery('.festi-cart-products').removeClass('festi-cart-products-active');
        }


        function getPositionProductList(element) {
            var windowWidth = jQuery(window).width();
            var offset = element.offset();

            var height = element.outerHeight();

            var width = element.outerWidth();

            var selectorWidth = jQuery(productsListSelector).width();

            if (typeof fesiWooCart.productListAligment != "undefined") {
                if (fesiWooCart.productListAligment == 'left') {
                    if ((offset.left + selectorWidth) > windowWidth) {
                        offset.left = offset.left - selectorWidth + width;
                    }
                } else {
                    if ((offset.left - selectorWidth) > 0) {
                        offset.left = offset.left - selectorWidth + width;
                    }
                }
            }

            offset.top = offset.top + height - 1;
            return offset;
        }

        jQuery('body').on('hover', '.festi-cart-products', function() {
            festiCartProductsMouseRemove = 0;
        });

        jQuery('body').on('click', '.festi-cart.festi-cart-click', function() {
            festiCartClick(this);

            return false;
        });


        jQuery('body').on('click', function(event) {
            if (jQuery(event.target).closest(productsListSelector).length == 0) {
                jQuery(productsListSelector).hide();
                jQuery('.festi-cart-arrow').hide();
                jQuery("a.festi-cart").removeClass("festi-cart-active");
                hideOnHoverIcon('.festi-cart.festi-cart-click');
            }
        });

        function festiCartClick(element) {
            if (isClickedOnLastUsedProduct(element)) {
                jQuery(productsListSelector).hide();
                jQuery('.festi-cart-arrow').hide();
                jQuery(element).removeClass("festi-cart-active");
            } else {
                jQuery(productsListSelector).show();
                lastUsedShowProducts = jQuery(element);

                offset = getPositionProductList(jQuery(element));
                jQuery(productsListSelector).offset({top: offset.top, left: offset.left});

                elementOffset = jQuery(element).offset();
                jQuery('.festi-cart-arrow').show();
                jQuery('.festi-cart-arrow').offset({
                    top: offset.top,
                    left: elementOffset.left + (jQuery(element).width() / 2)
                });
                jQuery(element).addClass("festi-cart-active");
            }

            if (jQuery("#festi-cart-products-list-body").length > 0) {
                jQuery("#festi-cart-products-list-body").scrollTop(0);
            }
        }

        function isClickedOnLastUsedProduct(element) {
            return lastUsedShowProducts &&
                   jQuery(productsListSelector).css('display') != 'none' &&
                   jQuery(element).get(0) == lastUsedShowProducts.get(0)
        } // end isClickedOnLastUsedProduct

        function festiCartMouseOver(element) {
            festiCartProductsMouseRemove = 0;

            jQuery(productsListSelector).show();
            lastUsedShowProducts = jQuery(element);

            offset = getPositionProductList(jQuery(element));
            jQuery(productsListSelector).offset({top: offset.top, left: offset.left});
            elementOffset = jQuery(element).offset();
            jQuery('.festi-cart-arrow').show();
            jQuery('.festi-cart-arrow').offset({
                top: offset.top,
                left: elementOffset.left + (jQuery(element).width() / 2)
            });
            jQuery(element).addClass("festi-cart-active");

            if (jQuery("#festi-cart-products-list-body").length > 0) {
                jQuery("#festi-cart-products-list-body").scrollTop(0);
            }
        }


        jQuery('body').on('mouseover', '.festi-cart.festi-cart-hover', function() {

            festiCartMouseOver(this);

            return false;
        });

        jQuery('body').on('mouseover', function(event) {
            if (jQuery(event.target).closest(productsListSelector).length == 0 && jQuery(".festi-cart.festi-cart-hover").length != 0) {
                clearTimeout(festiSetTimeout);
                festiCartProductsMouseRemove = 1;
                festiSetTimeout = setTimeout(function() {
                    hideProductsList();
                }, 100);
            }
        });

        function hideProductsList() {
            if (festiCartProductsMouseRemove == 1) {
                jQuery(productsListSelector).hide();
                jQuery('.festi-cart-arrow').hide();
                jQuery("a.festi-cart").removeClass("festi-cart-active");
                hideOnHoverIcon('.festi-cart.festi-cart-hover');
            }
        }

        function getCartProductData(id) {
            if (!id || typeof(festiCartProductsItems) === 'undefined') {
                return false;
            }

            if (typeof(festiCartProductsItems[id]) === 'undefined') {
                return false;
            }

            return festiCartProductsItems[id];
        }

        function doRemoveProductFromCart(element, itemHash) {
            var productID = jQuery(element).attr('data-id');
            var productData = getCartProductData(productID);
            if (productData) {
                jQuery(document).trigger(
                    "remove_product_from_cart", [element, productData]
                );
            }
            if (!itemHash) {
                var itemHref = jQuery(element).attr('href');
            } else {
                var itemHref = jQuery(element).attr('name');
            }
            var productKey = getParameterByName(itemHref, 'remove_item');
            if (!productKey) {
                selector = jQuery(element).parent().parent();
                productKey = itemHref
            }

            showBlockUi("table.festi-cart-list");
            showBlockUi(".cart_list.product_list_widget ");

            var data = {
                action: 'remove_product',
                deleteItem: productKey
            };

            var instance = element;

            jQuery.post(fesiWooCart.ajaxurl, data, function(productCount) {

                var productCount = productCount;

                var data = {
                    action: 'woocommerce_get_refreshed_fragments'
                };

                jQuery.post(fesiWooCart.ajaxurl, data, function(response) {
                    fragments = response.fragments;

                    if (fragments) {
                        jQuery.each(fragments, function(key, value) {
                            jQuery(key).replaceWith(value);
                        });

                        if (!jQuery(instance).hasClass("fecti-cart-from-widget")) {
                            jQuery('a.festi-cart').addClass("festi-cart-active");
                        }
                    }

                    if (productCount < 1) {
                        var parent = jQuery(lastUsedShowProducts).parent()
                        if (parent.hasClass("widget")) {
                            jQuery(productsListSelector).fadeOut();
                        }
                    }

                })
            });
        }

        jQuery('body').on('click', '.festi-cart-remove-product, .cart_list.product_list_widget .remove', function() {
            doRemoveProductFromCart(this);

            return false;
        });

        function getParameterByName(url, name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(url);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function refreshCartAfterAddToCart() {
            var data = {
                action: 'woocommerce_get_refreshed_fragments'
            };

            jQuery.post(fesiWooCart.ajaxurl, data, function(response) {

                fragments = response.fragments;

                if (fragments) {
                    jQuery.each(fragments, function(key, value) {
                        jQuery(key).replaceWith(value);
                    });
                }
                jQuery("body").trigger("onShowPupUpCart");
            })
        } // end refreshCart

        jQuery(window).scroll(function() {
            if (jQuery(productsListSelector).css('display') != 'none' && jQuery(productsListSelector).length != 0) {
                var offset = getPositionProductList(lastUsedShowProducts);
                if ((offset.top - jQuery(document).scrollTop()) > 0) {
                    jQuery(productsListSelector).offset({top: offset.top, left: offset.left});
                    elementOffset = jQuery(lastUsedShowProducts).offset();
                    jQuery('.festi-cart-arrow').offset({
                        top: offset.top,
                        left: elementOffset.left + (jQuery(lastUsedShowProducts).width() / 2)
                    });
                } else {
                    jQuery(productsListSelector).hide();
                    jQuery('.festi-cart-arrow').hide();
                    jQuery("a.festi-cart").removeClass("festi-cart-active");
                }

            }
        });


        if (jQuery('.festi-cart-horizontal-position-center').length > 0) {
            var documentWidth = jQuery(document).width();
            var windowCartOuterWidth = jQuery('.festi-cart-horizontal-position-center').outerWidth()

            var leftPosition = (documentWidth - windowCartOuterWidth) / 2;

            jQuery('.festi-cart-horizontal-position-center').css({
                left: leftPosition,
            });

            jQuery('.festi-cart-horizontal-position-center').show();
        }

        if (jQuery('.festi-cart-vertical-position-middle').length > 0) {
            var documentHeight = jQuery(document).height();
            var windowCartOuterHeight = jQuery('.festi-cart-vertical-position-middle').outerHeight()

            var topPosition = (documentHeight - windowCartOuterHeight) / 2;

            jQuery('.festi-cart-vertical-position-middle').css({
                top: topPosition,
            });

            jQuery('.festi-cart-vertical-position-middle').show();
        }

        jQuery('body').on('added_to_cart', function() {
            refreshCartAfterAddToCart();
        });

        jQuery("body").on("onShowPupUpCart", function() {
            jQuery('#festi-cart-pop-up-content').bPopup({
                modalClose: true,
                positionStyle: 'absolute'
            });
        });


        if (fesiWooCart.isMobile && fesiWooCart.isEnabledPopUp) {
            jQuery('body').on('click', '.festi-cart', function() {
                jQuery('.festi-cart-pop-up-header').css('display', 'none');
                jQuery('#festi-cart-pop-up-content').bPopup({
                    modalClose: true,
                    positionStyle: 'absolute'
                });
                return false;
            });
        }


        jQuery("body").on("onShowPupUpCart", function() {
            jQuery('.festi-cart-pop-up-header').css('display', 'block');
            jQuery('#festi-cart-pop-up-content').bPopup({
                modalClose: true,
                positionStyle: 'absolute'
            });
        });

        function showBlockUi(element) {
            jQuery(element).fadeTo("400", "0.4").block(
                {
                    message: null,
                    overlayCSS: {
                        background: "transparent url('" + fesiWooCart.imagesUrl + "ajax-loader.gif') no-repeat center",
                        opacity: .6
                    }
                }
            );
        } // end showBlockUi

        function hideBlockUi(element) {
            jQuery(element).unblock().fadeTo("400", "1");
        } // end hideBlockUi


        jQuery(window).load(function() {
            doShowCartContentsAfterIconLoaded();
        });
        
        function doShowCartContentsAfterIconLoaded()
        {
            jQuery.ajax({
                type: 'POST',
                url: fesiWooCart.ajaxurl,
                data: {
                    action: 'do_display_cart_in_window_after_icon_loaded'
                },
                success: function(response) {
                    jQuery('a.festi-cart-window').html(response.body);
                    
                    if (jQuery('img.festi-cart-icon').length) {
                        jQuery('img.festi-cart-icon').on('load', function () {
                            jQuery('div.festi-cart-window-content').css('visibility', 'visible');
                        });
                    } else {
                        jQuery('div.festi-cart-window-content').css('visibility', 'visible');
                    }
                }

            });
        } // end doShowCartContentsAfterIconLoaded
        
        
        jQuery('body').on('spinchange spinstop onkeyup', 'div.itemQuantity input[type=number]', function(e) {
            var value = jQuery(this).spinner("value");
           
            var currentQuantity = parseFloat(value);
            var itemKey = jQuery(this).attr('name');
            var minPossibleValue = 1;

            if (value < minPossibleValue) {
                doRemoveProductFromCart(this, itemKey)
            } else {
                jQuery.ajax({
                    type: 'POST',
                    url: fesiWooCart.ajaxurl,
                    dataType: "json",
                    data: {
                        action: 'update_total_price',
                        quantity: currentQuantity,
                        itemKey: itemKey
                    },
                    success: function(response) {
                        if (response.error) {
                            jQuery('.festi-cart-error-message').text(
                                'Some error has occurred, please reload page or try it later'
                            ).show();
                            console.error(response.error.message);
                        } else {
                            response.productListTotalText += ' : ';
                            jQuery('.festi-cart-total').html(response.totalPrice);
                            jQuery('.festi-cart-quantity').text(response.totalItems);
                            jQuery('.budgeCounter').text(response.totalItems);
                            jQuery('.subtotal').prepend(response.productListTotalText);
                            if (response.totalItems > 1)
                                jQuery('.festi-cart-text-after-quantity').text(
                                    response.textAfterQuantityPlural
                                );
                            else
                                jQuery('.festi-cart-text-after-quantity').text(
                                    response.textAfterQuantity
                                );

                            doChangeQuantityItemProductTypeBundle(
                                itemKey,
                                currentQuantity
                            );
                        }
                    },
                    error: function(response) {
                        jQuery('.festi-cart-error-message').text(
                            'Some error has occurred, please reload page or try it later'
                        ).show();
                        console.error('There was a failure ajax request');
                    }
                });
            }
        });
        
        function doChangeQuantityItemProductTypeBundle(itemKey, currentQuantity) {
            jQuery('.itemQuantity').each(function() {
                if(isProductItemTypeBundle(jQuery(this), itemKey)) {
                    jQuery(this).html(currentQuantity);      
                }
            })
        }
        
        function isProductItemTypeBundle($this, itemKey) {
            return $this.data('bundle-name') == itemKey;
        }
        
        function changeDefaultCrossSellTitle() {

            if (typeof(userCrossSellTitle) !== 'undefined' && typeof(userCrossSellTitle) == 'string') {
                doReplaceCurrentCrossSellTitle(userCrossSellTitle);

                jQuery(document).ajaxComplete(function() {
                    doReplaceCurrentCrossSellTitle(userCrossSellTitle);
                });
            }
        }

        function doReplaceCurrentCrossSellTitle(userCrossSellTitle) {
            jQuery('#cross-sell-products-container .cross-sells h2').text(userCrossSellTitle);
        }

        changeDefaultCrossSellTitle();

        function showScrollInPopUp() {
            if (isNeedShowScroll() && typeof(isEnableDisplayCrossSellProductsOption) !== 'undefined') {
                doAppendScroll();

                jQuery(document).ajaxComplete(function() {
                    doAppendScroll();
                })
            }
        }

        function isNeedShowScroll() {
            var heightBlockThatContainPopUpItems = jQuery('#festi-cart-pop-up-products-list-body').height(),
                heightTwoItems = getHeightTwoItemsIntoPopUp();

            return (heightBlockThatContainPopUpItems > heightTwoItems);
        }

        function doAppendScroll() {
            var height = getHeightTwoItemsIntoPopUp();
            jQuery('div#festi-cart-pop-up-products-list-body').css({
                "max-height": height,
                "overflow": "hidden",
                "overflow-y": "auto"
            });
        }

        function getHeightTwoItemsIntoPopUp() {
            var sizeOfBorder = 2,
                twoItems = 2,
                heightOneItems = jQuery('#festi-cart-pop-up-products-list-body .festi-cart-item').height();

            return heightOneItems * twoItems + sizeOfBorder;
        }

        showScrollInPopUp();

        jQuery(document).ajaxComplete(function() {
            jQuery('div#festi-cart-pop-up-content .cross-sells ul.products li').addClass("product");
            showQuantitySpinnerSkin();
        });

        function displayPopupWithWooVariationsTableGridPlugin() {
            if (fesiWooCart.isActiveTableGridPlugin && fesiWooCart.isEnabledPopUp) {
                jQuery(document).on("submit", "form.vtajaxform", function(event) {
                    refreshCartAfterAddToCart();
                });
            }
        }

        displayPopupWithWooVariationsTableGridPlugin();
        
        function showQuantitySpinnerSkin() {           
            if (fesiWooCart.isDisplayQuantitySpinner != 1){
                return;
            }           
            if (jQuery.ui) {
                var options = {
                        icons: { down: "ui-icon-triangle-1-s", up: "ui-icon-triangle-1-n" }
                     };
                 if (fesiWooCart.quantitySpinnerSkin == 'skinPlusMinus') {
                     options = {
                        icons: { down: "ui-icon-minus", up: "ui-icon-plus" }
                     };
                 }
                jQuery(".quantitySpinner").spinner(options);  
            }
        }   

    });
}(jQuery));


