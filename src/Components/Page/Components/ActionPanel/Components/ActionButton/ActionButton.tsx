import { Button, Icon, SymbolCircleIcon, Text, Tooltip } from "evergreen-ui";

interface Props {
  action: any;
  disabled: boolean;
  onClick: () => void;
}

export function ActionButton({ action, disabled, onClick }: Props) {
  const mappingArray = new Array(action.cost).fill("-");
  const staminaIconMarkup = mappingArray.map((_, i) => (
    <Icon
      icon={SymbolCircleIcon}
      onClick={onClick}
      key={`${action.name}-${i}`}
    />
  ));
  return (
    <Tooltip content={action.tip}>
      <Button margin={8} intent="success" onClick={onClick} disabled={disabled}>
        {staminaIconMarkup}
        <Text color="default">{action.name}</Text>
      </Button>
    </Tooltip>
  );
}
