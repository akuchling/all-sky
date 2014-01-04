
// XXX styling to do: have the component images be smaller, and put them
// into a sensible display.

// Sanity check the images; they should all be the same size.
// Will display an error message if there's a problem; the intention is
// that the developer will correct the JSON file or the images as necessary.
function verify_images_ok(images_expected)
{
    var i;
    var width, height;

    var image_list = $("img.image-component");

    if (image_list.length == 0) {
	alert("No images loaded.");
	return false;
    }
    if (image_list.length != images_expected) {
	alert("Expected to load " + images_expected + " images, but " +
	      image_list.length + " were loaded.");
	return false;
    }

    // Check that all of the image sizes match.
    width = image_list[0].width;
    height = image_list[0].height;
    for(i = 1; i < image_list.length; i++) {
	if (width != image_list[i].width ||
	    height != image_list[i].height) {
	    alert("Image #" + (i+1) + " size mismatch: expected " +
		  width + "x" + height + "; got " +
		  image_list[i].width + "x" + image_list[i].height);
	    return false;
	    }
    }

    // Set the size of the canvas correspondingly.
    $('#canvas-result').attr({'width': width, 'height': height});

    return true;
}


// Convert an IMG element to a canvas element.
// Taken from <http://davidwalsh.name/convert-canvas-image>.
function image_to_canvas(image)
{
    var canvas = $("<canvas />").get(0);

    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}

//
// Pixel-blending functions that can be used by update_result().
//

// NOT USED: Normal blend
function combine_normal(v1, alpha1, v2, alpha2) {
return v2 * alpha2 + (1 - alpha2) * alpha1 * v1;
}

// Screen blend
function combine_screenblend(v1, alpha1, v2, alpha2) {
    var value;
    // Invert both colours.
    v1 = 255 - v1; v2 = 255 - v2;
    // Carry out the normal blend operation.
    value = v2 * alpha2 + (1 - alpha2) * alpha1 * v1;
    // Invert result colour.
    value = 255 - value;
    return value;
}

// Looks at all of the sliders and computes a result image.
function update_result()
{
    var i, j, k;
    var range_elem, value;
    var canvas = $('#canvas-result').get(0);
    var context = canvas.getContext("2d");
    var imageData;

    var slider_values = $('.range-slider').map(
	function (index, elem) {
	    return parseFloat(elem.value) / 100;
	}).toArray();
    var image_comp = $('img.image-component').map(
	function (index, elem) {
	    var canvas = image_to_canvas(elem);
	    var context = canvas.getContext("2d");
	    return context.getImageData(0, 0, canvas.width, canvas.height);
	}).toArray();

    // expected: (sliders.length == image_elems.length)
    imageData = context.createImageData(canvas.width, canvas.height);
    for(i = 0; i < canvas.width; i++) {
	for(j = 0; j < canvas.height; j++) {
	    var index = (i + j * imageData.width) * 4;
	    var alpha = 1.0;
	    var data = imageData.data;

	    for(k = 0; k < image_comp.length; k++) {
		var alpha2 = slider_values[k]
		data[index] = combine_screenblend(data[index], alpha,
				      image_comp[k].data[index], alpha2);
		data[index+1] = combine_screenblend(data[index+1], alpha,
					image_comp[k].data[index+1], alpha2);
		data[index+2] = combine_screenblend(data[index+2], alpha,
			image_comp[k].data[index+2], alpha2);
		alpha = (1 - (1 - alpha)*(1 - alpha2));
	    }
	    data[index + 3] = alpha * 255;
	}
    }
    context.putImageData(imageData, 0, 0,
			 0, 0, imageData.width, imageData.height);
}

// NOT USED: combine the images using the CSS opacity property.
function update_result_opacity()
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
    for(i = 0; i < images.length; i++) {
	var im = images[i];
	var image_path = 'images/allsky/' + im['filename'];
	var image_elem;

	// Create image displaying the original and the slider widget.
	elem = $('<div class="component"><p><img /><br />' +
		 im['title'] +
		 ': 0&nbsp;<input class="range-slider" type="range" min="0" max="100" step="1" value="50" />&nbsp;100</p><hr /></div>');
	$('#div-image-list').append(elem);

	// Fill in the elements on the image
	elem.find('img').attr({
	   'src': image_path,
	   'onload': image_loaded,
	   'width': 205, 'height': 105,
	   'class': 'image-component'}).data('index', i);
    }

    // Make slider adjustments update the displayed image.
    $('.range-slider').change(update_result);
}

function setup_page() {
    var index_url = $("body").data("index");
    // XXX figure out the exact path later.
    index_url = "images/allsky/index.json";
    $.getJSON(index_url, {}, load_index);
}

$(setup_page);
