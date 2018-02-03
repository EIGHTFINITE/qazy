# Qazy

A complete rewrite of Qazy. Lazy loading without any negative SEO impact.

## How to use

There's a few different ways to add Qazy to you page. The easiest method, not requiring any configuration, is to add the script to the end of the body. While not recommended, you can also add the script to the head and have it work perfectly with minimal configuration. Beyond those methods, you can configure exactly how Qazy functions by overriding variables and functions.

### No configuration needed

Simply add the qazy script to the end of the body to have it just work.

    <!DOCTYPE html>
    <html>
      <head>
        <!-- Your regular head contents -->
      </head>
      <body>
        <!-- Your regular body contents -->
        <script src="qazy.js"></script>
      </body>
    </html>

### Script in head

If your usecase requires you to add the script to the head you can still make the script work perfectly with minimal configuration. Setting the interval variable will allow Qazy to detect images created after it.

    <!DOCTYPE html>
    <html>
      <head>
        <!-- Your regular head contents -->
        <script>window.qazy={};qazy.interval=1</script>
        <script src="qazy.js"></script>
      </head>
      <body>
        <!-- Your regular body contents -->
      </body>
    </html>

### Configure to your exact needs

Want to control exactly how Qazy functions? Override variables and functions and bend Qazy to your will.

    <!DOCTYPE html>
    <html>
      <head>
        <!-- Your regular head contents -->
      </head>
      <body>
        <!-- Your regular body contents -->
        <script>
          function myListOfElements() {
              return document.querySelectorAll("img[data-qazy][data-qazy='true']");
          }
          window.qazy = {};
          qazy.preventSetup = true;
          qazy.img = "https://example.com/default.png";
          qazy.elems = myListOfElements();
          qazy.autoHide = function() {
              qazy.lazyLoad(qazy.elems, true);
          }
          callWhenReady = function(){
              qazy.setup();
          }
        </script>
        <script src="qazy.js"></script>
        <script>
          function createMoreImages() {
              var image1 = document.createElement("img");
              var image2 = document.createElement("img");
              image1.src = "https://example.com/01.png";
              image2.src = "https://example.com/02.png";
              document.body.appendChild(image1);
              document.body.appendChild(image2);
              return [image1, image2];
          }
          qazy.elems = Array.prototype.slice.call(qazy.elems).concat(createMoreImages());
          callWhenReady();
        </script>
      </body>
    </html>
