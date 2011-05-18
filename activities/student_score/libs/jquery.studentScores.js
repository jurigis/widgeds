/**
 * Word Magnets, Firdge Mangets with jQuery
 * @version: 0.2 (2011/04/28)
 * @requires jQuery v1.4.2 or later 
 * @author Marielle Lange
 * Source: http://github.com/widged/widgeds
 *  
 * Built on top of the jQuery library
 *   http://jquery.com
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 (function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-Magnets").wgStudentScores();
     * @before <div class="wg-StudentScores"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgStudentScores = function(o) {
         return this.each(function() {
            $(this).data('widged', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
         scoreList     : null,
         legendWidth      : 60,                                 // Width of text'
         barWidth         : 120,                                 // Width of the progressbar - don't forget to adjust your image too!!!                                    // Image to use in the progressbar. Can be a single image too: 'images/progressbg_green.gif'
         barHeight        : 12,                                 // Height of the progressbar - don't forget to adjust your image too!!!
         progressBackground  : 'assets/progressbar.gif',                  // boxImage : image around the progress bar
         progressImages      : {
                        0:   'assets/progressbg_red.gif',
                        30: 'assets/progressbg_orange.gif',
                        50: 'assets/progressbg_yellow.gif',
                        70: 'assets/progressbg_green.gif'
                     },
       
    };

    // ##############################################
    // <<<  Plugin logic, shared by all widgets
    //      (no modifications required, leave on top)
    // ##############################################
    /**
     * The widged object.
     *
     * @constructor
     * @class widged
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/widged
     */
    $wg = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});
        this.container   = $(e);
        this.setup();
    };

    $wg.fn = $wg.prototype = {
        version: this.version
    };

    $wg.fn.extend = $wg.extend = $.extend;

    // ##############################################
    //      End of plugin logic >>>
    // ##############################################

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
         setup: function() {
            // parse items in the activity division
            var wg = this;
            this.scoreList = this.options.scoreList;
            this.container.bind("dataError", function(e, error){ alert(error.msg) });
            this.container.bind("dataChange", function(e, data){ wg.onDataChange(data); });
            this.render();
         },

         onDataChange: function(data) {
            this.scoreList = data;
            this.render();
         },

         render: function() {
            var html = '';
            var scoreList = this.scoreList;

            this.container.html('');
            var barWidth = this.options.barWidth;
            var barHeight = this.options.barHeight;
            var legendWidth = this.options.legendWidth;

            var progressMax = barWidth / 100;

            var percentValue, percentText, progressImages = this.options.progressImages, progressBackground = this.options.progressBackground;
            for (col in scoreList)
            {
               itemEl = $('<div class="score"><div style="width:' + legendWidth + 'px;display:inline-block">' + col + '</div></div>');
               percentValue = scoreList[col];
               percentText = percentValue + "%";
               
               for (var i in progressImages) {
                  if (percentValue >= parseInt(i)) {
                     progressImage = progressImages[i];
                  } else { break; }
               }
               
               var $bar      = $('<img/>');
               var $text      = $('<span style="padding-left: 20px"/>');

               $text.html(percentText);
               $bar.attr('title', 'barTitle');
               $bar.attr('alt', percentText);
               $bar.attr('width', barWidth);
               $bar.css({
                  'height': barHeight + "px",
                  'width': barWidth + "px",
                  'src': progressBackground,
                  'background-image': "url(" + progressImage + ")",
                  'background-position': (barWidth * -1) + (percentValue * progressMax ) + 'px 50%',
                  'padding' : 0,
                  'margin' : 0
               })

               itemEl.append($bar);
               itemEl.append($text);
               this.container.append(itemEl);
            }

/*            for(var i in list)
            {
               itemEl = $('<div class="magnet" style="left: 10px; top: 10px;">' + item.html + '</div>');
               itemEl.css({'border': '1px solid black', 'border-right': '2px solid black', 'border-bottom': '2px solid black', 'font-family': '"courier new",veranda,arial', 'float': 'left', 'padding': '0 3px 0 3px', 'background': 'white', 'cursor': 'pointer', 'position': 'absolute'});
               itemEl.css({'left': Math.round(Math.random() * (barWidth-100)) + 20 + 'px'});
               itemEl.css({'top': Math.round(Math.random() * (barHeight - 100)) + 20 + 'px'});
               itemEl.draggable({
                       containment: 'parent',
                       stack:'.item',
                       });
               item.el = el;
               itemEl.append(el);
            }
            */               
            
         }
 
    });


})(jQuery);