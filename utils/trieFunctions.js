let Node = require('./Node');
let Trie = require('./Trie');

let trieFunctions = {}

trieFunctions.add = function(node, input) {
    if (input.length == 0) {
        node.end = true;
        return;
    } else if (!node.keys.has(input[0])) {
        node.keys.set(String(input[0]), new Node());
        return trieFunctions.add(node.keys.get(input[0]), input.substr(1));
    } else {
        return trieFunctions.add(node.keys.get(input[0]), input.substr(1));
    };
};

trieFunctions.isWord = function(root, word) {
    var node = root;
    while (word.length > 1) {
        if (!node.keys.hasOwnProperty(word[0])) {
            return false;
        } else {
            node = node.keys[word[0]];
            word = word.substr(1);
        };
    };
    if(node.keys.hasOwnProperty(word)) {
        node = node.keys[word];
        return (node.end === true);
    }
    return false;
};

trieFunctions.print = function(root) {
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
    return words.length > 0 ? words : null;
};

module.exports = trieFunctions;