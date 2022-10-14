import {
	adv1,
	cliExecute,
	familiarEquippedEquipment,
	familiarWeight,
	haveEffect,
	itemAmount,
	Location,
	myBasestat,
	myInebriety,
	myPrimestat,
	retrieveItem,
	retrievePrice,
	runChoice,
	use,
	useFamiliar,
	useSkill,
	visitUrl,
} from "kolmafia";
import {
	$effect,
	$familiar,
	$familiars,
	$item,
	$items,
	$location,
	$locations,
	$monster,
	$skill,
	AutumnAton,
	get,
	getSaleValue,
	have,
	Macro,
	set,
	uneffect,
} from "libram";
import { CombatStrategy } from "../engine/combat";
import { Quest } from "../engine/task";
import { OutfitSpec, step } from "grimoire-kolmafia";
import "core-js/features/array/flat";

const fallBotUpgradeLocs: Record<AutumnAton.Upgrade, Location[]> = {
	leftarm1: $locations`The Stately Pleasure Dome, The Haunted Pantry`,
	base_blackhat: $locations`The Fun-Guy Mansion, The Outskirts of Cobb's Knob, The Spooky Forest, The Sleazy Back Alley`,
	cowcatcher: $locations`The Cave Before Time, The Deep Machine Tunnels, Itznotyerzitz Mine, The Defiled Nook`,
	dualexhaust: $locations`The Haunted Wine Cellar, The Middle Chamber, The Castle in the Clouds in the Sky (Basement)`,
	leftleg1: $locations`Cobb's Knob Kitchens, Cobb's Knob Barracks, The Batrat and Ratbat Burrow, The Dire Warren, The Haiku Dungeon, Noob Cave`,
	periscope: $locations`The Oasis, The Penultimate Fantasy Airship`,
	radardish: $locations`The Red Zeppelin, The Copperhead Club, The Castle in the Clouds in the Sky (Top Floor)`,
	rightleg1: $locations`Pirates of the Garbage Barges, Barf Mountain, The Ice Hotel, The Haunted Kitchen`,
	rightarm1: $locations`The Deep Dark Jungle, Twin Peak, The Overgrown Lot`,
};

const upgradeOrder: AutumnAton.Upgrade[] = [
	"leftleg1",
	"rightleg1",
	"leftarm1",
	"rightarm1",
	"cowcatcher",
	"periscope",
	"radardish",
];

