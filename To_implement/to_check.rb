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