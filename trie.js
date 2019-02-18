var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/sihtrie")

var trieSchema = new mongoose.Schema({
    trie: mongoose.Schema.Types.Mixed
})

var TrieModel = mongoose.model("Trie", trieSchema)

string = "Nec no esse labores usu eu agam dicam vivendo Modo aliquid ei has quo assentior conceptam expetendis id eum eu discere vituperata interesset Te mei dolor primis omnis maiestatis no mea Ne mea viris putant repudiare id eos tation corpora platonem Ut cum copiosae singulis tota conceptam cu sit aperiri mediocritatem ne mel No eam etiam option voluptatibus usu ea ullum soluta laudem persius molestiae et qui No nec esse percipit salutatus duo ut facer placerat Eam ne postulant persequeris te nam quando tantas epicurei Sed cu facilis periculis facete scripta pri ad fastidii voluptua vel at Nulla populo ius in his dolores delectus mandamus id Vix cu nobis veniam adolescens te mel zril scaevola Ex alterum omnesque usu te quot quaerendum sed no sed audiam philosophia complectitur Te per consul cetero mnesarchum ea iudico instructior mei ex mei liber salutandi adolescens Audiam molestie euripidis eu vis te vix vide reque ponderum usu soleat partem admodum in Id maiorum argumentum mea everti percipitur ut eam Habemus suscipiantur delicatissimi vim eu ne mei officiis partiendo omittam corrumpit ad pri Eu nam virtute scribentur Ius illum dolorem molestie eu sea eu erat interpretaris Vis wisi consulatu ea Eruditi lobortis vulputate pri an quod tantas ullamcorper no has His an epicuri constituto tritani interesset per et ne audire ceteros qui Vim paulo petentium no exerci vocent scripserit an quo Eu stet aeterno per et novum detraxit pro In pro liber argumentum deleniti vituperata no pri Cu has accusata molestiae Modus tation consectetuer et vis et eius offendit consequuntur ius Duis nominati cotidieque nec ut est wisi omittam ne vel nominati praesent efficiantur ei Mei cu admodum deserunt reformidans consul officiis ne mei Ei alii nostro vis quo verear nostrud convenire id An esse iusto blandit eos Sale option necessitatibus ea has eum at putant possim periculis vel cu omnes alienum forensibus Et nec clita congue suscipit mel eu ignota aeterno platonem Quod vidisse ad vix ad usu nibh tota iusto Dolore discere dissentiet cum te pro amet dissentiet cu errem mucius dignissim quo id Ex eum ferri viris legimus disputationi qui et Cibo affert tritani cum ad nec quot justo audiam cu habeo nonumes ad eos Vix cu congue mentitum ad sit everti dignissim Ei hinc persecuti est est melius fabulas recusabo ei alia consul qualisque usu ut Ne mei iuvaret accusata perpetua Esse meis pri ne sint paulo integre mei ad Id est efficiantur suscipiantur agam discere ei nec Primis moderatius ea nam sed ut autem accommodare signiferumque natum fastidii per in Duis saperet delectus vix at Nemore mollis vix et sea illud veritus mandamus at Sit et oblique dolores scribentur nam case debitis tibique at Facer ludus doctus eu vix intellegam quaerendum in vis Qui te soluta impetus vituperatoribus Facer homero blandit est ex No dicta nominati gloriatur quo An vel populo insolens referrentur Causae iracundia his ex an nemore appetere qui Nec ei vidisse temporibus idque falli minim vim te Ei mel etiam dissentiet pericula qualisque constituam ex vix Duis similique quo te an vel tota electram signiferumque Eos ut affert platonem petentium"
words = string.split(" ")
//console.log(words.length)
var Node = function() {
	this.keys = new Map();
	this.end = false;
	this.setEnd = function() {
		this.end = true;
	};
	this.isEnd = function() {
		return this.end;
	};
};

var Trie = function() {

	this.root = new Node();

	this.add = function(input, node) {
		if (input.length == 0) {
			node.setEnd();
			return;
		} else if (!node.keys.has(input[0])) {
			node.keys.set(input[0], new Node());
			return this.add(input.substr(1), node.keys.get(input[0]));
		} else {
			return this.add(input.substr(1), node.keys.get(input[0]));
		};
	};

	this.isWord = function(word) {
		var node = this.root;
		while (word.length > 1) {
			if (!node.keys.has(word[0])) {
				return false;
			} else {
				node = node.keys.get(word[0]);
				word = word.substr(1);
			};
		};
		return (node.keys.has(word) && node.keys.get(word).isEnd()) ? 
      true : false;
	};

	this.print = function() {
		var words = new Array();
		var search = function(node, string) {
			if (node.keys.size != 0) {
				for (var varter of node.keys.keys()) {
					search(node.keys.get(varter), string.concat(varter));
				};
				if (node.isEnd()) {
					words.push(string);
				};
			} else {
				string.length > 0 ? words.push(string) : undefined;
				return;
			};
		};
		search(this.root, new String());
		return words.length > 0 ? words : mo;
	};

};

myTrie = new Trie()
/*for( i=0;i<words.length;i++){
    myTrie.add(words[i], myTrie.root)
}*/
myTrie.add('ball', myTrie.root); 
myTrie.add('bat', myTrie.root); 
myTrie.add('doll', myTrie.root); 
myTrie.add('dork', myTrie.root); 
myTrie.add('do', myTrie.root); 
myTrie.add('dorm', myTrie.root)
myTrie.add('send', myTrie.root)
myTrie.add('sense', myTrie.root)
console.log(myTrie.isWord('doll'))
console.log(myTrie.isWord('dor'))
console.log(myTrie.isWord('dorf'))
//console.log(myTrie.isWord('mollis'))
//console.log(myTrie.isWord('mullis'))
console.log(myTrie.print())

var george = new TrieModel({trie: myTrie})
george.save((err,trie)=>{
    if(err)
        console.log(err)
    else
        console.log("Saved")
})
