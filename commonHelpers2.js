import{c as r,l as n,s as c,b as h,r as o,n as y,d as E,e as _,f as P,g as k,h as T}from"./assets/refs-940be7fb.js";import{a as u,i as f,S as C}from"./assets/vendor-95a3a663.js";async function w(e){try{return(await u({url:`${r.BASE_URL}/products`,method:"GET",header:{"Content-Type":"aplication/json"},params:e})).data}catch(t){return t}}async function b(e){try{return(await u({url:`${r.BASE_URL}/products/${e}`,method:"GET",header:{"Content-Type":"aplication/json"}})).data}catch(t){console.log(t)}}async function R(e){try{let t=null;return e&&(t={limit:e}),(await u({url:`${r.BASE_URL}/products/popular`,method:"GET",header:{"Content-Type":"aplication/json"},params:t})).data}catch(t){return t}}async function S(){try{return(await u({url:`${r.BASE_URL}/products/discount`,method:"GET",header:{"Content-Type":"aplication/json"}})).data}catch(e){return e}}async function A(){try{return(await u({url:`${r.BASE_URL}/products/categories`,method:"GET",header:{"Content-Type":"aplication/json"}})).data}catch(e){return e}}const i=n(r.LOCAL_CART_KEY)??[],m=async e=>{const{id:t}=e.target.closest(".js-card").dataset,a=await b(t);i.some(({_id:l})=>l===a._id)||(i.push(a),c(r.LOCAL_CART_KEY,i),e.target.closest(".js-cart").innerHTML=`<button class="card-btn" type="button">
                    <svg class="card-btn-icon-check" width="18" height="18">
                        <use href="${h}#check"></use>
                    </svg>
                </button>`,f.success({title:"OK",message:"Added to cart!"}))},M=async e=>{const{id:t}=e.target.closest(".js-card").dataset,a=await b(t);i.some(({_id:l})=>l===a._id)||(i.push(a),c(r.LOCAL_CART_KEY,i),e.target.closest(".js-cart").innerHTML=`<button class="popular-card-btn" type="button">
                    <svg class="popular-icon-check" width="18" height="18">
                      <use href="${h}#check"></use>
                    </svg>
                </button>`,f.success({title:"OK",message:"Added to cart!"}))},g=e=>{const t=n(r.LOCAL_CART_KEY)??[];return e.map(s=>t.some(({_id:p})=>p===s._id)?(s.isChecked=!0,s):(s.isChecked=!1,s))},d=async e=>{const t=await w(e);if(!t.results.length){y(o.productList);return}c(r.PAGES,{page:t.page,perPage:t.perPage,totalPages:t.totalPages});const a=g(t.results);o.productList.innerHTML=E(a)},O=e=>{e.preventDefault(),e.target.closest(".js-cart")&&m(e),e.target.classList.contains("js-info")&&openModal(e)};o.productList.addEventListener("click",O);new C({select:"#abcField",settings:{placeholderText:"A to Z",showSearch:!1}});const U=async()=>{const e=await A(),t=_(e);o.categoryField.insertAdjacentHTML("beforeend",t),new C({select:"#categoryField",settings:{placeholderText:"Categories",showSearch:!1}})};U();let L=[];const v=[{value:"alphabetical",label:"A to Z"},{value:"reverse-alphabetical",label:"Z to A"},{value:"cheap",label:"Cheap"},{value:"expensive",label:"Expensive"},{value:"popular",label:"Popular"},{value:"not-popular",label:"Not popular"},{value:"",label:"Show all"}],K=async()=>{L=[...await A(),"Show_all"];const t=_(L);o.categoryField.insertAdjacentHTML("beforeend",t),o.abcField.innerHTML=P(v)},j=e=>{const t=e.target.value,a=n(r.LOCAL_QUERY_KEY);t==="Show_all"?a.category=null:a.category=t,c(r.LOCAL_QUERY_KEY,a);const s=n(r.LOCAL_QUERY_KEY);d(s)},Q=e=>{e.preventDefault();const t=o.searchField.value,a=n(r.LOCAL_QUERY_KEY);t?a.keyword=t:a.keyword=null,c(r.LOCAL_QUERY_KEY,a);const s=n(r.LOCAL_QUERY_KEY);d(s)},F=async e=>{const t=e.target.value,a=n(r.LOCAL_QUERY_KEY);a.sort=t,c(r.LOCAL_QUERY_KEY,a);const s=n(r.LOCAL_QUERY_KEY),l=s.sort,p=$(l),Y=await D(s,p);H(Y)},$=e=>{let t={};switch(e){case"alphabetical":t="&byABC=true";break;case"reverse-alphabetical":t="&byABC=false";break;case"cheap":t="&byPrice=true";break;case"expensive":t="&byPrice=false";break;case"popular":t="&byPopularity=false";break;case"not-popular":t="&byPopularity=true";break}return t};async function D(e,t){try{return(await u({url:`${r.BASE_URL}/products?${t}`,method:"GET",header:{"Content-Type":"application/json"},params:e})).data}catch(a){return a}}const H=async e=>{if(!e.results.length){y(o.productList);return}c(r.PAGES,{page:e.page,perPage:e.perPage,totalPages:e.totalPages}),o.productList.innerHTML=E(e.results)},B=e=>{if(e.target.value===""){const t=n(r.LOCAL_QUERY_KEY);t.keyword=null,c(r.LOCAL_QUERY_KEY,t);const a=n(r.LOCAL_QUERY_KEY);d(a)}};o.form.addEventListener("submit",Q);o.categoryField.addEventListener("change",j);o.abcField.addEventListener("change",F);o.searchField.addEventListener("input",B);const G=async()=>{const e=await R();if(!e.length){notFoundMarkup(o.popularProductList);return}const t=g(e),a=k(t);o.popularProductList.insertAdjacentHTML("beforeend",a)},q=e=>{e.preventDefault(),e.target.closest(".js-cart")&&M(e),e.target.classList.contains("js-info")&&openModal(e)};o.popularProductList.addEventListener("click",q);const x=2,I=e=>{const t=[];for(let a=0;a<x;a++){const s=Math.floor(Math.random()*e.length);t.push(e[s])}return t},N=async()=>{const e=await S(),t=I(e),a=g(t),s=T(a);o.dicsProd.innerHTML=s},Z=e=>{e.preventDefault(),e.target.closest(".js-cart")&&m(e),e.target.classList.contains("js-info")&&openModal(e)};o.discProdList.addEventListener("click",Z);c(r.LOCAL_QUERY_KEY,r.INIT_QUERY);const V=n(r.LOCAL_QUERY_KEY)??[];K();d(V);G();N();
//# sourceMappingURL=commonHelpers2.js.map
