import { Pane } from "evergreen-ui";
import { ActionButtons, Combatant, TurnOrder } from "./Components";
import { combatant1Base, combatant2Base } from "./constants";
import { useState } from "react";

export function Page() {
  const [combatant1, setCombatant1] = useState(combatant1Base);
  const [combatant2, setCombatant2] = useState(combatant2Base);

  return (
    <Pane
      height="100vh"
      display="flex"
      alignItems="stretch"
      justifyContent="center"
      backgroundImage="url(https://www.metmuseum.org/-/media/images/blogs/now-at-the-met/2010/2010_09/natm_lod_lod-1.jpg)"
      backgroundSize="fill"
      backgroundPosition="center"
      backgroundRepeat="repeat-xy"
    >
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Pane display="flex">
          <Combatant combatant={combatant1} />
          <Pane padding={128} />
          <Combatant combatant={combatant2} />
        </Pane>
        <Pane padding={8} />
        <TurnOrder combatant1={combatant1} combatant2={combatant2} />
        <Pane padding={8} />
        <ActionButtons combatant1={combatant1} />
      </Pane>
    </Pane>
  );
}
