import { createMongoAbility, RawRuleOf } from "@casl/ability";
import { ListaAbility } from "../interfaces/ListaAbility";

export const createListaAbility = (
  rules: RawRuleOf<ListaAbility>[]
): ListaAbility => createMongoAbility<ListaAbility>(rules);
