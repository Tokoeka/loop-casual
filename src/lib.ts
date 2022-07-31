import {
  adv1,
  equip,
  equippedAmount,
  equippedItem,
  Item,
  Location,
  print,
  setAutoAttack,
  Slot,
} from "kolmafia";
import { $item, Macro } from "libram";

export function debug(message: string, color?: string): void {
  if (color) {
    print(message, color);
  } else {
    print(message);
  }
}

// From phccs
export function convertMilliseconds(milliseconds: number): string {
  const seconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.round((seconds - minutes * 60) * 1000) / 1000;
  const hours = Math.floor(minutes / 60);
  const minutesLeft = Math.round(minutes - hours * 60);
  return (
    (hours !== 0 ? `${hours} hours, ` : "") +
    (minutesLeft !== 0 ? `${minutesLeft} minutes, ` : "") +
    (secondsLeft !== 0 ? `${secondsLeft} seconds` : "")
  );
}

export function advMacroAA(
  location: Location,
  macro: Macro,
  parameter: number | (() => boolean) = 1,
  afterCombatAction?: () => void
): void {
  let n = 0;
  const condition = () => {
    return typeof parameter === "number" ? n < parameter : parameter();
  };
  macro.setAutoAttack();
  while (condition()) {
    adv1(location, -1, () => {
      return Macro.if_("!pastround 2", macro).abort().toString();
    });
    if (afterCombatAction) afterCombatAction();
    n++;
  }
}

export function advMacro(
  location: Location,
  macro: Macro,
  parameter: number | (() => boolean) = 1,
  afterCombatAction?: () => void
): void {
  setAutoAttack(0);
  let n = 0;
  const condition = () => {
    return typeof parameter === "number" ? n < parameter : parameter();
  };

  while (condition()) {
    adv1(location, -1, () => {
      return Macro.if_("!pastround 2", macro).abort().toString();
    });
    if (afterCombatAction) afterCombatAction();
    n++;
  }
}

export function unequip(item: Item): void {
  while (equippedAmount(item) > 0) {
    const slot = Slot.all().find((equipmentSlot) => equippedItem(equipmentSlot) === item);
    if (!slot) return;
    equip(slot, $item`none`);
  }
}
