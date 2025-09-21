def avec_trois(val, val2, val3)
  yield(val, val2, val3) if block_given?
end

# Appel de la méthode avec un bloc
avec_trois(1, 2, 3) do |a, b|
  puts "a = #{a}, b = #{b}"
end
