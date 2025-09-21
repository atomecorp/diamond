# Une mini "pipeline" de transformation de texte

class TextProcessor
  def initialize(text)
    @text = text
  end

  # Applique un block directement
  def transform
    @text = yield(@text) if block_given?
    self
  end

  # Accepte un Proc ou lambda
  def apply(proc)
    @text = proc.call(@text)
    self
  end

  def result
    @text
  end
end

# --- Définition de lambdas et proc ---
to_capitalize = ->(str) { str.split.map(&:capitalize).join(" ") }
remove_short  = Proc.new { |str| str.split.select { _1.size > 3 }.join(" ") }
reverse_text  = ->(str) { str.reverse }

# --- Utilisation ---
text = "bonjour à tous les amis du ruby"

processed = TextProcessor.new(text)
  .transform { _1.strip }     # block simple
  .apply(to_capitalize)       # lambda capitalize chaque mot
  .apply(remove_short)        # proc filtre les mots trop courts
  .apply(reverse_text)        # lambda reverse
  .result

puts processed