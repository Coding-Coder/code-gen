(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e1663c4e"],{"067a":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-tabs",{attrs:{type:"card"},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{name:"first"}},[a("span",{attrs:{slot:"label"},slot:"label"},[a("i",{staticClass:"el-icon-edit-outline"}),e._v(" 生成代码")]),e._v(" "),a("generate-config")],1),e._v(" "),a("el-tab-pane",{attrs:{name:"second"}},[a("span",{attrs:{slot:"label"},slot:"label"},[a("i",{staticClass:"el-icon-date"}),e._v(" 生成历史")]),e._v(" "),a("generate-history")],1)],1)],1)},r=[],n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"code-gen"},[a("el-form",{ref:"genForm",staticClass:"gen-form",attrs:{model:e.clientParam,size:"mini","label-width":"150px"}},[a("el-form-item",{attrs:{label:"选择数据源",prop:"datasourceConfigId",rules:{required:!0,message:"请选择数据源"}}},[a("el-select",{attrs:{placeholder:"选择数据源"},on:{change:e.onDataSourceChange},model:{value:e.clientParam.datasourceConfigId,callback:function(t){e.$set(e.clientParam,"datasourceConfigId",t)},expression:"clientParam.datasourceConfigId"}},e._l(e.datasourceConfigList,(function(t){return a("el-option",{key:t.id,attrs:{label:e.getDatasourceLabel(t),value:t.id}},[a("span",{staticStyle:{float:"left"}},[e._v(e._s(e.getDatasourceLabel(t)))]),e._v(" "),a("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[a("el-tooltip",{attrs:{placement:"top",content:"Duplicate"}},[a("el-link",{staticStyle:{"margin-right":"20px"},attrs:{type:"primary",icon:"el-icon-document-copy"},on:{click:function(a){return a.stopPropagation(),e.onDataSourceDuplicate(t)}}})],1),e._v(" "),a("el-link",{staticStyle:{"margin-right":"20px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:function(a){return a.stopPropagation(),e.onDataSourceUpdate(t)}}}),e._v(" "),a("el-link",{attrs:{type:"danger",icon:"el-icon-delete"},on:{click:function(a){return a.stopPropagation(),e.onDataSourceDelete(t)}}})],1)])})),1),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:e.onDataSourceAdd}},[e._v("新建数据源")])],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.showTable,expression:"showTable"}],attrs:{label:"包名（package）"}},[a("el-input",{attrs:{placeholder:"可选，如：cn.studyjava.xxx","show-word-limit":"",maxlength:"100"},model:{value:e.clientParam.packageName,callback:function(t){e.$set(e.clientParam,"packageName",t)},expression:"clientParam.packageName"}})],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.showTable,expression:"showTable"}],attrs:{label:"删除前缀"}},[a("el-input",{attrs:{placeholder:"可选，如：sys_user对应Java类为User(多前缀逗号隔开)","show-word-limit":"",maxlength:"100"},model:{value:e.clientParam.delPrefix,callback:function(t){e.$set(e.clientParam,"delPrefix",t)},expression:"clientParam.delPrefix"}})],1)],1),e._v(" "),a("el-row",{directives:[{name:"show",rawName:"v-show",value:e.showTable,expression:"showTable"}],attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("h4",[e._v("选择表")]),e._v(" "),a("el-input",{staticStyle:{"margin-bottom":"10px",width:"100%"},attrs:{"prefix-icon":"el-icon-search",clearable:"",size:"mini",placeholder:"过滤表"},model:{value:e.tableSearch,callback:function(t){e.tableSearch=t},expression:"tableSearch"}}),e._v(" "),a("el-table",{attrs:{data:e.tableListData,border:"","cell-style":e.cellStyleSmall(),"header-cell-style":e.headCellStyleSmall(),"row-class-name":e.tableRowClassName},on:{"selection-change":e.onTableListSelect}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{prop:"tableName",label:"表名"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:12,id:"templateSelect"}},[a("h4",[e._v("选择模板")]),e._v(" "),a("el-select",{staticStyle:{"margin-bottom":"10px",width:"100%"},attrs:{placeholder:"选择模板所在组",size:"mini"},model:{value:e.groupId,callback:function(t){e.groupId=t},expression:"groupId"}},e._l(e.groupData,(function(t){return a("el-option",{key:t.id,attrs:{label:t.groupName,value:t.id}},[e._v("\n            "+e._s(t.groupName)+"\n          ")])})),1),e._v(" "),a("el-table",{attrs:{data:e.templateListData,border:"","cell-style":e.cellStyleSmall(),"header-cell-style":e.headCellStyleSmall(),"row-class-name":e.templateTableRowClassName},on:{"selection-change":e.onTemplateListSelect}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"模板名称"},scopedSlots:e._u([{key:"default",fn:function(t){return a("span",{},[e._v("\n              "+e._s(t.row.name)+"\n            ")])}}])})],1),e._v(" "),a("el-button",{directives:[{name:"show",rawName:"v-show",value:e.showTable,expression:"showTable"}],attrs:{type:"primary"},on:{click:e.onGenerate}},[e._v("生成代码")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:e.datasourceTitle,visible:e.datasourceDlgShow},on:{"update:visible":function(t){e.datasourceDlgShow=t}}},[a("el-form",{ref:"datasourceForm",attrs:{model:e.datasourceFormData,rules:e.datasourceRule,size:"mini","label-width":"120px"}},[a("el-form-item",{attrs:{label:"数据库类型"}},[a("el-select",{attrs:{filterable:"","default-first-option":""},model:{value:e.datasourceFormData.dbType,callback:function(t){e.$set(e.datasourceFormData,"dbType",t)},expression:"datasourceFormData.dbType"}},e._l(e.dbTypeConfig,(function(e){return a("el-option",{key:e.dbType,attrs:{label:e.label,value:e.dbType}})})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"Host",prop:"host"}},[a("el-input",{attrs:{placeholder:"地址","show-word-limit":"",maxlength:"100"},model:{value:e.datasourceFormData.host,callback:function(t){e.$set(e.datasourceFormData,"host",t)},expression:"datasourceFormData.host"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"Port",prop:"port"}},[a("el-input",{attrs:{placeholder:"端口","show-word-limit":"",maxlength:"10"},model:{value:e.datasourceFormData.port,callback:function(t){e.$set(e.datasourceFormData,"port",t)},expression:"datasourceFormData.port"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"Database",prop:"dbName"}},[a("el-input",{attrs:{placeholder:"数据库","show-word-limit":"",maxlength:"64"},model:{value:e.datasourceFormData.dbName,callback:function(t){e.$set(e.datasourceFormData,"dbName",t)},expression:"datasourceFormData.dbName"}})],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.showPgSqlSchema,expression:"showPgSqlSchema"}],attrs:{label:"Schema",prop:"schemaName"}},[a("el-input",{attrs:{placeholder:"schema","show-word-limit":"",maxlength:"64"},model:{value:e.datasourceFormData.schemaName,callback:function(t){e.$set(e.datasourceFormData,"schemaName",t)},expression:"datasourceFormData.schemaName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"Username",prop:"username"}},[a("el-input",{attrs:{placeholder:"用户名","show-word-limit":"",maxlength:"100"},model:{value:e.datasourceFormData.username,callback:function(t){e.$set(e.datasourceFormData,"username",t)},expression:"datasourceFormData.username"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"Password",prop:"password"}},[a("el-input",{attrs:{type:"password",placeholder:"密码","show-word-limit":"",maxlength:"100"},model:{value:e.datasourceFormData.password,callback:function(t){e.$set(e.datasourceFormData,"password",t)},expression:"datasourceFormData.password"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"包名",prop:"packageName"}},[a("el-input",{attrs:{placeholder:"包名（package）","show-word-limit":"",maxlength:"100"},model:{value:e.datasourceFormData.packageName,callback:function(t){e.$set(e.datasourceFormData,"packageName",t)},expression:"datasourceFormData.packageName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"删除前缀",prop:"delPrefix"}},[a("el-input",{attrs:{placeholder:"删除前缀（表名sys_user删除前缀sys_对应bean为User）多前缀逗号隔开","show-word-limit":"",maxlength:"200"},model:{value:e.datasourceFormData.delPrefix,callback:function(t){e.$set(e.datasourceFormData,"delPrefix",t)},expression:"datasourceFormData.delPrefix"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"代码生成器模板",prop:"delPrefix"}},[a("el-select",{staticStyle:{"margin-bottom":"10px",width:"100%"},attrs:{placeholder:"选择模板所在组",size:"mini"},model:{value:e.datasourceFormData.groupId,callback:function(t){e.$set(e.datasourceFormData,"groupId",t)},expression:"datasourceFormData.groupId"}},e._l(e.groupData,(function(t){return a("el-option",{key:t.id,attrs:{label:t.groupName,value:t.id}},[e._v("\n              "+e._s(t.groupName)+"\n            ")])})),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"success"},on:{click:e.onDatasourceTest}},[e._v("测试连接")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.onDatasourceSave}},[e._v("保存")])],1)],1)],1)],1)},l=[],s=(a("456d"),a("ac6a"),a("2d63")),i="gen-datasource-id",c={MySQL:1,Oracle:2,SQL_Server:3,PostgreSQL:4},u={name:"GenerateConfig",data:function(){return{groupId:"",groupData:[],showTable:!1,clientParam:{datasourceConfigId:"",tableNames:[],templateConfigIdList:[],packageName:"",delPrefix:"",groupId:""},tableSearch:"",datasourceConfigList:[],tableListData:[],templateListData:[],datasourceTitle:"新建连接",datasourceDlgShow:!1,datasourceFormData:{id:0,dbType:1,host:"",port:"",username:"",password:"",dbName:"",schemaName:"",packageName:"",delPrefix:"",groupId:""},dbTypeConfig:[],datasourceRule:{host:[{required:!0,message:"不能为空",trigger:"blur"}],port:[{required:!0,message:"不能为空",trigger:"blur"}],username:[{required:!0,message:"不能为空",trigger:"blur"}],password:[{required:!0,message:"不能为空",trigger:"blur"}],dbName:[{required:!0,message:"不能为空",trigger:"blur"}]}}},watch:{"clientParam.datasourceConfigId":function(e){var t,a=Object(s["a"])(this.datasourceConfigList);try{for(a.s();!(t=a.n()).done;){var o=t.value;if(o.id===e){this.groupId=o.groupId,Object.assign(this.clientParam,{packageName:o.packageName,delPrefix:o.delPrefix,groupId:o.groupId});break}}}catch(r){a.e(r)}finally{a.f()}}},computed:{showPgSqlSchema:function(){return this.datasourceFormData.dbType===c.PostgreSQL}},created:function(){this.loadDataSource(),this.loadTemplate(),this.loadDbType(),this.loadGroups()},methods:{tableRowClassName:function(e){var t=e.row;e.index;return t.hidden=!1,0===this.tableSearch.length||t.tableName&&t.tableName.toLowerCase().indexOf(this.tableSearch.toLowerCase())>-1?"":(t.hidden=!0,"hidden-row")},templateTableRowClassName:function(e){var t=e.row;e.index;return t.hidden=!1,""==this.groupId||this.groupId<=0||t.groupId&&t.groupId==this.groupId?"":(t.hidden=!0,"hidden-row")},getDatasourceLabel:function(e){var t=e.schemaName?"/".concat(e.schemaName):"";return"".concat(e.dbName).concat(t," (").concat(e.host,") - ").concat(e.username)},loadGroups:function(){this.post("/group/list/",{},(function(e){this.groupData=e.data}))},loadDataSource:function(){var e=this,t=this.getCurrentDataSourceId();this.post("/datasource/list",{},(function(a){var o,r=a.data;e.datasourceConfigList=r;var n,l=Object(s["a"])(r);try{for(l.s();!(n=l.n()).done;){var i=n.value;if(i.id===t){o=i.id;break}}}catch(c){l.e(c)}finally{l.f()}!o&&r.length>0&&(o=r[0].id),o&&e.onDataSourceChange(parseInt(o))}))},loadTemplate:function(){var e=this;this.post("/template/list",{},(function(t){e.templateListData=t.data}))},loadDbType:function(){var e=this;this.post("/datasource/dbtype",{},(function(t){e.dbTypeConfig=t.data}))},setCurrentDataSourceId:function(e){this.setAttr(i,e)},getCurrentDataSourceId:function(){var e=this.getAttr(i);return parseInt(e)||""},onDataSourceAdd:function(){var e=this;this.datasourceTitle="新建连接",Object.keys(this.datasourceFormData).forEach((function(t){e.datasourceFormData[t]=""})),this.datasourceFormData.id=0,this.datasourceFormData.dbType=1,this.datasourceDlgShow=!0,this.$nextTick((function(){e.groupData.length>0&&(e.datasourceFormData.groupId=e.groupData[0].id)}))},onTableListSelect:function(e){this.clientParam.tableNames=e.filter((function(e){return void 0===e.hidden||!1===e.hidden})).map((function(e){return e.tableName}))},onTemplateListSelect:function(e){this.clientParam.templateConfigIdList=e.filter((function(e){return void 0===e.hidden||!1===e.hidden})).map((function(e){return e.id}))},onDataSourceChange:function(e){var t=this;this.setCurrentDataSourceId(e),this.clientParam.datasourceConfigId=e,this.post("/datasource/table/".concat(e),{},(function(e){t.showTable=!0,t.tableListData=e.data}))},onDataSourceUpdate:function(e){this.datasourceTitle="修改连接",Object.assign(this.datasourceFormData,e),this.datasourceDlgShow=!0},onDataSourceDuplicate:function(e){this.datasourceTitle="".concat(e.host," Copy"),Object.assign(this.datasourceFormData,e),this.datasourceFormData.id=0,this.datasourceDlgShow=!0},onDataSourceDelete:function(e){this.confirm("确认要删除 ".concat(e.dbName," 吗？"),(function(t){var a={id:e.id};this.post("/datasource/del",a,(function(){t(),location.reload()}))}))},onGenerate:function(){var e=this;this.$refs.genForm.validate((function(t){if(t){if(0===e.clientParam.tableNames.length)return void e.tip("请勾选表","error");if(0===e.clientParam.templateConfigIdList.length)return void e.tip("请勾选模板","error");var a=JSON.stringify(e.clientParam);e.goRoute("result/".concat(a))}}))},onDatasourceTest:function(){var e=this;this.$refs.datasourceForm.validate((function(t){t&&e.post("/datasource/test",e.datasourceFormData,(function(t){e.tip("连接成功")}))}))},onDatasourceSave:function(){var e=this;this.$refs.datasourceForm.validate((function(t){t&&e.post("/datasource/test",e.datasourceFormData,(function(t){e.datasourceFormData.id?e.post("/datasource/update",e.datasourceFormData,(function(e){location.reload()})):e.post("/datasource/add",e.datasourceFormData,(function(t){e.tip("添加成功"),e.loadDataSource(),e.datasourceDlgShow=!1}))}))}))}}},d=u,m=(a("da9a"),a("2877")),p=Object(m["a"])(d,n,l,!1,null,null,null),f=p.exports,h=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-table",{attrs:{data:e.tableData,border:"","highlight-current-row":""}},[a("el-table-column",{attrs:{prop:"generateTime",label:"生成时间",width:"160"}}),e._v(" "),a("el-table-column",{attrs:{prop:"datasource",label:"数据源",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{label:"packageName",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.configContent.packageName)+"\n      ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"删除前缀",width:"100","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.configContent.delPrefix)+"\n      ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"表名"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.configContent.tableNames.length<=5?a("div",[e._v("\n          "+e._s(t.row.configContent.tableNames.join("、"))+"\n        ")]):a("div",[e._v("\n          "+e._s(e.showArray(t.row.configContent.tableNames,3,"、"))+"\n          "),a("el-popover",{attrs:{placement:"left",width:"400",trigger:"click"}},[a("el-table",{attrs:{data:t.row.configContent.tableNames,"max-height":"400px"}},[a("el-table-column",{attrs:{label:"表名"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row))]}}],null,!0)})],1),e._v(" "),a("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[e._v("更多")])],1)],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"templateNames",label:"模板","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.templateNames&&t.row.templateNames.join("、"))+"\n      ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.onGenerate(t.row)}}},[e._v("再次生成")])]}}])})],1)],1)},b=[],g={name:"GenerateHistory",data:function(){return{tableData:[]}},created:function(){this.loadTable()},methods:{loadTable:function(){this.post("/history/list",{},(function(e){this.tableData=e.data}))},onGenerate:function(e){var t=JSON.stringify(e.configContent);this.goRoute("result/".concat(t))},showArray:function(e,t,a){if(!e||0===e.length)return"";for(var o=[],r=0;r<Math.min(t,e.length);r++)o.push(e[r]);return o.join(a)}}},v=g,w=Object(m["a"])(v,h,b,!1,null,null,null),y=w.exports,D={components:{GenerateConfig:f,GenerateHistory:y},data:function(){return{activeName:"first"}}},_=D,x=Object(m["a"])(_,o,r,!1,null,null,null);t["default"]=x.exports},"1af6":function(e,t,a){var o=a("63b6");o(o.S,"Array",{isArray:a("9003")})},"2d63":function(e,t,a){"use strict";var o=a("5d73"),r=a.n(o),n=a("a745"),l=a.n(n),s=a("5d58"),i=a.n(s),c=a("67bb"),u=a.n(c),d=a("774e"),m=a.n(d);function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,o=new Array(t);a<t;a++)o[a]=e[a];return o}function f(e,t){if(e){if("string"===typeof e)return p(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?m()(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?p(e,t):void 0}}function h(e,t){var a;if("undefined"===typeof u.a||null==e[i.a]){if(l()(e)||(a=f(e))||t&&e&&"number"===typeof e.length){a&&(e=a);var o=0,n=function(){};return{s:n,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,c=!0,d=!1;return{s:function(){a=r()(e)},n:function(){var e=a.next();return c=e.done,e},e:function(e){d=!0,s=e},f:function(){try{c||null==a["return"]||a["return"]()}finally{if(d)throw s}}}}a.d(t,"a",(function(){return h}))},"456d":function(e,t,a){var o=a("4bf8"),r=a("0d58");a("5eda")("keys",(function(){return function(e){return r(o(e))}}))},"469f":function(e,t,a){a("6c1c"),a("1654"),e.exports=a("7d7b")},"549b":function(e,t,a){"use strict";var o=a("d864"),r=a("63b6"),n=a("241e"),l=a("b0dc"),s=a("3702"),i=a("b447"),c=a("20fd"),u=a("7cd6");r(r.S+r.F*!a("4ee1")((function(e){Array.from(e)})),"Array",{from:function(e){var t,a,r,d,m=n(e),p="function"==typeof this?this:Array,f=arguments.length,h=f>1?arguments[1]:void 0,b=void 0!==h,g=0,v=u(m);if(b&&(h=o(h,f>2?arguments[2]:void 0,2)),void 0==v||p==Array&&s(v))for(t=i(m.length),a=new p(t);t>g;g++)c(a,g,b?h(m[g],g):m[g]);else for(d=v.call(m),a=new p;!(r=d.next()).done;g++)c(a,g,b?l(d,h,[r.value,g],!0):r.value);return a.length=g,a}})},"5d58":function(e,t,a){e.exports=a("d8d6")},"5d73":function(e,t,a){e.exports=a("469f")},"5eda":function(e,t,a){var o=a("5ca1"),r=a("8378"),n=a("79e5");e.exports=function(e,t){var a=(r.Object||{})[e]||Object[e],l={};l[e]=t(a),o(o.S+o.F*n((function(){a(1)})),"Object",l)}},"67bb":function(e,t,a){e.exports=a("f921")},"774e":function(e,t,a){e.exports=a("d2d5")},"7d7b":function(e,t,a){var o=a("e4ae"),r=a("7cd6");e.exports=a("584a").getIterator=function(e){var t=r(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return o(t.call(e))}},a745:function(e,t,a){e.exports=a("f410")},c1ad:function(e,t,a){},d2d5:function(e,t,a){a("1654"),a("549b"),e.exports=a("584a").Array.from},da9a:function(e,t,a){"use strict";var o=a("c1ad"),r=a.n(o);r.a},f410:function(e,t,a){a("1af6"),e.exports=a("584a").Array.isArray}}]);