import { $class, $classes, $item, ascend, Clan, Lifestyle, Paths, prepareAscension } from "libram";

/* const timespinnerTargets = [
  "Busta_Rhymes",
  "Manendra",
  "Gausie",
  "Beldur",
  "worthawholebean",
  "ReverKiller",
  "phreddrickv2",
  "The Dictator",
]; */

/*while ($skill`Experience Safari`.timescast < get("skillLevel180") && safariTargets.length) {
    useSkill($skill`Experience Safari`, 1, safariTargets[0]);
    safariTargets.shift();
}*/

export function main(args = ""): void {
  const newClass = args.includes(`tt`)
    ? $class`Turtle Tamer`
    : args.includes(`pm`)
    ? $class`Pastamancer`
    : args.includes(`sr`)
    ? $class`Sauceror`
    : args.includes(`db`)
    ? $class`Disco Bandit`
    : args.includes(`at`)
    ? $class`Accordion Thief`
    : $class`Seal Clubber`;

  Clan.join("Alliance From Heck");

  prepareAscension({
    workshed: `Asdon Martin keyfob`,
    garden: `packet of thanksgarden seeds`,
    eudora: `New-You Club Membership Form`,
    chateau: {
      desk: `continental juice bar`,
      nightstand: $classes`Pastamancer, Sauceror`.includes(newClass)
        ? `foreign language tapes`
        : $classes`Disco Bandit, Accordion Thief`.includes(newClass)
        ? `bowl of potpourri`
        : `electric muscle stimulator`,
      ceiling: `ceiling fan`,
    },
  });

  ascend(
    Paths.Unrestricted,
    newClass,
    Lifestyle.casual,
    "knoll",
    $item`astral six-pack`,
    $item`astral shirt`
  );
}
