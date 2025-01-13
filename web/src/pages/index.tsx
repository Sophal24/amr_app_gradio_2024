import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Slider,
  Container,
  Stack,
  Card,
  Theme,
  Autocomplete,
  LinearProgress,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Iconify from 'src/components/iconify';
import { alpha } from '@mui/system';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

const defaultResult = [
  { name: 'Amoxicilline', value: 0 },
  { name: 'Augmentin', value: 0 },
  { name: 'Oxacilline / cefazoline', value: 0 },
  { name: 'Tazocilline', value: 0 },
  { name: 'Cefotaxime / ceftriaxone', value: 0 },
  { name: 'Ceftazidime', value: 0 },
  { name: 'Cefepime', value: 0 },
  { name: 'Aztreonam', value: 0 },
  { name: 'Imipenem', value: 0 },
  { name: 'Meropenem', value: 0 },
  { name: 'Ertapenem', value: 0 },
  { name: 'Amikacine', value: 0 },
  { name: 'Gentamicine', value: 0 },
  { name: 'Ciprofloxacine', value: 0 },
  { name: 'Levofloxacine', value: 0 },
  { name: 'Bactrim', value: 0 },
  { name: 'Vancomycine', value: 0 },
  { name: 'Rifampicine', value: 0 },
  { name: 'ClindamycineMacrolides', value: 0 },
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    age: string;
    sex: string;
    address: string;
    ward_en: string;
    service_type: string;
    date: Date | null;
    prelevement_type: string;
    germe: string;
    contamination: string;
    direct_2: string;
    culture_3: string;
    genre_4: string;
    species_training_5: string;
  }>({
    age: '',
    sex: '',
    address: '',
    ward_en: '',
    service_type: '',
    date: null,
    prelevement_type: '',
    germe: '',
    contamination: '',
    direct_2: '',
    culture_3: '',
    genre_4: '',
    species_training_5: '',
  });

  const [results, setResults] = useState<{ name: string; value: number }[]>(defaultResult);

  const [options, setOptions] = useState<{
    gender: string[];
    address: string[];
    ward: string[];
    service_type: string[];
    germe: string[];
    contamination: string[];
    direct_2: string[];
    culture_3: string[];
    genre_4: string[];
    species_training_5: string[];
    prelevement_type: string[];
  }>({
    gender: [],
    address: [],
    ward: [],
    service_type: [],
    germe: [],
    contamination: [],
    direct_2: [],
    culture_3: [],
    genre_4: [],
    species_training_5: [],
    prelevement_type: [],
  });

  useEffect(() => {
    axios.get('/api/options').then((response) => {
      setOptions(response.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name: string, value: string | null) => {
    setFormData({ ...formData, [name]: value || '' });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await axios.post('/api/amr', formData);

    const result = res.data.result_probab_dict;
    const results = Object.keys(result)
      .map((name) => {
        const value = Number(Number(result[name]).toFixed(2)) * 100;
        return { name, value };
      })
      .sort((a, b) => b.value - a.value);

    setResults(results);
    setIsLoading(false);
  };

  const handleClear = () => {
    setFormData({
      age: '',
      sex: '',
      address: '',
      ward_en: '',
      service_type: '',
      date: null,
      prelevement_type: '',
      germe: '',
      contamination: '',
      direct_2: '',
      culture_3: '',
      genre_4: '',
      species_training_5: '',
    });
  };

  const handleAutoFill = () => {
    setFormData({
      age: '18',
      sex: options.gender[0] || '',
      address: options.address[0] || '',
      ward_en: options.ward[0] || '',
      service_type: options.service_type[0] || '',
      date: new Date(),
      prelevement_type: options.prelevement_type[0] || '',
      germe: options.germe[0] || '',
      contamination: options.contamination[0] || '',
      direct_2: options.direct_2[0] || '',
      culture_3: options.culture_3[0] || '',
      genre_4: options.genre_4[0] || '',
      species_training_5: options.species_training_5[0] || '',
    });
  };

  const handleResult = () => {
    setResults(defaultResult);
  };

  const disabledForm = Object.values(formData).some((value) => value === '');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{
                boxShadow: 6,
                borderRadius: 1,
                p: 2,
                bgcolor: 'background.paper',
                color: 'primary.main',
              }}
            >
              <Iconify
                icon="healthicons:biomarker-24px"
                width={32}
                sx={{
                  transform: 'rotate(45deg)',
                }}
              />
              <Typography variant="h5">Antibiotic Sensitivity Analysis</Typography>
              <Box flexGrow={1} />
              <Button variant="contained" color="primary" sx={{ px: 6 }}>
                Help ?
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
            >
              <Box component="img" src="/logo/cadt-logo.png" alt="logo" height={64} />
              <Box component="img" src="/logo/logo_full.svg" alt="logo" height={64} />
              <Box component="img" src="/logo/uhs-logo.png" alt="logo" height={64} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center">
              Welcome to our web app! We're excited to help you find the right antibiotic treatment
              for your patients.
            </Typography>
            <Typography variant="body2" textAlign="center">
              To ensure you get the most accurate analysis, please fill in your patient information
              accurately below and click submit to get the results.
            </Typography>
          </Grid>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.lighter, 0.2),
              }}
            >
              <Typography variant="h6" color="primary.main">
                Input Form
              </Typography>
              <Box component="form">
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Autocomplete
                  options={options.gender}
                  value={formData.sex}
                  onChange={(event, value) => handleAutocompleteChange('sex', value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Sex" name="sex" fullWidth margin="normal" />
                  )}
                />
                <Autocomplete
                  options={options.address}
                  value={formData.address}
                  onChange={(event, value) => handleAutocompleteChange('address', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Address"
                      name="address"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.ward}
                  value={formData.ward_en}
                  onChange={(event, value) => handleAutocompleteChange('ward_en', value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Ward" name="ward_en" fullWidth margin="normal" />
                  )}
                />
                <Autocomplete
                  options={options.service_type}
                  value={formData.service_type}
                  onChange={(event, value) => handleAutocompleteChange('service_type', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Service Type"
                      name="service_type"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: { fullWidth: true, margin: 'normal' },
                  }}
                />
                <Autocomplete
                  options={options.prelevement_type}
                  value={formData.prelevement_type}
                  onChange={(event, value) => handleAutocompleteChange('prelevement_type', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Prelevement Type"
                      name="prelevement_type"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.germe}
                  value={formData.germe}
                  onChange={(event, value) => handleAutocompleteChange('germe', value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Germe" name="germe" fullWidth margin="normal" />
                  )}
                />
                <Autocomplete
                  options={options.contamination}
                  value={formData.contamination}
                  onChange={(event, value) => handleAutocompleteChange('contamination', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Contamination"
                      name="contamination"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.direct_2}
                  value={formData.direct_2}
                  onChange={(event, value) => handleAutocompleteChange('direct_2', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Direct 2"
                      name="direct_2"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.culture_3}
                  value={formData.culture_3}
                  onChange={(event, value) => handleAutocompleteChange('culture_3', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Culture 3"
                      name="culture_3"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.genre_4}
                  value={formData.genre_4}
                  onChange={(event, value) => handleAutocompleteChange('genre_4', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Genre 4"
                      name="genre_4"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  options={options.species_training_5}
                  value={formData.species_training_5}
                  onChange={(event, value) => handleAutocompleteChange('species_training_5', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Species Training 5"
                      name="species_training_5"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Box>
            </Card>

            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              justifyContent="flex-start"
              mt={4}
            >
              <Button variant="outlined" onClick={handleClear}>
                Clear All
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleSubmit}
                disabled={disabledForm}
                loading={isLoading}
              >
                Submit
              </LoadingButton>
              {/* <Button variant="contained" color="secondary" onClick={handleAutoFill}>
                Auto Fill
              </Button> */}
            </Stack>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.lighter, 0.2),
              }}
            >
              <Typography variant="h6" color="primary.main">
                Antibiotic Sensitivity Results
              </Typography>
              <Box mt={2}>
                {results.map((result, index) => (
                  <Box key={index} mb={2}>
                    <Typography>{result.name}</Typography>
                    <Box display="flex" alignItems="center">
                      <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" value={result.value} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${Math.round(
                          result.value
                        )}%`}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              justifyContent="flex-end"
              mt={4}
            >
              <Button variant="contained" onClick={handleResult}>
                Clear Result
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mt={4}>
              <Typography variant="body2" textAlign="center">
                Powered by
              </Typography>
              <Box component="img" src="/logo/cadt-logo.png" alt="logo" height={32} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;
