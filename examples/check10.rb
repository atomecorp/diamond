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