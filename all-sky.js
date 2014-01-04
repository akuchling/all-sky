
// XXX styling to do: have the component images be smaller, and put them
// into a sensible display.

// Sanity check the images; they should all be the same size.
// Will display an error message if there's a problem; the intention is
// that the developer will correct the JSON file or the images as necessary.
function verify_images_ok(images_expected)
{
    var i;
    var x, y;

    var image_list = $("img.image-component");
    if (image_list.length != images_expected) {
	alert("Expected to load " + images_expected + " images, but " +
	      image_list.length + " were loaded.");
	return false;
    }

    return true;
}


// Looks at all of the sliders and updates the CSS opacities in the result
// image.
function update_result()
{
    var i;
    var range_elem, value;
    var sliders = $('.range-slider');
    var image_elems = $('img.image-component');
    var canvas = $('#canvas-result').get(0);
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    // expected: (sliders.length == image_elems.length)
    for(i = 0; i < image_elems.length; i++) {
	context.save();
	value = parseFloat(sliders[i].value);
	context.globalAlpha = value / 100;
	context.drawImage(image_elems[i], 0, 0);
	context.restore();
	//$(image_elems[i]).css('opacity', value / 100);
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
    var num_images;

    $(".title").text(title);

    // Track the number of images, and set up the page once they've all been
    // loaded.
    num_images = images.length;
    function image_loaded() {
	num_images--;
	if (num_images == 0) {
	    // There needs to be a slight delay after the last image
	    // is loaded.  Without the delay, verify_images_ok()
	    // only finds N-1 images and fails.
	    setTimeout(function () {
		// Sanity check the images
		if (verify_images_ok(images.length)) {
		    // Perform an initial update
		    update_result();
		}
	    }, 250);
	}
    }

    // Create image objects.
    image_list = $('#div-image-list');
    for(i = 0; i < images.length; i++) {
	var im = images[i];
	var image_path = 'images/allsky/' + im['filename'];
	var image_elem;

	// Create image displaying the original and the slider widget.
	elem = $('<div class="component"><p><img /><br /><input class="range-slider" type="range" min="0" max="100" step="1" value="50" /></p></div>');
	$('#div-image-list').append(elem);

	// Fill in the elements on the image
	elem.find('img').attr({
	   'src': image_path,
	   'onload': image_loaded,
	   'width': 205, 'height': 105,
	   'class': 'image-component'}).data('index', i);
    }

    $('.range-slider').change(update_result);
}

function setup_page() {
    var index_url = $("body").data("index");
    // XXX figure out the exact path later.
    index_url = "images/allsky/index.json";
    $.getJSON(index_url, {}, load_index);
}

$(setup_page);
