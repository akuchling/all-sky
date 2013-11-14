
function load_index(data, textStatus, xhr)
{
    var title = data["title"];
    var images = data["images"];
    var i;
    var img;
    var elem;

    $(".title").text(title);
    for(i = 0; i < images.length; i++) {
	var im = images[i];

	elem = $("div.image-list").append("<div><img/></div>");


    }

}

function setup_page() {
    var index_url = $("body").data("index");
    $.getJSON(index_url, {}, load_index);
}

$(setup_page);
