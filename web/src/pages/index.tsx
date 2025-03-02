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
  Tooltip,
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
import { getNestedStageOptions, getWardCases, options } from 'src/constants/options';

const defaultResult = [
  { name: 'Amoxicilline', value: 0, isDefault: true },
  { name: 'Augmentin', value: 0, isDefault: true },
  { name: 'Oxacilline / cefazoline', value: 0, isDefault: true },
  { name: 'Tazocilline', value: 0, isDefault: true },
  {
    name: 'Cefotaxime / ceftriaxone',
    value: 0,
    isDefault: true,
  },
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
  { name: 'Macrolides', value: 0, isDefault: true },
  { name: 'Metronidazole', value: 0, isDefault: true },
];

const mappedResult = [
  { name: 'Amoxicilline', label: 'Amoxicilline' },
  { name: 'Augmentin', label: 'Amoxicilline /Acide Clavulanique' },
  { name: 'Oxacilline / cefazoline', label: 'Oxacilline / Cefazoline' },
  { name: 'Tazocilline', label: 'Piperacilline / Tazobactam' },
  { name: 'Cefotaxime / ceftriaxone', label: 'Cefotaxime / Ceftriaxone' },
  { name: 'Ceftazidime', label: 'Ceftazidime' },
  { name: 'Cefepime', label: 'Cefepime' },
  { name: 'Aztreonam', label: 'Aztreonam' },
  { name: 'Imipenem', label: 'Imipenem' },
  { name: 'Meropenem', label: 'Meropenem' },
  { name: 'Ertapenem', label: 'Ertapenem' },
  { name: 'Amikacine', label: 'Amikacine' },
  { name: 'Gentamicine', label: 'Gentamicine' },
  { name: 'Ciprofloxacine', label: 'Ciprofloxacine' },
  { name: 'Levofloxacine', label: 'Levofloxacine' },
  { name: 'Bactrim', label: 'Cotrimoxazole' },
  { name: 'Vancomycine', label: 'Vancomycine' },
  { name: 'Rifampicine', label: 'Rifampicine' },
  { name: 'ClindamycineMacrolides', label: 'Clindamycine' },
  { name: 'Macrolides', label: 'Macrolides' },
  { name: 'Metronidazole', label: 'Metronidazole' },
];

const getResultLabel = (key: string): string => {
  const v = mappedResult.find((x) => x.name === key);
  if (v) {
    return v.label;
  }
  return '';
};

const getSliceNumber = (totalCount: number, sliceCount: number) => {
  if (totalCount % sliceCount === 0) {
    return totalCount / sliceCount;
  }
  return Math.floor(totalCount / sliceCount) + 1;
};

const getSliceResult = (
  results: { name: string; value: number; isDefault: boolean }[],
  sliceCount: number
) => {
  const sliceNumber = getSliceNumber(results.length, sliceCount);
  const sliceResults = [];
  for (let i = 0; i < sliceNumber; i++) {
    sliceResults.push(results.slice(i * sliceCount, (i + 1) * sliceCount));
  }
  return sliceResults;
};

const SLICE_COUNT = 7;

