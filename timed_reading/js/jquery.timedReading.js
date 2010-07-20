/*
 timedReading - Timed Reading Widged with jQuery
 http://github.com/widged/exercist-widgeds

 Created: Marielle Lange, 2010
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php) license

 Built on top of the jQuery library
   http://jquery.com
*/

(function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-timedReading").wgTimedReading();
     * @before <ul id="myactivity" class="wgTimedReading-skin-name"><li>First item</li><li>Second item</li></ul>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgTimedReading = function(o) {
         return this.each(function() {
            $(this).data('wgTimedReading', new $wg(this, o));
         });
    };

    // Default configuration properties.
    var defaults = {
       timeLimit: 10000
    };
    
    /**
     * The wgTimedReading object.
     *
     * @constructor
     * @class wgTimedReading
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/wgTimedReading
     */
    $.wgTimedReading = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});

        this.container  = $(e);
        this.setup();
    };
    
    

    // Create shortcut for internal use
    var $wg = $.wgTimedReading;

    $wg.fn = $wg.prototype = {
        wgTimedReading: '0.0.1'
    };

    $wg.fn.extend = $wg.extend = $.extend;

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
        setup: function() {

           // game parameters
           var divHTML = this.container.html();
           this.controlBox = $('<div />');
           this.controlBox.css({'margin-bottom' : '40px', 'text-align' : 'center'});
           
           var titleBox = this.container.find('.title');
           this.contentBox = this.container.find('.content');

           var activityBox = $('<div />');
           activityBox.css({'border-color': '#E69D00', 'border-style': 'solid', 'border-width': '1px', 'background-color': '#FFF4BF', 'padding' : '20px', 'font-family': 'Geneva,Arial'});
           
           activityBox.append(this.controlBox);
           activityBox.append(titleBox);
           activityBox.append(this.contentBox);
           this.container.html(activityBox);

           this.tickInterval = 1000; // in milliseconds
           this.maxTime = this.options.timeLimit; // in milliseconds, 5 minutes = 300000 ms

           this.updateActivity('init');
        },
        
        startActivity: function() {

           this.updateActivity('start');
        },

        // ################
        // Interactivity
        // ################
        
        onTimerTick: function(tickCount) {
           this.updateActivity(tickCount);
        },

        onStartClick: function() {
           this.startActivity();
        },
        
        // ################
        // View
        // ################
        updateActivity: function(value) {

           var el;
           var timeElapsed;
           switch(value)
           {
              case 'init':
              case 'startAgain':
                  var buttonText, feedback;
                  if(value == 'startAgain') { 
                     buttonText = 'Start Reading Again' ;
                     feedback = '<div>Your time is over!</div>';
                  } else { 
                     buttonText = 'Start Reading';
                     feedback = '';
                  }
                  el = $('<div><input id="startButton" type="submit" value="' + buttonText + '"/>' + feedback + '</div>');
                  el.css({'font-size' : '11px'})
                  el.find('#startButton').css({'border-color': '#E69D00', 'border-width': '1px', 'background-color': '#FFDD73', 'padding' : '8px'})
                  el.bind( 
                    'click', // bind to multiple events 
                    { script: this }, // pass in data
                    function(eventObject) {  eventObject.data.script.onStartClick(); }
                  );                 
                  this.contentBox.hide();
              break;
              case 'start':
                  this.timeBox = $('<input id="timeInput" type="input" value="' + '' + '" size="10"/>');
                  el = $('<div>Remaining Time: </div>');
                  el.append(this.timeBox);
                  el.css({'font-size' : '10px', 'margin-top' : '11px'})
                  timeElapsed = this.tickToTime(0)
                  this.timeBox.val(this.timeAsText(timeElapsed));
                  this.contentBox.show();
                  $(this).stopTime();
                  $(this).everyTime(this.tickInterval, function(i) {
                    this.onTimerTick(i);
                  }, 0);   
               break;
              default:
                  timeElapsed = this.tickToTime(value);
                  if(timeElapsed <= 0) { 
                     this.updateActivity('startAgain') 
                  } 
                  else
                  {
                     this.timeBox.val(this.timeAsText(timeElapsed));
                  }
              break;
           }

           this.controlBox.html(el);
        },
        
        // ################
        // Utilities
        // ################
        tickToTime: function(value) {
           var d;
           if(value == 0) {
              d = new Date(this.maxTime); 
            } else { 
               var timeElapsed = this.maxTime - (value * this.tickInterval);
              d= new Date(timeElapsed);
            }
            return d;
        },        

        timeAsText: function(d) {
            var seconds = d.getSeconds();
            if (seconds < 10){
               seconds = "0" + seconds
            }
           return d.getMinutes() + ":" + seconds;
        }        

    });

    $wg.extend({
        /**
         * Gets/Sets the global default configuration properties.
         *
         * @return {Object}
         * @param d {Object} A set of key/value pairs to set as configuration properties.
         */
        defaults: function(d) {
            return $.extend(defaults, d || {});
        }
   
    });

})(jQuery);