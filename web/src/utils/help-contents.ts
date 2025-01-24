export const HELP_CONTENTS: {
  page: number;
  contents: {
    title: string;
    items: string[];
  }[];
}[] = [
  {
    page: 0,
    contents: [
      {
        title: 'Stage 1: Basic Information',
        items: [
          'Required Inputs:',
          'Month: Month of the sample collection (e.g., “January”).',
          'Age: Age of the patient (in years).',
          'Sex: Gender of the patient (e.g., “Male” or “Female”).',
          'Address: Patient’s residential address.',
          'Ward: The ward or department where the patient is receiving care.',
          'Service Type: Type of medical service provided (e.g., outpatient, inpatient).',
          'Sample: Type of sample collected (e.g., blood, urine, sputum).',
        ],
      },
    ],
  },
  {
    page: 1,
    contents: [
      {
        title: 'Stage 2: Direct Examination Results',
        items: [
          'Required Inputs:',
          'All inputs from Stage 1.',
          'Direct observation: Results of direct microscopic examination (e.g., “Gram-positive”, “Gram-negative”).',
        ],
      },
      {
        title: 'Stage 3: Culture Results',
        items: [
          'All inputs from Stage 2.',
          'Culture: Results of the culture test (e.g., “Positive”, “Negative”, or specific findings).',
        ],
      },
    ],
  },
  {
    page: 2,
    contents: [
      {
        title: 'Stage 4: Genetic Testing Results',
        items: [
          'All inputs from Stage 3.',
          'Genre: Results of genetic testing to identify resistance genes or mechanisms.',
        ],
      },
      {
        title: 'Stage 5: Species Identification',
        items: [
          'All inputs from Stage 4.',
          'Species: Specific species identified (e.g., “E. coli”, “Klebsiella pneumoniae”).',
        ],
      },
    ],
  },
  {
    page: 3,
    contents: [
      {
        title: 'Instructions for Using the System',
        items: [
          'Begin with Stage 1 and provide all mandatory input fields.',
          'You need to input and the system will handle loading prediction model on stages accordingly.',
          'Review and verify your inputs before submitting.',
        ],
      },
      {
        title: 'Additional Tips',
        items: [
          'Ensure all data entries are accurate to improve prediction results.',
          'Contact the system administrator if you encounter technical issues or require further assistance.',
          'Contact number: +855 81 591 594',
        ],
      },
    ],
  },
];
