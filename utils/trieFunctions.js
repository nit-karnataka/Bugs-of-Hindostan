const Node = require('./Node');
const Trie = require('./Trie');

const treeFunctions = {}

treeFunctions.add = function(node, input) {
    if (input.length == 0) {
        node.end = true;
        return;
    } else if (!node.keys.has(input[0])) {
        node.keys.set(String(input[0]), new Node());
        return treeFunctions.add(node.keys.get(input[0]), input.substr(1));
    } else {
        return treeFunctions.add(node.keys.get(input[0]), input.substr(1));
    };
};

treeFunctions.isWord = function(root, word) {
    var node = root;
    while (word.length > 1) {
        var tempNode = node.keys[word[0]];
        if (!tempNode) {
            return false;
        } else {
            node = tempNode;
            word = word.substr(1);
        };
    };
    node = node.keys[word];
    if(!node) return false;
    else return (node.end === true);
};

treeFunctions.print = function(root) {
    var words = new Array();
    var search = function(node, string) {
        if (node.keys.size != 0) {
            for (var varter of node.keys.keys()) {
                search(node.keys.get(varter), string.concat(varter));
            };
            if (node.end === true) {
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

module.exports = treeFunctions;