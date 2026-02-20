import { z } from "zod";
import { publicProcedure } from "../..";
import { NIGERIA_STATES } from "./zones";

export const zonesRouter = {
  getStates: publicProcedure.handler(() => {
    return Object.keys(NIGERIA_STATES);
  }),

  getLGAs: publicProcedure
    .input(z.object({ state: z.string() }))
    .handler(({ input }) => {
      const lgas = NIGERIA_STATES[input.state as keyof typeof NIGERIA_STATES];
      if (!lgas) return [];
      return [...lgas];
    }),
};
