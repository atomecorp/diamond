## DOM integration test
# UI demo: create a styled div with gradient + shadow, and wire interactions

on_ready = -> {
# Container full-screen with gradient background
container = document.createElement('div')
container['style']['width'] = '100%'
container['style']['height'] = '100vh'
container['style']['margin'] = '0'
container['style']['display'] = 'flex'
container['style']['alignItems'] = 'center'
container['style']['justifyContent'] = 'center'
container['style']['background'] = 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)'
container['style']['position'] = 'relative'
document['body'].appendChild(container)

# Draggable, resizable card
box = document.createElement('div')
box['style']['width'] = '220px'
box['style']['height'] = '140px'
box['style']['borderRadius'] = '16px'
box['style']['boxShadow'] = '0 10px 25px rgba(0,0,0,.25)'
box['style']['background'] = 'linear-gradient(135deg, #6EE7F9 0%, #9333EA 100%)'
box['style']['position'] = 'relative'
box['style']['cursor'] = 'grab'
box['style']['userSelect'] = 'none'
box['style']['transform'] = 'translate(0px, 0px)'
box['style']['transition'] = 'transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease'
container.appendChild(box)

label = document.createElement('div')
label['style']['color'] = '#fff'
label['style']['fontFamily'] = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
label['style']['fontSize'] = '14px'
label['style']['padding'] = '12px'
label['innerText'] = 'Click / Tap / Drag me'
box.appendChild(label)

# Resize handle (bottom-right)
handle = document.createElement('div')
handle['style']['position'] = 'absolute'
handle['style']['right'] = '6px'
handle['style']['bottom'] = '6px'
handle['style']['width'] = '14px'
handle['style']['height'] = '14px'
handle['style']['borderRadius'] = '3px'
handle['style']['background'] = 'rgba(255,255,255,.85)'
handle['style']['boxShadow'] = '0 1px 3px rgba(0,0,0,.3)'
handle['style']['cursor'] = 'nwse-resize'
box.appendChild(handle)

# Hover animation
box.addEventListener('mouseenter', ->(e) {
  box['style']['boxShadow'] = '0 14px 32px rgba(0,0,0,.32)'
})
box.addEventListener('mouseleave', ->(e) {
  box['style']['boxShadow'] = '0 10px 25px rgba(0,0,0,.25)'
})

# Click / Tap
box.addEventListener('click', ->(e) { console.log('clicked') })
box.addEventListener('touchstart', ->(e) { console.log('tap') })

# Drag logic
dragging = false
startX = 0
startY = 0
boxX = 0.0
boxY = 0.0

parse_translate = ->(t) {
  m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.match(t)
  if m
    [m[1].to_f, m[2].to_f]
  else
    [0.0, 0.0]
  end
}

startDrag = ->(clientX, clientY) {
  dragging = true
  box['style']['cursor'] = 'grabbing'
  box['style']['transition'] = 'none'
  startX = clientX
  startY = clientY
  coords = parse_translate.call(box['style']['transform'] || '')
  boxX = coords[0]
  boxY = coords[1]
}

moveDrag = ->(clientX, clientY) {
  return unless dragging
  dx = clientX - startX
  dy = clientY - startY
  box['style']['transform'] = "translate(#{(boxX + dx).to_i}px, #{(boxY + dy).to_i}px)"
}

stopDrag = -> {
  dragging = false
  box['style']['cursor'] = 'grab'
  box['style']['transition'] = 'transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease'

}

# Mouse drag
box.addEventListener('mousedown', ->(e) {
  startDrag.call(e['clientX'], e['clientY'])
  e['preventDefault'].call()
})
document.addEventListener('mousemove', ->(e) {
  moveDrag.call(e['clientX'], e['clientY'])
})
document.addEventListener('mouseup', ->(e) { stopDrag.call() })

