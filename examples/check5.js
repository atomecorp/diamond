let obj;

const __rubyIvarName = (name) => {
  const str = String(name ?? "");
  const clean = str.startsWith("@") ? str.slice(1) : str;
  return "__" + clean;
};

class MyDynamicClass {
  static my_attr_accessor(...names) {
    return names.forEach((name) => {
      this.prototype[name] = function() {
        return this[__rubyIvarName(`@${name}`)];
      };
      return this.prototype[`${name}=`] = function(value) {
        return this[__rubyIvarName(`@${name}`)] = value;
      };
    });
  }
}
MyDynamicClass.my_attr_accessor("name", "age");
obj = new MyDynamicClass();
obj["name="]("Alice");
obj["age="](30);
console.log(obj.name());
console.log(obj.age());