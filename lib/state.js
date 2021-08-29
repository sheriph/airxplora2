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

/* export const dictionary_ = atom({
  key: "dictionary",
  default: null,
}); */

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

export const xpaOffersFixed_ = atom({
  key: "xpaOffersFixed_",
  default: null,
});

export const xpaResults_ = atom({
  key: "xparesults",
  default: null,
});

export const xpaDictionary_ = atom({
  key: "xpadictionary",
  default: null,
});

export const xpaCarriers_ = atom({
  key: "xpaCarriers_",
  default: null,
});

export const xpaBookingOffer_ = atom({
  key: "xpabookingoffer",
  default: null,
});

export const flightOfferExtended_ = atom({
  key: "flightOfferExtended_",
  default: null,
});

export const travelerRequirements_ = atom({
  key: "travelerRequirements",
  default: null,
});

export const included_ = atom({
  key: "included",
  default: null,
});

export const defaultExpanded_ = atom({
  key: "defaultExpanded_",
  default: false,
});
