export type Combatant = {
  name: string;
  id: string;
  color:
    | "neutral"
    | "blue"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "purple"
    | undefined;
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
