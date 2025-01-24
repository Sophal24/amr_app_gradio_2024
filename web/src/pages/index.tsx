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
  Dialog,
  IconButton,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Iconify from 'src/components/iconify';
import { alpha } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import axiosInstance from 'src/utils/axios';
import * as XLSX from 'xlsx';
import { HELP_CONTENTS } from 'src/utils/help-contents';
import Scrollbar from 'src/components/scrollbar';

const defaultResult = [
  { name: 'Amoxicilline', value: 0, isDefault: true },
  { name: 'Augmentin', value: 0, isDefault: true },
  { name: 'Oxacilline / cefazoline', value: 0, isDefault: true },
  { name: 'Tazocilline', value: 0, isDefault: true },
  { name: 'Cefotaxime / ceftriaxone', value: 0, isDefault: true },
  { name: 'Ceftazidime', value: 0, isDefault: true },
  { name: 'Cefepime', value: 0, isDefault: true },
  { name: 'Aztreonam', value: 0, isDefault: true },
  { name: 'Imipenem', value: 0, isDefault: true },
  { name: 'Meropenem', value: 0, isDefault: true },
  { name: 'Ertapenem', value: 0, isDefault: true },
  { name: 'Amikacine', value: 0, isDefault: true },
  { name: 'Gentamicine', value: 0, isDefault: true },
  { name: 'Ciprofloxacine', value: 0, isDefault: true },
  { name: 'Levofloxacine', value: 0, isDefault: true },
  { name: 'Bactrim', value: 0, isDefault: true },
  { name: 'Vancomycine', value: 0, isDefault: true },
  { name: 'Rifampicine', value: 0, isDefault: true },
  { name: 'ClindamycineMacrolides', value: 0, isDefault: true },
];

