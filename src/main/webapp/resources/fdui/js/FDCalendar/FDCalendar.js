/**
 * 日历控件
 * @private
 * 2012-8-30
 */
var FDCalendar = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.dateUtil = FDLib.date;
	this.today = new Date();
	// 年月日
	this.date = new Date();	
	
	this.calendarDiv = this.buildCalandarPanel();
	
	this.table = this.buildCalendarTable();
	this.thead = this.table.createTHead();
	this.tbody = document.createElement(FDTag.TBODY);
	this.tfoot = this.table.createTFoot();
	this.table.appendChild(this.tbody);
	
	this.yearSelect = null;
	this.monthSelect = null;
	
	this.selectedTD;
	
	this._buildCalendarBody();
	
	this.render();
}

FDCalendar.FORMAT_YMD = "yyyy-MM-dd";
FDCalendar.FORMAT_YMDHMS = "yyyy-MM-dd hh:mm:ss";
FDCalendar.MONTH_ITEMS = [
{text:'一月',value:'1'},{text:'二月',value:'2'},{text:'三月',value:'3'},{text:'四月',value:'4'},{text:'五月',value:'5'},{text:'六月',value:'6'}
,{text:'七月',value:'7'},{text:'八月',value:'8'},{text:'九月',value:'9'},{text:'十月',value:'10'},{text:'十一月',value:'11'},{text:'十二月',value:'12'}
];

