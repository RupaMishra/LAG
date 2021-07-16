 $(window).scroll(function(){
      if ($(this).scrollTop() > 135) {
          $('.navbar_div').addClass('stricky-fixed fadeInDown animated');
      } else {
          $('.navbar_div').removeClass('stricky-fixed fadeInDown animated');
      }
  });