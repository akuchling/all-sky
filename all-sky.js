
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
    var canvas = $('#canvas-result').get(0);
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    // expected: (sliders.length == image_elems.length)
    for(i = 0; i < image_elems.length - 1; i++) {
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

    $(".title").text(title);

    // Create image objects.
    image_list = $('#div-image-list');
    for(i = 0; i < images.length; i++) {
	var im = images[i];
	var image_path = 'images/allsky/' + im['filename'];
	var image_elem;

	// Create image displaying the original and the slider widget.
	elem = $('<p><img /><br /><input class="range-slider" type="range" min="0" max="100" step="1" value="50" /></p>');
	elem.children().filter('img').attr({
	   'src': image_path,
	   'width': 205, 'height': 105,
	   'class': 'image-component'}).data('index', i);
	$('#div-image-list').append(elem);
    }

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
