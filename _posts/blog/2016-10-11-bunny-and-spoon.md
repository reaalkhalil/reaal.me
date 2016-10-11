---
title: Bunny&Spoon
category: blog
---

[Bunny and Spoon](http://bunnyandspoon.com) is a food blog I made for Audrey. It's weird, she refers to herself as "The Bunny" on there, but it's cute. It was fun and I learnt a lot making it, I hope she'll use it often. As an asside, I used [Affinity Designer](https://affinity.serif.com/designer/) to make this bunny: <img src="{{ site.baseurl }}/assets/blog/bands/bunny.png" class="inlineImg" height="20">, it's a wonderful app by a wonderful company. They actually strive to make good software, not just line their pockets like some other companies out there \**cough*\* Adobe \**cough*\*. The price is extremely reasonable so I went ahead and bought a copy. Here's a screenshot of Bunny and Spoon:

![]({{ site.baseurl }}/assets/blog/bands/scr0.png)

It's a standard Wordpress site, with a custom made template that features a [Mapbox](https://www.mapbox.com/) map. Her posts are displayed as bunny paws (<img src="{{ site.baseurl }}/assets/blog/bands/paw.png" class="inlineImg" width="20">) on the map. Clicking on a map-marker, or paw, displays a popup preview of the post.
<img src="{{ site.baseurl }}/assets/blog/bands/scr1.png" width="350">
Clicking read more then gets the corresponding post using AJAX and displays it on the same page in a div element i.e. without reloading the page. In the brief seconds as it's loading, there's a [gif loading animation]({{ site.baseurl }}/assets/blog/bands/loading.gif) involving chopsticks and a spoon (The Bunny's trusty tool and our deuteragonist in this adventure). **BTW:** getting AJAX to work in Wordpress was a nightmare, but once the hair pulling was done it was an easy fix - more on that later.

I used hash marks at the end of the URL or [fragment identifiers](https://en.wikipedia.org/wiki/Fragment_identifier) - as I just learnt they are called - to point to the page or post currently open in the browser. This lets people share posts by copying the link: So [`bunnyandspoon.com/#about`](http://bunnyandspoon.com/#about) links to the about page and [`bunnyandspoon.com/#2016/10/06/graduation-dinner/`](http://bunnyandspoon.com/#2016/10/06/graduation-dinner/) links to Audrey's first (and only - at the time of writing) post, about her graduation dinner.

Bunny and Spoon is hosted on AWS, which is working pretty fine for now. I'm very satisfied with the usability and the experience, and I'm especially happy with the first free year.

Now back to Wordpess' AJAX issue: if you make your own PHP file (see below) and try to get data from it using AJAX, wordpress will throw a 404 error in it. What's frustrating is that if you view the PHP file in your browser it actually shows the data! But upon inspecting the page you'll see a 404 in the header.

{% highlight PHP %}
<?php

header('Content-type: application/json;');

require('wp-blog-header.php');

$return = '{ "type": "FeatureCollection", "features": [';
$comma = "";

$myposts = get_posts();

foreach ( $myposts as $post ){

	$locationPos = strpos($post->post_content,'[location: (');
	if($locationPos !== false):
		// gets the lat and long coords from the post
		$coords = substr($post->post_content, $locationPos + 12, stripos($post->post_content,')',$locationPos) - $locationPos - 12 );
		$postContent = str_replace('[location: ('.$coords.')]', '', $post->post_content);

	$return = $return . $comma;
	$comma = ",";
	
	$return = $return .' { "type": "Feature", "properties": {';
	$return = $return .'"title":' . json_encode($post->post_title).',';
	$return = $return .'"excerpt": ' . json_encode($post->post_excerpt) . ',';
	$return = $return .'"description": ' . json_encode($postContent) . ',';
	$return = $return .	'"link":' . json_encode(get_permalink($post->ID)) . ' }, "geometry": { "type": "Point",';
	$return = $return . '"coordinates": [' . $coords . ' ] } }';
	endif;
}
$return = $return . ']}';
echo $return;
?>
{% endhighlight %}

So after hours of bashing my head into a wall, I found that what you're meant to do is to pass all your custom AJAX requests through: `/wp-admin/admin-ajax.php`, including the name of your custom function that will handle this request in the data section: in this case it's `get_geojson`.

{% highlight JavaScript %}
$.ajax({
  	url: '/wp-admin/admin-ajax.php',
	type: 'GET',
	dataType: 'json',
	cache: false,
	data: {
		action: 'get_geojson'
	},
	success: function() {
		// do something
	}
});
{% endhighlight %}

Or, in the case of Bunny and Spoon, using the Mapbox API to add the data into the map:

{% highlight JavaScript %}
 map.addSource("markers", {
        "type": "geojson",
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50,
		data: 'wp-admin/admin-ajax.php?action=get_geojson'
    });
{% endhighlight %}

And then, include the function to handle the request into your theme's `functions.php` file:

{% highlight PHP %}
<?php

add_action('wp_ajax_get_geojson', 'get_geojson');
add_action('wp_ajax_nopriv_get_geojson', 'get_geojson');

function get_geojson() {
	$return = '{ "type": "FeatureCollection", "features": [';
	$comma = "";
	
	$myposts = get_posts();
	
	foreach ( $myposts as $post ){
	
		$locationPos = strpos($post->post_content,'[location: (');
		if($locationPos !== false):
			// gets the lat and long coords from the post
			$coords = substr($post->post_content, $locationPos + 12, stripos($post->post_content,')',$locationPos) - $locationPos - 12 );
			$postContent = str_replace('[location: ('.$coords.')]', '', $post->post_content);
	
		$return = $return . $comma;
		$comma = ",";
		
		$return = $return .' { "type": "Feature", "properties": {';
		$return = $return .'"title":' . json_encode($post->post_title).',';
		$return = $return .'"excerpt": ' . json_encode($post->post_excerpt) . ',';
		$return = $return .'"description": ' . json_encode($postContent) . ',';
		$return = $return .'"link":' . json_encode(get_permalink($post->ID)) . ' }, "geometry": { "type": "Point",';
		$return = $return .'"coordinates": [' . $coords . ' ] } }';
		endif;
	}
	$return = $return . ']}';
	echo $return;
}
?>
{% endhighlight %}

And BOOM! It works!

Check out [Bunny and Spoon](http://bunnyandspoon.com) for more food and less code.
