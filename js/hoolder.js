  /* Slick Carousel */   
$(document).on('ready', function() {
  $(".responsive").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });
});
  /* Navbar Animation Control */
$(document).ready(function(){
  // Load fadeInDown Animation when page opened for first time
  // So! when scrolled for first time, there's no "fadeInDown" Animation
  $('.first-time').addClass("fadeInDown");
  $("img").unveil();
});
// Navbar hidden when Scroll
$(window).scroll(function() {
    if ($(this).scrollTop()>420)
     {
        $('.navbar-fixed-top').addClass("sticky-header");
        $('.brand-logo').removeClass("fadeInDown").addClass("fadeOutUp");
        $('.brand-categories').removeClass('fadeOutDown hidden').addClass("fadeInUp");
          // Click Function
        $(".navbar-brand-collapse").click(function(){
          var $this = $(this);
          if($this.hasClass("hide-categories")){
            $(".brand-categories").html('<i class="fa fa-bars"></i> All Categories');
            $(".header-third").removeClass("collapse-header");
            $this.removeClass("hide-categories");
          }
          else{
            $(".brand-categories").html('<i class="fa fa-bars"></i> Hide Categories');
            $(".header-third").addClass("collapse-header");
            $this.addClass("hide-categories");
          }
        });
     }
    else
     {
      $('.navbar-fixed-top').removeClass("sticky-header");
      $('.brand-logo').removeClass("fadeOutUp").addClass("fadeInDown");
      $('.brand-categories').removeClass('fadeInUp').addClass("fadeOutDown");
     }
 });

// Image Hover Zoom
// Initiate the plugin and pass the id of the div containing gallery images
$("#zoom_03").elevateZoom({
  gallery:'gallery_01', 
  cursor: 'pointer', 
  galleryActiveClass: 'active', 
  imageCrossfade: true,
  zoomWindowFadeIn: 500,
  zoomWindowFadeOut: 500,
  lensFadeIn: 500,
  lensFadeOut: 500
}); 

//pass the images to Fancybox
$("#zoom_03").bind("click", function(e) {  
  var ez =   $('#zoom_03').data('elevateZoom'); 
  $.fancybox(ez.getGalleryList());
  return false;
});
