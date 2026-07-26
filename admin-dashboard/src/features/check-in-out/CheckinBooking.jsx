import { useEffect, useState } from "react";
import styled from "styled-components";

import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "../bookings/useBooking";
import useBookingOperations from "../bookings/useBookingOperations";
import useSettings from "../settings/useSettings";

import { formatCurrency } from "../../utils/helpers";
import BookingDataBox from "../../features/bookings/BookingDataBox";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const { booking, isLoading } = useBooking();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { checkIn, isCheckingIn } = useBookingOperations();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  useEffect(() => {
    setConfirmPaid(booking?.isPaid || false);
  }, [booking]);
  if (isLoading || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    bookingNumber,
    guest,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numGuests * numNights;

  function handleCheckin() {
    if (!confirmPaid) return;
    if (addBreakfast) {
      checkIn({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extraPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    }
    checkIn({ bookingId, breakfast: {} });
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingNumber}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast">
            Want to add breakfast for ${optionalBreakfastPrice}?
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid}>
          I confirm that {guest.name} has paid the total amount{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(totalPrice + optionalBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)})`}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
