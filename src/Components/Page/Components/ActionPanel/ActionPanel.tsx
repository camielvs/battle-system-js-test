import { Button, Card, Heading, Pane } from "evergreen-ui";
import { ACTIONS, Action, Combatant, SKIPTURN } from "../../constants";
import { useState } from "react";
import { ActionButton } from "./Components";

interface Props {
  combatant1: Combatant;
  onConfirm: (actions: string[]) => void;
}

export function ActionPanel({ combatant1, onConfirm }: Props) {
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

  function updateActions(action: Action) {
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
          onClick={() => {
            onConfirm(chosenActions);
            setChosenActions([]);
          }}
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