const HomePage = () => {
  const [tab, setTab] = useState<'input' | 'result'>('input');
  const [helpIndex, setHelpIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    age: number | string;
    sex: string;
    address: string;
    ward: string;
    service_type: string;
    date: Date | null;
    sample: string;
    direct_2: string;
    culture_3: string;
    genre_4: string;
    diagnosis: string;
    species_training_5: string;
  }>({
    age: '',
    sex: '',
    address: '',
    ward: '',
    service_type: '',
    date: null,
    sample: '',
    direct_2: '',
    culture_3: '',
    genre_4: '',
    species_training_5: '',
    diagnosis: '',
  });
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [results, setResults] = useState<{ name: string; value: number; isDefault: boolean }[][]>(
    getSliceResult(defaultResult, SLICE_COUNT)
  );
  const [availableOptions, setAvailableOptions] = useState(options);

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

    const _defaultResult = results.map((r) => ({ ...r, isDefault: false }));

    setResults(getSliceResult(_defaultResult, SLICE_COUNT));
    setIsLoading(false);
    setTab('result');
  };

  const handleClear = () => {
    setResults(getSliceResult(defaultResult, SLICE_COUNT));
  };

  const handleExport = async () => {
    const formDataSheet = XLSX.utils.json_to_sheet([formData]);
    const resultsSheet = XLSX.utils.json_to_sheet(
      results.flat().map((r) => ({
        antibiotic: r.name,
        percentage: `${Math.round(r.value)}%`,
        status: Math.round(r.value) >= 50 ? 'S' : 'R',
      }))
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
    !formData.ward ||
    !formData.service_type ||
    !formData.date ||
    !formData.sample ||
    !formData.diagnosis;

  const disabledForm = disabledStage2;

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

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
      <Container maxWidth={false} sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 8 } }}>
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
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', md: '1.5rem' },
                }}
              >
                Antibiotic Sensitivity Analysis
              </Typography>
              <Box flexGrow={1} />
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 6 }}
                onClick={() => setOpenHelpDialog(true)}
              >
                Help ?
              </Button>
              <Tooltip title="Logout">
                <Button variant="outlined" color="error" onClick={handleLogout}>
                  <Iconify icon="mdi:logout" width={24} />
                </Button>
              </Tooltip>
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
          {tab === 'input' && (
            <Grid item xs={12}>
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
                  <Autocomplete
                    options={availableOptions.ward}
                    value={formData.ward}
                    onChange={(event, value) => {
                      handleAutocompleteChange('ward', value);
                      setFormData((prev) => ({ ...prev, age: '', sex: '' }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Ward" name="ward" fullWidth size="small" />
                    )}
                  />
                  <Autocomplete
                    options={getWardCases(formData.ward).allowedGender}
                    value={formData.sex}
                    disabled={formData.ward === ''}
                    onChange={(event, value) => handleAutocompleteChange('sex', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sex"
                        name="sex"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: formData.ward === '' ? alpha('#000', 0.05) : 'inherit',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  />
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    disabled={formData.ward === ''}
                    onChange={handleChange}
                    onBlur={(e) => {
                      if (Number(e.target.value) < 0) {
                        setFormData({ ...formData, age: 0 });
                      }

                      const min = getWardCases(formData.ward).allowedMinAge;

                      if (!(Number(e.target.value) >= min)) {
                        setFormData({ ...formData, age: min });
                      }
                    }}
                    fullWidth
                    size="small"
                    sx={{
                      backgroundColor: formData.ward === '' ? alpha('#000', 0.05) : 'inherit',
                      borderRadius: 1,
                    }}
                  />
                  <Autocomplete
                    options={availableOptions.address}
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
                    options={availableOptions.service_type}
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
                    format="dd/MM/yyyy"
                  />
                  <Autocomplete
                    options={availableOptions.sample}
                    value={formData.sample}
                    onChange={(event, value) => handleAutocompleteChange('sample', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Sample" name="sample" fullWidth size="small" />
                    )}
                  />
                  <Autocomplete
                    options={availableOptions.diagnosis}
                    value={formData.diagnosis}
                    onChange={(event, value) => handleAutocompleteChange('diagnosis', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Diagnosis"
                        name="diagnosis"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Box>

                <Typography variant="h6" color="primary.main" gutterBottom mt={2}>
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
                    options={getNestedStageOptions()}
                    value={formData.direct_2}
                    onChange={(event, value) => {
                      handleAutocompleteChange('direct_2', value);
                      setFormData((prev) => ({
                        ...prev,
                        culture_3: '',
                        genre_4: '',
                        species_training_5: '',
                      }));
                    }}
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
                    options={getNestedStageOptions(formData.direct_2)}
                    value={formData.culture_3}
                    onChange={(event, value) => {
                      handleAutocompleteChange('culture_3', value);
                      setFormData((prev) => ({
                        ...prev,
                        genre_4: '',
                        species_training_5: '',
                      }));
                    }}
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
                    options={getNestedStageOptions(formData.direct_2, formData.culture_3)}
                    value={formData.genre_4}
                    onChange={(event, value) => {
                      handleAutocompleteChange('genre_4', value);
                      setFormData((prev) => ({
                        ...prev,
                        species_training_5: '',
                      }));
                    }}
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
                    options={getNestedStageOptions(
                      formData.direct_2,
                      formData.culture_3,
                      formData.genre_4
                    )}
                    value={formData.species_training_5}
                    onChange={(event, value) =>
                      handleAutocompleteChange('species_training_5', value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Species 5"
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
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={2}
                >
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ px: 8, width: { xs: '100%', sm: 'auto' } }}
                  >
                    Clear All
                  </Button>
                  <LoadingButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={disabledForm}
                    loading={isLoading}
                    sx={{ px: 8, width: { xs: '100%', sm: 'auto' } }}
                  >
                    Submit
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          )}

          {/* Results Panel */}
          {tab === 'result' && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <Typography variant="h6" color="primary.main">
                  Antibiotic Sensitivity Results
                </Typography>
                <Box flex={1} />
                <Button
                  variant="outlined"
                  sx={{ px: 6 }}
                  onClick={handleExport}
                  disabled={results.flat().some((r) => r.isDefault)}
                >
                  Export
                </Button>
                <Button variant="contained" sx={{ px: 6 }} onClick={() => setTab('input')}>
                  Input Form
                </Button>
              </Stack>

              <Grid container spacing={2}>
                {results.map((result, index) => (
                  <Grid item xs={12} lg={4}>
                    <Card
                      elevation={3}
                      sx={{
                        p: 2,
                      }}
                    >
                      <Box mt={2}>
                        {result.map((result, index) => (
                          <Box key={index} mb={2}>
                            <Typography>{getResultLabel(result.name)}</Typography>
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
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

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
