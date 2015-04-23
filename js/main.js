require.config({
	baseUrl: "js",
	paths: {
		jquery: 'vendor/jquery',
		underscore: 'vendor/underscore',
		backbone: 'vendor/backbone',
		json2: 'vendor/json2',
		marionette: 'vendor/backbone.marionette',
		d3js: 'vendor/d3.v3.min'
	},
	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: ["jquery", "underscore", "json2"],
			exports: "Backbone"
		},
		marionette: {
			deps: ["backbone"],
			exports: "Marionette"
		}

	}
});

require(["marionette", "d3js"], function(Marionette, d3){
	console.log("jQuery version: ", $.fn.jquery);
	console.log("underscore identity call: ", _.identity(5));
	console.log("Backbone.history: ", Backbone.history);
	console.log("Marionette: ", Marionette);
	console.log("d3js: ", d3);

	require(["GraphApp", "mentionsscript"], function(){
			GraphApp.start();
	});
});

