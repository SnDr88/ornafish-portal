import{k as c}from"./chunk-JALGS62Q.js";import{$ as l,I as m,ca as k,fa as a,la as o,o as d,r as i,s as f,w as g}from"./chunk-IK46I2X3.js";var _=(()=>{class s{constructor(){this._httpClient=o(c),this._user=new d(1)}set user(t){this._user.next(t)}get user$(){return this._user.asObservable()}get(){return this._httpClient.get("api/common/user").pipe(k(t=>{this._user.next(t)}))}update(t){return this._httpClient.patch("api/common/user",{user:t}).pipe(g(e=>{this._user.next(e)}))}static{this.\u0275fac=function(e){return new(e||s)}}static{this.\u0275prov=a({token:s,factory:s.\u0275fac,providedIn:"root"})}}return s})();var u=class{static isTokenExpired(r,t){if(!r||r==="")return!0;let e=this._getTokenExpirationDate(r);return t=t||0,e===null?!0:!(e.valueOf()>new Date().valueOf()+t*1e3)}static _b64decode(r){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="";if(r=String(r).replace(/=+$/,""),r.length%4===1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(let h=0,p,n,T=0;n=r.charAt(T++);~n&&(p=h%4?p*64+n:n,h++%4)?e+=String.fromCharCode(255&p>>(-2*h&6)):0)n=t.indexOf(n);return e}static _b64DecodeUnicode(r){return decodeURIComponent(Array.prototype.map.call(this._b64decode(r),t=>"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)).join(""))}static _urlBase64Decode(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:{t+="==";break}case 3:{t+="=";break}default:throw Error("Illegal base64url string!")}return this._b64DecodeUnicode(t)}static _decodeToken(r){if(!r)return null;let t=r.split(".");if(t.length!==3)throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");let e=this._urlBase64Decode(t[1]);if(!e)throw new Error("Cannot decode the token.");return JSON.parse(e)}static _getTokenExpirationDate(r){let t=this._decodeToken(r);if(!t.hasOwnProperty("exp"))return null;let e=new Date(0);return e.setUTCSeconds(t.exp),e}};var A=(()=>{class s{constructor(){this._authenticated=!1,this._httpClient=o(c),this._userService=o(_)}set accessToken(t){localStorage.setItem("accessToken",t)}get accessToken(){return localStorage.getItem("accessToken")??""}forgotPassword(t){return this._httpClient.post("api/auth/forgot-password",t)}resetPassword(t){return this._httpClient.post("api/auth/reset-password",t)}signIn(t){return this._authenticated?f("User is already logged in."):this._httpClient.post("api/auth/sign-in",t).pipe(l(e=>(this.accessToken=e.accessToken,this._authenticated=!0,this._userService.user=e.user,i(e))))}signInUsingToken(){return this._httpClient.post("api/auth/sign-in-with-token",{accessToken:this.accessToken}).pipe(m(()=>i(!1)),l(t=>(t.accessToken&&(this.accessToken=t.accessToken),this._authenticated=!0,this._userService.user=t.user,i(!0))))}signOut(){return localStorage.removeItem("accessToken"),this._authenticated=!1,i(!0)}signUp(t){return this._httpClient.post("api/auth/sign-up",t)}unlockSession(t){return this._httpClient.post("api/auth/unlock-session",t)}check(){return this._authenticated?i(!0):this.accessToken?u.isTokenExpired(this.accessToken)?i(!1):this.signInUsingToken():i(!1)}static{this.\u0275fac=function(e){return new(e||s)}}static{this.\u0275prov=a({token:s,factory:s.\u0275fac,providedIn:"root"})}}return s})();export{u as a,_ as b,A as c};
