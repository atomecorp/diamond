let processed;
let remove_short;
let reverse_text;
let text;
let to_capitalize;

const __rubyStrip = (value) => String(value ?? "").trim();

const __rubySplit = (value) => String(value ?? "").split(/\s+/);

const __rubyReverse = (value) => String(value ?? "").split("").reverse().join("");

const __rubyCapitalize = (value) => {
  const str = String(value ?? "");
  if (!str.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const __rubySymbolProc = (name) => {
  switch (name) {
    case "capitalize":
      return (value) => __rubyCapitalize(value);
    default:
      return (value, ...rest) => {
        if (value == null) return value;
        const method = value[name];
        return typeof method === "function" ? method.apply(value, rest) : value;
      };
  }
};

class TextProcessor {
  constructor(text) {
    this.__text = text;
  }
  transform(__block) {
    if (typeof __block === 'function') {
      this.__text = __block ? __block(this.__text) : undefined;
    }
    return this;
  }
  apply(proc) {
    this.__text = proc(this.__text);
    return this;
  }
  result() {
    return this.__text;
  }
}
to_capitalize = (str) => {
  return __rubySplit(str).map(__rubySymbolProc("capitalize")).join(" ");
};
remove_short = function(str) {
  return __rubySplit(str).filter((_1) => {
    return _1.length > 3;
  }).join(" ");
};
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = new TextProcessor(text).transform((_1) => {
  return __rubyStrip(_1);
}).apply(to_capitalize).apply(remove_short).apply(reverse_text).result();
console.log(processed);