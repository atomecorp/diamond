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