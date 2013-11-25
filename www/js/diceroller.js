var drnTotal = 0;
var drnTotalAll = 0;
var L=1;
document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(function() {
	onDeviceReady();
});


function doClear(boolAbove, boolBelow, boolPrev) {
	boolAbove = typeof boolAbove !== 'undefined' ? boolAbove : false;
	boolBelow = typeof boolBelow !== 'undefined' ? boolBelow : true;
	boolPrev = typeof boolPrev !== 'undefined' ? boolPrev : false;
	if (boolAbove)
		$("#input").val("");
	if (boolBelow)
		$("#out").html("");
	if (boolPrev) {
		var arr = new Array();
		$(".previousruns option").each(function()
		{
			if ($(this).val() != "----" || value != "--clear--")
				$(this).remove();
		});
		$(".previousrunshold").hide();
		amplify.store( "drnPrevious", arr );
	}
	amplify.store( "drnInput", $("#input").val() );
	amplify.store( "drnOutput", $("#out").html() );
}
function doGo() {
	L = 1;
	
	var c = 0;
	var inputShortcuts = $('#input').val();
	while( inputShortcuts.search(/[d]\d/g) >= 0 && c < 4)
	{
		c++;
		inputShortcuts.replace(/[d]\d/g, "ddddd");
	}
	$('#input').val(inputShortcuts);
	
	var arrayOfLines = $('#input').val().split('\n');
	var output = "";
	drnTotal = 0.0;
	drnTotalAll = 0.0;
	$.each(arrayOfLines, function(index, item) {
		
		
		
		item = $.trim(item);
		
		if (item.length > 0){
			try {
				var evali = doEval("" + item, true, false) / doEval("" + item, true, false);
				
				if (output.length > 0)
						output += "<br/>";
				if (!isNaN(evali)){
					output += "<span class='eval'><span class='evalue'>" + doEval("" + item) + "</span> => <span class='evaltext'>" + item + "</span></span>";
				} else {
					output += "<span class='noneval'>" + item + "</span>";
				}
			} catch (e) {
			}
		}
		if(item == "=") {
			output += "<div class='subtotal'>=Total: " + drnTotal + "</div>";
			drnTotalAll += drnTotal;
			drnTotal = 0;
		}
	});
	
	if (output.length > 0) {
		if (drnTotalAll < drnTotal) {
			output += "<div class='subtotal'>=Total: " + drnTotal + "</div>";
			drnTotalAll += drnTotal;
			drnTotal = 0;
		}
			
		
		var inputVal = $("#input").val();
			
		output =  "<div class='grandtotal'>Total of Totals:" + drnTotalAll + "</div>" + output;
		output += "<div class='grandtotal'>Total of Totals:" + drnTotalAll + "</div>";
		$("#out").html("<div class='outputbox'>" + output + "</div>" + $("#out").html() );
		
		amplify.store( "drnInput",  inputVal);
		amplify.store( "drnOutput", $("#out").html() );
		$('.previousruns option[value="' + inputVal + '"]').each(function(){
			$(this).remove();
		});
		if ($(".previousruns")[0].length <= 1) {
			$(".previousruns")[0].options[$(".previousruns")[0].length] = new Option(inputVal, inputVal);
		} else
			$("select option").eq(1).before($("<option></option>").val(inputVal).html(inputVal));

		$(".previousrunshold").show();
		
		var arr = new Array();
		$(".previousruns option").each(function()
		{
			if ($(this).val() != "----" || $(this).val() != "--clear--")
				arr.push($(this).val());
		});
		amplify.store( "drnPrevious", arr );
		
		//var options = $('.previousruns').attr('options');
		//options[options.length] = new Option($("#input").val(), $("#input").val(), true, true);
	}
}

