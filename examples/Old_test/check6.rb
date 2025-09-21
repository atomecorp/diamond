class Model
  def self.attr_with_callback(name, &callback)
    # Création du getter
    define_method(name) do
      instance_variable_get("@#{name}")
    end

    # Création du setter
    define_method("#{name}=") do |value|
      instance_variable_set("@#{name}", value)
      callback.call(value) if callback
    end
  end
end

# --- Exemple d'utilisation ---
class User < Model
  attr_with_callback :email do |new_email|
    puts "📩 Email mis à jour: #{new_email}"
  end
end

u = User.new
u.email = "alice@example.com"   # => 📩 Email mis à jour: alice@example.com
u.email = "bob@example.com"     # => 📩 Email mis à jour: bob@example.com