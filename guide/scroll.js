!function ($) {

  $(function(){

    var $window = $(window)
    var $body   = $(document.body)

    //var navHeight = $('.navbar').outerHeight(true) + 10
      var navHeight = 100;
      
    $body.scrollspy({
      target: '.guidenav',
      offset: navHeight
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })


    // back to top
    setTimeout(function () {
      var $sideBar = $('.guidenav')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            //var offsetTop = 0;
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            //var navOuterHeight = $('.bs-docs-nav').height()
            var navOuterHeight = 0;

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
            //return (this.top = 0)
          }
        , bottom: function () {
            return (this.bottom = $('.bottom-menu').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 0)

})

}(jQuery)