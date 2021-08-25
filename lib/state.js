import { atom } from "recoil";

export const isReturnTrip_ = atom({
  key: "isreturntrip",
  default: true,
});

export const tripType_ = atom({
  key: "triptype",
  default: "Return Trip",
});

export const flightOffer_ = atom({
  key: "flightoffer",
  default: null,
});

export const dictionary_ = atom({
  key: "dictionary",
  default: null,
});

export const openDrawer_ = atom({
  key: "opendrawer",
  default: false,
});

export const tab_ = atom({
  key: "tab",
  default: "1",
});

export const xpaOffers_ = atom({
  key: "xpaOffers_",
  default: null,
});

export const defaultExpanded_ = atom({
  key: "defaultExpanded_",
  default: false,
});
