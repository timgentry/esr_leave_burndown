!function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e){t.exports=d3},function(t,e,n){"use strict";n.r(e);var a=n(0);function r(t){return new Promise((function(e,n){e(t.events.map(t=>a.timeParse("%Y-%m-%d")(t.date)))}))}var u=a.timeParse("%Y-%m-%d");function o(t){return new Promise((function(e,n){var a=t.map(t=>t.date),r=t.columns.slice(2).map((function(e){var n=t.filter((function(t){return""!==t[e]})).map((function(t){var n=+t[e]/7.5;return{date:t.date,days:n}}));return{id:e,values:n}}));e([t,a,r])}))}var l=a.select("svg"),i=20,d=20,s=30,c=50,f=+l.attr("width")-c-d,p=+l.attr("height")-i-s,v=l.append("g").attr("transform","translate("+c+","+i+")"),m=a.scaleTime().rangeRound([0,f]),y=a.scaleLinear().rangeRound([p,0]),g=a.scaleOrdinal(a.schemeCategory10),h=a.line().x((function(t){return m(t.date)})).y((function(t){return y(t.days)}));function x(t,e){var n=t.getDay();return n>0&&n<6&&!e.includes(t)}function w(t,e,n){var r=[],u=0,o=t.filter(t=>x(t,e)).length,l=a.scaleLinear().range(n).domain([0,o]);return t.forEach((function(t){r.push({date:t,index:u,days:l(u)}),x(t,e)&&++u})),r}function b(t,e){var n={};for(let u of t){var a=0,r=0;e.forEach((function(t){n[t]||(n[t]=0);let e=u.values.find((function(e){return e.date==t}));void 0===e?a=r:(a=e.days,r=a),n[t]+=a}))}let u=e[0];for(let e of t){let t=e.values.map((function(t){return t.date})),n=new Date(Math.max.apply(null,t));n>u&&(u=n)}var o=[];for(let e in n){var l=n[e];new Date(e)<u&&o.push({date:new Date(e),days:l/t.length})}return o}function D(t,e,n,r,u,o){t.append("path").datum(function(t,e,n){for(var a=5,r=[],u=t.length;u--&&!(a>n);){var o=t[u];r.push({date:o,days:a}),x(o,e)&&++a}return r}(e,n,r)).attr("class","lost").attr("d",function(t,e){return a.area().x(e=>t(e.date)).y0(0).y1(t=>e(t.days))}(u,o))}var P=function(t){return"steelblue"};function j(t,e,n,r,u){t.append("path").datum(function(t,e){var n=27,a=[];return t.forEach((function(t){if(n<0)return!1;a.push({date:t,days:n}),x(t,e)&&--n})),a}(e,n)).attr("class","unavailable").attr("d",function(t,e){return a.area().x(e=>t(e.date)).y0(e(0)).y1(t=>e(t.days))}(r,u))}Promise.all([a.tsv("leave.csv",(function(t){return t.date=u(t.date),t})).then(o),a.json("https://www.gov.uk/bank-holidays/england-and-wales.json").then(r)]).then(([[t,e,n],r])=>{var u=a.max(n,(function(t){return a.max(t.values,t=>t.days)}));m.domain(a.extent(t,t=>t.date)),y.domain([0,u]),g.domain(n.map((function(t){return t.id}))),j(v,e,r,m,y),D(v,e,r,u,m,y),function(t,e,n,a){t.append("path").datum(w(e,n,[27,0])).attr("class","line guide").attr("d",a),t.append("path").datum(w(e,n,[38,5])).attr("class","line guide").attr("d",a)}(v,e,r,h),function(t,e,n){t.append("line").attr("class","today").attr("x1",()=>e(new Date)).attr("x2",()=>e(new Date)).attr("y1",()=>n(0)).attr("y2",0)}(v,m,y),function(t,e,n,a){var r=b(e,n);t.append("path").datum(r).attr("class","line planned trend bg").attr("d",(function(t){return a(t.filter((function(t){return t.date>new Date})))})),t.append("path").datum(r).attr("class","line planned trend").attr("d",(function(t){return a(t.filter((function(t){return t.date>new Date})))}))}(v,n,e,h),function(t,e,n,a,r,u){var o=e.selectAll(".person").data(n).enter().append("g").attr("class",(function(t,e){return"person esr"+e})).attr("title",t=>t.id);o.append("path").attr("class","line").attr("d",(function(t){return a(t.values.filter((function(t){return t.date<=new Date})))})).style("stroke",t=>P(t.id)),o.append("path").attr("class","line planned").attr("d",(function(t){return a(t.values.filter((function(t){return t.date>new Date})))})).style("stroke",t=>P(t.id)),o.append("path").attr("class","target").attr("d",t=>a(t.values)).style("stroke",t=>P(t.id)).on("mouseover",(function(e,n){return function(t,e,n){t.selectAll("g.person").classed("unselected",!0),t.selectAll("g.person.esr"+n).classed("unselected",!1),t.selectAll("g.person.esr"+n).classed("selected",!0)}(t,0,n)})).on("mouseout",(function(e,n){return function(t,e,n){t.selectAll("g.person").classed("unselected",!1),t.selectAll("g.person.esr"+n).classed("selected",!1)}(t,0,n)})),o.append("text").datum((function(t){return{id:t.id,value:t.values[t.values.filter((function(t){return t.date<=new Date})).length-1]}})).attr("class","bg").attr("transform",(function(t){return"translate("+r(t.value.date)+","+u(t.value.days)+")"})).attr("x",5).attr("dy",-5).text((function(t){return t.id})),o.append("text").datum((function(t){return{id:t.id,value:t.values[t.values.filter((function(t){return t.date<=new Date})).length-1]}})).attr("transform",(function(t){return"translate("+r(t.value.date)+","+u(t.value.days)+")"})).attr("x",5).attr("dy",-5).text((function(t){return t.id}))}(l,v,n,h,m,y),function(t,e,n,a){var r=b(e,n);t.append("path").datum(r).attr("class","line trend bg").attr("d",(function(t){return a(t.filter((function(t){return t.date<=new Date})))})),t.append("path").datum(r).attr("class","line trend").attr("d",(function(t){return a(t.filter((function(t){return t.date<=new Date})))}))}(v,n,e,h),function(t,e,n,r){t.append("g").attr("transform","translate(0,"+e+")").call(a.axisBottom(n).tickFormat((function(t){return a.timeYear(t)<t?a.timeFormat("%B")(t):a.timeFormat("%Y")(t)}))),t.append("g").call(a.axisLeft(r)).append("text").attr("fill","#000").attr("transform","rotate(-90)").attr("y",6).attr("dy","-3.71em").attr("text-anchor","end").text("Leave (Days)")}(v,p,m,y)}).catch(t=>{console.log(`error: ${t}`)})}]);