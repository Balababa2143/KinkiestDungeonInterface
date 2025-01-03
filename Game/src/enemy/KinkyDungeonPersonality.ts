"use strict";

let KDJailPersonalities = {
	"Robot": true,
	"Dom": true,
	"Sub": true,
};

let KDStrictPersonalities = [
	"Dom",
];
let KDLoosePersonalities = [
	"Sub",
];

let KDEnemyPersonalities = {
	"": {weight: 10,
		loose: false,
		strict: false,
		brat: false,
		domVariance: 0.4,
		submissiveness: 0.25,
		tags: {
			"robot": -100,
			"switch": 10,
			"veryswitch": 100,
			"nobrain": -100,
		},
	},
	"Robot": {weight: -100,
		loose: false,
		strict: false,
		brat: false,
		submissiveness: 0.25,
		tags: {
			"robot": 200,
			"cyborg": -200,
			"nobrain": -100,
		},
	},
	"NoBrain": {weight: -100,
		loose: false,
		strict: false,
		brat: false,
		submissiveness: 0.0,
		tags: {
			"nobrain": 200,
		},
	},
	"Dom": {weight: 1,
		loose: false,
		strict: true,
		brat: false,
		submissiveness: 0,
		tags: {
			"minor": -3,
			"alchemist": 2,
			"elite": 3,
			"boss": 3,
			"robot": -100,
			"cyborg": 100,
			"submissive": -10,
			"dom": 10,
			"verydom": 100,
			"nobrain": -100,
		},
	},
	"Sub": {weight: 0,
		loose: true,
		strict: false,
		brat: false,
		submissiveness: 1.0,
		tags: {
			"minor": 3,
			"human": 1,
			"elite": -2,
			"boss": -10,
			"robot": -100,
			"cyborg": 100,
			"submissive": 10,
			"sub": 10,
			"verysub": 100,
			"nobrain": -100,
		},
	},
	"Brat": {weight: 0,
		loose: true,
		strict: false,
		brat: true,
		domMod: 0.7,
		domVariance: 0.2,
		submissiveness: 0.75,
		tags: {
			"minor": 3,
			"brat": 10,
			"verybrat": 100,
			"human": 1,
			"boss": -3,
			"robot": -100,
			"nobrain": -100,
			"cyborg": 100,
			"submissive": 1,
		},
	},
};

/**
 * Do NOT call this during UI loop, as can lead to desyncs in future w/ replay system or possible netcode
 * @param enemy
 */
function KDGetPersonality(enemy: entity): string {
	if (!enemy.Enemy) return undefined;
	if (enemy.personality) return enemy.personality;
	let WeightTotal = 0;
	let Weights = [];

	for (let p of Object.entries(KDEnemyPersonalities)) {
		let weight = p[1].weight;
		Weights.push({p: p[0], weight: WeightTotal});
		if (p[1].tags)
			for (let tag of Object.entries(p[1].tags)) {
				if (enemy.Enemy.tags[tag[0]]) weight += tag[1];
			}
		WeightTotal += Math.max(weight, 0);
	}

	let selection = KDRandom() * WeightTotal;

	for (let L = Weights.length - 1; L >= 0; L--) {
		if (selection > Weights[L].weight) {
			if (Weights[L].p != undefined) {
				return Weights[L].p;
			}
			return "";
		}
	}

	return "";
}


/**
 * @param Enemy
 */
function KDGetPersonalityType(Enemy: enemy): string {
	let WeightTotal = 0;
	let Weights = [];

	for (let p of Object.entries(KDEnemyPersonalities)) {
		let weight = p[1].weight;
		Weights.push({p: p[0], weight: WeightTotal});
		if (p[1].tags)
			for (let tag of Object.entries(p[1].tags)) {
				if (Enemy.tags[tag[0]]) weight += tag[1];
			}
		WeightTotal += Math.max(weight, 0);
	}

	let selection = KDRandom() * WeightTotal;

	for (let L = Weights.length - 1; L >= 0; L--) {
		if (selection > Weights[L].weight) {
			if (Weights[L].p != undefined) {
				return Weights[L].p;
			}
			return "";
		}
	}

	return "";
}

/**
 * @param enemy
 */
function KDJailPersonality(enemy: entity): string {
	return (enemy.personality && KDJailPersonalities[enemy.personality]) ? enemy.personality : "";
}
