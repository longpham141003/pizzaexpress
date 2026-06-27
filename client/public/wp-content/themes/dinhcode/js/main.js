document.addEventListener("DOMContentLoaded", function() {
    'use strict';
    jQuery(document).ready(function($) {
        // $('#billing_time').inputmask("99/99/9999 99:99", {
        //     alias: "datetime"
        // });
        // var now = new Date ();
        // var next30 = new Date ( now );
        // next30.setMinutes ( now.getMinutes() + 30 );
        // $('#billing_time').val(formatDate(next30));

        // function formatDate(date) {
        //     var d = new Date(date),
        //         month = '' + (d.getMonth() + 1),
        //         day = '' + d.getDate(),
        //         year = d.getFullYear(),
        //         hour = d.getHours(),
        //         min = d.getMinutes();
        
        //     if (month.length < 2) 
        //         month = '0' + month;
        //     if (day.length < 2) 
        //         day = '0' + day;
        //     if (hour.length < 2) 
        //         hour = '0' + hour;
        //     if (min.length < 2) 
        //         min = '0' + min;
        
        //     var result = [day, month, year].join('/') + ' ' + hour + ':' + min;
        //     return result.replace('T', ' ');
        // }

        function findOffset(element) {
            var top = 0,
                left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top: top,
                left: left
            };
        }
        var mq = window.matchMedia("(min-width: 999px)");
        if (mq.matches) {
            window.onload = function() {
                var stickyHeader = document.getElementById('dc_menu');
                var headerOffset = findOffset(stickyHeader);
                window.onscroll = function() {
                    var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    if (bodyScrollTop > headerOffset.top) {
                        stickyHeader.classList.add('header_fix');
                    } else {
                        stickyHeader.classList.remove('header_fix');
                    }
                };
            };


            $('.thucdon a[href*=#]').click(function() {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top - 100
                        }, 1000);
                        return false;
                    }
                }
            });


        } else {

            window.onload = function() {
                var stickyHeader = document.getElementById('dc_header');
                var headerOffset = findOffset(stickyHeader);
                window.onscroll = function() {
                    var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    if (bodyScrollTop > headerOffset.top) {
                        stickyHeader.classList.add('header_fix');
                    } else {
                        stickyHeader.classList.remove('header_fix');
                    }
                };
            };

        }

		//autocomplete///////////////////////////////////
		// function initAutoComplete() {
		// 	var options = {
		// 		types: ['geocode', 'establishment'],
		// 		componentRestrictions: { country: "vn" }
		// 	};
		// 	var autocomplete_address = new google.maps.places.Autocomplete($('#billing_address_1')[0], options);
		// 	google.maps.event.addListener(autocomplete_address, 'place_changed', function () {
		// 		var place = autocomplete_address.getPlace();
		// 		if (!place.geometry) {
		// 			alert("Không có dữ liệu chi tiết cho địa điểm: '" + place.name + "'.");
		// 			return false;
		// 		}
        //         var address = place.formatted_address.includes(place.name)? place.formatted_address: place.name + ', ' + place.formatted_address;
        //         $.ajax({
        //             method: "POST",
        //             url: ajax_main.ajaxurl,
        //             data: { action: 'calculate_shipping_fee', address: address, /*delivery_time: $('#billing_time').val()*/}
        //         })
        //             .done(function (responseText) {
        //                 if(responseText.slice(-1) == '0')
        //                     responseText = responseText.slice(0, -1);
        //                 var response = jQuery.parseJSON(responseText);
        //                 if(response.status == 1){
        //                     console.log("Phí vận chuyển cho "+response.distance+" (km) là " + response.formatted_delivery_fee);
        //                 }else{
        //                     console.log(response.msg)
        //                     // if(response.msg == null)
        //                 }
        //             })
        //             .fail(function (jqXHR, textStatus) {
                        
        //             })
        //             .always(function () {
                        
        //             });
		// 	});
		// }
		// initAutoComplete();
        /////////////////////////////////////////////////

    });

});