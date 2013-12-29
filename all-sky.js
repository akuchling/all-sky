
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
    $('body').append(image_list);
    for(i = 0; i < images.length; i++) {
	var im = images[i];
	var image_path = 'images/allsky/' + im['filename'];

	// Create image displaying the original
	elem = $("<img/>");
	elem.attr('src', image_path);
	elem.addClass('image-original').data('index', i);
	image_list.append(elem);

	// Create slider widget.
	// XXX what should the upper limit be?
	elem = $('<input type="range" min="0" max="100" step="1" value="50" />');
	elem.addClass("range-slider");
	image_list.append(elem);
	elem.change(update_result);

	// Create image that will be used in the result display.
	elem = $("<img/>");
	elem.attr('src', image_path);
	$('#div-result').append(elem);
	elem.addClass('image-component').css({
           'position': 'absolute',
	    'top': '0px', 'left': '0px'
	});
    }

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
