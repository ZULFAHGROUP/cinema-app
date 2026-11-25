/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Button from "../../components/shared/Button";
import ReusableSelect from "../../components/shared/Select";
import Input from "../../components/shared/Input";
import { Users, Plus, Loader2 } from "lucide-react";
import MovieSelection from "./components/MovieSelection";
import ShowtimeSelection from "./components/ShowtimeSelection";
import PurchaseSelection from "./components/PurchaseSelection";
import PaymentSummary from "./components/PaymentSummary";
import BookingSummary from "./components/BookingSummary";
import StepIndicator from "./components/StepIndicator";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllMovies } from "../../store/slices/movie";
import { getAllShowtimes, getShowtimePrice } from "../../store/slices/showtime";
import { getAvailableProducts } from "../../store/slices/product";
import { initiatePurchase, resetPurchase } from "../../store/slices/purchase";
import { toast } from "react-toastify";
import { getHumanTime } from "../../utils";
import { clearShowtimeSeats, getShowtimeSeats } from "../../store/slices/seat";
import { newIdempotencyKey } from "../../services/httpClient";
import { isAdminRole } from "../../utils/permissions";

function TicketSalesPage() {
  const [currentStep, setCurrentStep] = useState("movie-selection");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  // One key per purchase attempt, reused on retries so the order isn't created twice.
  const purchaseKey = useRef<string | null>(null);
  const [movieLimit, setMovieLimit] = useState(10);
  const [showtimeLimit, setShowtimeLimit] = useState(10);
  const [availableProductLimit, setAvailableProductLimit] = useState(10);
  const [isBoxOfficeMode, setIsBoxOfficeMode] = useState(false);

  const dispatch = useAppDispatch();
  const { movies, moviesLoading, total: totalMovies } = useAppSelector((state) => state.movie);
  const { showtimes, selectedShowtimePrice, total: totalShowtimes } = useAppSelector((state) => state.showtime);
  const { availableProducts, availableProductTotal } = useAppSelector((state) => state.product);
  const { initiateLoading, initiateData } = useAppSelector((state) => state.purchase);
  const { showtimeSeatMap, showtimeSeatsLoading } = useAppSelector((state) => state.seat);
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = isAdminRole(user);
  const scopedCinemaId = !isAdmin ? user?.cinema_id : user?.scoped_cinema_id || "";

  const loadSeats = (showtimeId?: string) => {
    setSelectedSeatIds([]);
    if (showtimeId) dispatch(getShowtimeSeats(showtimeId));
    else dispatch(clearShowtimeSeats());
  };

  useEffect(() => {
    dispatch(getAllMovies({ page: 1, limit: movieLimit }));
    dispatch(getAvailableProducts({ page: 1, limit: availableProductLimit }));
  }, [dispatch, movieLimit, availableProductLimit]);

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    dispatch(getAllShowtimes({ page: 1, limit: showtimeLimit })); // Ideally filter by movie_id if supported
    setCurrentStep("showtime-selection");
  };

  useEffect(() => {
    if (selectedMovie) {
      dispatch(getAllShowtimes({ page: 1, limit: showtimeLimit }));
    }
  }, [dispatch, selectedMovie, showtimeLimit]);

  const handleShowtimeSelect = async (showtime: any) => {
    setSelectedShowtime(showtime);
    loadSeats(showtime.showtime_id);
    try {
      await dispatch(getShowtimePrice(showtime.showtime_id)).unwrap();
      setCurrentStep("purchase-selection");
    } catch (err) {
      toast.error("Failed to fetch showtime price");
    }
  };

  const handlePurchaseConfirm = async () => {
    const payload = {
      showtime_id: selectedShowtime?.showtime_id,
      ticket_quantity: selectedSeatIds.length || ticketQuantity,
      // Without seat_ids the first free seats are assigned.
      ...(selectedSeatIds.length ? { seat_ids: selectedSeatIds } : {}),
      extra_products: selectedProducts.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity
      }))
    };

    purchaseKey.current ??= newIdempotencyKey();
    const resultAction = await dispatch(
      initiatePurchase({ payload, idempotencyKey: purchaseKey.current })
    );

    if (initiatePurchase.fulfilled.match(resultAction)) {
      purchaseKey.current = null;
      setCurrentStep("payment-summary");
      return;
    }

    const { message, statusCode } = (resultAction.payload as any) || {};
    toast.error(message || "Failed to initiate purchase");
    if (statusCode === 409 && selectedShowtime) {
      // Not enough seats, or a chosen seat was just taken: show the current map.
      loadSeats(selectedShowtime.showtime_id);
    }
    if (statusCode === 422) {
      // Same key with a different order: treat it as a new attempt.
      purchaseKey.current = null;
    }
  };

  const handlePay = () => {
    if (initiateData?.authorization_url) {
      window.location.href = initiateData.authorization_url;
    }
  };

  const resetBooking = () => {
    dispatch(resetPurchase());
    setCurrentStep("movie-selection");
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setTicketQuantity(1);
    setSelectedProducts([]);
    loadSeats();
    purchaseKey.current = null;
  };

  // Filter showtimes by selected movie and staff's assigned cinema (if non-Admin or scoped)
  const filteredShowtimes = showtimes.filter(
    (s: any) =>
      s.movie_id === selectedMovie?.movie_id &&
      (!scopedCinemaId || s.screen?.cinema_id === scopedCinemaId)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-sans font-bold text-foreground">
              Ticket Sales
            </h1>
            <p className="text-muted-foreground font-serif">
              Box office and online bookings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsBoxOfficeMode(!isBoxOfficeMode)}
              className="gap-2 rounded-full px-6"
              variant={isBoxOfficeMode ? "primary" : "outline"}
              icon={<Users className="w-4 h-4" />}
              title={isBoxOfficeMode ? "Exit Box Office" : "Box Office Mode"}
            />
            <Button
              onClick={resetBooking}
              className="gap-2 rounded-full px-6"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              title="New Sale"
            />
          </div>
        </div>

        {/* Step Indicator - Hidden in Box Office Mode */}
        {!isBoxOfficeMode && <StepIndicator currentStep={currentStep} />}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1 min-h-[500px]">
            {moviesLoading ? (
               <div className="flex items-center justify-center h-full">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
            ) : (
              <>
                {/* Box Office Mode - Form-Based Interface */}
                {isBoxOfficeMode ? (
                  <div className="max-w-4xl">
                    <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
                      <h2 className="text-2xl font-sans font-bold mb-6">Quick Sale</h2>
                      
                      {/* Movie Selection */}
                      <ReusableSelect
                        label="Select Movie"
                        value={selectedMovie?.movie_id || ""}
                        onChange={(value) => {
                          const movie = movies.find((m: any) => m.movie_id === value);
                          setSelectedMovie(movie);
                          setSelectedShowtime(null);
                          loadSeats();
                        }}
                        options={movies.map((movie: any) => ({
                          value: movie.movie_id,
                          label: movie.title
                        }))}
                        defaultOption="Choose a movie"
                        showSearch={true}
                      />

                      {/* Showtime Selection */}
                      <ReusableSelect
                        label="Select Showtime"
                        value={selectedShowtime?.showtime_id || ""}
                        onChange={async (value) => {
                          const showtime = filteredShowtimes.find((s: any) => s.showtime_id === value);
                          setSelectedShowtime(showtime);
                          loadSeats(showtime?.showtime_id);
                          if (showtime) {
                              try {
                                await dispatch(getShowtimePrice(showtime.showtime_id)).unwrap();
                              } catch (err) {
                                toast.error("Failed to fetch showtime price");
                              }
                          }
                        }}
                        options={filteredShowtimes.map((showtime: any) => ({
                          value: showtime.showtime_id,
                          label: `${getHumanTime(showtime.show_time)} - ${showtime.screen?.name} (${showtime.screen?.cinema?.name})`
                        }))}
                        defaultOption="Choose a showtime"
                        disabled={!selectedMovie}
                        showSearch={true}
                      />

                      {/* Ticket Quantity */}
                      <Input
                        label="Number of Tickets"
                        type="number"
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Number(e.target.value))}
                        disabled={!selectedShowtime}
                        min={1}
                        placeholder="Enter quantity"
                      />

                      {/* Products/Concessions Selection */}
                      {selectedShowtime && (
                        <div className="border-t pt-6">
                          <PurchaseSelection
                            showtime={{ ...selectedShowtime, price: selectedShowtimePrice?.price || 0 }}
                            availableProducts={availableProducts}
                            totalAvailableProducts={availableProductTotal}
                            onLoadMoreProducts={() => setAvailableProductLimit(prev => prev + 10)}
                            ticketQuantity={ticketQuantity}
                            isBoxOfficeMode={isBoxOfficeMode}
                            setTicketQuantity={setTicketQuantity}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            seatMap={showtimeSeatMap}
                            seatMapLoading={showtimeSeatsLoading}
                            selectedSeatIds={selectedSeatIds}
                            setSelectedSeatIds={setSelectedSeatIds}
                            onConfirm={handlePurchaseConfirm}
                            onBack={() => {}}
                          />
                        </div>
                      )}

                      {/* Payment Summary */}
                      {currentStep === "payment-summary" && initiateData && (
                        <div className="border-t pt-6">
                          <PaymentSummary
                            initiateData={initiateData}
                            loading={initiateLoading}
                            onPay={handlePay}
                            onBack={() => setCurrentStep("purchase-selection")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Normal Step-by-Step Mode */
                  <>
                    {currentStep === "movie-selection" && (
                      <MovieSelection 
                        movies={movies} 
                        onSelect={handleMovieSelect} 
                        totalMovies={totalMovies}
                        onLoadMore={() => setMovieLimit(prev => prev + 10)}
                      />
                    )}

                    {currentStep === "showtime-selection" && selectedMovie && (
                      <ShowtimeSelection
                        movie={{ ...selectedMovie, showtimes: filteredShowtimes }}
                        onSelect={handleShowtimeSelect}
                        onBack={() => setCurrentStep("movie-selection")}
                        totalShowtimes={totalShowtimes}
                        onLoadMore={() => setShowtimeLimit(prev => prev + 10)}
                      />
                    )}

                    {currentStep === "purchase-selection" && (
                      <PurchaseSelection
                        showtime={{ ...selectedShowtime, price: selectedShowtimePrice?.price || 0 }}
                        availableProducts={availableProducts}
                        totalAvailableProducts={availableProductTotal}
                        onLoadMoreProducts={() => setAvailableProductLimit(prev => prev + 10)}
                        ticketQuantity={ticketQuantity}
                        setTicketQuantity={setTicketQuantity}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        seatMap={showtimeSeatMap}
                        seatMapLoading={showtimeSeatsLoading}
                        selectedSeatIds={selectedSeatIds}
                        setSelectedSeatIds={setSelectedSeatIds}
                        onConfirm={handlePurchaseConfirm}
                        isBoxOfficeMode={isBoxOfficeMode}
                        onBack={() => setCurrentStep("showtime-selection")}
                      />
                    )}

                    {currentStep === "payment-summary" && initiateData && (
                      <PaymentSummary
                        initiateData={initiateData}
                        loading={initiateLoading}
                        onPay={handlePay}
                        onBack={() => setCurrentStep("purchase-selection")}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Booking Summary Sidebar - Always visible in Box Office Mode */}
          {(isBoxOfficeMode && selectedMovie) || (currentStep !== "movie-selection" && currentStep !== "payment-summary") ? (
            <div className="lg:w-80">
                <BookingSummary
                selectedMovie={selectedMovie}
                selectedShowtime={{ ...selectedShowtime, price: selectedShowtimePrice?.price || 0 }}
                ticketQuantity={ticketQuantity}
                selectedProducts={selectedProducts}
                totalPrice={0} // This will be calculated in summary component or use initiate response
                />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TicketSalesPage;


