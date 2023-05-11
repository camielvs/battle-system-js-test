import { Button, Card, Heading, Pane } from "evergreen-ui";
import { Combatant } from "../../constants";
import { useState } from "react";
import { ActionButton } from "./Components";

interface Props {
  combatant1: Combatant;
}

const SKIPTURN = "-";
const ACTIONS = {
  attack: {
    name: "Attack",
    tip: "Deal Damage",
    cost: 1,
  },
  defend: {
    name: "Defend",
    tip: "+5 Defence until next action",
    cost: 1,
  },
  study: {
    name: "Study",
    tip: "+5 Accuracy, +5 Evasion until end of round",
    cost: 1,
  },
  special: {
    name: "Special Attack",
    tip: "+50% Attack, Ignore Defence",
    cost: 2,
  },
};

export function ActionPanel({ combatant1 }: Props) {
  const [chosenActions, setChosenActions] = useState([] as string[]);

  const stamina = combatant1.stats.stamina.max;
  const staminaArray = new Array(stamina).fill("-");
  const staminaMarkup = staminaArray.map((_, i) => (
    <Pane
      width={32}
      height={32}
      borderRadius={16}
      margin={8}
      border="default"
      borderWidth="thin"
      background={getStaminaColor(i)}
      display="flex"
      justifyContent="center"
      alignItems="center"
      key={i}
    >
      {i < chosenActions.length ? chosenActions[i].substring(0, 2) : null}
    </Pane>
  ));

  function getStaminaColor(i: number) {
    if (i < chosenActions.length) {
      if (chosenActions[i].substring(0, 2) === SKIPTURN) return "gray400";
      return "green400";
    }
    return "yellow100";
  }

  function updateActions(action: any) {
    if (action && chosenActions.length < stamina - action.cost + 1) {
      const newActions = new Array(action.cost).fill(SKIPTURN);
      newActions[0] = action.name;
      setChosenActions([...chosenActions, newActions].flat());
    }
  }

  const buttons = Object.entries(ACTIONS).map((entry) => {
    const action = entry[1];
    return (
      <ActionButton
        action={action}
        disabled={chosenActions.length >= stamina - action.cost + 1}
        onClick={() => updateActions(action)}
        key={action.name}
      />
    );
  });

  return (
    <Card
      display="flex"
      flexDirection="column"
      background="tint2"
      padding={16}
      alignItems="center"
    >
      <Pane display="flex" justifyContent="center">
        {staminaMarkup}
      </Pane>
      <Heading padding={8}>Choose your actions for this round</Heading>
      <Pane justifyContent="center">{buttons}</Pane>
      <Pane margin={8} />
      <Pane display="flex" justifyContent="center">
        <Button
          appearance="primary"
          onClick={() => console.log(chosenActions)}
          disabled={chosenActions.length !== stamina}
        >
          Confirm
        </Button>
        <Pane margin={8} />
        <Button appearance="destructive" onClick={() => setChosenActions([])}>
          Clear
        </Button>
      </Pane>
    </Card>
  );
}
