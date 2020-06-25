---
title: How to find ghost CSS elements
published: true
description: CSS styles to help you find ghost or invisible spacing on your HTML
tags: 'CSS, HTML'
cover_image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--TM8JhiDk--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/6jddl1p3v9j2tl4ugjm6.png
canonical_url: 'https://dev.to/david_ojeda/how-to-find-ghost-css-elements-1h00'
type_of: article
id: 30788
published_at: 2018-05-11
slug: how-to-find-ghost-css-elements-1h00
path: /david_ojeda/how-to-find-ghost-css-elements-1h00
url: 'https://dev.to/david_ojeda/how-to-find-ghost-css-elements-1h00'
comments_count: 2
public_reactions_count: 68
page_views_count: 3734
published_timestamp: '2018-05-11T16:14:30Z'
positive_reactions_count: 68
tag_list:
  - css
  - html
---

I recently came across a bug on our landing page which caused a weird blank space overflow on the right side:

![Landing page with extra white space on right side][landing-page-bug]

I looked for a couple of hours trying to find any CSS spacing causing it, or some wrong element on my HTML, but couldn't find anything out of place. The blank space wasn't even inside the &lt;html&gt; element of the page 🧐

I then [stumbled upon this post](http://wernull.com/2013/04/debug-ghost-css-elements-causing-unwanted-scrolling/) and rapidly found the problem. This blog post suggests some CSS styles to make ghost elements visible 👻:

```css
* {
  background: #000 !important;
  color: #0f0 !important;
  outline: solid #f00 1px !important;
}
```

Now, I could find the section that was causing the problem:

![Landing page with ghost elements visible][landing-page-ghost]

In the end, it was a matter of fixing some mismatching HTML elements.

Would've had this CSS styles helping me debug from the beginning, could've saved me a couple hours of work 🤦🏻‍♂️


[landing-page-bug]: https://thepracticaldev.s3.amazonaws.com/i/o1q1hlen9lqdy7dsc7zz.png "Landing page with extra white space on right side"

[landing-page-ghost]: https://thepracticaldev.s3.amazonaws.com/i/909z7bing8w3g1u0ssmf.png "Landing page with ghost elements visible"
