import{a as oe,b as ne,c as se}from"./chunk-FTP6EKWL.js";import{A as ie,B as re,a as T,b as N,d as B,g as q,h as L,k as H,m as C,n as J,o as W,q as K,s as X,t as Z,v as $,w as ee,x as te}from"./chunk-NOFO4MTN.js";import{$ as G,Y as z,_ as D,ba as Q,ca as U}from"./chunk-ZWODD56P.js";import{n as Y}from"./chunk-T5U6POZL.js";import{c as O}from"./chunk-VIDF4ZC3.js";import{u as j}from"./chunk-JALGS62Q.js";import{$b as E,Gb as c,Mb as p,Pb as i,Q as P,Qb as t,Rb as m,Vb as M,_b as x,dc as A,ec as R,fc as I,gb as o,hb as _,ic as g,jc as n,lc as k,nc as V,tb as S,ua as h,va as y,wa as b,xa as F,zb as w}from"./chunk-IK46I2X3.js";var v=class{static isEmptyInputValue(s){return s==null||s.length===0}static mustMatch(s,l){return d=>{let a=d.get(s),r=d.get(l);if(!a||!r||(r.hasError("mustMatch")&&(delete r.errors.mustMatch,r.updateValueAndValidity()),this.isEmptyInputValue(r.value)||a.value===r.value))return null;let u={mustMatch:!0};return r.setErrors(u),u}}};var me=["resetPasswordNgForm"],le=()=>["/sign-in"];function de(e,s){if(e&1&&(i(0,"fuse-alert",10),n(1),t()),e&2){let l=E();c("appearance","outline")("showIcon",!1)("type",l.alert.type)("@shake",l.alert.type==="error"),o(),k(" ",l.alert.message," ")}}function ce(e,s){e&1&&m(0,"mat-icon",15),e&2&&c("svgIcon","heroicons_solid:eye")}function pe(e,s){e&1&&m(0,"mat-icon",15),e&2&&c("svgIcon","heroicons_solid:eye-slash")}function ue(e,s){e&1&&m(0,"mat-icon",15),e&2&&c("svgIcon","heroicons_solid:eye")}function fe(e,s){e&1&&m(0,"mat-icon",15),e&2&&c("svgIcon","heroicons_solid:eye-slash")}function we(e,s){e&1&&(i(0,"mat-error"),n(1," Password confirmation is required "),t())}function ge(e,s){e&1&&(i(0,"mat-error"),n(1," Passwords must match "),t())}function he(e,s){e&1&&(i(0,"span"),n(1," Reset your password "),t())}function ye(e,s){e&1&&m(0,"mat-progress-spinner",18),e&2&&c("diameter",24)("mode","indeterminate")}var ae=(()=>{class e{constructor(l,d){this._authService=l,this._formBuilder=d,this.alert={type:"success",message:""},this.showAlert=!1}ngOnInit(){this.resetPasswordForm=this._formBuilder.group({password:["",C.required],passwordConfirm:["",C.required]},{validators:v.mustMatch("password","passwordConfirm")})}resetPassword(){this.resetPasswordForm.invalid||(this.resetPasswordForm.disable(),this.showAlert=!1,this._authService.resetPassword(this.resetPasswordForm.get("password").value).pipe(P(()=>{this.resetPasswordForm.enable(),this.resetPasswordNgForm.resetForm(),this.showAlert=!0})).subscribe(l=>{this.alert={type:"success",message:"Your password has been reset."}},l=>{this.alert={type:"error",message:"Something went wrong, please try again."}}))}static{this.\u0275fac=function(d){return new(d||e)(_(O),_($))}}static{this.\u0275cmp=S({type:e,selectors:[["auth-reset-password"]],viewQuery:function(d,a){if(d&1&&A(me,5),d&2){let r;R(r=I())&&(a.resetPasswordNgForm=r.first)}},decls:66,vars:16,consts:[["resetPasswordNgForm","ngForm"],["passwordField",""],["passwordConfirmField",""],[1,"flex","min-w-0","flex-auto","flex-col","items-center","sm:flex-row","sm:justify-center","md:items-start","md:justify-start"],[1,"w-full","px-4","py-8","sm:bg-card","sm:w-auto","sm:rounded-2xl","sm:p-12","sm:shadow","md:flex","md:h-full","md:w-1/2","md:items-center","md:justify-end","md:rounded-none","md:p-16","md:shadow-none"],[1,"mx-auto","w-full","max-w-80","sm:mx-0","sm:w-80"],[1,"w-12"],["src","images/logo/logo.svg"],[1,"mt-8","text-4xl","font-extrabold","leading-tight","tracking-tight"],[1,"mt-0.5","font-medium"],[1,"mt-8",3,"appearance","showIcon","type"],[1,"mt-8",3,"formGroup"],[1,"w-full"],["id","password","matInput","","type","password",3,"formControlName"],["mat-icon-button","","type","button","matSuffix","",3,"click"],[1,"icon-size-5",3,"svgIcon"],["id","password-confirm","matInput","","type","password",3,"formControlName"],["mat-flat-button","",1,"fuse-mat-button-large","mt-3","w-full",3,"click","color","disabled"],[3,"diameter","mode"],[1,"text-secondary","mt-8","text-md","font-medium"],[1,"ml-1","text-primary-500","hover:underline",3,"routerLink"],[1,"relative","hidden","h-full","w-1/2","flex-auto","items-center","justify-center","overflow-hidden","bg-gray-800","p-16","dark:border-l","md:flex","lg:px-28"],["viewBox","0 0 960 540","width","100%","height","100%","preserveAspectRatio","xMidYMax slice","xmlns","http://www.w3.org/2000/svg",1,"absolute","inset-0","pointer-events-none"],["fill","none","stroke","currentColor","stroke-width","100",1,"text-gray-700","opacity-25"],["r","234","cx","196","cy","23"],["r","234","cx","790","cy","491"],["viewBox","0 0 220 192","width","220","height","192","fill","none",1,"absolute","-top-16","-right-16","text-gray-700"],["id","837c3e70-6c3a-44e6-8854-cc48c737b659","x","0","y","0","width","20","height","20","patternUnits","userSpaceOnUse"],["x","0","y","0","width","4","height","4","fill","currentColor"],["width","220","height","192","fill","url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"],[1,"relative","z-10","w-full","max-w-2xl"],[1,"text-7xl","font-bold","leading-none","text-gray-100"],[1,"mt-6","text-lg","leading-6","tracking-tight","text-gray-400"],[1,"mt-8","flex","items-center"],[1,"flex","flex-0","items-center","-space-x-1.5"],["src","images/avatars/female-18.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/female-11.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/male-09.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/male-16.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],[1,"ml-4","font-medium","tracking-tight","text-gray-400"]],template:function(d,a){if(d&1){let r=M();i(0,"div",3)(1,"div",4)(2,"div",5)(3,"div",6),m(4,"img",7),t(),i(5,"div",8),n(6," Reset your password "),t(),i(7,"div",9),n(8," Create a new password for your account "),t(),w(9,de,2,5,"fuse-alert",10),i(10,"form",11,0)(12,"mat-form-field",12)(13,"mat-label"),n(14,"Password"),t(),m(15,"input",13,1),i(17,"button",14),x("click",function(){h(r);let f=g(16);return y(f.type==="password"?f.type="text":f.type="password")}),w(18,ce,1,1,"mat-icon",15)(19,pe,1,1,"mat-icon",15),t(),i(20,"mat-error"),n(21," Password is required "),t()(),i(22,"mat-form-field",12)(23,"mat-label"),n(24,"Password (Confirm)"),t(),m(25,"input",16,2),i(27,"button",14),x("click",function(){h(r);let f=g(26);return y(f.type==="password"?f.type="text":f.type="password")}),w(28,ue,1,1,"mat-icon",15)(29,fe,1,1,"mat-icon",15),t(),w(30,we,2,0,"mat-error")(31,ge,2,0,"mat-error"),t(),i(32,"button",17),x("click",function(){return h(r),y(a.resetPassword())}),w(33,he,2,0,"span")(34,ye,1,2,"mat-progress-spinner",18),t(),i(35,"div",19)(36,"span"),n(37,"Return to"),t(),i(38,"a",20),n(39,"sign in "),t()()()()(),i(40,"div",21),b(),i(41,"svg",22)(42,"g",23),m(43,"circle",24)(44,"circle",25),t()(),i(45,"svg",26)(46,"defs")(47,"pattern",27),m(48,"rect",28),t()(),m(49,"rect",29),t(),F(),i(50,"div",30)(51,"div",31)(52,"div"),n(53,"Welcome to"),t(),i(54,"div"),n(55,"our community"),t()(),i(56,"div",32),n(57," Fuse helps developers to build organized and well coded dashboards full of beautiful and rich modules. Join us and start building your application today. "),t(),i(58,"div",33)(59,"div",34),m(60,"img",35)(61,"img",36)(62,"img",37)(63,"img",38),t(),i(64,"div",39),n(65," More than 17k people joined us, it's your turn "),t()()()()()}if(d&2){let r=g(16),u=g(26);o(9),p(a.showAlert?9:-1),o(),c("formGroup",a.resetPasswordForm),o(5),c("formControlName","password"),o(3),p(r.type==="password"?18:-1),o(),p(r.type==="text"?19:-1),o(6),c("formControlName","passwordConfirm"),o(3),p(u.type==="password"?28:-1),o(),p(u.type==="text"?29:-1),o(),p(a.resetPasswordForm.get("passwordConfirm").hasError("required")?30:-1),o(),p(a.resetPasswordForm.get("passwordConfirm").hasError("mustMatch")?31:-1),o(),c("color","primary")("disabled",a.resetPasswordForm.disabled),o(),p(a.resetPasswordForm.disabled?-1:33),o(),p(a.resetPasswordForm.disabled?34:-1),o(4),c("routerLink",V(15,le))}},dependencies:[se,ee,K,H,J,W,te,X,Z,L,q,T,N,B,re,ie,G,z,D,U,Q,ne,oe,j],encapsulation:2,data:{animation:Y}})}}return e})();var Oe=[{path:"",component:ae}];export{Oe as default};
