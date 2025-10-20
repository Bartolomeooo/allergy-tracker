import {Stack} from '@mui/material';
import SymptomSlider from '../../components/SymptomSlider';
import {useState} from 'react';

export default function SymptomsSection() {
  const [upperResp, setUpperResp] = useState(0);
  const [lowerResp, setLowerResp] = useState(0);
  const [skin, setSkin] = useState(0);
  const [eyes, setEyes] = useState(0);

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
          onChange={setUpperResp}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Dolny układ oddechowy"
          helperText="Kaszel, świszczący oddech, duszność"
          value={lowerResp}
          onChange={setLowerResp}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Zmiany skórne"
          helperText="Wysypka, świąd, zaczerwienienie skóry"
          value={skin}
          onChange={setSkin}
        />
      </Stack>

      <Stack sx={{flexBasis: {xs: '100%', md: '40%'}}}>
        <SymptomSlider
          label="Podrażnienie oczu"
          helperText="Łzawienie, swędzenie, zaczerwienienie oczu"
          value={eyes}
          onChange={setEyes}
        />
      </Stack>
    </Stack>
  );
}
