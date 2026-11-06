// The public rubric a buyer attaches to a task. Stored on the Arkiv task (bytes) and on Swarm (rubricRef).
// The verifier (P4) judges clips against exactly these named steps.
import { z } from "zod"

export const rubricSchema = z.object({
  v: z.literal(1),
  skill: z.string().min(2).max(40),
  summary: z.string().min(10).max(280),
  setup: z.array(z.string().max(120)).max(6),
  steps: z
    .array(
      z.object({
        name: z.string().regex(/^[a-z][a-z0-9_]{1,30}$/),
        label: z.string().max(60),
        hint: z.string().max(140),
      }),
    )
    .min(1)
    .max(8),
  framing: z.enum(["top_down", "front", "any"]),
  durationS: z.object({ min: z.number().int().min(5), max: z.number().int().max(60) }),
})
export type Rubric = z.infer<typeof rubricSchema>

export const TOWEL_RUBRIC: Rubric = {
  v: 1,
  skill: "towel-fold",
  summary:
    "Fold a hand towel in half twice on a flat surface, filmed from directly above. Our robot fails when the towel starts crumpled, so begin with it loosely bunched.",
  setup: [
    "Phone held above the table, camera pointing straight down",
    "Both hands and the whole towel in frame",
    "Good light, plain surface",
  ],
  steps: [
    {
      name: "grasp_corners",
      label: "Grab two corners",
      hint: "Pinch two neighbouring corners, one in each hand",
    },
    { name: "first_fold", label: "Fold in half", hint: "Bring the corners across to the far edge" },
    { name: "second_fold", label: "Fold again", hint: "Fold the long strip in half the other way" },
    { name: "flatten", label: "Smooth it flat", hint: "Run a palm across the folded towel" },
  ],
  framing: "top_down",
  durationS: { min: 15, max: 30 },
}
