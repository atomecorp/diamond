class Greeter
  def initialize(name)
    @name = name
  end

  def greet(times)
    i = 0
    while i < times
      puts "Hello #{@name}!"
      i += 1
    end
  end
end

Greeter.new("Jean").greet(2)
