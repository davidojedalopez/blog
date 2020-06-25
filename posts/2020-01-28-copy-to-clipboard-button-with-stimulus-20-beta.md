---
type_of: article
id: 248182
title: Copy to clipboard with Stimulus 2.0 beta
description: >-
  Stimulus is a JavaScript framework developed by Basecamp, and it
  aims to augment your existing HTML.
published: true
published_at: 2020-01-28
slug: copy-to-clipboard-button-with-stimulus-2-0-beta-1nll
path: /david_ojeda/copy-to-clipboard-button-with-stimulus-2-0-beta-1nll
url: >-
  https://dev.to/david_ojeda/copy-to-clipboard-button-with-stimulus-2-0-beta-1nll
comments_count: 0
public_reactions_count: 19
page_views_count: 226
published_timestamp: '2020-01-28T00:46:41Z'
positive_reactions_count: 19
cover_image: null
tag_list:
  - stimulus
  - javascript
  - webdev
canonical_url: >-
  https://dev.to/david_ojeda/copy-to-clipboard-button-with-stimulus-2-0-beta-1nll
---

<details open>
  <summary>
    Index
  </summary>

  [[toc]]

</details>

[**Stimulus**](https://stimulusjs.org/handbook/introduction) is a JavaScript framework developed by a team at [Basecamp](https://basecamp.com/), and it aims to augment your existing HTML so things work without too much "connecting" code.

Contrary to other frameworks, Stimulus doesn't take over your front-end, so you can add it without too much hassle to your already running app.  

**Its documentation is very clear and digestible**. Included in its handbook is an [example of building a clipboard functionality](https://stimulusjs.org/handbook/building-something-real), which I recommend you go through if you are trying Stimulus for the first time.

Right now we are **replicating** that functionality and adding a couple more things **using a development build** specified in [this Pull Request (PR)](https://github.com/stimulusjs/stimulus/pull/202).

It **includes new APIs that will be released with version 2.0** of the framework, so they are not yet available with the current stable production release.

## What are we building?

A one-time password "copy to clipboard" button what wraps the DOM Clipboard API.

You can access the final working version on [Glitch](https://glitch.com/edit/#!/trapezoidal-seer).

## Starting off

First, we are creating our base HTML where the one-time password will be and the actual button to copy it:

```html
<div>
  <label>
    One-time password:
    <input type="text" value="fbbb5593-1885-4164-afbe-aba1b87ea748" readonly="readonly">
  </label>

  <button>
    Copy to clipboard
  </button>
</div>
```

![Text input with "copy to clipboard button" rendered HTML](https://thepracticaldev.s3.amazonaws.com/i/bu8kact7stjzee0flm5a.png)

This doesn't do anything by itself; we need to add our Stimulus controller.

## The controller definition

In Stimulus, **a controller is a JavaScript object that automatically connects to DOM elements that have certain identifiers**.

Let's define our clipboard controller. The main thing it needs to do? Grab the text on the input field and copy it to the clipboard:

```javascript

(() => {
  const application = Stimulus.Application.start();

  application.register("clipboard", class extends Stimulus.Controller {
    // We'll get to this below
    static get targets() {
      return ['source']
    }

    copy() {
      // Here goes the copy logic 
    }
  });

})();
```

Now, this is a valid controller that doesn't do anything because it's not connected to any DOM element yet.

## Connecting the controller

Adding a `data-controller` attribute to our `div` will enable the connection:

```html
<div data-controller="clipboard">

[...]
```

Remember the `static get targets()` from above? That allows us to **access DOM elements as properties in the controller**. 

Since there is already a `source` target, we can now access any DOM element with the attribute `data-clipboard-target="source"`:

```html
[...]

<input data-clipboard-target="source" type="text" value="fbbb5593-1885-4164-afbe-aba1b87ea748" readonly="readonly">

[...]
```

Also, we need the button to actually do something. We can link the "Copy to clipboard" button to the `copy` action in our controller with another identifier: `data-action="clipboard#copy"`. The HTML now looks like this:

```html
<div data-controller="clipboard">
  <label>
    One-time password:
    <input data-clipboard-target="source" type="text" value="fbbb5593-1885-4164-afbe-aba1b87ea748" readonly="readonly">
  </label>

  <button data-action="clipboard#copy">
    Copy to clipboard
  </button>
</div>
```

Our controller is now automatically connected to the DOM, and clicking the copy button will invoke the `copy` function; let's proceed to write it.

## The copy function

This function is essentially a **wrapper of the DOM Clipboard API**. The logic goes like this:

```javascript
[...]

copy() {
  this.sourceTarget.select();
  document.execCommand('copy');
}

[...]
```

We take the `source` target we defined earlier, our text input that is, select its content, and use the Clipboard API to copy it to our clipboard.

At this point, **the functionality is practically done!** You can press the button and the one-time password is now available for you on your clipboard.

## Moving further

The copy button works now, but we can go further. **What if the browser doesn't support the Clipboard API or JavaScript is disabled?**

If that's the case, we are going to hide the copy button entirely.

## Checking API availability

We can check if the `copy` command is available to us by doing this:

```javascript
document.queryCommandSupported("copy")
```

One of the best places to check this is when the Stimulus controller connects to the DOM. Stimulus gives us some nice **lifecycle callbacks** so we can know when this happens. 

We can create a `connect` function on our controller and it will be invoked whenever this controller connects to the DOM:

```javascript
[...]

connect() {
  if (document.queryCommandSupported("copy")) 
    // Proceed normally
  }
} 

[...]
```

One way to hide/show the copy button depending on the API availability is to initially load the page with the button hidden, and then displaying it if the API is available. 

To achieve this we can rely on CSS:

```css
.clipboard-button {
  display: none;
}

/* Match all elements with .clipboard-button class inside the element with .clipboard--supported class */
.clipboard--supported .clipboard-button {
  display: initial;
}
```

Our button is now hidden from the beginning, and will only be visible when we add the `.clipboard--supported` class to our `div`.

To do it, we modify the connect lifecycle callback. 

Here is where we can start to see major differences from this latest development version. With the actual production version you would need to specify the CSS class in the controller, effectively doing this:

```javascript
[...]

connect() {
  if (document.queryCommandSupported("copy")) 
    this.element.classList.add('clipboard--supported');
  }
} 

[...]
```

**There is a new, better way to achieve it.**

## Classes API

Now, **CSS classes can be actual properties of the controller**. To do so, we need to add some identifiers to our HTML and add a new array to our controller:

```html
<div data-controller="clipboard" data-clipboard-supported-class="clipboard--supported" class="clipboard">

[...]
```

```javascript
[...]

application.register("clipboard", class extends Stimulus.Controller {

[...]

  static classes = ['supported']

  connect() {
    if (document.queryCommandSupported("copy")) 
      this.element.classList.add(this.supportedClass);
    }
  } 
[...]
```

Great! Now we can access our supported class string from our controller with `this.supportedClass`. **This will help keep things loosely coupled.**

The clipboard real-life example from Stimulus' handbook ends here. Now, to show the other newest additions and use the *Classes API* once more, we're adding the following functionality:

- A new style to the "Copy to clipboard" button once it has been clicked
- A refresh interval for the one-time password. This will generate a new password every 2.5 seconds
- A data attribute to keep track of how many times the password has been generated

## Values API

This, along with the *Classes API*, is one of the new additions to Stimulus. Before this API you would need to add arbitrary values to your controller with the Data Map API, that is, adding `data-[identifier]-[variable-name]` to your DOM element, and then parsing that value in your controller. 

This created boilerplate such as getters and setters with calls to `parseFloat()`, `parseInt()`, `JSON.stringify()`, etc. This is how it will work with the *Values API*:

```html
<div data-controller="clipboard" data-clipboard-supporte-class="clipboard--supported" data-clipboard-refresh-interval-value="2500" class="clipboard">

[...]
```

```javascript
[...]

application.register("clipboard", class extends Stimulus.Controller {

[...]

  static values = {
    refreshInterval: Number
  }

  connect() {
    if (document.queryCommandSupported("copy")) 
      this.element.classList.add(this.supportedClass);
    }
    // Access refreshInterval value directly
    this.refreshIntervalValue; // 2500
  } 
[...]
```

**Accessing your controller values is now cleaner since you don't need to write your getters and setters, nor do you need to parse from String to the type you need.**

Moving forward, let's write the one-time password refresh.

## Implementing password generation

We're going to define a new function to create a new random password. [I grabbed this random UUID generator snippet from the internet](https://www.arungudelli.com/tutorial/javascript/how-to-create-uuid-guid-in-javascript-with-examples/):

```javascript
([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
```

Adding it to our Stimulus controller:

```javascript
  connect() {
    if (document.queryCommandSupported("copy")) 
      this.element.classList.add(this.supportedClass);
    }
    if(this.hasRefreshIntervalValue) {
          setInterval(() => this.generateNewPassword(), this.refreshIntervalValue)  
    } 
  } 

  // copy function

  generateNewPassword() {
    this.sourceTarget.value = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }
[...]
```

We use `setInterval` to refresh our password text field each 2500ms since that's the value we defined in the DOM. 

**Our refresh feature is now working!** Some things still missing:
- Add new style when copy button is clicked
- Keep track of how many times a password is generated

Giving all we have learned so far, this is what's need to be done:
- Add a new CSS class to the stylesheet, DOM element, and controller
- Add this new class when the button is clicked, and remove it when the password is refreshed
- Add to a counter when the password refreshes

This is how it will look at the end:

```css 
/* CSS */

.clipboard-button {
 display: none;
}

.clipboard--supported .clipboard-button {
  display: initial;
}
      
.clipboard--success .clipboard-button {
  background-color: palegreen;
}
```

```html
<!-- HTML -->

<div data-controller="clipboard" 
     data-clipboard-refresh-interval-value="2500"
     data-clipboard-supported-class="clipboard--supported" 
     data-clipboard-success-class="clipboard--success"      
     data-clipboard-times-generated-value="1" 
     >
      
      <label>
        One-time password: <input data-clipboard-target="source" type="text" value="fbbb5593-1885-4164-afbe-aba1b87ea748" readonly="readonly">
      </label>
      
      <button data-action="clipboard#copy"               
              class="clipboard-button" >
        Copy to Clipboard
      </button>
            
    </div>
```

```javascript
 // JavaScript

 (() => {
    const application = Stimulus.Application.start()

    application.register("clipboard", class extends Stimulus.Controller {

      static get targets() {
        return ['source']
      }

      static values = {              
        refreshInterval: Number,
        timesGenerated: Number
      }

      static classes = ['supported', 'success'];

      connect() {                 
        if (document.queryCommandSupported("copy")) {
          this.element.classList.add(this.supportedClass);                
        }                            
        if(this.hasRefreshIntervalValue) {
          setInterval(() => this.generateNewPassword(), this.refreshIntervalValue)  
        } 
      }


      copy() {              
        this.sourceTarget.select();
        document.execCommand('copy');
        this.element.classList.add(this.successClass);
      }

      generateNewPassword() {              
        this.sourceTarget.value = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));     
        this.element.classList.remove(this.successClass);
        this.timesGeneratedValue++;
      }                  

      // NEW! Read about it below
      timesGeneratedValueChanged() {              
        if(this.timesGeneratedValue !== 0 && this.timesGeneratedValue % 3 === 0) {
          console.info('You still there?');
        }
      }

    });

 })();
```

Apart from what we've already discussed about the *Values API*, there is also something new: **Value changed callbacks**.

These callbacks are called whenever a value changes, and also once when the controller is initialized. They are connected automatically given we follow the naming convention of `[valueName]ValueChanged()`. 

We use it to log a message each time the password has been refreshed three times, but they can help with state management in a more complex use case. 


## Wrapping up

I've created multiple Stimulus controllers for my daily job, and I must say that I always end up pleased with the results. Stimulus encourages you to keep related code together and, combined with the additional HTML markup required, ends up making your code much more readable.

If you haven't tried it yet, I highly recommend going for it! It offers a different perspective, one of magic 🧙🏻‍♂️. 


Thanks for reading me 👋🏼.