# Touch drag
box.addEventListener('touchstart', ->(e) {
  t = e['touches'][0]
  startDrag.call(t['clientX'], t['clientY'])
})
document.addEventListener('touchmove', ->(e) {
  t = e['touches'][0]
  moveDrag.call(t['clientX'], t['clientY'])
})
document.addEventListener('touchend', ->(e) { stopDrag.call() })

# Resize logic
resizing = false
startW = 0
startH = 0

handle.addEventListener('mousedown', ->(e) {
  resizing = true
  startX = e['clientX']
  startY = e['clientY']
  startW = box['offsetWidth']
  startH = box['offsetHeight']
  e['stopPropagation'].call()
  e['preventDefault'].call()
})

document.addEventListener('mousemove', ->(e) {
  if resizing
    dw = e['clientX'] - startX
    dh = e['clientY'] - startY
    w = [100, (startW + dw)].max.to_i
    h = [80, (startH + dh)].max.to_i
    box['style']['width'] = "#{w}px"
    box['style']['height'] = "#{h}px"
  end
})
document.addEventListener('mouseup', ->(e) { resizing = false })

# Simple drop zone
dropzone = document.createElement('div')
dropzone['style']['position'] = 'absolute'
dropzone['style']['top'] = '20px'
dropzone['style']['left'] = '20px'
dropzone['style']['width'] = '120px'
dropzone['style']['height'] = '80px'
dropzone['style']['border'] = '2px dashed rgba(255,255,255,.75)'
dropzone['style']['borderRadius'] = '8px'
dropzone['style']['color'] = '#fff'
dropzone['style']['display'] = 'flex'
dropzone['style']['alignItems'] = 'center'
dropzone['style']['justifyContent'] = 'center'
dropzone['innerText'] = 'Drop here'
container.appendChild(dropzone)

isOver = ->(el, x, y) {
  r = el['getBoundingClientRect'].call()
  x >= r['left'] && x <= r['right'] && y >= r['top'] && y <= r['bottom']
}

document.addEventListener('mouseup', ->(e) {
  if isOver.call(dropzone, e['clientX'], e['clientY'])
    box['style']['transform'] = 'translate(20px, 20px)'
    console.log('dropped')
  end
})
}

if document['readyState'] == 'loading'
  document.addEventListener('DOMContentLoaded', on_ready)
else
  on_ready.call
end





# examples/full.rb
puts "----- Full example -----"
# Output "I love Ruby"
say = "I love Ruby"
puts say

# Output "I *LOVE* RUBY"
say['love'] = "*love*"
puts say.upcase!

# Output "I *love* Ruby"
# five times
5.times { puts say }


# ---  zeroth check---  
a= 'hello world'
a.capitalize!
puts a
a.reverse!
puts a
a.upcase!
puts a
a.downcase!
puts a
b= a.swapcase
puts b

# new test 1
puts "----- new test 1 -----"
# Ruby sait ce que vous
# voulez vraiment faire,
# même avec des tableaux.
villes   = %w[ Londres
               Oslo
               Paris
               Amsterdam
               Berlin ]
visitees = %w[Berlin Oslo]

restantes = villes - visitees
puts "Encore à visiter :"
puts restantes


#new test 2
     
class Majordome
  def initialize(nom)
    @nom = nom.capitalize
  end

  def saluer
    puts "Bonjour #{@nom} !"
  end
end

# Créer un nouvel objet
m = Majordome.new("patron")

# « Bonjour Patron ! »
m.saluer

# ---  verification 2  ---


class C
  def [](k); k*2; end
  def []=(k,v); @h ||= {}; @h[k]=v; end
  def +@; :plus_unary; end
  def -@; :minus_unary; end
  def coerce(o); [o, self]; end
end

#---  vverificationerfi 3  ---

class K
  private
  def secret; :ok; end
  class << self
    def cm; :class_method; end
  end
  def self.alt; :alt; end
end
obj = K.new
K.define_singleton_method(:dyn) { :dyn }

