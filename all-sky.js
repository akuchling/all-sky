
// XXX styling to do: have the component images be smaller, and put them
// into a sensible display.

// Looks at all of the sliders and updates the CSS opacities in the result
// image.
function update_result()
{
    var i;
    var range_elem, value;
    var sliders = $('.range-slider');
    var image_elems = $('img.image-component');

    // expected: (sliders.length == image_elems.length)
    for(i = 0; i < image_elems.length; i++) {
	value = parseFloat(sliders[i].value);
	$(image_elems[i]).css('opacity', value / 100);
    }
}


// Once the JSON index of images has been received, create image objects
// and place them within the page.
function load_index(data, textStatus, xhr)
{
    var title = data["title"];
    var images = data["images"];
    var i;
    var img;
    var elem;
    var image_list;

    $(".title").text(title);

    // Create image objects.
    image_list = $('#div-image-list');
    for(i = 0; i < images.length; i++) {
	var im = images[i];
	var image_path = 'images/allsky/' + im['filename'];
	var image_elem;

	// Create image displaying the original and the slider widget.
	image_elem = $("<img/>", {
	   'src': image_path,
	   'width': 205, 'height': 105,
	   'class': 'image-original'});
	image_elem.data('index', i);
	elem = $('<p><input class="range-slider" type="range" min="0" max="100" step="1" value="50" /></p>');
	elem.append(image_elem);
	$('#div-image-list').append(elem);

	// Create image that will be used in the result display.
	elem = $("<img/>", {src: image_path});
	$('#div-result-image').append(elem);
	// XXX need to position this more adaptively.
	elem.addClass('image-component').css({
           'position': 'absolute',
	    'top': '0px', 'left': '0px',
	    'z-index': (i+1)
	});
    }

    $('#div-result-image').css({'position': 'relative',
			       'top': '0px', 'left': '0px'});
    $('.range-slider').change(update_result);

    // Perform an initial update
    update_result();
}

function setup_page() {
    var index_url = $("body").data("index");
    // XXX figure out the exact path later.
    index_url = "images/allsky/index.json";
    $.getJSON(index_url, {}, load_index);
}

$(setup_page);
