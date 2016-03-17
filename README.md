table2gichart
=============

Generating [Google Interactive Charts](https://developers.google.com/chart/interactive/docs/) from simple html data table written in Mootools. All google charts and options can set to draw the charts you like. Absolutly Seo friendly!

![Screenshot](http://i.imgur.com/NUIvbdG.jpg)

How to use
-----------

First you must to include the JS files in the head of your HTML document.

       #Html
       <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
       <script type="text/javascript" src="mootools.js"></script>
       <script type="text/javascript" src="table2gichart.min.js"></script>

Add the script to the top of the body with domready Event:

      #JS 
      <script type="text/javascript">
            window.addEvent('domready',function(){
               var chart = $$(element).table2gichart(options);
            });  
      </script>

OR add the script to the end of the body:

       #JS
       <script type="text/javascript">
         var chart = $$(element).table2gichart(options);
       </script>


### Arguments

1. element - ([element/elements](http://mootools.net/docs/core/Element/Element)) The element to draw chart.
2. options - ([object](http://mootools.net/docs/core/Types/Object), optional) See below.

### Options

* title (string) title chart [default: empty]
* size (string) size of the chart. Set WidthxHeight  [default: 600x400]
* tableView (string: clear|hide|show) Set how data table is handled after chart draw. (clear => delete data table from DOM, hide => hidden data table, show => show data table) [default: clear]
* chart (string) Which ChartType should be drawn. [default: PieChart]
* chartId (string, optionally) Id of chart div where chart is drawing in. If no id is set, a new div will be create
* chartClass (string) default class name of chart div [default: 'piechart']
* all options from google chart type ([Example](https://developers.google.com/chart/interactive/docs/gallery/piechart#configuration-options)) 

### Data Options

data-[options] can be used to set options at html data table code. So you need only once initialize the syntax.

	<table class="table2chart" data-size="400x250" data-title="Browsers for this site, 30 May 2010" data-chart="ColumnChart" data-tableview="show" data-chartid="columnchart">
		<thead><tr><th>Browser</th><th>Percent</th></tr></thead>
		<tbody>
		<tr data-url="http://www.microsoft.com" data-style="color: red"><td>MSIE</td><td>25</td></tr>
		<tr data-url="http://www.mozilla.org" data-style="color: yellow"><td>FireFox</td><td>120</td></tr>
		<tr data-url="http://www.caminobrowser.org" data-style="color: brown"><td>Camino</td><td>130</td></tr>
		<tr data-url="http://www.opera.com" data-style="color: orange"><td>Opera</td><td>280</td></tr>
		<tr data-url="http://www.apple.com/de/safari/" data-style="color: blue"><td>Safari</td><td>50</td></tr>
		</tbody>
	</table>

* data-size (string) overwrite option size
* data-title (string) overwrite option title. Set individual chart title.
* data-chart (string) overwrite option chart
* data-tableview (string) overwrite option tableView
* data-chartid (string) overwrite option chartId
* data-url (string) redirect to url if click on chart graph
* data-style (string) style a single chart graph. For all options see to google chart documentation 

### Events

All events are Google chart events. More details ([here](https://developers.google.com/chart/interactive/docs/gallery/piechart#events))

#### click 

Fired when chart is clicked. You should use select event to handle click event according to Google

	var chart = $$(element).table2gichart({
		onClick: function(el, self){
		}
	});

##### Arguments

1. el (string) Element
2. self (object) complete chart class reference (this)

#### error (function)

Fired when Google throw an error 

	var chart = $$(element).table2gichart({
		onError: function(id, message, self){
		}
	});

##### Arguments

1. id (numeric) google chart error id
2. message (string) google chart error message
3. self - complete chart class reference (this)

#### mouseover

Fired when mouse over chart

	var chart = $$(element).table2gichart({
		onMouseover: function(row, column, self){
		}
	});

##### Arguments

1. row (numeric) google chart throw id
2. column (string) google chart throw id
3. self - complete chart class reference (this)


#### mouseout

Fired when mouse out chart

	var chart = $$(element).table2gichart({
		onMouseout: function(row, column, self){
		}
	});
	
##### Arguments

1. row (numeric) google chart throw id
2. column (string) google chart throw id
3. self - complete chart class reference (this)

#### ready

Fired when chart ready

	var chart = $$(element).table2gichart({
		onReady: function(self){
		}
	});

##### Arguments

1. self - complete chart class reference (this)

#### select

Fired when chart is clicked

	var chart = $$(element).table2gichart({
		onSelect: function(self){
		}
	});

##### Arguments

1. self - complete chart class reference (this)

Demo
----
[Click here](http://elso.github.io/table2gichart/)
