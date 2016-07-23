//Create Graph Object
var GraphApp = new Marionette.Application();

//define regions
GraphApp.addRegions({
		headRegion: "#head-region",
		mainRegion: "#body-region"
});

var nameFrequencyQuery = function(expressionId, nameType){
	var subset_filter = "";
	
		if (expressionId !== "all"){
			subset_filter = [
				"?element <http://scta.info/property/isPartOfStructureBlock> ?block .",
				"?block <http://scta.info/property/isPartOfTopLevelExpression> <http://scta.info/resource/" + expressionId + "> ."
			].join('');
		}

		if (nameType !== "all"){
			nameTypeFilter = [
				"?ref <http://scta.info/property/personType> <http://scta.info/resource/" + nameType + "> ."
			].join('');
		}
		

		var query = [
			"select ?ref ?reftitle (count(?element) as ?count)", 
			"where {", 
			"?element <http://scta.info/property/expressionType> <http://scta.info/resource/structureElement> .",
			subset_filter,
			"?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementName> .", 
			"?element <http://scta.info/property/isInstanceOf> ?ref .", 
			"?ref <http://purl.org/dc/elements/1.1/title> ?reftitle .", 
			nameTypeFilter,
			"}", 
			"group by ?ref ?reftitle",
		].join('');
	return query;
};

//Collection
var graphs = new Backbone.Collection([
	{
		id: 1, 
		title: "Frequency of Mentions of Scholastic Names", 
		description: "A Graph that shows the frequency of mentions of Scholastic names in medieval Sentences commentaries", 
		//query: [
		//'select ?ref ?reftitle',
		//  '(count(?element) as ?count) where {', 
		//  '?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Scholastic> .} group by ?ref ?reftitle'
		query: nameFrequencyQuery("all", "scholastic")
	},
	{
		id: 2, 
		title: "Frequency of Mentions of Biblical Names", 
		description: "A Graph that shows the frequency of mentions of Biblical names in medieval Sentences commentaries", 
		//query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Biblical> .} group by ?ref ?reftitle'
		query: nameFrequencyQuery("all", "biblical")
	},
	{
		id: 3, 
		title: "Frequency of Mentions of Classical Names", 
		description: "A Graph that shows the frequency of mentions of Classical names in medieval Sentences commentaries", 
		//query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Classical> .} group by ?ref ?reftitle'
		query: nameFrequencyQuery("all", "classical")
	},
	{
		id: 4, 
		title: "Frequency of Mentions of Patristic Names", 
		description: "A Graph that shows the frequency of mentions of Patristic names in medieval Sentences commentaries", 
		//query: 'select ?ref ?reftitle  (count(?element) as ?count) where { ?element a <http://scta.info/resource/nameElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://purl.org/dc/elements/1.1/title> ?reftitle . ?ref <http://scta.info/property/personType> <http://scta.info/resource/persontype/Patristic> .} group by ?ref ?reftitle'
		query: nameFrequencyQuery("all", "patristic")
	},
	{
		id: 5, 
		title: "Frequency of Mentions of Any Names", 
		description: "A Graph that shows the frequency of mentions of any author in medieval Sentences commentaries", 
		query: nameFrequencyQuery("all", "all")
	},
	
	{id: 8, 
		title: "Frequency of Mentions of Names in Plaoul's Commentary", 
		description: "A Graph that shows the frequency of names mentioned in Peter Plaoul's Commentary on the Sentences", 
		query: nameFrequencyQuery("plaoulcommentary", "all")
	},
	{id: 9, 
		title: "Frequency of Mentions of Names in Wodeham's Commentary", 
		description: "A Graph that shows the frequency of names mentioned in Adam Wodeham's Ordinatio Commentary on the Sentences", 
		query: nameFrequencyQuery("wodehamordinatio", "all")
	},
	{id: 10, 
		title: "Frequency of Mentions of Names in Gracilis's Commentary", 
		description: "A Graph that shows the frequency of names mentioned in Peter Gracilis's Commentary on the Sentences", 
		query: nameFrequencyQuery("graciliscommentary", "all")
	},
	//{id: 6, title: "Frequency of Use of Scholastic Quotations", description: "A Graph that shows the frequency of use of scholastic quotations in medieval Sentences commentaries", query: "select ?ref ?reftitle (count(?element) as ?count) where {?element a <http://scta.info/resource/quoteElement> . ?element <http://scta.info/property/isInstanceOf> ?ref . ?ref <http://scta.info/property/citation> ?reftitle . ?ref <http://scta.info/property/quotationType> <http://scta.info/resource/quotationType/Scholastic> .} group by ?ref ?reftitle"},
	{
		id: 7, 
		title: "Frequency of Use of Biblical Quotations", 
		description: "A Graph that shows the frequency of use of biblical quotations in medieval Sentences commentaries", 
		query: [
			"select ?ref ?reftitle (count(?element) as ?count)",
			"where {",
			"?element <http://scta.info/property/expressionType> <http://scta.info/resource/structureElement> .",
			"?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementQuote> .", 
			"?element <http://scta.info/property/isInstanceOf> ?ref .",
			"?ref <http://scta.info/property/citation> ?reftitle .", 
			"?ref <http://scta.info/property/quotationType> <http://scta.info/resource/biblical> .",
			"}", 
			"group by ?ref ?reftitle",
			].join('')
	},
	

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
			$(".tooltip").css('opacity', 0);
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
			GraphApp.mainRegion.show(graphsView);
			
		}
	};  	
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