function onDeviceReady() {
	var drnInput = amplify.store( "drnInput" );
	var drnOutput = amplify.store( "drnOutput" );
	var drnPrevious = amplify.store( "drnPrevious" );
	
	drnInput = typeof drnInput !== 'undefined' ? drnInput : "";
	drnOutput = typeof drnOutput !== 'undefined' ? drnOutput : "";
	drnPrevious = typeof drnPrevious !== 'undefined' ? drnPrevious : null;
	
	
	if (drnOutput.length > 0) {
		$("#out").html(drnOutput);
	}
	
	if (drnInput.length > 0) {
		$("#input").val(drnInput);
	}
	$('#input').css('overflow', 'hidden').autogrow();
	
	if (drnPrevious != null)
	{
		$.each(drnPrevious, function( index, value ) {
			if (value != "----" || value != "--previous--" || value != "--clear--") {
				$(".previousruns")[0].options[$(".previousruns")[0].length] = new Option(value, value);
				$(".previousrunshold").show();
			}
		});
	}
	$( ".previousruns" ).change(function() {
		if ($( this ).val() != '----' && value != "--previous--" && value != "--clear--") {
			$('#input').val($( this ).val());
			$('#input').keydown();
		} else if (value == "--clear--") {
			doClear(false,false,true);
		}
	});

}
function toggleDiceSelect() {
	$(".diceselectbox").toggle();
}
function hideDiceSelect() {
	$(".diceselectbox").hide();
}
function doEval(stringStatement, boolRound, booladdtototal) {
	boolRound = typeof boolRound !== 'undefined' ? boolRound : true;
	booladdtototal = typeof booladdtototal !== 'undefined' ? booladdtototal : true;
	var ret = (eval(stringStatement));
	if (boolRound) {
		ret = Math.round(ret);
	}
	if (booladdtototal) {
		try {
			if (parseFloat(ret) > 0||parseFloat(ret) < 0){
				//alert(stringStatement + "==" + ret);
				drnTotal+=parseFloat(ret);
				//alert(drnTotal);
			}
		} catch(e){var sssadas =0;}
	}
	return ret;				
}
function D(dicenumber, rolls, modifier){
	return d(dicenumber, rolls, modifier);
}
function d(dicenumber, rolls, modifier) {
	rolls = typeof rolls !== 'undefined' ? rolls : 1;
	modifier = typeof modifier !== 'undefined' ? modifier : 0;
	var retVal = 0;
	for (var i=1;i<=rolls;i++) {
		retVal+=(Math.floor(Math.random()*dicenumber)+1)+modifier;
	}
	return retVal;
}
function lvl(lvlNumber) {
	L=lvlNumber;
}
function rdown(inputnumber) {
	return Math.floor(inputnumber);
}
function rup(inputnumber) {
	return Math.floor(inputnumber);
}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}
function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
    	"ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
	if(text.startsWith("d") && endsWith(front,')')) {
		text = "+" + text;
	}
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	range.moveStart ('character', strPos);
    	range.moveEnd ('character', 0);
    	range.select();
    }
    else if (br == "ff") {
    	txtarea.selectionStart = strPos;
    	txtarea.selectionEnd = strPos;
    	txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
	$(txtarea).keydown();
}
(function($)
{
    /**
     * Auto-growing textareas; technique ripped from Facebook
     *
     * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
     */
    $.fn.autogrow = function(options)
    {
        return this.filter('textarea').each(function()
        {
            var self         = this;
            var $self        = $(self);
            var minHeight    = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;

            var shadow = $('<div></div>').css({
                position:    'absolute',
                top:         -10000,
                left:        -10000,
                width:       $self.width(),
                fontSize:    $self.css('fontSize'),
                fontFamily:  $self.css('fontFamily'),
                fontWeight:  $self.css('fontWeight'),
                lineHeight:  $self.css('lineHeight'),
                resize:      'none',
    			'word-wrap': 'break-word'
            }).appendTo(document.body);

            var update = function(event)
            {
                var times = function(string, number)
                {
                    for (var i=0, r=''; i<number; i++) r += string;
                    return r;
                };

                var val = self.value.replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/&/g, '&amp;')
                                    .replace(/\n$/, '<br/>&nbsp;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/ {2,}/g, function(space){ return times('&nbsp;', space.length - 1) + ' ' });

				// Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
				if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
					val += '<br />';
				}

                shadow.css('width', $self.width());
                shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.
                $self.height(Math.max(shadow.height() + noFlickerPad, minHeight));
            }

            $self.change(update).keyup(update).keydown({event:'keydown'},update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);