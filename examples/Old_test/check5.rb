class MyDynamicClass
  def self.my_attr_accessor(*names)
    names.each do |name|
      # Getter
      define_method(name) do
        instance_variable_get("@#{name}")
      end

      # Setter
      define_method("#{name}=") do |value|
        instance_variable_set("@#{name}", value)
      end
    end
  end

  # On crée dynamiquement : name, age
  my_attr_accessor :name, :age
end

# --- Utilisation ---
obj = MyDynamicClass.new
obj.name = "Alice"
obj.age  = 30

puts obj.name  # => "Alice"
puts obj.age   # => 30