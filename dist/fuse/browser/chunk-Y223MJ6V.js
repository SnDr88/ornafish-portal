import{c as E}from"./chunk-VIDF4ZC3.js";import{g as C,t as O,u as k}from"./chunk-JALGS62Q.js";import{$b as _,E as l,Gb as v,Mb as m,Pb as n,Q as d,Qb as o,Rb as w,aa as p,ba as f,ca as h,gb as u,hb as s,jc as r,lc as b,m as c,nc as S,tb as x,uc as y,vc as A,zb as g}from"./chunk-IK46I2X3.js";var M=()=>["/sign-in"];function D(t,I){if(t&1&&(r(0),y(1,"i18nPlural")),t&2){let e=_();b(" Redirecting in ",A(1,1,e.countdown,e.countdownMapping)," ")}}function L(t,I){t&1&&r(0," You are now being redirected! ")}var j=(()=>{class t{constructor(e,i){this._authService=e,this._router=i,this.countdown=3,this.countdownMapping={"=1":"# second",other:"# seconds"},this._unsubscribeAll=new c}ngOnInit(){this._authService.signOut(),l(1e3,1e3).pipe(d(()=>{this._router.navigate(["sign-in"])}),f(()=>this.countdown>0),p(this._unsubscribeAll),h(()=>this.countdown--)).subscribe()}ngOnDestroy(){this._unsubscribeAll.next(null),this._unsubscribeAll.complete()}static{this.\u0275fac=function(i){return new(i||t)(s(E),s(O))}}static{this.\u0275cmp=x({type:t,selectors:[["auth-sign-out"]],decls:15,vars:4,consts:[[1,"flex","min-w-0","flex-auto","flex-col","items-center","sm:justify-center"],[1,"w-full","px-4","py-8","sm:bg-card","sm:w-auto","sm:rounded-2xl","sm:p-12","sm:shadow"],[1,"mx-auto","w-full","max-w-80","sm:mx-0","sm:w-80"],[1,"mx-auto","w-56"],["src","images/logo/ornafish-logo.png"],[1,"mt-8","text-center","text-4xl","font-extrabold","leading-tight","tracking-tight"],[1,"mt-0.5","flex","justify-center","font-medium"],[1,"text-secondary","mt-8","text-center","text-md","font-medium"],[1,"ml-1","text-primary-500","hover:underline",3,"routerLink"]],template:function(i,a){i&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),w(4,"img",4),o(),n(5,"div",5),r(6," You have signed out! "),o(),n(7,"div",6),g(8,D,2,4)(9,L,1,0),o(),n(10,"div",7)(11,"span"),r(12,"Go to"),o(),n(13,"a",8),r(14,"sign in "),o()()()()()),i&2&&(u(8),m(a.countdown>0?8:-1),u(),m(a.countdown===0?9:-1),u(4),v("routerLink",S(3,M)))},dependencies:[k,C],encapsulation:2})}}return t})();var U=[{path:"",component:j}];export{U as default};