const HomePage = () => {
  const [helpIndex, setHelpIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    age: string;
    sex: string;
    address: string;
    ward_en: string;
    service_type: string;
    date: Date | null;
    sample: string;
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
    sample: '',
    direct_2: '',
    culture_3: '',
    genre_4: '',
    species_training_5: '',
  });
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [results, setResults] =
    useState<{ name: string; value: number; isDefault: boolean }[]>(defaultResult);
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
    sample: string[];
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
    sample: [],
  });

  useEffect(() => {
    axiosInstance.get('/api/options').then((response) => {
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
    const res = await axiosInstance.post('/api/amr', formData);

    const result = res.data.result_probab_dict;
    const results = Object.keys(result)
      .map((name) => {
        const value = Number(Number(result[name]).toFixed(2)) * 100;
        return { name, value };
      })
      .sort((a, b) => b.value - a.value);

    setResults(results.map((r) => ({ ...r, isDefault: false })));
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
      sample: '',
      direct_2: '',
      culture_3: '',
      genre_4: '',
      species_training_5: '',
    });
    setResults(defaultResult);
  };

  const handleAutoFill = () => {
    setFormData({
      age: '18',
      sex: options.gender[0] || '',
      address: options.address[0] || '',
      ward_en: options.ward[0] || '',
      service_type: options.service_type[0] || '',
      date: new Date(),
      sample: options.sample[0] || '',
      direct_2: options.direct_2[0] || '',
      culture_3: options.culture_3[0] || '',
      genre_4: options.genre_4[0] || '',
      species_training_5: options.species_training_5[0] || '',
    });
  };

  const handleExport = async () => {
    const formDataSheet = XLSX.utils.json_to_sheet([formData]);
    const resultsSheet = XLSX.utils.json_to_sheet(
      results.map((r) => ({ name: r.name, percentage: `${Math.round(r.value)}%` }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Results');
    XLSX.utils.book_append_sheet(workbook, formDataSheet, 'Form Data');

    XLSX.writeFile(workbook, 'results.xlsx');
  };

  const disabledStage2 =
    !formData.age ||
    !formData.sex ||
    !formData.address ||
    !formData.ward_en ||
    !formData.service_type ||
    !formData.date ||
    !formData.sample;

  const disabledForm = disabledStage2;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <Stack p={4}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              borderBottom: (theme: Theme) => `1px dashed ${theme.palette.primary.main}`,
              pb: 2,
              mb: 2,
            }}
          >
            <Typography variant="h6" color="primary">
              Help Guide: Using the Clinical Decision Support System
            </Typography>
            <IconButton onClick={() => setOpenHelpDialog(false)}>
              <Iconify icon="mdi:close" width={24} />
            </IconButton>
          </Stack>
          <Typography variant="body1" textAlign="center">
            This system predicts antibiotic resistance and sensitivity through multiple stages.
            Follow the steps below to input the required information at each stage.
          </Typography>
          <Typography variant="h6" color="primary" mt={2} textAlign="center">
            Stage Descriptions and Input Fields
          </Typography>
          <Scrollbar
            sx={{
              maxHeight: '500px',
              py: 4,
            }}
          >
            <Stack spacing={4}>
              {HELP_CONTENTS[helpIndex].contents.map((content, index) => (
                <Stack key={index} spacing={4}>
                  <Typography variant="subtitle1">{content.title}</Typography>
                  <Stack spacing={2}>
                    {content.items.map((item, i) => (
                      <Typography key={i} component="li">
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Scrollbar>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              borderTop: (theme: Theme) => `1px dashed ${theme.palette.primary.main}`,
              pt: 4,
              mt: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {HELP_CONTENTS.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    height: '8px',
                    borderRadius: 4,
                    backgroundColor: 'primary.main',
                    width: index === helpIndex ? '32px' : '8px',
                    transition: 'width 0.5s',
                  }}
                />
              ))}
            </Stack>
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 8,
              }}
              onClick={() => {
                if (helpIndex < HELP_CONTENTS.length - 1) {
                  setHelpIndex(helpIndex + 1);
                } else {
                  setOpenHelpDialog(false);
                  setTimeout(() => setHelpIndex(0), 500);
                }
              }}
            >
              {helpIndex < HELP_CONTENTS.length - 1 ? 'Next' : 'Done'}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 4, md: 8 } }}>
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
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 6 }}
                onClick={() => setOpenHelpDialog(true)}
              >
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
              <Box component="img" src="/logo/uhs-logo.png" alt="logo" height={64} />
              <Box component="img" src="/logo/cadt-logo.png" alt="logo" height={64} />
              <Box component="img" src="/logo/logo_full.svg" alt="logo" height={64} />
              <Box component="img" src="/logo/IMG_5721.PNG" alt="logo" height={64} />
              <Box component="img" src="/logo/IMG_5722.JPG" alt="logo" height={64} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center">
              A Machine Learning-based Clinical Decision Support System predicts antibiotic
              resistance and susceptibility using patient data
            </Typography>
            <Typography variant="body2" textAlign="center">
              and microbial information, helping combat Antimicrobial Resistance <b>(AMR)</b>.
            </Typography>
          </Grid>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Card
                sx={{
                  p: 2,
                }}
                elevation={3}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Patient Form
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                  <Autocomplete
                    options={options.gender}
                    value={formData.sex}
                    onChange={(event, value) => handleAutocompleteChange('sex', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Sex" name="sex" fullWidth size="small" />
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
                        size="small"
                      />
                    )}
                  />
                  <Autocomplete
                    options={options.ward}
                    value={formData.ward_en}
                    onChange={(event, value) => handleAutocompleteChange('ward_en', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Ward" name="ward_en" fullWidth size="small" />
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
                        size="small"
                      />
                    )}
                  />
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: { fullWidth: true, size: 'small' },
                    }}
                  />
                  <Autocomplete
                    options={options.sample}
                    value={formData.sample}
                    onChange={(event, value) => handleAutocompleteChange('sample', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Sample" name="sample" fullWidth size="small" />
                    )}
                  />
                </Box>
              </Card>
              <Card
                elevation={3}
                sx={{
                  p: 2,
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Stage Form
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
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
                        size="small"
                        sx={{
                          backgroundColor: disabledStage2 ? alpha('#000', 0.05) : 'inherit',
                          borderRadius: 1,
                        }}
                      />
                    )}
                    disabled={disabledStage2}
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
                        size="small"
                        sx={{
                          backgroundColor: !formData.direct_2 ? alpha('#000', 0.05) : 'inherit',
                          borderRadius: 1,
                        }}
                      />
                    )}
                    disabled={!formData.direct_2}
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
                        size="small"
                        sx={{
                          backgroundColor: !formData.culture_3 ? alpha('#000', 0.05) : 'inherit',
                          borderRadius: 1,
                        }}
                      />
                    )}
                    disabled={!formData.culture_3}
                  />
                  <Autocomplete
                    options={options.species_training_5}
                    value={formData.species_training_5}
                    onChange={(event, value) =>
                      handleAutocompleteChange('species_training_5', value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Species Training 5"
                        name="species_training_5"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: !formData.genre_4 ? alpha('#000', 0.05) : 'inherit',
                          borderRadius: 1,
                        }}
                      />
                    )}
                    disabled={!formData.genre_4}
                  />
                </Box>
              </Card>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              justifyContent="flex-start"
              mt={4}
            >
              <Button variant="outlined" onClick={handleClear} sx={{ px: 8 }}>
                Clear All
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleSubmit}
                disabled={disabledForm}
                loading={isLoading}
                sx={{ px: 8 }}
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
              elevation={3}
              sx={{
                p: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="h6" color="primary.main">
                  Antibiotic Sensitivity Results
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ px: 6 }}
                  onClick={handleExport}
                  disabled={results.some((r) => r.isDefault)}
                >
                  Export
                </Button>
              </Stack>
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
            {/* <Stack
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
            </Stack> */}
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
