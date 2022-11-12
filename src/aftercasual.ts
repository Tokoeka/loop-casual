import {
  adv1,
  cliExecute,
  closetAmount,
  equip,
  itemAmount,
  mallPrice,
  myAscensions,
  mySign,
  myTurncount,
  print,
  putCloset,
  retrieveItem,
  runChoice,
  takeCloset,
  toInt,
  use,
  useFamiliar,
  visitUrl,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $items,
  $location,
  $skill,
  $slot,
  AsdonMartin,
  get,
  have,
  Macro,
  set,
} from "libram";
import { advMacro, unequip } from "./lib";

cliExecute(`refresh all`);
if (get(`_feastUsed`) === 0) {
  cliExecute(`call login.ash`);
}
let duped = $item`none`;

if (get(`encountersUntilDMTChoice`) === 0 && get(`lastDMTDuplication`) < myAscensions()) {
  useFamiliar($familiar`Machine Elf`);
  const dupeItems = $items`very fancy whiskey, bottle of Greedy Dog, Daily Affirmation: Always be Collecting, huge Crimbo cookie, green-iced sweet roll, bottle of Race Car Red, warbear gyro, karma shawarma`;
  const dupeVals = Array.from(dupeItems.values()).map((dupe) => {
    return {
      dupeIt: dupe,
      value: mallPrice(dupe),
    };
  });
  const best = dupeVals.sort((a, b) => b.value - a.value)[0];
  let closet = false;
  duped = best.dupeIt
  set(`choiceAdventure1119`, 4);
  set(`choiceAdventure1125`, `1&iid=${toInt(best.dupeIt)}`);
  if (itemAmount(best.dupeIt) === 0 && closetAmount(best.dupeIt) > 0) {
    takeCloset(best.dupeIt, 1);
    closet = true;
  }
  while (get(`lastDMTDuplication`) < myAscensions()) {
    adv1($location`The Deep Machine Tunnels`);
  }
  if (closet) {
    putCloset(best.dupeIt, 2);
  }
}

if (mySign() !== "Platypus" && !get("moonTuned")) {
  unequip($item`hewn moon-rune spoon`);
  visitUrl("inv_use.php?whichitem=10254&pwd&doit=96&whichsign=4");
}

useFamiliar($familiar`Ms. Puck Man`);
equip($slot`familiar`, $item`tiny stillsuit`);
if (get(`_questESp`) === "") {
  visitUrl(`place.php?whichplace=airport_spooky&action=airport2_radio`);
  if (
    [
      `questESpEVE`,
      `questESpClipper`,
      `questESpFakeMedium`,
      `questESpGore`,
      `questESpOutOfOrder`,
      `questESpSerum`,
      `questESpSmokes`,
    ].includes(get(`_questESp`))
  ) {
    runChoice(1);
  } else {
    runChoice(6);
  }
}

if (get(`lastEncounter`) !== `Lava Dogs`) {
  retrieveItem($item`heat-resistant sheet metal`, 20);
  set(`mpAutoRecoveryTarget`, 0.7);
  set(`mpAutoRecovery`, 0.5);

  if (get(`_calderaStart`) === "") {
    set(`_calderaStart`, myTurncount());
  }

  const calderaTurns = get(`_calderaStart`, myTurncount());
  equip($slot`pants`, $item`designer sweatpants`);

  advMacro(
    $location`The Bubblin' Caldera`,
    Macro.skill($skill`Curse of Weaksauce`)
      .skill($skill`Micrometeorite`)
      .while_(`!times 3`, Macro.skill($skill`Saucestorm`))
      .skill($skill`Shrap`),
    () => get(`lastEncounter`) !== `Lava Dogs` && myTurncount() - calderaTurns < 7
  );
  cliExecute(`soak`);
  set(`mpAutoRecoveryTarget`, 0.25);
  set(`mpAutoRecovery`, 0.05);
}

if (AsdonMartin.installed()) {
  AsdonMartin.drive($effect`Driving Observantly`, 900);
}

use($item`cold medicine cabinet`);

print(`We duped a ${duped}`);
