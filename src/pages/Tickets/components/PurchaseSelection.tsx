/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { Plus, Minus, Info, ArrowLeftIcon } from "lucide-react";
import { formatCurrency } from "../../../utils";
import SeatPicker from "./SeatPicker";

interface PurchaseSelectionProps {
  showtime: any;
  availableProducts: any[];
  totalAvailableProducts: number;
  onLoadMoreProducts: () => void;
  ticketQuantity: number;
  setTicketQuantity: (q: number) => void;
  selectedProducts: { product_id: string; quantity: number; name: string; price: number }[];
  setSelectedProducts: (products: any[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  isBoxOfficeMode: boolean;
  seatMap: { has_seat_map: boolean; seats: any[] } | null;
  seatMapLoading: boolean;
  selectedSeatIds: string[];
  setSelectedSeatIds: (seatIds: string[]) => void;
}

export default function PurchaseSelection({
  showtime,
  availableProducts,
  totalAvailableProducts,
  onLoadMoreProducts,
  ticketQuantity,
  setTicketQuantity,
  selectedProducts,
  setSelectedProducts,
  onConfirm,
  onBack, isBoxOfficeMode,
  seatMap,
  seatMapLoading,
  selectedSeatIds,
  setSelectedSeatIds,
}: PurchaseSelectionProps) {
  const hasSeatMap = Boolean(seatMap?.has_seat_map);

  // Picking seats sets the ticket count; with none picked the first free seats are assigned.
  const handleSeatChange = (seatIds: string[]) => {
    setSelectedSeatIds(seatIds);
    if (seatIds.length) setTicketQuantity(seatIds.length);
  };
  
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
        {isBoxOfficeMode ? "" : (
          <Button
            onClick={onBack}
            variant="outline"
            title="Back"
            icon={<ArrowLeftIcon />}
            className="rounded-md"
          />
        )}
        <h2 className="text-xl font-sans font-semibold text-foreground">Tickets & Concessions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ticket Section */}
        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 group">
            <h3 className="text-base font-extrabold text-stone-900">1. Select Tickets</h3>
            <Info className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#fff8ea]/70 border border-[#c77e3b]/20 rounded-xl">
            <div>
              <p className="font-bold text-stone-900">Standard Admission</p>
              <p className="text-sm font-semibold text-[#c77e3b]">
                {formatCurrency(showtime?.price || 0)} per ticket
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Included concessions:{" "}
                {showtime?.products?.map((product: any) => product.name).join(", ") || "None"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTicketQuantity(Math.max(0, ticketQuantity - 1))}
                className="w-9 h-9 flex items-center justify-center border border-[#c77e3b]/30 bg-white rounded-xl hover:bg-[#c77e3b] hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                disabled={ticketQuantity === 0 || selectedSeatIds.length > 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-extrabold text-stone-900">
                {ticketQuantity}
              </span>
              <button
                onClick={() => setTicketQuantity(ticketQuantity + 1)}
                className="w-9 h-9 flex items-center justify-center border border-[#c77e3b]/30 bg-white rounded-xl hover:bg-[#c77e3b] hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                disabled={selectedSeatIds.length > 0}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(hasSeatMap || seatMapLoading) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-sans font-semibold text-sm">Choose seats</p>
                {selectedSeatIds.length > 0 && (
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => setSelectedSeatIds([])}
                  >
                    Clear seats
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: leave empty to get the first free seats.
              </p>
              <SeatPicker
                seats={seatMap?.seats || []}
                loading={seatMapLoading}
                selectedSeatIds={selectedSeatIds}
                onChange={handleSeatChange}
              />
            </div>
          )}
        </div>

        {/* Concessions Section */}
        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
          <h3 className="text-base font-extrabold text-stone-900 mb-4">2. Add Concessions</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {availableProducts?.length === 0 ? (
              <p className="text-center text-stone-500 py-8 text-sm">
                No concessions available at this time.
              </p>
            ) : (
              availableProducts?.map((product) => (
                <div
                  key={product.product_id}
                  className="flex items-center justify-between p-3 border border-stone-200/80 rounded-xl hover:border-[#c77e3b]/50 bg-[#fff8ea]/30 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-[#fff8ea] border border-[#c77e3b]/25 rounded-xl flex items-center justify-center">
                      <span className="text-sm text-[#c77e3b] font-extrabold">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-800">{product.name}</p>
                      <p className="text-xs text-[#754f2c] font-semibold">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleProductQuantity(product, -1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#c77e3b]/30 bg-white rounded-lg hover:bg-[#c77e3b] hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                      disabled={getProductQuantity(product.product_id) === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-stone-900">
                      {getProductQuantity(product.product_id)}
                    </span>
                    <button
                      onClick={() => handleProductQuantity(product, 1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#c77e3b]/30 bg-white rounded-lg hover:bg-[#c77e3b] hover:text-white cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
            {availableProducts.length < totalAvailableProducts && (
                <div className="pt-2 text-center">
                    <button 
                        onClick={onLoadMoreProducts}
                        className="text-[10px] cursor-pointer font-bold uppercase tracking-wider hover:underline"
                    >
                        Load More Concessions...
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onConfirm}
          disabled={ticketQuantity === 0}
          className="w-full md:w-auto px-10 py-3.5 text-base"
          title="Proceed to Payment"
        />
      </div>
    </div>
  );
}
