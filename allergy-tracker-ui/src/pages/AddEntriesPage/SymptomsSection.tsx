import {Stack} from '@mui/material';
import SymptomSlider from './SymptomSlider';

type Props = {
  upperResp: number;
  onUpperRespChange: (v: number) => void;
  lowerResp: number;
  onLowerRespChange: (v: number) => void;
  skin: number;
  onSkinChange: (v: number) => void;
  eyes: number;
  onEyesChange: (v: number) => void;
};

export default function SymptomsSection({
  upperResp,
  onUpperRespChange,
  lowerResp,
  onLowerRespChange,
  skin,
  onSkinChange,
  eyes,
  onEyesChange,
}: Props) {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="space-between"
      sx={{width: '100%', gap: 4, p: 2}}
    >
      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Górny układ oddechowy"
          helperText="Nasilenie kataru i kichania"
          value={upperResp}
          onChange={onUpperRespChange}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Dolny układ oddechowy"
          helperText="Kaszel, świszczący oddech, duszność"
          value={lowerResp}
          onChange={onLowerRespChange}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Zmiany skórne"
          helperText="Wysypka, świąd, zaczerwienienie skóry"
          value={skin}
          onChange={onSkinChange}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Podrażnienie oczu"
          helperText="Łzawienie, swędzenie, zaczerwienienie oczu"
          value={eyes}
          onChange={onEyesChange}
        />
      </Stack>
    </Stack>
  );
}
