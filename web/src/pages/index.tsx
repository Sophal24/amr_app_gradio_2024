import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { getNestedStageOptions, getWardCases, options } from 'src/constants/options';
import axiosInstance from 'src/utils/axios';
import { HELP_CONTENTS } from 'src/utils/help-contents';
import * as XLSX from 'xlsx';

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

type InputFormData = {
  age: number | string;
  sex: string;
  address: string;
  ward_en: string;
  date: Date | null;
  sample: string;
  direct_2: string;
  culture_3: string;
  genre_4: string;
  diagnosis: string;
  species_training_5: string;
};

type Result = {
  name: string;
  value: number;
};

type FeedbackFormData = {
  agree: string | number;
  comment: string;
  inputs: InputFormData;
  results: Result[];
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
  const [formData, setFormData] = useState<InputFormData>({
    age: '',
    sex: '',
    address: '',
    ward_en: '',
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
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackFormData, setFeedbackFormData] = useState<FeedbackFormData>({
    agree: '',
    comment: '',
    inputs: formData,
    results: results.flat().map((r) => ({ name: r.name, value: r.value })),
  });

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

    setFeedbackFormData((prev) => ({
      ...prev,
      inputs: formData,
      results: res.data.result_probab_dict,
    }));

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
    setShowFeedbackPopup(true);
  };

  const handleClear = () => {
    setFormData({
      age: '',
      sex: '',
      address: '',
      ward_en: '',
      date: null,
      sample: '',
      direct_2: '',
      culture_3: '',
      genre_4: '',
      species_training_5: '',
      diagnosis: '',
    });
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
    !formData.ward_en ||
    !formData.date ||
    !formData.sample ||
    !formData.diagnosis;

  const disabledForm = disabledStage2;

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  const handleSaveFeedback = async () => {
    try {
      setShowFeedbackPopup(false);
      await axiosInstance.post('/api/save-feedback', feedbackFormData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFeedbackFormData({
        agree: '',
        comment: '',
        inputs: {
          age: '',
          sex: '',
          address: '',
          ward_en: '',
          date: null,
          sample: '',
          direct_2: '',
          culture_3: '',
          genre_4: '',
          species_training_5: '',
          diagnosis: '',
        },
        results: defaultResult.map((r) => ({ name: r.name, value: r.value })),
      });
    } catch (error) {
      console.error(error);
    }
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
              <Box
                component="img"
                src="/logo/Logo AMR.png"
                width={32}
                sx={{
                  m: 'auto',
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', md: '1.5rem' },
                }}
              >
                Cambodia AMR Predicting Application
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
              <Box component="img" src="/logo/IMG_5722.JPG" alt="logo" height={64} />
              <Box component="img" src="/logo/cadt-logo.png" alt="logo" height={64} />
              <Box component="img" src="/logo/IMG_5721.PNG" alt="logo" height={64} />
              <Box component="img" src="/logo/IMG000.jpg" alt="logo" height={64} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center">
              A Machine Learning-based Clinical Decision Support System predicts antibiotic
              resistance and susceptibility using patient data
            </Typography>
            <Typography variant="body2" textAlign="center">
              and microbial information, helping combat Antimicrobial Resistance <b>(CAMPRA)</b>.
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
                    value={formData.ward_en}
                    onChange={(event, value) => {
                      handleAutocompleteChange('ward_en', value);
                      setFormData((prev) => ({ ...prev, age: '', sex: '' }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Ward" name="ward_en" fullWidth size="small" />
                    )}
                  />
                  <Autocomplete
                    options={getWardCases(formData.ward_en).allowedGender}
                    value={formData.sex}
                    disabled={formData.ward_en === ''}
                    onChange={(event, value) => handleAutocompleteChange('sex', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sex"
                        name="sex"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor:
                            formData.ward_en === '' ? alpha('#000', 0.05) : 'inherit',
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
                    disabled={formData.ward_en === ''}
                    onChange={handleChange}
                    onBlur={(e) => {
                      if (Number(e.target.value) < 0) {
                        setFormData({ ...formData, age: 0 });
                      }

                      const min = getWardCases(formData.ward_en).allowedMinAge;

                      if (!(Number(e.target.value) >= min)) {
                        setFormData({ ...formData, age: min });
                      }
                    }}
                    fullWidth
                    size="small"
                    sx={{
                      backgroundColor: formData.ward_en === '' ? alpha('#000', 0.05) : 'inherit',
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
                  Microbiology Information
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
                        label="Direct"
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
                        label="Culture"
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
                        label="Genre"
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
                        label="Species"
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
        <Stack
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'background.paper',
            boxShadow: 6,
            zIndex: 1000,
            width: { xs: '100%', sm: '460px', md: '560px', lg: '620px' },
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out',
            transform: showFeedbackPopup ? 'translateY(0)' : 'translateY(110%)',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: 'primary.main',
              pl: 2,
              py: 1,
              pr: 1,
              color: 'white',
            }}
          >
            <Typography variant="subtitle1" textAlign="center">
              Result Report
            </Typography>
            <Box flex={1} />
            <IconButton onClick={() => setShowFeedbackPopup(false)}>
              <Iconify icon="mdi:close" width={24} color="white" />
            </IconButton>
          </Stack>
          <Stack p={2} spacing={1}>
            <Typography variant="body2" textAlign="center">
              Fill result report with a thumbs-up/thumbs-down and a comment. Click 'Save'.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                height: '36px',
                '& > svg': {
                  cursor: 'pointer',
                },
              }}
            >
              {feedbackFormData.agree === 1 ? (
                <svg
                  width="35"
                  height="30"
                  viewBox="0 0 35 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.68 1.08995L10.37 9.39995C9.815 9.95495 9.5 10.72 9.5 11.515V26.5C9.5 28.15 10.85 29.5 12.5 29.5H26C27.2 29.5 28.28 28.78 28.76 27.685L33.65 16.27C34.91 13.3 32.735 9.99995 29.51 9.99995H21.035L22.46 3.12995C22.61 2.37995 22.385 1.61495 21.845 1.07495C20.96 0.204953 19.55 0.204953 18.68 1.08995ZM3.5 29.5C5.15 29.5 6.5 28.15 6.5 26.5V14.5C6.5 12.85 5.15 11.5 3.5 11.5C1.85 11.5 0.5 12.85 0.5 14.5V26.5C0.5 28.15 1.85 29.5 3.5 29.5Z"
                    fill="#4589F0"
                  />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setFeedbackFormData((prev) => ({ ...prev, agree: 1 }))}
                >
                  <path
                    d="M12.0002 28H24.0002C25.1068 28 26.0535 27.3333 26.4535 26.3733L30.4802 16.9733C30.6002 16.6667 30.6668 16.3467 30.6668 16V13.3333C30.6668 11.8667 29.4668 10.6667 28.0002 10.6667H19.5868L20.8535 4.57334L20.8935 4.14668C20.8935 3.60001 20.6668 3.09334 20.3068 2.73334L18.8935 1.33334L10.1068 10.12C9.62683 10.6 9.3335 11.2667 9.3335 12V25.3333C9.3335 26.8 10.5335 28 12.0002 28ZM12.0002 12L17.7868 6.21334L16.0002 13.3333H28.0002V16L24.0002 25.3333H12.0002V12ZM1.3335 12H6.66683V28H1.3335V12Z"
                    fill="#4589F0"
                  />
                </svg>
              )}

              {feedbackFormData.agree === 0 ? (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 24C3.7 24 3 23.7 2.4 23.1C1.8 22.5 1.5 21.8 1.5 21V18C1.5 17.825 1.5185 17.6375 1.5555 17.4375C1.5925 17.2375 1.649 17.05 1.725 16.875L6.225 6.3C6.45 5.8 6.825 5.375 7.35 5.025C7.875 4.675 8.425 4.5 9 4.5H21C21.825 4.5 22.5315 4.7935 23.1195 5.3805C23.7075 5.9675 24.001 6.674 24 7.5V22.7625C24 23.1625 23.919 23.544 23.757 23.907C23.595 24.27 23.376 24.5885 23.1 24.8625L14.9625 32.9625C14.5875 33.3125 14.144 33.525 13.632 33.6C13.12 33.675 12.626 33.5875 12.15 33.3375C11.674 33.0875 11.3305 32.7375 11.1195 32.2875C10.9085 31.8375 10.8645 31.375 10.9875 30.9L12.675 24H4.5ZM30 4.5C30.825 4.5 31.5315 4.794 32.1195 5.382C32.7075 5.97 33.001 6.676 33 7.5V21C33 21.825 32.7065 22.5315 32.1195 23.1195C31.5325 23.7075 30.826 24.001 30 24C29.174 23.999 28.468 23.7055 27.882 23.1195C27.296 22.5335 27.002 21.827 27 21V7.5C27 6.675 27.294 5.969 27.882 5.382C28.47 4.795 29.176 4.501 30 4.5Z"
                    fill="#EB5151"
                  />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setFeedbackFormData((prev) => ({ ...prev, agree: 0 }))}
                >
                  <path
                    d="M25.3335 20V4H30.6668V20H25.3335ZM20.0002 4C20.7074 4 21.3857 4.28095 21.8858 4.78105C22.3859 5.28115 22.6668 5.95942 22.6668 6.66667V20C22.6668 20.7333 22.3735 21.4 21.8802 21.88L13.1068 30.6667L11.6935 29.2533C11.3335 28.8933 11.1068 28.4 11.1068 27.84L11.1468 27.4267L12.4135 21.3333H4.00016C3.29292 21.3333 2.61464 21.0524 2.11454 20.5523C1.61445 20.0522 1.3335 19.3739 1.3335 18.6667V16C1.3335 15.6533 1.40016 15.3333 1.52016 15.0267L5.54683 5.62667C5.94683 4.66667 6.8935 4 8.00016 4H20.0002ZM20.0002 6.66667H7.96016L4.00016 16V18.6667H15.7068L14.2002 25.76L20.0002 19.96V6.66667Z"
                    fill="#EB5151"
                  />
                </svg>
              )}
            </Stack>
            <TextField
              placeholder="Write a comment…"
              variant="outlined"
              fullWidth
              multiline
              rows={1}
              value={feedbackFormData.comment}
              onChange={(e) =>
                setFeedbackFormData({ ...feedbackFormData, comment: e.target.value })
              }
            />
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 6 }}
                onClick={handleSaveFeedback}
                disabled={feedbackFormData.agree === ''}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;
