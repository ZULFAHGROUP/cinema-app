/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../../components/shared/Button";
import { Users, Plus } from "lucide-react";
import MovieSelection from "./components/MovieSelection";
import ShowtimeSelection from "./components/ShowtimeSelection";
import TicketQuantity from "./components/TicketQuantity";
import SeatSelection from "./components/SeatSelection";
import CustomerInfo from "./components/CustomerInfo";
import Payment from "./components/Payment";
import Confirmation from "./components/Confirmation";
import BookingSummary from "./components/BookingSummary";
import StepIndicator from "./components/StepIndicator";

function TicketSalesPage() {
  const [currentStep, setCurrentStep] = useState("movie-selection");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [paymentInfo, setPaymentInfo] = useState<any>({});
  const [ticketQuantity, setTicketQuantity] = useState({
    adult: 2,
    child: 0,
    senior: 0,
  });

  const movies = [
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      genre: "Action/Adventure",
      duration: 148,
      rating: "PG-13",
      poster: "/spider-man-movie-poster.png",
      showtimes: [
        {
          id: 1,
          time: "10:00 AM",
          theater: "Theater 1",
          screen: "Screen A",
          price: 12.99,
          available: 120,
        },
        {
          id: 2,
          time: "1:30 PM",
          theater: "Theater 1",
          screen: "Screen A",
          price: 12.99,
          available: 95,
        },
        {
          id: 3,
          time: "5:00 PM",
          theater: "Theater 2",
          screen: "Screen B",
          price: 15.99,
          available: 180,
        },
        {
          id: 4,
          time: "8:30 PM",
          theater: "Theater 2",
          screen: "Screen B",
          price: 15.99,
          available: 160,
        },
      ],
    },
    {
      id: 2,
      title: "Dune: Part Two",
      genre: "Sci-Fi/Drama",
      duration: 166,
      rating: "PG-13",
      poster: "/dune-part-two-poster.png",
      showtimes: [
        {
          id: 5,
          time: "11:00 AM",
          theater: "Theater 3",
          screen: "Screen C",
          price: 14.99,
          available: 100,
        },
        {
          id: 6,
          time: "2:30 PM",
          theater: "Theater 1",
          screen: "Screen A",
          price: 12.99,
          available: 85,
        },
        {
          id: 7,
          time: "6:00 PM",
          theater: "Theater 2",
          screen: "Screen B",
          price: 15.99,
          available: 140,
        },
        {
          id: 8,
          time: "9:30 PM",
          theater: "Theater 3",
          screen: "Screen C",
          price: 14.99,
          available: 110,
        },
      ],
    },
  ];

  const totalTickets =
    ticketQuantity.adult + ticketQuantity.child + ticketQuantity.senior;
  const basePrice = selectedShowtime?.price || 0;
  const totalPrice =
    ticketQuantity.adult * basePrice +
    ticketQuantity.child * (basePrice * 0.7) +
    ticketQuantity.senior * (basePrice * 0.8);

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setCurrentStep("showtime-selection");
  };

  const handleShowtimeSelect = (showtime: any) => {
    setSelectedShowtime(showtime);
    setCurrentStep("ticket-quantity");
  };

  const handleQuantityConfirm = () => {
    if (totalTickets > 0) {
      setCurrentStep("seat-selection");
    }
  };

  const handleSeatConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    setCurrentStep("customer-info");
  };

  const handleCustomerInfoSubmit = (info: any) => {
    setCustomerInfo(info);
    setCurrentStep("payment");
  };

  const handlePaymentComplete = (payment: any) => {
    setPaymentInfo(payment);
    setCurrentStep("confirmation");
  };

  const resetBooking = () => {
    setCurrentStep("movie-selection");
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setCustomerInfo({});
    setPaymentInfo({});
    setTicketQuantity({ adult: 2, child: 0, senior: 0 });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Ticket Sales
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Box office and online bookings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 border rounded-md">
              <Users className="w-3 h-3" />
              <span className="text-sm">Box Office Mode</span>
            </div>
            <Button
              onClick={resetBooking}
              className="gap-2 rounded-md"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              title="New Sale"
            />
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Main Content Area */}
        <div className="flex gap-6 mt-6">
          <div className="flex-1">
            {currentStep === "movie-selection" && (
              <MovieSelection movies={movies} onSelect={handleMovieSelect} />
            )}

            {currentStep === "showtime-selection" && selectedMovie && (
              <ShowtimeSelection
                movie={selectedMovie}
                onSelect={handleShowtimeSelect}
                onBack={() => setCurrentStep("movie-selection")}
              />
            )}

            {currentStep === "ticket-quantity" && (
              <TicketQuantity
                basePrice={basePrice}
                ticketQuantity={ticketQuantity}
                setTicketQuantity={setTicketQuantity}
                totalTickets={totalTickets}
                totalPrice={totalPrice}
                onConfirm={handleQuantityConfirm}
                onBack={() => setCurrentStep("showtime-selection")}
              />
            )}

            {currentStep === "seat-selection" && (
              <SeatSelection
                totalTickets={totalTickets}
                theater={selectedShowtime?.theater}
                onConfirm={handleSeatConfirm}
                onBack={() => setCurrentStep("ticket-quantity")}
              />
            )}

            {currentStep === "customer-info" && (
              <CustomerInfo
                onSubmit={handleCustomerInfoSubmit}
                onBack={() => setCurrentStep("seat-selection")}
              />
            )}

            {currentStep === "payment" && (
              <Payment
                totalAmount={totalPrice}
                onComplete={handlePaymentComplete}
                onBack={() => setCurrentStep("customer-info")}
              />
            )}

            {currentStep === "confirmation" && (
              <Confirmation
                movie={selectedMovie}
                showtime={selectedShowtime}
                seats={selectedSeats}
                customer={customerInfo}
                totalPrice={totalPrice}
                onNewSale={resetBooking}
              />
            )}
          </div>

          {/* Booking Summary Sidebar */}
          {currentStep !== "movie-selection" && (
            <BookingSummary
              selectedMovie={selectedMovie}
              selectedShowtime={selectedShowtime}
              ticketQuantity={ticketQuantity}
              selectedSeats={selectedSeats}
              totalTickets={totalTickets}
              totalPrice={totalPrice}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketSalesPage;
