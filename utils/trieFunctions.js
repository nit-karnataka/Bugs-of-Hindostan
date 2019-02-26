let Node = require('./Node');
let Trie = require('./Trie');

let trieFunctions = {}

trieFunctions.add = function(node, input) {
    if (input.length == 0) {
        node.end = true;
        return;
    } else if (!node.keys.has(input[0])) {
        console.log("Hi");
        node.keys.set(String(input[0]), new Node());
        return trieFunctions.add(node.keys.get(input[0]), input.substr(1));
    } else {
        return trieFunctions.add(node.keys.get(input[0]), input.substr(1));
    };
};

trieFunctions.isWord = function(root, word) {
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

module.exports = trieFunctions;