import { print, runChoice, use, visitUrl } from "kolmafia";
import {
	$class,
	$classes,
	$item,
  $path,
	ascend,
	AsdonMartin,
	Clan,
	get,
	Lifestyle,
	prepareAscension,
	PropertiesManager,
} from "libram";

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

const PropertyManager = new PropertiesManager();

function setChoice(adv: number, choice: number | string): void {
	PropertyManager.setChoices({ [adv]: choice });
}

function NEP() {
	if (get("_questPartyFair") === "unstarted") {
		setChoice(1322, "");
		visitUrl("adventure.php?snarfblat=528");
		if (get("_questPartyFairQuest") === "food") {
			runChoice(1);
			setChoice(1324, 5);
			// setChoice(1326, 3);
		} else if (get("_questPartyFairQuest") === "booze") {
			runChoice(1);
			setChoice(1324, 5);
			// setChoice(1327, 3);
		} else {
			runChoice(2);
			setChoice(1324, 5);
		}
	}

	if (["food", "booze"].includes(get("_questPartyFairQuest"))) {
		const partyType = get("_questPartyFairQuest");
		print(
			`${partyType} Quest available! Go see Gerald${partyType === "food" ? "ine" : ""}`,
			"red"
		);
	}
}

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
		//workshed: `model train set`,
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
		$path`none`,
		newClass,
		Lifestyle.casual,
		"knoll",
		$item`astral six-pack`,
		$item`astral shirt`
	);
	NEP();
	//AsdonMartin.fillTo(700);
	use($item`model train set`);
}
