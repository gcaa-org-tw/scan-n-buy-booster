(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{248:function(t,e,n){var content=n(258);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(53).default)("85f4b3ec",content,!0,{sourceMap:!1})},257:function(t,e,n){"use strict";var r=n(248);n.n(r).a},258:function(t,e,n){(e=n(52)(!1)).push([t.i,".step-button.forbid[data-v-52bcaf88]{cursor:not-allowed;opacity:.5}",""]),t.exports=e},260:function(t,e,n){"use strict";var r={props:{disabled:{type:Boolean,default:!1},to:{type:String,default:""},primary:{type:Boolean,default:!1}},computed:{buttonClass:function(){var t=[this.disabled?"forbid":"pointer"];return this.primary?t.push("white","bg-green"):t.push("green","bg-white"),t}},methods:{handleClick:function(t){!this.disabled&&this.to&&this.$router.push(this.to),this.$emit("click",t)}}},c=(n(257),n(42)),component=Object(c.a)(r,(function(){var t=this.$createElement;return(this._self._c||t)("button",{staticClass:"step-button ba br2 b--green ph3 pv2 tc w-100",class:this.buttonClass,attrs:{disabled:this.disabled},on:{click:this.handleClick}},[this._t("default")],2)}),[],!1,null,"52bcaf88",null);e.a=component.exports},262:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r={created:function(){this.$store.state.barcode||this.$router.push("/create-item/scan")}}},275:function(t,e,n){"use strict";var r=n(42),component=Object(r.a)({},(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"vertical-step min-vh-100 w-100 flex flex-column justify-between"},[e("div",{staticClass:"vertical-step__head"},[this._t("head")],2),e("div",{staticClass:"vertical-step__content pv3"},[this._t("default")],2),e("div",{staticClass:"vertical-step__tail"},[this._t("tail")],2)])}),[],!1,null,null,null);e.a=component.exports},280:function(t,e,n){var content=n(334);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(53).default)("b6c76ac2",content,!0,{sourceMap:!1})},333:function(t,e,n){"use strict";var r=n(280);n.n(r).a},334:function(t,e,n){(e=n(52)(!1)).push([t.i,".company__label[data-v-40bdea40]{width:5.5rem;color:grey}.company__value[data-v-40bdea40]{width:calc(100% - 5.5rem)}",""]),t.exports=e},396:function(t,e,n){"use strict";n.r(e);n(109),n(55),n(35),n(26),n(65),n(54);var r=n(8),c=(n(66),n(12)),o=n(84),l=n(156),m=n(262),d=n(275),f=n(260),h=n(110);function v(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}var _={components:{VerticalStep:d.a,StepButton:f.a},mixins:[m.a],data:function(){return{name:"",id:"",hasName:!1,isExisted:!1,isLoading:!1,origName:"",hasMultipleName:!1}},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(e){Object(c.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(o.b)(["barcode","companyInfo","hasMultipleCompany"]),{allowNext:function(){return this.name}}),watch:{name:function(){this.updateCompany()},origName:function(){this.updateCompany()}},created:function(){this.companyInfo?(this.name=this.companyInfo.name,this.hasName=!!this.name,this.id=this.companyInfo.id):this.getCompany()},methods:{enableMultipleName:function(){var t=this;this.origName=this.name,this.name="",this.$store.commit(l.MUTATIONS.ENABLE_MULTIPLE_COMPANY),this.$nextTick((function(){t.$refs.name&&t.$refs.name.focus()}))},updateCompany:function(){this.name&&this.$store.commit(l.MUTATIONS.SET_COMPANY,{name:this.name,origName:this.origName,id:this.id})},crawlCompany:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=encodeURIComponent(t.barcode),r=null,e.prev=2,e.next=5,Object(h.a)("/grocery/".concat(n));case 5:r=e.sent,e.next=12;break;case 8:return e.prev=8,e.t0=e.catch(2),console.error(e.t0),e.abrupt("return",!1);case 12:if(r.data.success){e.next=15;break}return console.error("Crawl company failed because ".concat(r.data.reason)),e.abrupt("return",!1);case 15:return(data=r.data.data).name=data.name||data.rawName,t.companyInfo||(t.name=data.name,t.id=data.id,t.$store.commit(l.MUTATIONS.SET_COMPANY,data)),e.abrupt("return",!0);case 19:case"end":return e.stop()}}),e,null,[[2,8]])})))()},getCacheCompany:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,c,o,data,m,d;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=encodeURIComponent(t.barcode),r="".concat("https://thaubing.gcaa.org.tw","/json/product/").concat(n),c=t.$auth.user["https://ddio.io/meta-key"],o=null,e.prev=4,e.next=7,t.$axios.get(r,{headers:{"x-thaubing-api-key":c}});case 7:o=e.sent,e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(4),console.error(e.t0),e.abrupt("return",!1);case 14:if(o.data){e.next=16;break}return e.abrupt("return",!1);case 16:return data=o.data,m=data.corp_id,d=data.corp_name,t.id=m,t.name=d,d&&t.$store.commit(l.MUTATIONS.SET_COMPANY,{id:m,name:d}),e.abrupt("return",!!data.product_name);case 23:case"end":return e.stop()}}),e,null,[[4,10]])})))()},getCompany:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.isLoading=!0,e.next=3,t.getCacheCompany();case 3:if(t.isExisted=e.sent,!t.isExisted){e.next=7;break}return t.isLoading=!1,e.abrupt("return");case 7:if(t.id&&t.name){e.next=10;break}return e.next=10,t.crawlCompany();case 10:t.hasName=!!t.name,!t.name&&t.barcode&&alert("網路上找不到公司資訊\n請幫我手動輸入～\n＼(◎o◎)／！"),t.isLoading=!1;case 13:case"end":return e.stop()}}),e)})))()}}},C=(n(333),n(42)),component=Object(C.a)(_,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("vertical-step",{staticClass:"company pa3"},[n("template",{slot:"head"},[n("div",{staticClass:"gray"},[t._v("第 ② 步")]),n("h1",{staticClass:"f3 mv0"},[t._v("確認公司資訊")])]),n("div",{staticClass:"company__main"},[t.isLoading?n("div",{staticClass:"tc"},[t._v("查詢公司資料中"),n("i",{staticClass:"fas fa-spinner fa-pulse ml3"})]):t._e(),t.isExisted?n("div",{staticClass:"center"},[n("div",{staticClass:"f5 tc"},[t._v("這筆已收集過惹")]),n("div",{staticClass:"f5 tc mt2"},[t._v("(◕︵◕)")]),n("div",{staticClass:"w-50 center mt4"},[n("step-button",{attrs:{to:"/create-item/scan"}},[t._v("再來一筆")])],1)]):t._e(),t.isLoading||t.isExisted?t._e():n("div",{staticClass:"w-100"},[n("div",{staticClass:"flex mv2"},[n("div",{staticClass:"company__label"},[t._v("產品條碼：")]),n("div",{staticClass:"company__value"},[t._v(t._s(t.barcode))])]),n("div",{staticClass:"flex mv2"},[n("div",{staticClass:"company__label"},[t._v("公司名稱：")]),n("div",{staticClass:"company__value"},[t.hasName&&!t.hasMultipleCompany?n("div",[n("div",{staticClass:"truncate"},[t._v(t._s(t.name))]),n("button",{staticClass:"br1 pointer dim mt2 ba b--gray gray bg-white",on:{click:t.enableMultipleName}},[t._v("使用製造商名稱")])]):n("div",{staticClass:"w-100"},[n("div",{staticClass:"bb b--green"},[n("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.name,expression:"name",modifiers:{trim:!0}}],ref:"name",staticClass:"w-100 bw0",attrs:{placeholder:"請輸入【製造商】名稱.."},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}})]),n("div",{staticClass:"mt2 f7 orange"},[t._v("請輸入【製造商】名稱，若找不到，請輸入【負責廠商】或【進口商】名稱")])])])])])]),t.isExisted?t._e():n("div",{staticClass:"flex",attrs:{slot:"tail"},slot:"tail"},[n("div",{staticClass:"w-50 pr2"},[n("step-button",{attrs:{to:"/create-item/scan"}},[t._v("上一步")])],1),n("div",{staticClass:"w-50 pl2"},[n("step-button",{attrs:{to:"/create-item/set-name-category",primary:!0,disabled:!t.allowNext}},[t._v("下一步")])],1)])],2)}),[],!1,null,"40bdea40",null);e.default=component.exports}}]);