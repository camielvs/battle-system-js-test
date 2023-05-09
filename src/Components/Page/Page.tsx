import { Pane } from "evergreen-ui";
import { Combatant } from "./Components";
import { combatant1, combatant2 } from "./constants";

export function Page() {
  
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
      <Combatant combatant={combatant1}/>
      <Pane padding={64} />
      <Combatant combatant={combatant2}/>
    </Pane>
  )
}
