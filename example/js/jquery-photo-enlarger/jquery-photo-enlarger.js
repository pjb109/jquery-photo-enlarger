(function($) {

    $.fn.PhotoEnlarger = function(options) {

        var plugin = this,
            default_options = {
                'photo_max_width': 760
            };

        plugin.options = $.extend(default_options, options);
        plugin.enlarge = function($thumb) {
            var $thumb_img = $thumb.find('img:first'),
                $thumb_lg_div = $('<div class="thumb-large">'),
                $thumb_lg_img = $('<img>');

            $thumb_lg_img.attr('src', $thumb_img.data('large_photo'));

            $thumb_lg_img.imagesLoaded().done(function(instance) {

                var lg_img_orig_width = $thumb_lg_img[0].width,
                    lg_img_orig_height = $thumb_lg_img[0].height,
                    max_width = lg_img_orig_width,
                    max_height = lg_img_orig_height;

                if (lg_img_orig_width > plugin.options.photo_max_width) {
                    max_width = plugin.options.photo_max_width;
                    max_height = lg_img_orig_height * (max_width / lg_img_orig_width);
                }

                $caption = $('<div class="caption">').html($thumb_img.data('caption'));
                $thumb_lg_div.append($thumb_lg_img).append($('<div class="state-icon">'));
                $thumb_lg_div.hide();
                $thumb_lg_div.css({width: $thumb_img[0].width, height: $thumb_img[0].height});
                $thumb.append($thumb_lg_div);
                $thumb_lg_div.show();
                $thumb_lg_div.animate({width: max_width, height: max_height }, 500, function() {

                    $thumb_lg_div.append($caption);
                    $thumb_lg_div.hover(
                        function() { $caption.show(); },
                        function() { $caption.hide(); }
                    );

                    $thumb_lg_div.find('img:first').click(function() { plugin.shrink($thumb); });
                });

            });

        };

        plugin.shrink = function($thumb) {

            var $thumb_lg_div = $thumb.find('.thumb-large:first'),
                $thumb_img = $thumb.find('img:first');

            $thumb_lg_div.find('.caption').fadeOut(100, function() {
                $thumb_lg_div.animate({width: $thumb_img.width(), height: $thumb_img.height() }, 500, function() {
                    $thumb_lg_div.remove();
                });
            });
        };

        return plugin.each(function() {

            var $thumb = $(this),
                $thumb_img = $thumb.find('img:first'),
                large_img_url = $thumb_img.data('large_photo'),
                _img = new Image();

            // pre-load large images
            _img.src = large_img_url;

            $thumb.append('<div class="state-icon">');
            $thumb_img.data('small_photo', $thumb_img.attr('src'));
            $thumb_img.click(function() {
                plugin.enlarge($thumb);
            });

            return $thumb;
        });

    };

}(jQuery));