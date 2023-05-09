export type Combatant = {
  name: string,
  stats: {
    hp: {
      max: number,
      current: number,
    },
    attack: {
      max: number,
      current: number,
    },
    defence: {
      max: number,
      current: number,
    },
    speed: {
      max: number,
      current: number,
    },
    stamina: {
      max: number,
      current: number,
    },
    accuracy: {
      max: number,
      current: number,
    },
    evasion: {
      max: number,
      current: number,
    }
  }
}

export const combatant1: Combatant = {
  name: 'Player 1',
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
      max: 3,
      current: 3,
    },
    accuracy: {
      max: 10,
      current: 10,
    },
    evasion: {
      max: 5,
      current: 5,
    }
  }
}

export const combatant2: Combatant = {
  name: 'Player 2',
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
      max: 1,
      current: 1,
    },
    speed: {
      max: 120,
      current: 120,
    },
    stamina: {
      max: 3,
      current: 3,
    },
    accuracy: {
      max: 5,
      current: 5,
    },
    evasion: {
      max: 3,
      current: 3,
    }
  }
}