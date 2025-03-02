export const options: {
  gender: string[];
  address: string[];
  ward: string[];
  service_type: string[];
  sample: string[];
  direct_2: string[];
  culture_3: string[];
  genre_4: string[];
  species_training_5: string[];
  diagnosis: string[];
} = {
  gender: ['Male', 'Female'],
  address: [
    'Kandal',
    'Kampong Cham',
    'Takeo',
    'Phnom Penh',
    'Svay Rieng',
    'Unknown',
    'Kampot',
    'Battambang',
    'Kampong Thom',
    'Kampong Speu',
    'Koh Kong',
    'Prey Veng',
    'Preah Sihanouk',
    'Kampong Chhnang',
    'Tbong Khmum',
    'Pursat',
    'Mondulkiri',
    'Kratie',
    'Banteay Meanchey',
    'Preah Vihear',
    'Oddar Meanchey',
    'Ratanakiri',
    'Siem Reap',
    'Kep',
    'Stung Treng',
    'Pailin',
  ],
  ward: [
    'Maternity',
    'Surgery B',
    'Medicine B',
    'Medicine A4',
    'Cancer/blood disorders',
    'Emergency',
    'Surgery A',
    'Medicine A',
    'Medicine A5',
    'Gyn',
    'Neuro-surgery',
    'Neurology',
    'Surgery A2',
    'Cardio Pediatric',
    'Cardio-Rea',
    'Medicine A6',
    'Cardio B',
    'Rea-neuro',
    'Hepatogastroenterology',
    'Rea B',
    'Medicine A7',
    'Cardio C',
    'Cardio A',
    'Rea A',
    'Rea C',
  ],
  service_type: ['Pediatrie', 'Chirurgie', 'Medecine', 'SAU', 'Gyneco/Obs', 'Rea'],
  sample: [
    'Collection/Abces',
    'Hemoc/KT',
    'Urine',
    'Genital',
    'Respiratoire',
    'LCR',
    'Sereuse',
    'Osteoarticulaire',
    'Biopsie',
    'Digestif',
    'Peau',
    'Materiel',
  ],
  direct_2: ['Cocci Gram Pos', 'Bacille Gram Neg', 'Levure', 'Bacille Gram Pos'],
  culture_3: [
    'Cocci Gram Pos type streptocoque',
    'Cocci Gram Pos type staphylocoque',
    'Bacille Gram Neg type enterobacterie',
    'Bacille Gram Neg non fermentant',
    'Cocci Gram Pos type enterocoque',
    'Levure',
    'Cocci Gram Pos non specifie',
    'Bacille Gram Neg non specifie',
    'Bacille Gram Pos',
  ],
  genre_4: [
    'Streptococcus',
    'Staphylococcus',
    'Enterobacter',
    'Pantoea',
    'Burkholderia',
    'Acinetobacter',
    'Stenotrophomonas',
    'Pseudomonas',
    'Enterococcus',
    'Klebsiella',
    'Proteus',
    'Candida',
    'Lactococcus',
    'Salmonella',
    'Citrobacter',
    'Providencia',
    'Morganella',
    'Aeromonas',
    'Aerococcus',
    'Serratia',
    'Edwardsiella',
    'Plesiomonas',
    'Listeria',
    'Gemella',
    'Shigella',
    'Cronobacter',
  ],
  species_training_5: [
    'Streptococcus anginosus/constellatus/intermedius/milleri',
    'Staphylococcus aureus',
    'Enterobacter cloacae complex',
    'Pantoea agglomerans',
    'Burkholderia cepacia complex',
    'Acinetobacter baumannii-calcoaceticus complex',
    'Acinetobacter sp.',
    'Stenotrophomonas maltophilia',
    'Pseudomonas aeruginosa',
    'Streptococcus uberis',
    'Staphylococcus hominis',
    'Staphylococcus epidermidis',
    'Enterococcus faecalis',
    'Cronobacter sakazakii',
    'Staphylococcus saprophyticus',
    'Enterococcus faecium',
    'Klebsiella pneumoniae',
    'Proteus mirabilis',
    'Klebsiella ornithinolytica',
    'Candida albicans',
    'Streptococcus agalactiae/B',
    'Streptococcus mitis/australis/cristatus/infantis/massiliensis/oligofermentans/oralis/peroris/pseudopneumoniae/sinensis',
    'Streptococcus acidominimus',
    'Streptococcus sanguinis/parasanguinis/gordonii',
    'Streptococcus equinus(bovis)/gallolyticus(caprinus)/infantarius/lutetiensis/alactolyticus/pasteurianus/D(hors enterococoques)',
    'Lactococcus garvieae',
    'Streptococcus dysgalactiae/equi/equisimilis/C/canis/G',
    'Streptococcus sp.',
    'Staphylococcus haemolyticus',
    'Salmonella Typhi',
    'Salmonella Paratyphi',
    'Salmonella sp.',
    'Salmonella enterica',
    'Enterococcus casseliflavus/gallinarum',
    'Enterococcus avium',
    'Citrobacter koseri',
    'Klebsiella aerogenes',
    'Citrobacter freundii complex',
    'Klebsiella ozaenae',
    'Proteus vulgaris',
    'Klebsiella oxytoca',
    'Providencia stuartii',
    'Morganella morganii',
    'Enterococcus durans',
    'Burkholderia pseudomallei',
    'Streptococcus suis',
    'Streptococcus pyogenes/A',
    'Aeromonas caviae/dhakensis/eucrenophila/hydrophila/punctata/sobria/veronii',
    'Acinetobacter lwoffii/haemolyticus',
    'Staphylococcus lugdunensis',
    'Staphylococcus caprae',
    'Streptococcus pneumoniae',
    'Enterococcus gallinarum',
    'Enterococcus hirae',
    'Enterococcus sp.',
    'Candida glabrata',
    'Candida tropicalis',
    'Candida melibiosica',
    'Aerococcus viridans',
    'Pseudomonas putida',
    'Enterococcus raffinosus',
    'Serratia liquefaciens',
    'Edwardsiella tarda',
    'Plesiomonas shigelloides',
    'Listeria monocytogenes',
    'Candida sp.',
    'Candida parapsilosis',
    'Gemella morbillorum',
    'Streptococcus salivarius/thermophilus/vestibularis',
    'Streptococcus porcinus',
    'Staphylocoque a coagulase negative',
    'Citrobacter amalonaticus group',
    'Klebsiella terrigena',
    'Serratia marcescens',
    'Providencia rettgeri',
    'Shigella sonnei',
    'Cronobacter malonaticus',
  ],
  diagnosis: [
    'Les infections maternelles ',
    'Infection du tissu mou et ostéo-articulaire ',
    'Infection digestive ',
    'Infection and Trouble metabolique(Diabetes…)',
    'Infection Respiratoire',
    'Complications infectieuses des Accidents vasculaire cérébrales',
    'Infection system nerveux central ',
    'Other infection',
    'Infection en onco-hématologie ',
    'Infection urinaire ',
    'Infections genitales',
    'Fracture osseuse',
    'Infection and HTA, Coeur , Vasculaire ',
    'ORL , EYES and ENT',
    'Choc Septique ',
    'Melioidosis',
    'Unknown',
  ],
};

