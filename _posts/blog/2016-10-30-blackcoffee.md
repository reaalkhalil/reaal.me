---
title: BlackCoffee
category: blog
---
<img src="{{ site.baseurl }}/assets/blog/codesoc/title.jpg" width="100%">

This is a sample website I made for a masterclass I will be giving at Oxford's [CodeSoc](http://codesoc.co.uk/) next week.
The idea is to go through the most important concepts of web development in under two hours.

I will start with a brief introduction on how servers and browsers communicate illustrating the difference between client-side and server-side languages. Then move on to the basics of coding these: HTML, CSS, JS, PHP and a little taste of what Apache is for. I thought about including SQL but that would be difficult to fit in the time.

The class will consist of a mixture of me talking about various aspects of web development and design, and guided interactive bits where the beginners will edit the code in the sample site and see the results.

After going through the code, I will mention various ways of deploying a website. I've grown to love Github Pages for static sites and I've seen plenty of people moving to it, not to mention it's free! AWS is free for the first year and I like how you can get instances with preinstalled tools.

### An aside:
While preparing for this class, I've learnt that Macs come with a built in Apache server! I knew this was the case with Web Sharing back in OSX 7, I thought they removed it but have just learnt it's a terminal command away:
{% highlight bash %}sudo apachectl start{% endhighlight %}
This will start an Apache server on your Mac. 

To use PHP as well which also comes preinstalled (woohoo!), you need to edit Apache's config file: `/etc/apache2/httpd.conf`. Look for `LoadModule php5_module libexec/apache2/libphp5.so` and uncomment that line.

If you want to mess around with .htaccess, directory index and stuff, look for the `DocumentRoot` section of the config file, and change `AllowOverride None` to `AllowOverride All`. Then restart Apache:

{% highlight bash %}sudo apachectl restart{% endhighlight %}

Now if you put your files in `/Library/WebServer/Documents/` you can see them on `localhost` in the browser. Tada!


I've included a zip of the site, it contains four stages of building the site:<br>
1. Plain HTML<br>
2. Styled with CSS<br>
3. Added a slideshow with JS<br>
4. Added a form with PHP.<br>

<a href="/assets/blog/codesoc/blackcoffee.zip" target="_blank" class="file file-zip">blackcoffee.zip</a>
