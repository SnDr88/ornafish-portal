import{a as ae,b as se}from"./chunk-KTLWWTMO.js";import{a as le}from"./chunk-MF7CZ5XY.js";import{A as oe,D as ne,E as re,a as R,b as B,d as T,h as L,i as G,l as J,n as W,p as $,q as K,t as X,v as Z,w as ee,y as te,z as ie}from"./chunk-OUAE2JKC.js";import{$ as P,ba as q,ca as D,ea as Q,fa as z}from"./chunk-SBROIB6A.js";import{p as H}from"./chunk-NNSOX7CY.js";import{c as Y}from"./chunk-VS236BPP.js";import{a as O}from"./chunk-SLH6MUXG.js";import{b as j,d as N,e as V}from"./chunk-FFHNBJAX.js";import"./chunk-I5N2CYA4.js";import{$b as b,Cb as f,Kb as m,Rb as u,Vb as t,Wb as e,Xb as s,fc as y,hc as F,jb as r,kb as c,lc as C,mc as M,nc as E,qc as w,rc as n,sc as I,tc as A,wa as v,wb as k,wc as U,xa as x,ya as S,za as _}from"./chunk-IVC4N5DD.js";var de=["unlockSessionNgForm"],ce=()=>["/sign-out"];function ue(i,p){if(i&1&&(t(0,"fuse-alert",9),n(1),e()),i&2){let o=F();m("appearance","outline")("showIcon",!1)("type",o.alert.type)("@shake",o.alert.type==="error"),r(),A(" ",o.alert.message," ")}}function pe(i,p){i&1&&s(0,"mat-icon",15),i&2&&m("svgIcon","heroicons_solid:eye")}function fe(i,p){i&1&&s(0,"mat-icon",15),i&2&&m("svgIcon","heroicons_solid:eye-slash")}function ge(i,p){i&1&&(t(0,"span"),n(1," Unlock your session "),e())}function he(i,p){i&1&&s(0,"mat-progress-spinner",17),i&2&&m("diameter",24)("mode","indeterminate")}var me=(()=>{class i{constructor(o,d,a,l,g){this._activatedRoute=o,this._authService=d,this._formBuilder=a,this._router=l,this._userService=g,this.alert={type:"success",message:""},this.showAlert=!1}ngOnInit(){this._userService.user$.subscribe(o=>{this.name=o.first_name+" "+o.last_name,this._email=o.email,this.unlockSessionForm=this._formBuilder.group({name:[{value:this.name,disabled:!0}],password:["",W.required]})})}unlock(){this.unlockSessionForm.invalid||(this.unlockSessionForm.disable(),this.showAlert=!1,this._authService.unlockSession({email:this._email??"",password:this.unlockSessionForm.get("password").value}).subscribe(()=>{let o=this._activatedRoute.snapshot.queryParamMap.get("redirectURL")||"/signed-in-redirect";this._router.navigateByUrl(o)},o=>{this.unlockSessionForm.enable(),this.unlockSessionNgForm.resetForm({name:{value:this.name,disabled:!0}}),this.alert={type:"error",message:"Invalid password"},this.showAlert=!0}))}static{this.\u0275fac=function(d){return new(d||i)(c(j),c(Y),c(te),c(N),c(O))}}static{this.\u0275cmp=k({type:i,selectors:[["auth-unlock-session"]],viewQuery:function(d,a){if(d&1&&C(de,5),d&2){let l;M(l=E())&&(a.unlockSessionNgForm=l.first)}},decls:60,vars:13,consts:[["unlockSessionNgForm","ngForm"],["passwordField",""],[1,"flex","min-w-0","flex-auto","flex-col","items-center","sm:flex-row","sm:justify-center","md:items-start","md:justify-start"],[1,"w-full","px-4","py-8","sm:bg-card","sm:w-auto","sm:rounded-2xl","sm:p-12","sm:shadow","md:flex","md:h-full","md:w-1/2","md:items-center","md:justify-end","md:rounded-none","md:p-16","md:shadow-none"],[1,"mx-auto","w-full","max-w-80","sm:mx-0","sm:w-80"],[1,"w-12"],["src","images/logo/logo.svg"],[1,"mt-8","text-4xl","font-extrabold","leading-tight","tracking-tight"],[1,"mt-0.5","font-medium"],[1,"mt-8",3,"appearance","showIcon","type"],[1,"mt-8",3,"formGroup"],[1,"w-full"],["id","name","matInput","",3,"formControlName"],["id","password","matInput","","type","password",3,"formControlName"],["mat-icon-button","","type","button","matSuffix","",3,"click"],[1,"icon-size-5",3,"svgIcon"],["mat-flat-button","",1,"fuse-mat-button-large","mt-3","w-full",3,"click","color","disabled"],[3,"diameter","mode"],[1,"text-secondary","mt-8","text-md","font-medium"],[1,"ml-1","text-primary-500","hover:underline",3,"routerLink"],[1,"relative","hidden","h-full","w-1/2","flex-auto","items-center","justify-center","overflow-hidden","bg-gray-800","p-16","dark:border-l","md:flex","lg:px-28"],["viewBox","0 0 960 540","width","100%","height","100%","preserveAspectRatio","xMidYMax slice","xmlns","http://www.w3.org/2000/svg",1,"absolute","inset-0","pointer-events-none"],["fill","none","stroke","currentColor","stroke-width","100",1,"text-gray-700","opacity-25"],["r","234","cx","196","cy","23"],["r","234","cx","790","cy","491"],["viewBox","0 0 220 192","width","220","height","192","fill","none",1,"absolute","-top-16","-right-16","text-gray-700"],["id","837c3e70-6c3a-44e6-8854-cc48c737b659","x","0","y","0","width","20","height","20","patternUnits","userSpaceOnUse"],["x","0","y","0","width","4","height","4","fill","currentColor"],["width","220","height","192","fill","url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"],[1,"relative","z-10","w-full","max-w-2xl"],[1,"text-7xl","font-bold","leading-none","text-gray-100"],[1,"mt-6","text-lg","leading-6","tracking-tight","text-gray-400"],[1,"mt-8","flex","items-center"],[1,"flex","flex-0","items-center","-space-x-1.5"],["src","images/avatars/female-18.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/female-11.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/male-09.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],["src","images/avatars/male-16.jpg",1,"h-10","w-10","flex-0","rounded-full","object-cover","ring-4","ring-gray-800","ring-offset-1","ring-offset-gray-800"],[1,"ml-4","font-medium","tracking-tight","text-gray-400"]],template:function(d,a){if(d&1){let l=b();t(0,"div",2)(1,"div",3)(2,"div",4)(3,"div",5),s(4,"img",6),e(),t(5,"div",7),n(6," Unlock your session "),e(),t(7,"div",8),n(8," Your session is locked due to inactivity "),e(),f(9,ue,2,5,"fuse-alert",9),t(10,"form",10,0)(12,"mat-form-field",11)(13,"mat-label"),n(14,"Full name"),e(),s(15,"input",12),e(),t(16,"mat-form-field",11)(17,"mat-label"),n(18,"Password"),e(),s(19,"input",13,1),t(21,"button",14),y("click",function(){v(l);let h=w(20);return x(h.type==="password"?h.type="text":h.type="password")}),f(22,pe,1,1,"mat-icon",15)(23,fe,1,1,"mat-icon",15),e(),t(24,"mat-error"),n(25," Password is required "),e()(),t(26,"button",16),y("click",function(){return v(l),x(a.unlock())}),f(27,ge,2,0,"span")(28,he,1,2,"mat-progress-spinner",17),e(),t(29,"div",18)(30,"span"),n(31,"I'm not"),e(),t(32,"a",19),n(33),e()()()()(),t(34,"div",20),S(),t(35,"svg",21)(36,"g",22),s(37,"circle",23)(38,"circle",24),e()(),t(39,"svg",25)(40,"defs")(41,"pattern",26),s(42,"rect",27),e()(),s(43,"rect",28),e(),_(),t(44,"div",29)(45,"div",30)(46,"div"),n(47,"Welcome to"),e(),t(48,"div"),n(49,"our community"),e()(),t(50,"div",31),n(51," Fuse helps developers to build organized and well coded dashboards full of beautiful and rich modules. Join us and start building your application today. "),e(),t(52,"div",32)(53,"div",33),s(54,"img",34)(55,"img",35)(56,"img",36)(57,"img",37),e(),t(58,"div",38),n(59," More than 17k people joined us, it's your turn "),e()()()()()}if(d&2){let l=w(20);r(9),u(a.showAlert?9:-1),r(),m("formGroup",a.unlockSessionForm),r(5),m("formControlName","name"),r(4),m("formControlName","password"),r(3),u(l.type==="password"?22:-1),r(),u(l.type==="text"?23:-1),r(3),m("color","primary")("disabled",a.unlockSessionForm.disabled),r(),u(a.unlockSessionForm.disabled?-1:27),r(),u(a.unlockSessionForm.disabled?28:-1),r(4),m("routerLink",U(12,ce)),r(),I(a.name)}},dependencies:[le,ie,X,J,$,K,oe,Z,ee,G,L,R,B,T,re,ne,D,P,q,z,Q,se,ae,V],encapsulation:2,data:{animation:H}})}}return i})();var Le=[{path:"",component:me}];export{Le as default};
