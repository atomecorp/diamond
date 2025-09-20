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