var treeFunctions = {}

var Node = function() {
	this.keys = new Map();
	this.end = false;
};

treeFunctions.add = function(node, input) {
    if (input.length == 0) {
        node.end = true;
        return;
    } else if (!node.keys.hasOwnProperty(input[0])) {
        node.keys.set(input[0], new Node());
        return treeFunctions.add(node.keys.get(input[0]), input.substr(1));
    } else {
        return treeFunctions.add(node.keys.get(input[0]), input.substr(1));
    };
};

treeFunctions.isWord = function(root, word) {
    var node = root;
    while (word.length > 1) {
        if (!node.keys.has(word[0])) {
            return false;
        } else {
            node = node.keys.get(word[0]);
            word = word.substr(1);
        };
    };
    return (node.keys.has(word) && (node.keys.get(word) === true)) ? true : false;
};

treeFunctions.print = function(root) {
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
    search(root, new String());
    return words.length > 0 ? words : mo;
};



var Trie = function() {
	this.root = new Node();
};

//module.exports = { treeFunctions, Trie };
module.exports.treeFunctions = treeFunctions
module.exports.Trie = Trie
module.exports.Node = Node