export const MiscQuest: Quest = {
	name: "Misc",
	tasks: [
		{
			name: "Unlock Beach",
			after: [],
			completed: () => have($item`bitchin' meatcar`) || have($item`Desert Bus pass`),
			do: () => cliExecute("acquire 1 bitchin' meatcar"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Unlock Island",
			after: [],
			completed: () =>
				have($item`dingy dinghy`) ||
				have($item`junk junk`) ||
				have($item`skeletal skiff`) ||
				have($item`yellow submarine`),
			do: () => {
				const options = $items`skeletal skiff, yellow submarine`;
				const bestChoice = options.sort((a, b) => retrievePrice(a) - retrievePrice(b))[0];
				if (bestChoice === $item`yellow submarine`) {
					// Open the mystic store if needed
					if (!have($item`continuum transfunctioner`)) {
						visitUrl("place.php?whichplace=forestvillage&action=fv_mystic");
						runChoice(1);
						runChoice(1);
						runChoice(1);
					}
				}
				retrieveItem(bestChoice);
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		/*{
      name: "Floundry",
      after: [],
      completed: () =>
        have($item`fish hatchet`) || get("_loop_casual_floundry_checked", "") === Clan.get().name,
      do: () => {
        const sufficientFish = visitUrl("clan_viplounge.php?action=floundry").match(
          "([0-9]+) hatchetfish"
        );
        if (sufficientFish === null || parseInt(sufficientFish[1]) < 10) {
          // Recheck if the script is rerun with a new clan
          set("_loop_casual_floundry_checked", Clan.get().name);
        } else {
          cliExecute("acquire 1 fish hatchet");
        }
      },
      limit: { tries: 1 },
      freeaction: true,
    },*/
		{
			name: "Short Cook",
			after: [],
			ready: () => have($familiar`Shorter-Order Cook`),
			completed: () =>
				familiarEquippedEquipment($familiar`Shorter-Order Cook`) === $item`blue plate`,
			acquire: [{ item: $item`blue plate` }],
			do: () => useFamiliar($familiar`Mosquito`), // Switch away to keep blue plate equipped
			outfit: { familiar: $familiar`Shorter-Order Cook`, equip: $items`blue plate` },
			freeaction: true,
			limit: { tries: 1 },
		},
		{
			name: "Acquire Kgnee",
			after: [],
			ready: () =>
				have($familiar`Reagnimated Gnome`) &&
				!have($item`gnomish housemaid's kgnee`) &&
				!get("_loopcasual_checkedGnome", false),
			completed: () =>
				!have($familiar`Reagnimated Gnome`) ||
				have($item`gnomish housemaid's kgnee`) ||
				get("_loopcasual_checkedGnome", false),
			do: () => {
				visitUrl("arena.php");
				runChoice(4);
				set("_loopcasual_checkedGnome", true);
			},
			outfit: { familiar: $familiar`Reagnimated Gnome` },
			limit: { tries: 1 },
		},
		{
			name: "Acquire FamEquip",
			after: [],
			ready: () =>
				$items`astral pet sweater, amulet coin, luck incense`.some((item) => !have(item)) &&
				$familiars`Mu, Cornbeefadon`.some(have),
			completed: () =>
				$items`astral pet sweater, amulet coin, luck incense`.some((item) => have(item)) ||
				!$familiars`Mu, Cornbeefadon`.some(have),
			do: () => {
				const famToUse = $familiars`Mu, Cornbeefadon`.find(have);
				if (famToUse) {
					useFamiliar(famToUse);
					retrieveItem($item`box of Familiar Jacks`);
					use($item`box of Familiar Jacks`);
				}
			},
			limit: { tries: 1 },
		},
		{
			name: "Voting",
			after: [],
			ready: () => get("voteAlways"),
			completed: () => have($item`"I Voted!" sticker`) || get("_voteToday"),
			do: (): void => {
				// Taken from garbo
				const voterValueTable = [
					{
						monster: $monster`terrible mutant`,
						value: getSaleValue($item`glob of undifferentiated tissue`) + 10,
					},
					{
						monster: $monster`angry ghost`,
						value: getSaleValue($item`ghostly ectoplasm`) * 1.11,
					},
					{
						monster: $monster`government bureaucrat`,
						value: getSaleValue($item`absentee voter ballot`) * 0.05 + 75 * 0.25 + 50,
					},
					{
						monster: $monster`annoyed snake`,
						value: 25 * 0.5 + 25,
					},
					{
						monster: $monster`slime blob`,
						value: 20 * 0.4 + 50 * 0.2 + 250 * 0.01,
					},
				];

				visitUrl("place.php?whichplace=town_right&action=townright_vote");

				const votingMonsterPriority = voterValueTable
					.sort((a, b) => b.value - a.value)
					.map((element) => element.monster.name);

				const initPriority = new Map<string, number>([
					["Meat Drop: +30", 10],
					["Item Drop: +15", 9],
					["Familiar Experience: +2", 8],
					["Adventures: +1", 7],
					["Monster Level: +10", 5],
					[`${myPrimestat()} Percent: +25`, 3],
					[`Experience (${myPrimestat()}): +4`, 2],
					["Meat Drop: -30", -2],
					["Item Drop: -15", -2],
					["Familiar Experience: -2", -2],
				]);

				const monsterVote =
					votingMonsterPriority.indexOf(get("_voteMonster1")) <
					votingMonsterPriority.indexOf(get("_voteMonster2"))
						? 1
						: 2;

				const voteLocalPriorityArr = [
					[
						0,
						initPriority.get(get("_voteLocal1")) ||
							(get("_voteLocal1").indexOf("-") === -1 ? 1 : -1),
					],
					[
						1,
						initPriority.get(get("_voteLocal2")) ||
							(get("_voteLocal2").indexOf("-") === -1 ? 1 : -1),
					],
					[
						2,
						initPriority.get(get("_voteLocal3")) ||
							(get("_voteLocal3").indexOf("-") === -1 ? 1 : -1),
					],
					[
						3,
						initPriority.get(get("_voteLocal4")) ||
							(get("_voteLocal4").indexOf("-") === -1 ? 1 : -1),
					],
				];

				const bestVotes = voteLocalPriorityArr.sort((a, b) => b[1] - a[1]);
				const firstInit = bestVotes[0][0];
				//const secondInit = bestVotes[1][0];

				visitUrl(
					`choice.php?option=1&whichchoice=1331&g=${monsterVote}&local[]=${firstInit}&local[]=${firstInit}`
				);
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Protonic Ghost",
			after: [],
			completed: () => step("questL13Final") >= 0, // Stop after tower starts
			ready: () => {
				if (!have($item`protonic accelerator pack`)) return false;
				if (get("questPAGhost") === "unstarted") return false;
				switch (get("ghostLocation")) {
					case $location`Cobb's Knob Treasury`:
						return step("questL05Goblin") >= 1;
					case $location`The Haunted Conservatory`:
						return step("questM20Necklace") >= 0;
					case $location`The Haunted Gallery`:
						return step("questM21Dance") >= 1;
					case $location`The Haunted Kitchen`:
						return step("questM20Necklace") >= 0;
					case $location`The Haunted Wine Cellar`:
						return step("questL11Manor") >= 1;
					case $location`The Icy Peak`:
						return step("questL08Trapper") === 999;
					case $location`Inside the Palindome`:
						return have($item`Talisman o' Namsilat`);
					case $location`The Old Landfill`:
						return myBasestat(myPrimestat()) >= 25 && step("questL02Larva") >= 0;
					case $location`Madness Bakery`:
					case $location`The Overgrown Lot`:
					case $location`The Skeleton Store`:
						return true; // Can freely start quest
					case $location`The Smut Orc Logging Camp`:
						return step("questL09Topping") >= 0;
					case $location`The Spooky Forest`:
						return step("questL02Larva") >= 0;
				}
				return false;
			},
			prepare: () => {
				// Start quests if needed
				switch (get("ghostLocation")) {
					case $location`Madness Bakery`:
						if (step("questM25Armorer") === -1) {
							visitUrl("shop.php?whichshop=armory");
							visitUrl("shop.php?whichshop=armory&action=talk");
							visitUrl("choice.php?pwd=&whichchoice=1065&option=1");
						}
						return;
					case $location`The Old Landfill`:
						if (step("questM19Hippy") === -1) {
							visitUrl("place.php?whichplace=woods&action=woods_smokesignals");
							visitUrl("choice.php?pwd=&whichchoice=798&option=1");
							visitUrl("choice.php?pwd=&whichchoice=798&option=2");
							visitUrl("woods.php");
						}
						return;
					case $location`The Overgrown Lot`:
						if (step("questM24Doc") === -1) {
							visitUrl("shop.php?whichshop=doc");
							visitUrl("shop.php?whichshop=doc&action=talk");
							runChoice(1);
						}
						return;
					case $location`The Skeleton Store`:
						if (step("questM23Meatsmith") === -1) {
							visitUrl("shop.php?whichshop=meatsmith");
							visitUrl("shop.php?whichshop=meatsmith&action=talk");
							runChoice(1);
						}
						return;
					default:
						return;
				}
			},
			do: () => {
				adv1(get("ghostLocation") ?? $location`none`, 0, "");
			},
			outfit: (): OutfitSpec => {
				if (get("ghostLocation") === $location`Inside the Palindome`)
					return { equip: $items`Talisman o' Namsilat, protonic accelerator pack` };
				return { equip: $items`protonic accelerator pack` };
			},
			combat: new CombatStrategy().macro(
				new Macro()
					.skill($skill`Shoot Ghost`)
					.skill($skill`Shoot Ghost`)
					.skill($skill`Shoot Ghost`)
					.skill($skill`Trap Ghost`)
			),
			limit: { tries: 10 },
		},
		{
			name: "Goose Exp",
			after: [],
			priority: () => true,
			completed: () =>
				familiarWeight($familiar`Grey Goose`) >= 9 ||
				get("_loop_casual_chef_goose") === "true" ||
				!have($familiar`Grey Goose`) ||
				!have($familiar`Shorter-Order Cook`),
			do: () => {
				set("_loop_casual_chef_goose", "true");
			},
			outfit: { familiar: $familiar`Grey Goose` },
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Cleaver NC",
			after: [],
			priority: () => true,
			completed: () => step("questL13Final") >= 0, // Stop after tower starts
			ready: () => {
				return have($item`June cleaver`) && get("_juneCleaverFightsLeft") === 0;
			},
			do: () => {
				adv1($location`Noob Cave`, 0);
				if (haveEffect($effect`Beaten Up`)) {
					useSkill($skill`Tongue of the Walrus`);
				}
			},
			outfit: (): OutfitSpec => {
				return { equip: $items`June cleaver` };
			},
			choices: {
				// June cleaver noncombats
				1467: 3, // Poetic Justice
				1468: () => (get("_juneCleaverSkips") < 5 ? 4 : 2), // Aunts Not Ants
				1469: 3, // Beware of Aligator
				1470: () => (get("_juneCleaverSkips") < 5 ? 4 : 2), // Teacher's Pet
				1471: 1, // Lost & Found
				1472: 1, // Summer Days
				1473: () => (get("_juneCleaverSkips") < 5 ? 4 : 1), // Bath Time
				1474: () => (get("_juneCleaverSkips") < 5 ? 4 : 2), // Delicious Sprouts
				1475: 1, // Hypnotic Master
			},
			limit: { tries: 18 },
		},
		{
			name: "Sweat Out Some Booze",
			after: [],
			priority: () => true,
			ready: () =>
				get("_sweatOutSomeBoozeUsed") < 3 &&
				get("sweat") > 25 &&
				have($item`designer sweatpants`) &&
				myInebriety() > 2,
			completed: () => get("_sweatOutSomeBoozeUsed") === 3,
			do: () => {
				useSkill($skill`Sweat Out Some Booze`);
			},
			outfit: { equip: $items`designer sweatpants` },
			limit: { tries: 3 },
			freeaction: true,
			noadventures: true,
		},
		{
			name: "Fallbot",
			after: [],
			priority: () => true,
			ready: () => AutumnAton.available(),
			completed: () => step("questL13Final") >= 0, // Stop after tower starts
			do: () => {
				AutumnAton.upgrade();
				useFamiliar($familiar`Machine Elf`); //to ensure deep machine tunnels is available
				const availableLocs = AutumnAton.availableLocations();
				const currentUpgrades = AutumnAton.currentUpgrades();
				const target =
					upgradeOrder
						.filter((upgrade) => !currentUpgrades.includes(upgrade))
						.map((upgrade) => fallBotUpgradeLocs[upgrade])
						.flat()
						.find((location) => availableLocs.includes(location)) ??
					$location`The Neverending Party`;
				//const target = upgradeOrder.map((upgrade) => ({ upgrade, locations: fallBotUpgradeLocs[upgrade]})).find(({ upgrade, locations }) => !currentUpgrades.includes(upgrade) && locations.some((location) => availableLocs.includes(location)))?.locations.find((location) => availableLocs.includes(location));
				AutumnAton.sendTo(target);
			},
			limit: { tries: 10 },
			freeaction: true,
			noadventures: true,
		},
	],
};

function keyCount(): number {
	let count = itemAmount($item`fat loot token`);
	if (have($item`Boris's key`) || get("nsTowerDoorKeysUsed").includes("Boris")) count++;
	if (have($item`Jarlsberg's key`) || get("nsTowerDoorKeysUsed").includes("Jarlsberg")) count++;
	if (have($item`Sneaky Pete's key`) || get("nsTowerDoorKeysUsed").includes("Sneaky Pete"))
		count++;
	return count;
}
export const KeysQuest: Quest = {
	name: "Keys",
	tasks: [
		{
			name: "Deck",
			after: [],
			completed: () => get("_deckCardsDrawn") > 0,
			do: () => cliExecute("cheat tower"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Lockpicking",
			after: ["Deck"],
			completed: () => !have($skill`Lock Picking`) || get("lockPicked"),
			do: (): void => {
				useSkill($skill`Lock Picking`);
			},
			choices: {
				1414: (): number => {
					if (!have($item`Boris's key`)) return 1;
					else if (!have($item`Jarlsberg's key`)) return 2;
					else return 3;
				},
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Malware",
			after: [],
			acquire: [
				{ item: $item`daily dungeon malware` },
				{ item: $item`Pick-O-Matic lockpicks` },
				{ item: $item`eleven-foot pole` },
			],
			completed: () =>
				get("_dailyDungeonMalwareUsed") || get("dailyDungeonDone") || keyCount() >= 3,
			prepare: () => {
				set("_loop_casual_malware_amount", itemAmount($item`daily dungeon malware`));
			},
			do: $location`The Daily Dungeon`,
			post: () => {
				if (
					itemAmount($item`daily dungeon malware`) < get("_loop_casual_malware_amount", 0)
				)
					set("_dailyDungeonMalwareUsed", true);
				uneffect($effect`Apathy`);
			},
			outfit: {
				equip: $items`ring of Detect Boring Doors`,
				avoid: $items`carnivorous potted plant`,
			},
			combat: new CombatStrategy().macro(
				new Macro()
					.item($item`daily dungeon malware`)
					.attack()
					.repeat()
			),
			choices: {
				689: 1,
				690: 2,
				691: 3, // Do not skip the second chest; there is a chance we skip all the monsters
				692: 3,
				693: 2,
			},
			limit: { soft: 11 },
		},
		{
			name: "Daily Dungeon",
			after: ["Deck", "Lockpicking", "Malware"],
			acquire: [{ item: $item`Pick-O-Matic lockpicks` }, { item: $item`eleven-foot pole` }],
			completed: () => get("dailyDungeonDone") || keyCount() >= 3,
			do: $location`The Daily Dungeon`,
			post: () => uneffect($effect`Apathy`),
			outfit: {
				equip: $items`ring of Detect Boring Doors`,
			},
			combat: new CombatStrategy().kill(),
			choices: { 689: 1, 690: 2, 691: 2, 692: 3, 693: 2 },
			limit: { tries: 11 },
		},
		{
			name: "Finish",
			after: ["Deck", "Lockpicking", "Malware", "Daily Dungeon"],
			completed: () => keyCount() >= 3,
			do: (): void => {
				throw "Unable to obtain enough fat loot tokens";
			},
			limit: { tries: 1 },
			freeaction: true,
		},
	],
};
