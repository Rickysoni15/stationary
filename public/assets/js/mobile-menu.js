(function ($) {
    "use strict"; // Start of use strict
    /* ---------------------------------------------
     Resize mega menu
     --------------------------------------------- */

    function responsive_megamenu_item(container, element) {
        if ( container != 'undefined' ) {
            var container_width  = 0,
                container_offset = container.offset();

            if ( typeof container_offset != 'undefined' ) {
                container_width = container.innerWidth();
                setTimeout(function () {
                    $(element).children('.megamenu').css({'max-width': container_width + 'px'});
                    var sub_menu_width = $(element).children('.megamenu').outerWidth(),
                        item_width     = $(element).outerWidth();
                    $(element).children('.megamenu').css({'left': '-' + (sub_menu_width / 2 - item_width / 2) + 'px'});
                    var container_left  = container_offset.left,
                        container_right = (container_left + container_width),
                        item_left       = $(element).offset().left,
                        overflow_left   = (sub_menu_width / 2 > (item_left - container_left)),
                        overflow_right  = ((sub_menu_width / 2 + item_left) > container_right);

                    if ( overflow_left ) {
                        var left = (item_left - container_left);
                        $(element).children('.megamenu').css({'left': -left + 'px'});
                    }
                    if ( overflow_right && !overflow_left ) {
                        var left = (item_left - container_left);
                        left     = left - (container_width - sub_menu_width);
                        $(element).children('.megamenu').css({'left': -left + 'px'});
                    }
                }, 100);
            }
        }
    }

    function oemone_resize_megamenu() {
        var window_size = jQuery('body').innerWidth();
        window_size += oemone_get_scrollbar_width();
        if ( $('.oemone-menu-wapper.horizontal .item-megamenu').length > 0 && window_size > 991 ) {
            $('.oemone-menu-wapper.horizontal .item-megamenu').each(function () {
                var _this            = $(this),
                    _data_responsive = _this.children('.megamenu').data('responsive'),
                    _container       = _this.closest('.oemone-menu-wapper');
                if ( _data_responsive != '' )
                    _container = _this.closest(_data_responsive);

                responsive_megamenu_item(_container, _this);
            });
        }
    }

    /**==============================
     Auto width Vertical menu
     ===============================**/
    function oemone_auto_width_vertical_menu() {
        $('.oemone-menu-wapper.vertical.support-mega-menu').each(function () {
            var menu_offset = $(this).offset(),
                menu_width  = parseInt($(this).actual('width')),
                menu_left   = menu_offset.left + menu_width;

            $(this).find('.megamenu').each(function () {
                var data_responsive   = $(this).data('responsive'),
                    element_caculator = $('.container');
                if ( data_responsive != '' )
                    element_caculator = $(this).closest(data_responsive);

                var container_width  = parseInt(element_caculator.innerWidth()) - 30,
                    container_offset = element_caculator.offset(),
                    container_left   = container_offset.left + container_width,
                    width            = (container_width - menu_width);

                if ( menu_offset.left > container_left || menu_left < container_offset.left )
                    width = container_width;
                if ( menu_left > container_left )
                    width = container_width - (menu_width - (menu_left - container_left)) - 30;

                if ( width > 0 )
                    $(this).css('max-width', width + 'px');
            });
        })
    }

    function oemone_get_scrollbar_width() {
        var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
            $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
            inner  = $inner[ 0 ],
            outer  = $outer[ 0 ];
        jQuery('body').append(outer);
        var width1 = inner.offsetWidth;
        $outer.css('overflow', 'scroll');
        var width2 = outer.clientWidth;
        $outer.remove();
        return (width1 - width2);
    }

    /* ---------------------------------------------
     MOBILE MENU
     --------------------------------------------- */
    function oemone_menuclone_all_menus() {
        if ( !$('.oemone-menu-clone-wrap').length && $('.oemone-clone-mobile-menu').length > 0 ) {
            $('body').prepend('<div class="oemone-menu-clone-wrap">' +
                '<div class="oemone-menu-panels-actions-wrap">' +
                '<span class="oemone-menu-current-panel-title">MENU</span>' +
                '<a class="oemone-menu-close-btn oemone-menu-close-panels" href="#">x</a></div>' +
                '<div class="oemone-menu-panels"></div>' +
                '</div>');
        }
        var i                = 0,
            panels_html_args = Array();
        if ( !$('.oemone-menu-clone-wrap .oemone-menu-panels #oemone-menu-panel-main').length ) {
            $('.oemone-menu-clone-wrap .oemone-menu-panels').append('<div id="oemone-menu-panel-main" class="oemone-menu-panel oemone-menu-panel-main"><ul class="depth-01"></ul></div>');
        }

        $('.oemone-clone-mobile-menu').each(function () {
            var $this              = $(this),
                thisOfficeu           = $this,
                this_menu_id       = thisOfficeu.attr('id'),
                this_menu_clone_id = 'oemone-menu-clone-' + this_menu_id;

            if ( !$('#' + this_menu_clone_id).length ) {
                var thisClone = $this.clone(true); // Clone Wrap
                thisClone.find('.menu-item').addClass('clone-menu-item');

                thisClone.find('[id]').each(function () {
                    // Change all tab links with href = this id
                    thisClone.find('.vc_tta-panel-heading a[href="#' + $(this).attr('id') + '"]').attr('href', '#' + oemone_menuadd_string_prefix($(this).attr('id'), 'oemone-menu-clone-'));
                    thisClone.find('.oemone-menu-tabs .tabs-link a[href="#' + $(this).attr('id') + '"]').attr('href', '#' + oemone_menuadd_string_prefix($(this).attr('id'), 'oemone-menu-clone-'));
                    $(this).attr('id', oemone_menuadd_string_prefix($(this).attr('id'), 'oemone-menu-clone-'));
                });

                thisClone.find('.oemone-menu-menu').addClass('oemone-menu-menu-clone');

                // Create main panel if not exists

                var thisMainPanel = $('.oemone-menu-clone-wrap .oemone-menu-panels #oemone-menu-panel-main ul');
                thisMainPanel.append(thisClone.html());

                oemone_menu_insert_children_panels_html_by_elem(thisMainPanel, i);
            }
        });
    }

    // i: For next nav target
    function oemone_menu_insert_children_panels_html_by_elem($elem, i) {
        if ( $elem.find('.menu-item-has-children').length ) {
            $elem.find('.menu-item-has-children').each(function () {
                var thisChildItem = $(this);
                oemone_menu_insert_children_panels_html_by_elem(thisChildItem, i);
                var next_nav_target = 'oemone-menu-panel-' + i;

                // Make sure there is no duplicate panel id
                while ( $('#' + next_nav_target).length ) {
                    i++;
                    next_nav_target = 'oemone-menu-panel-' + i;
                }
                // Insert Next Nav
                thisChildItem.prepend('<a class="oemone-menu-next-panel" href="#' + next_nav_target + '" data-target="#' + next_nav_target + '"></a>');

                // Get sub menu html
                var sub_menu_html = $('<div>').append(thisChildItem.find('> .submenu').clone()).html();
                thisChildItem.find('> .submenu').remove();

                $('.oemone-menu-clone-wrap .oemone-menu-panels').append('<div id="' + next_nav_target + '" class="oemone-menu-panel oemone-menu-sub-panel oemone-menu-hidden">' + sub_menu_html + '</div>');
            });
        }
    }

    function oemone_menuadd_string_prefix(str, prefix) {
        return prefix + str;
    }

    function oemone_menuget_url_var(key, url) {
        var result = new RegExp(key + "=([^&]*)", "i").exec(url);
        return result && result[ 1 ] || "";
    }

    function oemone_close_mobile_menu() {
        // BOX MOBILE MENU
        $(document).on('click', '.menu-toggle', function () {
            $('.oemone-menu-clone-wrap').addClass('open');
            return false;
        });
        // Close box menu
        $(document).on('click', '.oemone-menu-clone-wrap .oemone-menu-close-panels', function () {
            $('.oemone-menu-clone-wrap').removeClass('open');
            return false;
        });
        $(document).on('click', function (event) {
            if ( $('body').hasClass('rtl') ) {
                if ( event.offsetX < 0 )
                    $('.oemone-menu-clone-wrap').removeClass('open');
            } else {
                if ( event.offsetX > $('.oemone-menu-clone-wrap').width() )
                    $('.oemone-menu-clone-wrap').removeClass('open');
            }
        });
    }

    // Open next panel
    $(document).on('click', '.oemone-menu-next-panel', function (e) {
        var $this     = $(this),
            thisItem  = $this.closest('.menu-item'),
            thisPanel = $this.closest('.oemone-menu-panel'),
            target_id = $this.attr('href');

        if ( $(target_id).length ) {
            thisPanel.addClass('oemone-menu-sub-opened');
            $(target_id).addClass('oemone-menu-panel-opened').removeClass('oemone-menu-hidden').attr('data-parent-panel', thisPanel.attr('id'));
            // Insert current panel title
            var item_title     = thisItem.find('.oemone-menu-item-title').attr('title'),
                firstItemTitle = '';

            if ( $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').length > 0 ) {
                firstItemTitle = $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').html();
            }

            if ( typeof item_title != 'undefined' && typeof item_title != false ) {
                if ( !$('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').length ) {
                    $('.oemone-menu-panels-actions-wrap').prepend('<span class="oemone-menu-current-panel-title"></span>');
                }
                $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').html(item_title);
            }
            else {
                $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').remove();
            }

            // Back to previous panel
            $('.oemone-menu-panels-actions-wrap .oemone-menu-prev-panel').remove();
            $('.oemone-menu-panels-actions-wrap').prepend('<a data-prenttitle="' + firstItemTitle + '" class="oemone-menu-prev-panel" href="#' + thisPanel.attr('id') + '" data-cur-panel="' + target_id + '" data-target="#' + thisPanel.attr('id') + '"></a>');
        }

        e.preventDefault();
    });

    // Go to previous panel
    $(document).on('click', '.oemone-menu-prev-panel', function (e) {
        var $this        = $(this),
            cur_panel_id = $this.attr('data-cur-panel'),
            target_id    = $this.attr('href');

        $(cur_panel_id).removeClass('oemone-menu-panel-opened').addClass('oemone-menu-hidden');
        $(target_id).addClass('oemone-menu-panel-opened').removeClass('oemone-menu-sub-opened');

        // Set new back button
        var new_parent_panel_id = $(target_id).attr('data-parent-panel');
        if ( typeof new_parent_panel_id == 'undefined' || typeof new_parent_panel_id == false ) {
            $('.oemone-menu-panels-actions-wrap .oemone-menu-prev-panel').remove();
            $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').html('MAIN MENU');
        }
        else {
            $('.oemone-menu-panels-actions-wrap .oemone-menu-prev-panel').attr('href', '#' + new_parent_panel_id).attr('data-cur-panel', target_id).attr('data-target', '#' + new_parent_panel_id);
            // Insert new panel title
            var item_title = $('#' + new_parent_panel_id).find('.oemone-menu-next-panel[data-target="' + target_id + '"]').closest('.menu-item').find('.oemone-menu-item-title').attr('data-title');
            item_title     = $(this).data('prenttitle');
            if ( typeof item_title != 'undefined' && typeof item_title != false ) {
                if ( !$('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').length ) {
                    $('.oemone-menu-panels-actions-wrap').prepend('<span class="oemone-menu-current-panel-title"></span>');
                }
                $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').html(item_title);
            }
            else {
                $('.oemone-menu-panels-actions-wrap .oemone-menu-current-panel-title').remove();
            }
        }

        e.preventDefault();
    });

    /* ---------------------------------------------
     Scripts resize
     --------------------------------------------- */

    $(window).on("resize", function () {
        oemone_resize_megamenu();
        oemone_close_mobile_menu();
        oemone_auto_width_vertical_menu();
    });
    window.addEventListener('load',
        function (ev) {
            oemone_resize_megamenu();
            oemone_close_mobile_menu();
            oemone_auto_width_vertical_menu();
            oemone_menuclone_all_menus();
        }, false);

})(jQuery); // End of use strict