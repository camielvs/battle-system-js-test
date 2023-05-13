import { BadgeOwnProps } from "evergreen-ui";

export type Combatant = {
  name: string;
  id: string;
  color: BadgeOwnProps["color"];
  stats: {
    hp: {
      max: number;
      current: number;
    };
    attack: {
      max: number;
      current: number;
    };
    defence: {
      max: number;
      current: number;
    };
    speed: {
      max: number;
      current: number;
    };
    stamina: {
      max: number;
      current: number;
    };
    accuracy: {
      max: number;
      current: number;
    };
    evasion: {
      max: number;
      current: number;
    };
  };
};

export const combatant1Base: Combatant = {
  name: "Player 1",
  id: "1",
  color: "blue",
  stats: {
    hp: {
      max: 100,
      current: 100,
    },
    attack: {
      max: 5,
      current: 5,
    },
    defence: {
      max: 1,
      current: 1,
    },
    speed: {
      max: 100,
      current: 100,
    },
    stamina: {
      max: 5,
      current: 5,
    },
    accuracy: {
      max: 8,
      current: 8,
    },
    evasion: {
      max: 5,
      current: 5,
    },
  },
};

export const combatant2Base: Combatant = {
  name: "Player 2",
  id: "2",
  color: "red",
  stats: {
    hp: {
      max: 80,
      current: 80,
    },
    attack: {
      max: 4,
      current: 4,
    },
    defence: {
      max: 2,
      current: 2,
    },
    speed: {
      max: 120,
      current: 120,
    },
    stamina: {
      max: 4,
      current: 4,
    },
    accuracy: {
      max: 5,
      current: 5,
    },
    evasion: {
      max: 3,
      current: 3,
    },
  },
};

export const SKIPTURN = "-";
export const ACTIONS = {
  attack: {
    name: "Attack",
    tip: "Deal Damage",
    cost: 1,
    weight: 5,
  },
  defend: {
    name: "Defend",
    tip: "+5 Defence until your next action",
    cost: 1,
    weight: 4,
  },
  study: {
    name: "Study",
    tip: "+5 Accuracy, +5 Evasion for the rest of the round",
    cost: 1,
    weight: 3,
  },
  special: {
    name: "Special Attack",
    tip: "+50% Attack, Ignore Defence",
    cost: 2,
    weight: 2,
  },
};

export type Action = {
  name: string;
  tip: string;
  cost: number;
  weight: number;
};

export type TurnOrderData = {
  combatant: string;
  speed: number;
  color: BadgeOwnProps["color"];
};

export type Event = {
  message: string;
  color: BadgeOwnProps["color"];
};
