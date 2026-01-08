/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { Plus, Minus, Info } from "lucide-react";
import { formatCurrency } from "../../../utils";

interface PurchaseSelectionProps {
  showtime: any;
  availableProducts: any[];
  ticketQuantity: number;
  setTicketQuantity: (q: number) => void;
  selectedProducts: { product_id: string; quantity: number; name: string; price: number }[];
  setSelectedProducts: (products: any[]) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function PurchaseSelection({
  showtime,
  availableProducts,
  ticketQuantity,
  setTicketQuantity,
  selectedProducts,
  setSelectedProducts,
  onConfirm,
  onBack,
}: PurchaseSelectionProps) {
  
  const handleProductQuantity = (product: any, delta: number) => {
    const existing = selectedProducts.find(p => p.product_id === product.product_id);
    if (existing) {
      const newQuantity = Math.max(0, existing.quantity + delta);
      if (newQuantity === 0) {
        setSelectedProducts(selectedProducts.filter(p => p.product_id !== product.product_id));
      } else {
        setSelectedProducts(selectedProducts.map(p => 
          p.product_id === product.product_id ? { ...p, quantity: newQuantity } : p
        ));
      }
    } else if (delta > 0) {
      setSelectedProducts([...selectedProducts, { 
        product_id: product.product_id, 
        quantity: 1, 
        name: product.name, 
        price: product.price 
      }]);
    }
  };

  const getProductQuantity = (productId: string) => {
    return selectedProducts.find(p => p.product_id === productId)?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
        />
        <h2 className="text-xl font-sans font-semibold text-foreground">Tickets & Concessions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Section */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 group">
            <h3 className="text-lg font-sans font-bold">1. Select Tickets</h3>
            <Info className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-sans font-semibold">Ticket</p>
              <p className="text-sm text-muted-foreground font-serif">Price per ticket: {formatCurrency(showtime?.price || 0)}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTicketQuantity(Math.max(0, ticketQuantity - 1))}
                className="w-10 h-10 flex items-center justify-center border-2 rounded-full hover:bg-muted transition-colors"
                disabled={ticketQuantity === 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xl font-sans font-bold">{ticketQuantity}</span>
              <button
                onClick={() => setTicketQuantity(ticketQuantity + 1)}
                className="w-10 h-10 flex items-center justify-center border-2 rounded-full hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Concessions Section */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-sans font-bold mb-4">2. Add Concessions</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {availableProducts?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No concessions available at this time.</p>
            ) : (
              availableProducts?.map((product) => (
                <div key={product.product_id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                       {/* Placeholder for product image */}
                       <span className="text-xs text-muted-foreground font-bold">{product.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-sans font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-serif">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleProductQuantity(product, -1)}
                      className="p-1 border rounded hover:bg-muted disabled:opacity-30"
                      disabled={getProductQuantity(product.product_id) === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-sans font-semibold">
                      {getProductQuantity(product.product_id)}
                    </span>
                    <button
                      onClick={() => handleProductQuantity(product, 1)}
                      className="p-1 border rounded hover:bg-muted"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onConfirm}
          disabled={ticketQuantity === 0 && selectedProducts.length === 0}
          className="w-full md:w-auto px-12 rounded-xl py-6 h-auto text-lg font-bold shadow-lg shadow-primary/20"
          title="Proceed to Payment"
        />
      </div>
    </div>
  );
}
