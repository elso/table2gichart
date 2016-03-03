/*!
---
description: Generating Google Interactiv Charts from accessible HTML tables.

authors:
  - René Grosseck (http://www.electric-solutions.de)

license:
  - MIT-style license

requires:
  core/1.5: '*'

provides:
  - table2gichart
...
 */

var Table2GIChart = new Class({
	/* implements options */
	Implements : [Options, Events],

	/* options */
	options : {/*
		onClick: $empty,
		onError: $empty,
		onMouseover: $empty,
		onMouseout: $empty,
		onReady: $empty,
		onSelect: $empty*/
		title: '',
		size: '600x400',			//default chart size
		tableView: 'clear',			///show/hide/clear table before chart drawing [default: clear]
		chart: 'PieChart',				//Chart to draw [default: pie]
		chartId: null,				//predefined id of chart div [default: generated automaticly]
		chartClass: 'piechart',	//default class name of chart div
	},

	role_index : [],				//save column where data-[url|style] is set

	/* constructor of class - initialize */
	initialize : function(elm, options) {
		this.setOptions(options);
		this.tab2chart = elm;
		this.parse_table();
		this.tab2chart.addClass('tgic-done');
	},

	parse_table : function(){

		if (!this.tab2chart.get('id'))
			this.tab2chart.set('id', String.uniqueID());
		this.container_id = this.tab2chart.id.replace(/(:|\.)/g, '_') + "_tgic";

		var tt = this.tab2chart.get('data-title') || '',
			ts = this.tab2chart.get('data-size') || this.options.size,
			ch = this.tab2chart.get('data-chart') || this.options.chart;
			tw = this.tab2chart.get('data-tableview') || this.options.tableView,
			id = this.tab2chart.get('data-chartid') || this.options.chartId;
			ts = ts.split('x');

		var datatable = [], hdata = {};
		this.options = Object.merge(this.options, {'chart': ch, 'title': tt, width: ts[0], height: ts[1]});
		this.tab2chart.getElements('tr').each(function(tr,i){
			datatable[i] = [];
			var url = tr.get('data-url') != null ? tr.get('data-url') : false;
			var style = tr.get('data-style') != null ? tr.get('data-style') : false;
			tr.getElements('th, td').each(function(thtd,ii){
				if(thtd.get('html').contains('href')){
					url = thtd.get('html').toElement().get('href') || url;
				}
				datatable[i][ii] = Number.from(thtd.get('text')) || thtd.get('text');
			});
			if(typeOf(style) != 'boolean'){
				datatable[i].push(style);
				Object.merge(hdata, {'style':true});
			}
			if(typeOf(url) != 'boolean'){
				datatable[i].push(url);
				Object.merge(hdata, {'url':true});
			}
		});
		Object.each(hdata, function(v,k){
			if(v == true){
				var len = datatable[0].push({role:k});
				this.role_index[k] = len-1;
			}
		}, this);

		//chart div exists
		if($(id)){
			this.container_id = id;
			if(tw == 'show'){}
			else if(tw == 'clear')
				$(this.tab2chart).dispose();
			else
				$(this.tab2chart).setStyle('display', 'none');
		}
		//create new chart div
		else{
			this.container = new Element('div', {
				'id' : this.container_id,
				'class' : this.options.chartClass
			});
			if(tw == 'show'){}
			else if(tw == 'clear'){
				this.container.replaces(this.tab2chart);
			}
			else {
				$(this.tab2chart).setStyle('display', 'none');
				this.container.inject(this.tab2chart, 'before');
			}
		}

		google.charts.setOnLoadCallback(this.loadchart.bind(this, datatable));
	},

	loadchart : function(datatable){
		//convert to google data table
		this.datatable = google.visualization.arrayToDataTable(datatable);

		//load chart by type
		var fn = window["google"]["visualization"][this.options.chart];
		if(typeOf(fn) === 'function')
			this.chart = new fn(document.getElementById(this.container_id));
		else
			this.chart = new google.visualization.PieChart(document.getElementById(this.container_id));

		google.visualization.events.addListener(this.chart, 'click', this.handler_click.bind(this));
		google.visualization.events.addListener(this.chart, 'error', this.handler_error.bind(this));
		google.visualization.events.addListener(this.chart, 'onmouseover', this.handler_mouseover.bind(this));
		google.visualization.events.addListener(this.chart, 'onmouseout', this.handler_mouseout.bind(this));
		google.visualization.events.addListener(this.chart, 'ready', this.handler_ready.bind(this));
		google.visualization.events.addListener(this.chart, 'select', this.handler_select.bind(this));

		this.chart.draw(this.datatable, this.options);
	},

	handler_click : function(e){
		this.fireEvent('click', [e, this]);
	},

	handler_error : function(id, message){
		this.fireEvent('error', [id, message, this]);
	},

	handler_mouseover : function(row, column){
		this.fireEvent('mouseover', [row, column, this]);
	},

	handler_mouseout : function(row, column){
		this.fireEvent('mouseout', [row, column, this]);
	},

	handler_ready : function(){
		this.fireEvent('ready', this);
	},

	handler_select : function(){
		//if role url exist, then get value and redirect
		var selected = this.chart.getSelection();
		if(this.role_index['url']){
			var url = this.datatable.getValue(selected[0]['row'], this.role_index['url']);
			if(url.length)
				location.href=url;
		}

		this.fireEvent('select', this);
	}

});

var libloaded = (typeof google === 'undefined') || (typeof google.visualization === 'undefined') ? false : true;

Elements.implement({
	table2gichart: function(options){
		return this.each(function(el){
			if(!libloaded){
				google.charts.load("current", {packages:["corechart"]});
				libloaded = true;
			}
			if (!el.hasClass("tgic-done")) {
				var i = new Table2GIChart(el, options);
				return i;
			}
		});
   	}
});

String.implement({
	toElement: (function() {
		var div = new Element('div');
		return function(oEv) {
			return div.set('html', this).getFirst().addEvents(oEv);
		}
	})()
});