#---  verification 4  ---
module M; def z; :m; end; end
class D; include M; extend M; prepend M; end
module N; module_function; def mf; :mf; end; end

#---  verification 5 ---
module Hooks
  def self.included(base); base.const_set(:X, 1); end
  def self.method_added(name); end
end

#---  verification 6  ---

begin
  raise ArgumentError, "bad"
rescue ArgumentError => e
  e.class
ensure
  :always
end
x = (1/0 rescue :err)

#---  verification 7  ---
t = Thread.new { Thread.current[:foo] = 1 }
f = Fiber.new { Fiber.yield 1; 2 }
e = Enumerator.new { |y| y << 1; y << 2 }

#---  verification 8  ---
File.open(__FILE__, "r") { |f| f.gets }

#---  verification 9  ---
a = %w[a b c]
r = /(\d+)\s+(?<name>\w+)/
h = <<~HEREDOC
  leading
HEREDOC
puts a[1], r.match("123 abc")[:name], h
#---  verification 10  ---
case [1,2,3]
in [a, *rest] if a > 0
  [a,rest]
end
x = 1
case {x:1}
in { x: ^x } then :same end


#---  verification 11  ---

# frozen_string_literal: true
MYCONST = Struct.new(:a).new(1).freeze

#---  verification 12  ---

x = -1
y = 1 if true
z = (a = 1) ? :t : :f

#---  verification 13  ---


b = binding
eval("1+1", b)
TracePoint.new(:call) { |tp| }.enable { }

#---  verification 14  ---

def multi; yield 1; yield 2; end
[1,2].map(&:to_s)

#---  verification 15  ---
catch(:k) { throw :k, :val }
1.tap { |v| v+1 }.then { |v| v*2 }



# ---  17th check---

p 'hello'.split.map(&:capitalize).join(' ')
# ---  16th check---

 puts "----- 16th check -----"
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



# ---  15th  check---

puts "----- 15th check -----"
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


# ---  14th check   ---
puts "----- 14th check -----"
def f(a, b=2, *rest, c:, d: 4, **kw, &blk); [a,b,rest,c,d,kw, blk.class]; end
f(1,3,4,5, c: 7, x: 9) { }
def g(...); f(...); end

puts g(1,3,4,5, c: 7, x: 9) { }

# ---  13th check   ---
puts "----- 13th check -----"
def str_concat(str)
  str.to_i + 100
end

puts str_concat("12")


# ---  12th check   ---
puts "----- 12th check -----"

def str_interpolate(name)
  "Hello, #{name}!"
end 

puts str_interpolate("Alice")



# ---  11th check   ---
puts "----- 11th check -----"
def test_equal(val=42)
  puts "val = #{val}"
end
test_equal


def test_multi(*val)
  puts "val = #{val}"
end

test_multi(1,2,3,4,5)


# 10th check  
puts "----- 10th check -----"
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



# 9th check 
puts "----- 9th check -----"
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



# 8th check
puts "----- 8th check -----"

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



# 7th check
puts "----- 7th check -----"
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



# 6th check
puts "----- 6th check -----"
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




# 5th check
puts "----- 5th check -----"
c=eval("puts('hi there')")
puts c.class

# 4th check
puts "----- 4th check -----"  
a={"toto" => "titi", "tata" => "tutu"}

puts a.class


b=42

c=0.687654354654654
puts b
puts b.class
puts c
puts c.class


# 3rd check
puts "----- 3rd check -----"
a={toto: "titi", tata: :tutu}

puts(a[:tata])




# ---  second check---
puts "----- 2nd check -----"
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








# 2nd check
def avec_trois(val, val2, val3)
  yield(val, val2, val3) if block_given?
end

# Appel de la méthode avec un bloc
avec_trois(1, 2, 3) do |a, b|
  puts "a = #{a}, b = #{b}"
end


# --- 1st  check ---
puts "----- 1st check -----"
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







# ---   check---
puts "----- 0st check -----"
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