const wardCases: {
  values: string[];
  allowedGender: string[];
  allowedMinAge: number;
}[] = [
  {
    values: [
      'Medicine A',
      'Medicine B',
      'Medicine A4',
      'Medicine A5',
      'Medicine A6',
      'Medicine A1',
      'Medicine A7',
      'Neurology',
    ],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Rea A', 'Rea B', 'Rea C', 'Rea Pediatric', 'Rea Cardio', 'Rea Neuro'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 0,
  },
  {
    values: ['Cardio Pediatric', 'Cardio A', 'Cardio B', 'Cardio C'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 0,
  },
  {
    values: ['Surgery A', 'Surgery B', 'Surgery A2', 'Neuro-surgery'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Hepatogastroenterology'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Cancer/blood disorders'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 0,
  },
  {
    values: ['Emergency'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Gyn', 'Maternity'],
    allowedGender: ['Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Reveil'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: ['Dialysis'],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 14,
  },
  {
    values: [
      'ORL',
      'Consult ext.',
      'Consult ext. neuro',
      'Consult ext. cardio',
      'Consult ext. gyn',
      'External',
      'Eye disorders',
    ],
    allowedGender: ['Male', 'Female'],
    allowedMinAge: 0,
  },
];

export const getWardCases = (ward: string) => {
  const wardCase = wardCases.find((item) => item.values.includes(ward));
  if (!wardCase) {
    return {
      allowedGender: [],
      allowedMinAge: 0,
    };
  }
  return wardCase;
};

type StageOption =
  | string
  | {
      value: string;
      options: StageOption[];
    };

const nestedStageOptions: StageOption[] = [
  {
    value: 'Bacille Gram Neg',
    options: [
      {
        value: 'Bacille Gram Neg non fermentant',
        options: [
          {
            value: 'Acinetobacter',
            options: [
              'Acinetobacter baumannii-calcoaceticus complex',
              'Acinetobacter sp.',
              'Acinetobacter lwoffii/haemolyticus',
            ],
          },
          {
            value: 'Burkholderia',
            options: ['Burkholderia cepacia complex', 'Burkholderia pseudomallei'],
          },
          { value: 'Pseudomonas', options: ['Pseudomonas aeruginosa', 'Pseudomonas putida'] },
          { value: 'Stenotrophomonas', options: ['Stenotrophomonas maltophilia'] },
        ],
      },
      {
        value: 'Bacille Gram Neg non specifie',
        options: [
          { value: 'Aerococcus', options: ['Aerococcus viridans'] },
          {
            value: 'Aeromonas',
            options: ['Aeromonas caviae/dhakensis/eucrenophila/hydrophila/punctata/sobria/veronii'],
          },
        ],
      },
      {
        value: 'Bacille Gram Neg type enterobacterie',
        options: [
          {
            value: 'Citrobacter',
            options: [
              'Citrobacter koseri',
              'Citrobacter freundii complex',
              'Citrobacter amalonaticus group',
            ],
          },
          { value: 'Cronobacter', options: ['Cronobacter malonaticus'] },
          { value: 'Edwardsiella', options: ['Edwardsiella tarda'] },
          {
            value: 'Enterobacter',
            options: ['Enterobacter cloacae complex', 'Cronobacter sakazakii'],
          },
          {
            value: 'Klebsiella',
            options: [
              'Klebsiella pneumoniae',
              'Klebsiella ornithinolytica',
              'Klebsiella aerogenes',
              'Klebsiella ozaenae',
              'Klebsiella oxytoca',
              'Klebsiella terrigena',
            ],
          },
          { value: 'Morganella', options: ['Morganella morganii'] },
          { value: 'Pantoea', options: ['Pantoea agglomerans'] },
          { value: 'Plesiomonas', options: ['Plesiomonas shigelloides'] },
          { value: 'Proteus', options: ['Proteus mirabilis', 'Proteus vulgaris'] },
          { value: 'Providencia', options: ['Providencia stuartii', 'Providencia rettgeri'] },
          {
            value: 'Salmonella',
            options: [
              'Salmonella Typhi',
              'Salmonella Paratyphi',
              'Salmonella sp.',
              'Salmonella enterica',
            ],
          },
          { value: 'Serratia', options: ['Serratia liquefaciens', 'Serratia marcescens'] },
          { value: 'Shigella', options: ['Shigella sonnei'] },
          {
            value: 'Other',
            options: ['Contamination? ==> Consult with Infectious disease doctor'],
          },
        ],
      },
    ],
  },
  {
    value: 'Bacille Gram Pos',
    options: [
      { value: 'Listeria', options: ['Listeria monocytogenes'] },
      { value: 'Other', options: ['Contamination? ==> Consult with Infectious disease doctor'] },
    ],
  },
  {
    value: 'Cocci Gram Pos',
    options: [
      {
        value: 'Cocci Gram Pos non specifie',
        options: [
          { value: 'Gemella', options: ['Gemella morbillorum'] },
          { value: 'Lactococcus', options: ['Lactococcus garvieae'] },
        ],
      },
      {
        value: 'Cocci Gram Pos type enterocoque',
        options: [
          {
            value: 'Enterococcus',
            options: [
              'Enterococcus faecalis',
              'Enterococcus faecium',
              'Enterococcus casseliflavus/gallinarum',
              'Enterococcus avium',
              'Enterococcus durans',
              'Enterococcus gallinarum',
              'Enterococcus hirae',
              'Enterococcus sp.',
              'Enterococcus raffinosus',
            ],
          },
        ],
      },
      {
        value: 'Cocci Gram Pos type staphylocoque',
        options: [
          {
            value: 'Staphylococcus',
            options: [
              'Staphylococcus aureus',
              'Staphylococcus hominis',
              'Staphylococcus epidermidis',
              'Staphylococcus saprophyticus',
              'Staphylococcus haemolyticus',
              'Staphylococcus lugdunensis',
              'Staphylococcus caprae',
              'Staphylocoque a coagulase negative',
            ],
          },
        ],
      },
      {
        value: 'Cocci Gram Pos type streptocoque',
        options: [
          {
            value: 'Streptococcus',
            options: [
              'Streptococcus anginosus/constellatus/intermedius/milleri',
              'Streptococcus uberis',
              'Streptococcus agalactiae/B',
              'Streptococcus mitis/australis/cristatus/infantis/massiliensis/oligofermentans/oralis/peroris/pseudopneumoniae/sinensis',
              'Streptococcus acidominimus',
              'Streptococcus sanguinis/parasanguinis/gordonii',
              'Streptococcus equinus(bovis)/gallolyticus(caprinus)/infantarius/lutetiensis/alactolyticus/pasteurianus/D(hors enterococoques)',
              'Streptococcus dysgalactiae/equi/equisimilis/C/canis/G',
              'Streptococcus sp.',
              'Streptococcus suis',
              'Streptococcus pyogenes/A',
              'Streptococcus pneumoniae',
              'Streptococcus salivarius/thermophilus/vestibularis',
              'Streptococcus porcinus',
            ],
          },
          {
            value: 'Other',
            options: ['Contamination? ==> Consult with Infectious disease doctor'],
          },
        ],
      },
    ],
  },
  {
    value: 'Levure',
    options: [
      {
        value: 'Candida',
        options: [
          'Candida albicans',
          'Candida glabrata',
          'Candida tropicalis',
          'Candida melibiosica',
          'Candida sp.',
          'Candida parapsilosis',
        ],
      },
      { value: 'Other', options: ['Contamination? ==> Consult with Infectious disease doctor'] },
    ],
  },
];

export const getNestedStageOptions = (
  stage2?: string,
  stage3?: string,
  stage4?: string
): string[] => {
  if (!stage2) {
    return nestedStageOptions.map((item) => (typeof item === 'object' ? item.value : item));
  }
  const stage2Option = nestedStageOptions.find(
    (item) => typeof item === 'object' && item.value === stage2
  );
  if (!stage2Option) {
    return [];
  }
  if (!stage3) {
    return typeof stage2Option === 'object'
      ? stage2Option.options.map((item) => (typeof item === 'object' ? item.value : item))
      : [];
  }
  const stage3Option =
    typeof stage2Option === 'object'
      ? stage2Option.options.find((item) =>
          typeof item === 'object' ? item.value === stage3 : false
        )
      : undefined;
  if (!stage3Option) {
    return [];
  }
  if (!stage4) {
    return typeof stage3Option === 'object'
      ? stage3Option.options.map((item) => (typeof item === 'object' ? item.value : item))
      : [];
  }
  const stage4Option =
    typeof stage3Option === 'object'
      ? stage3Option.options.find((item) =>
          typeof item === 'object' ? item.value === stage4 : false
        )
      : undefined;
  if (!stage4Option) {
    return [];
  }
  return typeof stage4Option === 'object'
    ? stage4Option.options.map((item) => (typeof item === 'object' ? item.value : item))
    : [];
};
