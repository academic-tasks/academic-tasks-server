import { appActions } from "../spec/app-actions";
import { appSubjects } from "../spec/app-subjects";
import { ForcedSubject } from "@casl/ability";

export type AppAbilities = [
  typeof appActions[number],
  (
    | typeof appSubjects[number]
    | ForcedSubject<Exclude<typeof appSubjects[number], "all">>
  )
];
