import {
  Button,
  Card,
  Heading,
  Icon,
  Pane,
  SymbolCircleIcon,
  Text,
  Tooltip,
} from "evergreen-ui";
import { Combatant } from "../../constants";
import { useState } from "react";

interface Props {
  combatant1: Combatant;
}

const SKIPTURN = "-";
const ACTIONS = {
  attack: {
    name: "Attack",
    tip: "Deal Damage",
  },
  defend: {
    name: "Defend",
    tip: "+5 Defence until next action",
  },
  study: {
    name: "Study",
    tip: "+5 Accuracy, +5 Evasion until end of round",
  },
  special: {
    name: "Special Attack",
    tip: "+50% Attack, Ignore Defence",
  },
};

export function ActionButtons({ combatant1 }: Props) {
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

  function updateActions(e: any) {
    if (!chosenActions || chosenActions.length >= stamina) return;

    const target = getTargetButton(e.target) as HTMLElement;
    if (!target) return;
    const action = target.outerText;

    if (action) {
      if (action === ACTIONS.special.name) {
        if (chosenActions.length < stamina - 1) {
          setChosenActions([...chosenActions, action, SKIPTURN]);
        }
      } else {
        setChosenActions([...chosenActions, action]);
      }
    }
  }

  function getTargetButton(target: HTMLElement) {
    if (target.nodeName.toLowerCase() === "span") return target; //Clicked the text in the button
    if (target.nodeName.toLowerCase() === "button") return target.lastChild; //Clicked the whitespace in the button
    if (target.nodeName.toLowerCase() === "svg")
      return target.parentNode!.parentNode!.lastChild; //Clicked the svg in the button
    if (target.nodeName.toLowerCase() === "path")
      return target.parentNode!.parentNode!.parentNode!.lastChild; //Clicked the circle in the button

    return null;
  }

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
      <Pane justifyContent="center">
        <Tooltip content={ACTIONS.attack.tip}>
          <Button
            margin={8}
            intent="success"
            onClick={(e: any) => updateActions(e)}
            disabled={chosenActions.length >= stamina}
          >
            <Icon
              icon={SymbolCircleIcon}
              onClick={(e: any) => updateActions(e)}
            />
            <Text color="default">{ACTIONS.attack.name}</Text>
          </Button>
        </Tooltip>
        <Tooltip content={ACTIONS.defend.tip}>
          <Button
            margin={8}
            intent="success"
            onClick={(e: any) => updateActions(e)}
            disabled={chosenActions.length >= stamina}
          >
            <Icon
              icon={SymbolCircleIcon}
              onClick={(e: any) => updateActions(e)}
            />
            <Text color="default">{ACTIONS.defend.name}</Text>
          </Button>
        </Tooltip>
        <Tooltip content={ACTIONS.study.tip}>
          <Button
            margin={8}
            intent="success"
            onClick={(e: any) => updateActions(e)}
            disabled={chosenActions.length >= stamina}
          >
            <Icon
              icon={SymbolCircleIcon}
              onClick={(e: any) => updateActions(e)}
            />
            <Text color="default">{ACTIONS.study.name}</Text>
          </Button>
        </Tooltip>
        <Tooltip content={ACTIONS.special.tip}>
          <Button
            margin={8}
            intent="success"
            onClick={(e: any) => updateActions(e)}
            disabled={chosenActions.length >= stamina - 1}
          >
            <Icon
              icon={SymbolCircleIcon}
              onClick={(e: any) => updateActions(e)}
            />
            <Icon
              icon={SymbolCircleIcon}
              onClick={(e: any) => updateActions(e)}
            />
            <Text color="default">{ACTIONS.special.name}</Text>
          </Button>
        </Tooltip>
      </Pane>
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
