Meteor.libMethods = {

    eraseCookie(name) {
      document.cookie = name + '=; Max-Age=0'
    },
    setCRAACookieAcceptance(cname) {
      // console.log(cname);

      let
        name = cname + "=",
        decodedCookie = decodeURIComponent(document.cookie),
        ca = decodedCookie.split(';'),
        hasAccepted = false;

      for(let i = 0; i <ca.length; i++) {        
        
        let c = ca[i];
        // console.log(c)

        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {          
          let valueString = c.substring(name.length, c.length);
          if(valueString.includes("YES")) {
            hasAccepted = true;
          }
        }
      }

      if(!hasAccepted) {
      
        // toastr.options = {
        //   timeOut: 0,
        //   extendedTimeOut: 0,
        //   tapToDismiss: false
        // };

        // toastr.success('We use cookies on this website to offer you a better browsing experience. <a href="/terms" title="View our Cookie Policy">Find out more on how we use cookies</a>. By clicking “Accept Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.','We use cookies',{
        // toastr.success('We use cookies on this website to offer you a better browsing experience. These cookies are completely safe and secure and will never contain any sensitive informaion. <a href="/terms" title="View our Cookie Policy">Find out more on how we use cookies</a>. By clicking “Accept Cookies”, you give us your consent to store and access Cookies as described in our Privacy Policy.','We use cookies',{
        toastr.info('We use cookies on this website to offer you a better browsing experience. These cookies are completely safe and secure and will never contain any sensitive information. By clicking “Accept Cookies” and continuing to use our site, you understand that we use cookies to improve your experience and collect additional website usage data. Learn more in our <a href="/terms" title="View our Cookie Policy">Privacy Policy.</a>','We use cookies',{
            closeButton: true,
            positionClass: "toast-bottom-full-width",
            closeHtml: '<button class="btn-accept-cookies">Accept Cookies</button>',
            onclick: null,
            tapToDismiss: false,
            timeOut: 0,
            extendedTimeOut: 0,
            onShown: function() {
                // $("#toast-container").show();

                $('.btn-accept-cookies').closest('#toast-container').addClass('toast-accept-cookies');     
                
                $('.btn-accept-cookies').on("click", function() {
                  document.cookie = '_CRAA_CA='+'YES:'+new Date().getTime()+'; expires=' + new Date(18016776000 * 1000).toUTCString();
                  $("#toast-container").remove();
                })

                $("#toast-container.toast-accept-cookies").show();
            }
        });        
      }
      return "";
    }     
};
