class Greeter
  # This is a comment
  def initialize(name)
    @name = "#{name} is so cool!"
  end

  def message
    "Hello #{@name}!"
  end
end

greeter = Greeter.new("World")
result = greeter.message()
document.getElementById('output').textContent = result
# This is a comment
puts("hello world!!")


a={"toto" => "titi", "tata" => "tutu"}
puts(a)
b=a["toto"]
puts b

c=eval("a['tata']")
puts(c)


d=a["tutu"]
 puts(d) # nil

puts 'end of file'