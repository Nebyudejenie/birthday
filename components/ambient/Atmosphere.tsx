"use client";

import Aurora from "./Aurora";
import Starfield from "./Starfield";
import Petals from "./Petals";
import CursorGlow from "./CursorGlow";
import SmoothScroll from "./SmoothScroll";

/** All persistent, page-wide background & motion layers in one mount. */
export default function Atmosphere() {
  return (
    <>
      <SmoothScroll />
      <Aurora />
      <Starfield />
      <Petals />
      <CursorGlow />
    </>
  );
}
