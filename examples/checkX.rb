# ---  14th check   ---

def f(a, b=2, *rest, c:, d: 4, **kw, &blk); [a,b,rest,c,d,kw, blk.class]; end
f(1,3,4,5, c: 7, x: 9) { }
def g(...); f(...); end

puts g(1,3,4,5, c: 7, x: 9) { }


# ---  first check---

# Mini To-Do List en Ruby

class Task
  attr_accessor :title, :done

  def initialize(title)
    @title = title
    @done  = false
  end

  def mark_done
    @done = true
  end

  def to_s
    status = @done ? "[✔]" : "[ ]"
    "#{status} #{@title}"
  end
end

class TodoList
  def initialize
    @tasks = []
  end

  def add_task(title)
    @tasks << Task.new(title)
  end

  def show
    puts "\n--- Mes Tâches ---"
    @tasks.each_with_index do |task, i|
      puts "#{i + 1}. #{task}"
    end
  end

  def mark_task_done(index)
    task = @tasks[index - 1]
    task&.mark_done
  end
end

# --- Programme principal ---
list = TodoList.new

loop do
  puts "\n1. Ajouter une tâche"
  puts "2. Voir les tâches"
  puts "3. Marquer une tâche comme faite"
  puts "4. Quitter"
  print "> "
  choix = gets.to_i

  case choix
  when 1
    print "Nom de la tâche : "
    list.add_task(gets.chomp)
  when 2
    list.show
  when 3
    list.show
    print "Numéro de la tâche à cocher : "
    list.mark_task_done(gets.to_i)
  when 4
    puts "Au revoir !"
    break
  else
    puts "Choix invalide."
  end
end


# 2nd check
def avec_trois(val, val2, val3)
  yield(val, val2, val3) if block_given?
end

# Appel de la méthode avec un bloc
avec_trois(1, 2, 3) do |a, b|
  puts "a = #{a}, b = #{b}"
end

# 3rd check

a={toto: "titi", tata: :tutu}

puts(a["tata"])

# 4th check

a={"toto" => "titi", "tata" => "tutu"}

puts a.class


b=42

c=0.687654354654654
puts b
puts b.class
puts c
puts c.class

# 5th check

c=eval("puts('hi there')")
puts c.class


# 6th check

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

# 7th check

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

# 8th check


class Invoice
  def initialize(client, amount)
    @client = client
    @amount = amount
  end

  def to_text
    <<~INVOICE
      ======================
           FACTURE
      ======================
      Client : #{@client}
      Montant: #{@amount} €
      Date   : #{Time.now.strftime("%d/%m/%Y")}
      ======================
    INVOICE
  end
end

# --- Utilisation ---
invoice = Invoice.new("Alice Dupont", 250)
puts invoice.to_text


# 9th check 

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



# 10th check  

# Ruby >= 3.0

require "forwardable"

# 1) Refinement : ajoute une petite aide de parsing, uniquement dans le scope "using"
module StringPredicates
  refine String do
    def split_predicate
      # "age_gt" -> [:age, :>]
      attr, op = self.match(/\A(\w+)_(gt|lt|eq)\z/)&.captures
      return nil unless attr
      op_map = { "gt" => :>, "lt" => :<, "eq" => :== }.freeze
      [attr.to_sym, op_map.fetch(op)]
    end
  end
end

# 2) Mini-DSL de requêtage avec method_missing + Lazy + Forwardable
class Query
  extend Forwardable
  using StringPredicates

  def_delegators :@enum, :first, :to_a

  def initialize(enum)
    @enum = enum.lazy           # lazy pour chaîner sans tout évaluer
  end

  def where(&block)
    Query.new(@enum.select(&block))
  end

  # Interprète dynamiquement des prédicats du style age_gt(30), name_eq("Alice"), etc.
  def method_missing(name, *args, &)
    if (attr, op = name.to_s.split_predicate)
      value = args.fetch(0)      # lève si oublié → feedback utile
      return where { |row| (row[attr] || row[attr.to_s])&.public_send(op, value) }
    end
    super
  end

  def respond_to_missing?(name, _=false)
    !!name.to_s.split_predicate || super
  end
end

# --- Données mixtes (symboles + strings) ---
rows = [
  {name: "Alice", age: 30, role: "dev"},
  {"name" => "Bob", "age" => 25, "role" => "ops"},
  {name: "Cara", age: 35, role: "dev"}
].freeze

# --- Utilisation ---
q = Query.new(rows)
result = q.age_gt(28).where { (_1[:role] || _1["role"]) == "dev" }.to_a

# 3) Pattern matching pour formater proprement (hash à clés symboles ou strings)
result.each do |row|
  case row
  in { name:, age:, role: }                         # clés symboles
    puts "#{name} (#{age}) — #{role}"
  in { "name" => name, "age" => age, "role" => role } # clés strings
    puts "#{name} (#{age}) — #{role}"
  end
end

# 11th check

# ---  first  check---
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


# ---  second check---

class Universe
  # Un simple registre de callbacks
  def self.messages
    @messages ||= {}
  end

  # Pour enregistrer un callback lié à un id
  def self.on(message_id, &block)
    messages[message_id] = block
  end

  # Pour recevoir et exécuter
  def self.server_receiver(params)
    callback_found = messages[params[:message_id]]
    callback_found.call(params) if callback_found.is_a?(Proc)
  end
end

# --- Démo ---
Universe.on(:hello) do |params|
  puts "Message reçu: #{params[:content]}"
end

Universe.server_receiver(message_id: :hello, content: "Salut depuis Universe 👽")


# ---  third check---


class FileSystem
  def initialize(name)
    @name = name
  end

  def grab(parent)
    parent # ici on simplifie, `grab` retourne juste le parent
  end

  def file_handler(parent, filename, content, bloc)
    hash_content = { filename: filename, content: content }
    grab(parent).instance_exec(hash_content, &bloc)
  end
end

# --- Démo ---
class FileWorker
  def initialize(user)
    @user = user
  end

  def log(hash)
    puts "[#{@user}] traite le fichier: #{hash[:filename]}"
    puts "Contenu: #{hash[:content]}"
  end
end

fs = FileSystem.new("FS1")
worker = FileWorker.new("Alice")

fs.file_handler(worker, "notes.txt", "Hello World !", proc do |h|
  log(h)   # `self` = worker ici, grâce à instance_exec
end)

# ---  simple check---

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

# ---  11th check   ---

def test_equal(val=42)
  puts "val = #{val}"
end
test_equal


def test_multi(*val)
  puts "val = #{val}"
end

test_multi(1,2,3,4,5)

# ---  12th check   ---


def str_interpolate(name)
  "Hello, #{name}!"
end 

puts str_interpolate("Alice")

# ---  13th check   ---

def str_concat(str)
  str.to_i + 100
end

puts str_concat("12")