FDCalendar.prototype = {
	getOptions:function() {
		return {
			domId:null
			,weekTextArr:['日','一','二','三','四','五','六']
			,format:FDCalendar.FORMAT_YMD
			// 方法参数:self.getValue(),self
			,onclick:null
			,onclear:null
			,dayRender:function(td,date) {return date;}
		};
	}
	,buildCalandarPanel:function(){
		var panel = document.createElement(FDTag.DIV);
		panel.className = 'ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-shadow';
		panel.style.display = "none";
		return panel;
	}
	/**
	 * 显示日历
	 * @param dom 点击dom显示日历
	 * @param value 日期值
	 */
	,show:function(value) {
		this.setValue(value);
		this.calendarDiv.style.display = "block";
	}
	/**
	 * 获取日历的div
	 */
	,getCalendarDom:function() {
		return this.calendarDiv;
	}

	/**
	 * 隐藏日历控件
	 */
	,hide:function() {
		this.calendarDiv.style.display = "none";
	}
	/**
	 * 设置时间
	 * @param dateStr 字符串日期
	 */
	,setValue:function(dateStr) {
		var date;
		if(dateStr) {
			date = this.dateUtil.parse(dateStr);
		}else{
			date = new Date();
		}
		this.setValueDate(date);
	}
	/**
	 * 设置时间
	 * @param date Date类型日期
	 */
	,setValueDate:function(date) {
		this.date = date;
		this.refresh();
	}
	,setYearRefresh:function(year){
		this.setYear(year);
		this.refresh();
	}
	,setMonthRefresh:function(month){
		this.setMonth(month);
		this.refresh();
	}
	/**
	 * 获取日期值
	 */
	,getValue:function() {
		return this.dateUtil.format(this.date,this.options.format);
	}
	/**
	 * 获取年
	 */
	,getYear:function() {
		return this.date.getFullYear();
	}
	/**
	 * 获取月
	 */
	,getMonth:function() {
		return this.date.getMonth() + 1;
	}
	/**
	 * 获取日
	 */
	,getDate:function() {
		return this.date.getDate();
	}
	/**
	 * 获取小时
	 */
	,getHours:function() {
		return this.date.getHours();
	}
	/**
	 * 获取分钟
	 */
	,getMinutes:function() {
		return this.date.getMinutes();
	}
	/**
	 * 设置年
	 * @param year 年份,int型
	 */
	,setYear:function(year) {
		this.date.setYear(year);
	}
	/**
	 * 设置月
	 * @param month 月份1~12,int型
	 */
	,setMonth:function(month) {
		this.date.setMonth(month - 1);
	}
	/**
	 * 设置天
	 * @param date 天,int型
	 */
	,setDate:function(date) {
		this.date.setDate(date);
	}
	/**
	 * 设置小时
	 * @param hours 小时数,int型
	 */
	,setHours:function(hours) {
		this.date.setHours(hours);
	}
	/**
	 * 设置分钟
	 * @param hours 分钟数,int型
	 */
	,setMinutes:function(minutes) {
		this.date.setMinutes(minutes);
	}
	/**
	 * 设置秒
	 * @param second 秒,int型
	 */
	,setSeconds:function(second) {
		this.date.setSeconds(second);
	}
	/**
	 * 刷新
	 */
	,refresh:function() {
		this._refreshBody();
		this._buildCalendar();
	}
	/**
	 * 定位到dom节点
	 */
	,render:function() {
		if(FDRight.checkByCode(this.options.operateCode)) {
			var dom = FDLib.getEl(this.options.domId) || document.body;
			dom.appendChild(this.calendarDiv);
		}
	}
	/**
	 * 获取年月日对象
	 */
	,getYMDData:function() {
		return {year:this.getYear(),month:this.getMonth(),date:this.getDate()};
	}
	,_buildCalendarBody:function() {
		var yearMonthSelector = this.buildYearMonthSelector();
		this.calendarDiv.appendChild(yearMonthSelector);
		
		this.appendWeekTextRow(this.thead);
		
		this.calendarDiv.appendChild(this.table);
		
		var buttonsDiv = this.buildButtonsDiv();
		
		this.calendarDiv.appendChild(buttonsDiv);
	}
	,_refreshBody:function() {
		FDLib.dom.removeDom(this.tbody);
		this.tbody = document.createElement(FDTag.TBODY);
		this.table.appendChild(this.tbody);
		this._initOnclickEvent();
		this._initMouseEvent();
	}
	,buildCalendarTable:function() {
		var table = document.createElement(FDTag.TABLE);
		table.className = 'ui-datepicker-calendar';
		return table;
	}
	,buildButtonsDiv:function() {
		var btnDiv = document.createElement(FDTag.DIV);
		btnDiv.className = 'ui-datepicker-header';
		btnDiv.style.textAlign = 'center';
		var that = this;
		
		var todayBtn = new FDButton({text:'今天',onclick:function(){
			that.setToday();
		}});
		var clearBtn = new FDButton({text:'清空',onclick:function(){
			that._runOnclearHandler();
		}});
		
		todayBtn.renderToDom(btnDiv);
		clearBtn.renderToDom(btnDiv);
		
		return btnDiv;
	}
	,setToday:function(){
		this.setValueDate(new Date());
		this._runOnclickHandler();
	}
	,_initOnclickEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'click' // 事件名
			,handler:function(span) {  // 执行方法,target是子节点的DOM对象
				if(span && span.innerHTML) {
					var date = parseInt(span.innerHTML);
					self.onClickDate(date,span);
					self._runOnclickHandler();
				}
			}
		});
	}
	,_highlightTD:function(span){
		FDLib.dom.addClass(span,'ui-state-hover');
	}
	,_unhighlightTD:function(span){
		FDLib.dom.removeClass(span,'ui-state-hover');
	}
	,_initMouseEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'mouseover' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				self._highlightTD(target);
			}
		});
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'mouseout' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				self._unhighlightTD(target);
			}
		});
	}
	,onClickDate:function(date,span){
		this.setDate(date);
		this.activeTD(span.outer);
	}
	// 执行用户自定义事件
	,_runOnclickHandler:function() {
		var clickHandler = this.options.onclick;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),this);
		}
	}
	,_runOnclearHandler:function() {
		var clickHandler = this.options.onclear;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),this);
		}
	}
	// 改变td背景色
	,activeTD:function(nextTD) {
		var inner = null;
		if(this.selectedTD) {
			this.selectedTD.className = "";
			inner = this.selectedTD.inner;
			FDLib.dom.removeClass(inner,'ui-state-highlight ui-state-active');
		}
		FDLib.dom.addClass(nextTD,'ui-datepicker-days-cell-over  ui-datepicker-current-day ui-datepicker-today')
		
		inner = nextTD.inner;
		FDLib.dom.addClass(inner,'ui-state-highlight ui-state-active');
		
		this.selectedTD = nextTD;
	}
	,_buildCalendar:function() {
		var self = this;
		// 当月天数
		var daysInMonth = this.dateUtil.getEndDate(this.getYear(),this.getMonth());
		// 每月1号
		var firstDayOfMonth = new Date(this.getYear(),this.getMonth() - 1,1);
		// 每月1号星期几
		var firstDay = firstDayOfMonth.getUTCDay();
		// 今天
		var today = new Date();
		// 日期
		var dayIndex = 1;
		// 日期行的索引
		var rowIndex = 0;
		
		var thirdRow = this.tbody.insertRow(rowIndex++);
		
		// 填充空白天数
		for(var i=0;i<=firstDay;i++){
			thirdRow.insertCell(i);
		}
		// 填充第一个星期
		for (var i=firstDay + 1;i<=6;i++){
			this._buildTD(thirdRow,i,dayIndex++);
		}
		// 填充剩下的天数
		while (dayIndex <= daysInMonth) {
			
			var row = this.tbody.insertRow(rowIndex++)
			for (var i=0;i<=6 && dayIndex <= daysInMonth;i++){
				this._buildTD(row,i,dayIndex++);
			}
		}
		
		this.initYearMonthSelect();
	}
	,_buildTD:function(row,cellIndex,date) {
		var td = row.insertCell(cellIndex);
		var span = document.createElement(FDTag.SPAN);
		
		span.innerHTML = this.options.dayRender(span,date);
		span.className = 'ui-state-default';
		span.style.textAlign = 'center';
		// 相互关联
		span.outer = td;
		td.inner = span;
		
		td.appendChild(span);
		
		td.style.cursor = 'pointer';
		td.style.textAlign = 'center';
		
		// 如果是今天
		if(this._isReachToToday(date)) {
			td.title = "今天";
		}
		if(this._isSelectedDay(td)) {
			this.activeTD(td);
		}
		
	}
	,_isReachToToday:function(date) {
		return this.today.getDate() == date 
				&& this.getMonth() == this.today.getMonth() + 1
				&& this.today.getFullYear() == this.getYear();
	}
	,_isSelectedDay:function(td) {
		var date = this.getDateByTD(td);
		return this.getDate() == date;
	}
	,getDateByTD:function(td){
		var span = td.inner;
		var date = null;
		if(span){
			date = parseInt(span.innerHTML) || 1;
		}
		return date || 1;
	}

	,buildYearMonthSelector:function(){
		var yearMonthSelector = document.createElement(FDTag.DIV);
		yearMonthSelector.className = 'ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all';
		
		this.appendPrevMonthButton(yearMonthSelector);
		this.appendNextMonthButton(yearMonthSelector);
		this.appendYearMonthSelect(yearMonthSelector);
		
		return yearMonthSelector;
	}
	,appendPrevMonthButton:function(dom) {
		var self = this;
		var a = document.createElement(FDTag.A);
		a.className = 'ui-datepicker-prev ui-corner-all';
		
		var icon = document.createElement(FDTag.SPAN);
		icon.className = 'ui-icon ui-icon-circle-triangle-w';
		icon.title = '上月';
		
		FDLib.event.addEvent(icon,'click',function(){
			var nextMonth = self.getMonth() - 1;
			var nextYear = self.getYear();
			if(nextMonth < 1) {
				nextYear--;
			}
			self.setYearMonth(nextYear,nextMonth);
		});
		
		a.appendChild(icon);
		
		dom.appendChild(a);
	}
	,appendNextMonthButton:function(dom) {
		var self = this;
		var a = document.createElement(FDTag.A);
		a.className = 'ui-datepicker-next ui-corner-all';
		
		var icon = document.createElement(FDTag.SPAN);
		icon.className = 'ui-icon ui-icon-circle-triangle-e';
		icon.title = '下月';
		
		FDLib.event.addEvent(icon,'click',function(){
			var nextMonth = self.getMonth() + 1;
			var nextYear = self.getYear();
			if(nextMonth >12 ) {
				nextYear++;
			}
			nextMonth = nextMonth > 12 ? 1 : nextMonth;
			self.setYearMonth(nextYear,nextMonth);
		});
		
		a.appendChild(icon);
		
		dom.appendChild(a);
	}
	,setYearMonth:function(year,month){
		this._setNextMonthDate(year,month);
		this.setMonth(month);
		this.setYear(year);
		this.refresh();
	}
	,appendYearMonthSelect:function(dom){
		var that = this;
		var div = document.createElement(FDTag.DIV);
		div.className = 'ui-datepicker-title';
		this.yearSelect = new FDSelectBox({showDefault:false,items:this.buildYearItems()});
		this.monthSelect = new FDSelectBox({showDefault:false,items:FDCalendar.MONTH_ITEMS});
		
		this.yearSelect.addEvent('change',function(){
			that.setYearRefresh(this.value);
		});
		this.monthSelect.addEvent('change',function(){
			that.setMonthRefresh(this.value);
		});
		
		this.yearSelect.renderToDom(div);
		this.monthSelect.renderToDom(div);
		
		dom.appendChild(div);
	}

	,buildYearItems:function() {
		var items = this.options.yearItems || [];
		
		var currentYear = this.getYear();
		for(var i=-10;i<=10;i++) {
			var year = currentYear + i;
			items.push({text:year,value:year});
		}
		
		return items;
	}
	,_setNextMonthDate:function(year,nextMonth) {
		if(this.isEndDate()) {
			var endDate = this._getCurrentEndDate();
			var nextMonthEndDate = this.dateUtil.getEndDate(year,nextMonth);
			this.setDate(Math.min(endDate,nextMonthEndDate));
		}
	}
	/**
	 * 是否是当月最后一天
	 */
	,isEndDate:function() {
		var endDate = this._getCurrentEndDate();
		return this.getDate() == endDate;
	}
	,_getCurrentEndDate:function() {
		return this.dateUtil.getEndDate(this.getYear(),this.getMonth());
	}
	,appendWeekTextRow:function(thead) {
		var weekTextArr = this.options.weekTextArr;
		var weekTextRow = thead.insertRow(0);
		FDLib.util.each(weekTextArr,function(text,cellIndex){
			var th = document.createElement(FDTag.TH);
			if(cellIndex == 0 || cellIndex == weekTextArr.length-1){
				th.className = 'ui-datepicker-week-end';
			}
			th.innerHTML = '<span>' + text + '</span>';
			weekTextRow.appendChild(th);
		});
	}
	,initYearMonthSelect:function() {
		this.yearSelect.setValue(this.getYear());
		this.monthSelect.setValue(this.getMonth());
	}
};
