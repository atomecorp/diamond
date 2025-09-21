class Contexte
  attr_accessor :val, :val2, :val3

  def initialize(val, val2, val3)
    @val  = val
    @val2 = val2
    @val3 = val3
  end

  # Méthode qui exécute un bloc dans le contexte de l'instance
  def exec(&bloc)
    instance_eval(&bloc)
  end
end

# Exemple d'utilisation
obj = Contexte.new(10, 20, 30)

obj.exec do
  puts "val  = #{val}"
  puts "val2 = #{val2}"
  puts "val3 = #{val3}"
end