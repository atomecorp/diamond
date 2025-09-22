let say;

const __rubyUpcaseBang = (value) => String(value ?? "").toUpperCase();

const __rubyTimes = (value, block) => {
  const numeric = Number(value);
  const count = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
  if (typeof block !== "function") {
    return Array.from({ length: count }, (_, index) => index);
  }
  for (let index = 0; index < count; index += 1) {
    block(index);
  }
  return value;
};

say = "I love Ruby";
console.log(say);
say["love"] = "*love*";
console.log((() => { say = __rubyUpcaseBang(say); return say; })());
__rubyTimes(5, (() => {
  let __self1 = this;
  const __block2 = function(...__args3) {
    return (function() {
  return console.log(say);
}).apply(__self1, __args3);
  };
  __block2.__rubyBind = (value) => {
    const __prev4 = __self1;
    __self1 = value;
    return () => {
      __self1 = __prev4;
    };
  };
  return __block2;
})());