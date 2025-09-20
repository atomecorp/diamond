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