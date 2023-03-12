var api_url = 'http://192.168.0.181'
var base_url = 'http://192.168.0.181/falconley'
function get(e){
    return document.getElementById(e);
}
var scriptfiles = ['js/toast.js',"js/sw2.js","js/moment.js"];
scriptfiles.forEach((script)=>{
    var jsFile = document.createElement("script");
    jsFile.src = script;  // it can be path also  "{themes('/scripts/homePage.js')}"
    document.body.appendChild(jsFile);
})
load();
function value(e){
    return get(e).value;
}
(function () {
    'use strict';
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var isPhantom = (/PhantomJS/).test(navigator.userAgent);
    Object.defineProperties(console, ['log', 'info', 'warn', 'error'].reduce(function (props, method) {
      var _consoleMethod = console[method].bind(console);
      props[method] = {
        value: function MyError () {
          var stackPos = isOpera || isChrome ? 2 : 1;
          var err = new Error();
          if (isIE || isEdge || isPhantom) { // Untested in Edge
            try { // Stack not yet defined until thrown per https://docs.microsoft.com/en-us/scripting/javascript/reference/stack-property-error-javascript
              throw err;
            } catch (e) {
              err = e;
            }
            stackPos = isPhantom ? 1 : 2;
          }
  
          var a = arguments;
          if (err.stack) {
            var st = err.stack.split('\n')[stackPos]; // We could utilize the whole stack after the 0th index
            var argEnd = a.length - 1;
            [].slice.call(a).reverse().some(function(arg, i) {
              var pos = argEnd - i;
              if (typeof a[pos] !== 'string') {
                return false;
              }
              if (typeof a[0] === 'string' && a[0].indexOf('%') > -1) { pos = 0 } // If formatting
              a[pos] += ' \u00a0 (' + st.slice(0, st.lastIndexOf(':')) // Strip out character count
                .slice(st.lastIndexOf('/') + 1) + ')'; // Leave only path and line (which also avoids ":" changing Safari console formatting)
              return true;
            });
          }
          return _consoleMethod.apply(null, a);
        }
      };
      return props;
    }, {}));
  }());
window.addEventListener('load', (event) => {
   window.setTimeout(()=>{
    closeload();
   },2000);
    
var functionString = "componentDidMount"

    try 
    {
        typeof(eval(functionString))
        componentDidMount();
    }
    catch(err){
     //the function does not exist on this page
    }
});
$('.modes').click(function(){
    toggleDarkMode();
    var body = $('body');
    if (!body.hasClass('dark')) {
        //turn on dark
        $('#modeicon').addClass('fa-moon');
        $('#modeicon').removeClass('fa-sun');
    } else {
        //turn on light
        $('#modeicon').removeClass('fa-moon');
        $('#modeicon').addClass('fa-sun');
        
    }
})
function toggleDarkMode(){
    var body = $('body');
    if (!body.hasClass('dark')) {
        body.addClass('dark');
        localStorage.setItem('darkMode', "on");
    } else {
        body.removeClass('dark');
        localStorage.setItem('darkMode', "off");
    }
}
function say(e){
  return  Swal.fire({
        html:e,
        showConfirmButton:false,
        showCancelButton:false,
        showCloseButton:true,
        allowOutsideClick:true,
    
    })
}

function inform(text,type,time){
    Swal.fire({
        icon:type ? type:'',
        html:text,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:false,
        timer: time ? 5000 : false
      })
}
function load(e){
    if(e){
        var text = e;
    }
    else {
        var text = '';
    }

    var loader = `<div class="loadscreen" id="loadscreen">
        <div class="loadcontent">
            <img src="img/logos/load.svg"/>
            ${text}
        </div>
    </div>`;
    var loader = `<div class="loadscreen" id="loadscreen">
        <div class="loadcontent">
        <div class="sk-fold">
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
      </div>
      ${text}
        </div>
    </div>`;
    
    $('body').append(loader);
}
$('.logout').click(function(){
    setUserToken('');
    redirectTo("login");
})
function closeload(){
    $('.loadscreen').hide(100);
}
function show(id){
    get(id).style.display='block';
}
function hide(id){
    get(id).style.display='none';
}
function login(){
    window.location.href="login";
}
function redirectTo(url){
    window.location.href=url;
}
const user = {
    "token":""
};
let token = getitem('usertoken');
if(token){
    user.token = token;
    setitem('usertoken',token)
}
$('.home').click(function(){
    redirectTo('index');
})
function setUserToken(token){
    user.token = token;
    return setitem('usertoken',token)
}
function httpPost(requrl,reqbody){
    if(window.location.origin=='http://localhost'){
           var prefix ='http://localhost/falconley';
       }
       else if(window.location.origin==api_url){
           var prefix = base_url;
       }
       else {
            var prefix ='https://phalcone.herokuapp.com';
        //var prefix = "https://begetmusic.com/sorosoke/";
     }
    var prefix ='https://phalcone.herokuapp.com';
    //var prefix ='http://localhost/falconley';
    // console.log(prefix+requrl);
    // return  fetch(prefix+requrl,body)
    // alert(prefix);
    var url = prefix+requrl;
    return  fetch(url, {
        method: 'post',
        headers: new Headers({
            'Authorization': user.token,
            'Content-Type': 'application/json'
        }),
        body: reqbody
    });
    
           
  
  
}

function http(requrl){
    if(window.location.origin=='http://localhost'){
           var prefix ='http://localhost/falconley';
       }
       else if(window.location.origin==api_url){
        var prefix = base_url;
    }
       else {
            var prefix ='https://phalcone.herokuapp.com';
        //var prefix = "https://begetmusic.com/sorosoke/";
     }
    // console.log(prefix+requrl);
    // return  fetch(prefix+requrl,body)
    var url = prefix+requrl;
    return  fetch(url, {
        method: 'get',
        headers: new Headers({
            'Authorization':user.token,
            'Content-Type': 'application/json'
        }),
    });
    
           
  
  
}
function response(data){
    closeload();
    if(data.code==403){
        inform('Session expired, Please login');
        redirectTo('login');
        return false;
    }
    else if(data.code==203) {
        inform(data.text,'danger');
        return false;
    }
    else if(data.code==200){
        return data;
    }
    else {
       inform(data.text,'danger');
        return false;
    }
}
function toast(message,type){
    new Toast({
        message: message,
        type: type ? 'message' : type
      });
}
function pref(){
    if(window.location.origin=='http://localhost'){
         var prefy ='http://localhost/falconley/';

     }
     else {
        //var prefix ='../backend/budgetapp/'
       var prefy ='https://phalcone.herokuapp.com/';
   }
   return prefy;
}
function emailval(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function valnumber(number){
    return /^\d*$/.test(number);
}
function setitem(name,value){
    return localStorage.setItem(name,value);
 }
 function getitem(name){
    if(localStorage.getItem(name)==undefined||localStorage.getItem(name)==null||localStorage.getItem(name)==""){
        return false;
    }
    else {
        return localStorage.getItem(name);
    }
 }

 if(window.location.origin!='http://localhost'){

    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/60e92c84649e0a0a5ccb796f/1fa7dbq5k';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    
    var jsFile = document.createElement("script");
    jsFile.src = "https://scripts.simpleanalyticscdn.com/latest.js";  // it can be path also  "{themes('/scripts/homePage.js')}"
    document.body.appendChild(jsFile);
}
