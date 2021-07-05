function get(e){
    return document.getElementById(e);
}
var jsFile = document.createElement("script");
jsFile.src = "js/sw2.js";  // it can be path also  "{themes('/scripts/homePage.js')}"
document.body.appendChild(jsFile);

function value(e){
    return get(e).value;
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
function load(e){
    
}
function closeload(e){
    
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
    redirectTo('dashboard');
})
function setUserToken(token){
    user.token = token;
    return setitem('usertoken',token)
}
function httpPost(requrl,reqbody){
    if(window.location.origin=='http://localhost'){
           var prefix ='http://localhost/falconley';
       }
       else {
            var prefix ='https://phalconwise.herokuapp.com';
        //var prefix = "https://begetmusic.com/sorosoke/";
     }
    // console.log(prefix+requrl);
    // return  fetch(prefix+requrl,body)
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
       else {
            var prefix ='https://phalconwise.herokuapp.com';
        //var prefix = "https://begetmusic.com/sorosoke/";
     }
    // console.log(prefix+requrl);
    // return  fetch(prefix+requrl,body)
    var url = prefix+requrl;
    return  fetch(url, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer '+user.token,
            'Content-Type': 'application/json'
        }),
    });
    
           
  
  
}
function pref(){
    if(window.location.origin=='http://localhost'){
         var prefy ='http://localhost/falconley/';

     }
     else {
        //var prefix ='../backend/budgetapp/'
       var prefy ='https://phalconwise.herokuapp.com/';
   }
   return prefy;
}
function emailval(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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

