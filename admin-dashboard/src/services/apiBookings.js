import fetchAPI from "./apiClient";

export async function getBookings({ filter, sortBy, page }) {
  const params = new URLSearchParams();

  if (filter) {
    params.append(filter.field, filter.value);
  }
  if (sortBy) {
    params.append("sortBy", `${sortBy.field}-${sortBy.direction}`);
  }
  if (page) {
    params.append("page", page);
  }

  const queryString = params.toString();
  const response = await fetchAPI(`api/bookings?${queryString}`);

  return {
    data: response.data.bookings,
    count: response.totalCount,
  };
}

export async function getBooking(id) {
  const response = await fetchAPI(`api/bookings/${id}`);

  return response;
}

export async function getBookingsAfterDate(date) {
  const response = await fetchAPI(
    `api/bookings/bookings-after-date?date=${date}`,
  );
  return response;
}

export async function getStaysAfterDate(date) {
  const response = await fetchAPI(`api/bookings/stays-after-date?date=${date}`);
  return response;
}

export async function getStaysTodayActivity() {
  const response = await fetchAPI("api/bookings/stays-today-activity");
  return response;
}

export async function updateBooking(id, obj) {
  const response = await fetchAPI(`api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(obj),
  });
  return response;
}

export async function deleteBooking(id) {
  await fetchAPI(`api/bookings/${id}`, {
    method: "DELETE",
  });
}
