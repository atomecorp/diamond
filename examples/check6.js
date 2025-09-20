let u;

const __rubyIvarName = (name) => {
  const str = String(name ?? "");
  const clean = str.startsWith("@") ? str.slice(1) : str;
  return "__" + clean;
};

class Model {
  static attr_with_callback(name, callback) {
    this.prototype[name] = function() {
      return this[__rubyIvarName(`@${name}`)];
    };
    return this.prototype[`${name}=`] = function(value) {
      this[__rubyIvarName(`@${name}`)] = value;
      if (callback) {
        return callback(value);
      }
    };
  }
}
class User extends Model {
}
User.attr_with_callback("email", (new_email) => {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  });
u = new User();
u["email="]("alice@example.com");
u["email="]("bob@example.com");