//Create Graph Object
var GraphApp = new Marionette.Application();

//define regions
GraphApp.addRegions({
		headRegion: "#head-region",
		mainRegion: "#body-region"
});


//Collection
var graphs = new Backbone.Collection([
	{id: 1, title: "Frequency of Mentions of Scholastic Names", description: "A Graph that shows the frequency of mentions of Scholastic names in medieval Sentences commentaries", query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Scholastic> .} group by ?ref ?reftitle'},
	{id: 2, title: "Frequency of Mentions of Biblical Names", description: "A Graph that shows the frequency of mentions of Biblical names in medieval Sentences commentaries", query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Biblical> .} group by ?ref ?reftitle'},
	{id: 3, title: "Frequency of Mentions of Classical Names", description: "A Graph that shows the frequency of mentions of Classical names in medieval Sentences commentaries", query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Classical> .} group by ?ref ?reftitle'},
	{id: 4, title: "Frequency of Mentions of Patristic Names", description: "A Graph that shows the frequency of mentions of Patristic names in medieval Sentences commentaries", query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Patristic> .} group by ?ref ?reftitle'},
	{id: 5, title: "Frequency of Mentions of Any Names", description: "A Graph that shows the frequency of mentions of any author in medieval Sentences commentaries", query: "select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . } group by ?ref ?reftitle"},
	//{id: 6, title: "Frequency of Use of Scholastic Quotations", description: "A Graph that shows the frequency of use of scholastic quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle . ?ref <http://scta.info/property/quotationType> <http://scta.info/resource/quotationType/Scholastic> .} group by ?ref ?reftitle"},
	{id: 7, title: "Frequency of Use of Biblical Quotations", description: "A Graph that shows the frequency of use of biblical quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle . ?ref <http://scta.info/property/quotationType> <http://scta.info/resource/quoteType/biblical> .} group by ?ref ?reftitle"},
	//{id: 8, title: "Frequency of Use of Classical Quotations", description: "A Graph that shows the frequency of use of classical quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle . ?ref <http://scta.info/property/quotationType> <http://scta.info/resource/quotationType/Classical> .} group by ?ref ?reftitle"},
	//{id: 9, title: "Frequency of Use of Patristic Quotations", description: "A Graph that shows the frequency of use of patristic quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle . ?ref <http://scta.info/property/quotationType> <http://scta.info/resource/quotationType/Patristic> .} group by ?ref ?reftitle"},
	//{id: 10, title: "Frequency of Use of All Quotations", description: "A Graph that shows the frequency of use of all quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle .} group by ?ref ?reftitle"},
	

]);

//Views Views Views Views
GraphApp.module("Show", function(Show, GraphApp, Backbone, Marionettte, $, _){
	Show.Graph = Marionette.ItemView.extend({
		tagName: "div",
		class: "graph-show",
		template: "#show-graph",
		events: {
			"click a.js-list-graphs": "listGraphsClicked",
		},
		"listGraphsClicked": function(e){
			e.preventDefault();
			e.stopPropagation();
			//hides lingering tool tip
			$(".tooltip").css('opacity', 0)
			this.$el.parent().parent().fadeOut(500, function(){
				GraphApp.Show.Controller.showGraphList();
			}); 
			this.$el.parent().parent().fadeIn(500);
			
		}
		
	});
	Show.GraphDescriptions = Marionette.ItemView.extend({
		tagName: "div",
		class: "graph-descriptions",
		template: "#show-graph-descriptions",
		events: {
			"click a.js-show-graph": "showGraphClicked"
		},
		"showGraphClicked": function(e){
			e.preventDefault();
			e.stopPropagation();
			var self = this;
			this.$el.parent().parent().fadeOut(500, function(){
				GraphApp.Show.Controller.showGraph(self.model.id);
			}); 
			this.$el.parent().parent().fadeIn(500);
			
		}
	});
	Show.GraphCollection = Marionette.CollectionView.extend({
		tagName: "div",
		class: "graph-collection container",
		template: "#show-graph-descriptions",
		childView: Show.GraphDescriptions,
		
	});
});
	
//controllers controllers controllers controllers

GraphApp.module("Show", function(Show, GraphApp, Backbone, Marionette, $, _){
	Show.Controller = {
		showGraph: function(id){
			graph = graphs.get(id);
			var graphView = new Show.Graph({
				model: graph
			});
			Backbone.history.navigate("graph/" + id);
			GraphApp.headRegion.empty();
			GraphApp.headRegion.show(graphView);
			GraphApp.mainRegion.empty();
			chartDisplay(graph.attributes.query, "body-region", numericalSort);
		},
		showGraphList: function(){
			var graphsView = new Show.GraphCollection({
				collection: graphs
			});
			Backbone.history.navigate("graphs");
			GraphApp.headRegion.empty();
			GraphApp.mainRegion.empty();
			GraphApp.mainRegion.show(graphsView)
			
		}
	}  	
});



GraphApp.on("start", function(options){
	if(Backbone.history){
		Backbone.history.start();
		console.log(Backbone.history.fragment);
		if (Backbone.history.fragment === "graphs"){
			GraphApp.Show.Controller.showGraphList();
		}
		else if (Backbone.history.fragment.includes("graph/")){
			var id = Backbone.history.fragment.split("/").slice().pop();
			GraphApp.Show.Controller.showGraph(id);
		}
		else{
			GraphApp.Show.Controller.showGraphList();
		}
			
	}
	
	
});
