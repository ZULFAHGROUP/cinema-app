/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import { Users, Plus, Loader2 } from "lucide-react";
import MovieSelection from "./components/MovieSelection";
import ShowtimeSelection from "./components/ShowtimeSelection";
import PurchaseSelection from "./components/PurchaseSelection";
import PaymentSummary from "./components/PaymentSummary";
import PaymentSuccess from "./components/PaymentSuccess";
import BookingSummary from "./components/BookingSummary";
import StepIndicator from "./components/StepIndicator";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllMovies } from "../../store/slices/movie";
import { getAllShowtimes, getShowtimePrice } from "../../store/slices/showtime";
import { getAvailableProducts } from "../../store/slices/product";
import { initiatePurchase, resetPurchase } from "../../store/slices/purchase";
import { toast } from "react-toastify";
import { getHumanTime } from "../../utils";

function TicketSalesPage() {
  const [currentStep, setCurrentStep] = useState("movie-selection");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [movieLimit, setMovieLimit] = useState(10);
  const [showtimeLimit, setShowtimeLimit] = useState(10);
  const [availableProductLimit, setAvailableProductLimit] = useState(10);

  const dispatch = useAppDispatch();
  const { movies, moviesLoading, total: totalMovies } = useAppSelector((state) => state.movie);
  const { showtimes, selectedShowtimePrice, total: totalShowtimes } = useAppSelector((state) => state.showtime);
  const { availableProducts, availableProductTotal } = useAppSelector((state) => state.product);
  const { initiateLoading, initiateData } = useAppSelector((state) => state.purchase);

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
      ticket_quantity: ticketQuantity,
      // extra_products: selectedProducts.map(p => ({
      //   product_id: p.product_id,
      //   quantity: p.quantity
      // }))
    };

    try {
      const resultAction = await dispatch(initiatePurchase(payload));
      if (initiatePurchase.fulfilled.match(resultAction)) {
        setCurrentStep("payment-summary");
      } else {
        toast.error("Failed to initiate purchase");
      }
    } catch (err) {
      toast.error("An error occurred");
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
  };

  // Filter showtimes by selected movie
  const filteredShowtimes = showtimes.filter((s: any) => s.movie_id === selectedMovie?.movie_id);

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
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border rounded-full text-sm font-sans font-medium">
              <Users className="w-4 h-4" />
              <span>Box Office Mode</span>
            </div>
            <Button
              onClick={resetBooking}
              className="gap-2 rounded-full px-6"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              title="New Sale"
            />
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1 min-h-[500px]">
            {moviesLoading ? (
               <div className="flex items-center justify-center h-full">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
            ) : (
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
                    onConfirm={handlePurchaseConfirm}
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

                {currentStep === "confirmation" && (
                  <PaymentSuccess
                    bookingData={{
                      bookingNumber: initiateData?.payment_reference || "N/A",
                      movieTitle: selectedMovie?.title,
                      theater: selectedShowtime?.screen?.cinema?.name || "N/A",
                      screen: selectedShowtime?.screen?.name || "N/A",
                      showtime: selectedShowtime ? getHumanTime(selectedShowtime.show_time) : "N/A",
                      seats: [], // Seats are no longer part of the flow
                      amountPaid: initiateData?.amount || 0,
                      customerEmail: "customer@example.com", // Placeholder
                      bookingDate: new Date().toLocaleDateString(),
                    }}
                    onNewBooking={resetBooking}
                  />
                )}
              </>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          {currentStep !== "movie-selection" && currentStep !== "confirmation" && currentStep !== "payment-summary" && (
            <div className="lg:w-80">
                <BookingSummary
                selectedMovie={selectedMovie}
                selectedShowtime={{ ...selectedShowtime, price: selectedShowtimePrice?.price || 0 }}
                ticketQuantity={ticketQuantity}
                selectedProducts={selectedProducts}
                totalPrice={0} // This will be calculated in summary component or use initiate response
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketSalesPage;


