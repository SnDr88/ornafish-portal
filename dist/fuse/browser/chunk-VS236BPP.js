import{a as f}from"./chunk-SLH6MUXG.js";import{r as k}from"./chunk-I5N2CYA4.js";import{$ as u,I as d,fa as g,la as h,r as o,s as p}from"./chunk-IVC4N5DD.js";var l={production:!0,apiUrl:"https://api-ornafish-bmazhpbvf4bgh0du.westeurope-01.azurewebsites.net"};var i=class{static isTokenExpired(t,e){if(!t||t==="")return!0;let r=this._getTokenExpirationDate(t);return e=e||0,r===null?!0:!(r.valueOf()>new Date().valueOf()+e*1e3)}static _b64decode(t){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r="";if(t=String(t).replace(/=+$/,""),t.length%4===1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(let a=0,c,n,T=0;n=t.charAt(T++);~n&&(c=a%4?c*64+n:n,a++%4)?r+=String.fromCharCode(255&c>>(-2*a&6)):0)n=e.indexOf(n);return r}static _b64DecodeUnicode(t){return decodeURIComponent(Array.prototype.map.call(this._b64decode(t),e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join(""))}static _urlBase64Decode(t){let e=t.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:{e+="==";break}case 3:{e+="=";break}default:throw Error("Illegal base64url string!")}return this._b64DecodeUnicode(e)}static _decodeToken(t){if(!t)return null;let e=t.split(".");if(e.length!==3)throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");let r=this._urlBase64Decode(e[1]);if(!r)throw new Error("Cannot decode the token.");return JSON.parse(r)}static _getTokenExpirationDate(t){let e=this._decodeToken(t);if(!e.hasOwnProperty("exp"))return null;let r=new Date(0);return r.setUTCSeconds(e.exp),r}};var E=(()=>{class s{constructor(){this._authenticated=!1,this._httpClient=h(k),this._userService=h(f)}set accessToken(e){localStorage.setItem("accessToken",e)}get accessToken(){return localStorage.getItem("accessToken")??""}forgotPassword(e){return this._httpClient.post("api/auth/forgot-password",e)}resetPassword(e){return this._httpClient.post("api/auth/reset-password",e)}signIn(e){return this._authenticated?p(()=>new Error("User is already logged in.")):this._httpClient.post(`${l.apiUrl}/api/users/login`,e).pipe(u(r=>(localStorage.setItem("accessToken",r.token),this._authenticated=!0,this._userService.user=r.user||{email:e.email},o(r))))}signInUsingToken(){return console.log("[AuthService] signInUsingToken() gestart met token:",this.accessToken),this._httpClient.post(`${l.apiUrl}/api/auth/sign-in-with-token`,{accessToken:this.accessToken}).pipe(d(()=>(console.warn("[AuthService] Token verificatie faalde"),o(!1))),u(e=>(e.accessToken&&(this.accessToken=e.accessToken,localStorage.setItem("accessToken",e.accessToken),console.log("[AuthService] Token vernieuwd en opgeslagen")),this._authenticated=!0,this._userService.user=e.user,o(!0))))}signOut(){return localStorage.removeItem("accessToken"),this._authenticated=!1,o(!0)}signUp(e){return this._httpClient.post("api/auth/sign-up",e)}unlockSession(e){return this._httpClient.post("api/auth/unlock-session",e)}check(){if(console.log("[AuthService] check() gestart"),this._authenticated)return o(!0);if(!this.accessToken){let e=localStorage.getItem("accessToken");if(console.log("[AuthService] Token uit localStorage:",e),!e)return o(!1);this.accessToken=e}return i.isTokenExpired(this.accessToken)?o(!1):this.signInUsingToken()}static{this.\u0275fac=function(r){return new(r||s)}}static{this.\u0275prov=g({token:s,factory:s.\u0275fac,providedIn:"root"})}}return s})();export{l as a,i as b,E as c};
