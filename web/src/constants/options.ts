export const options: {
  gender: string[];
  address: string[];
  ward: string[];
  sample: string[];
  direct_2: string[];
  culture_3: string[];
  genre_4: string[];
  species_training_5: string[];
  diagnosis: string[];
} = {
  gender: ['Male', 'Female'],
  address: [
    'Banteay Meanchey',
    'Battambang',
    'Kampong Cham',
    'Kampong Chhnang',
    'Kampong Speu',
    'Kampong Thom',
    'Kampot',
    'Kandal',
    'Kep',
    'Koh Kong',
    'Kratie',
    'Mondulkiri',
    'Oddar Meanchey',
    'Other',
    'Pailin',
    'Phnom Penh',
    'Preah Sihanouk',
    'Preah Vihear',
    'Prey Veng',
    'Pursat',
    'Ratanakiri',
    'Siem Reap',
    'Stung Treng',
    'Svay Rieng',
    'Takeo',
    'Tbong Khmum',
  ],
  ward: [
    'Cancer/blood disorders',
    'Cardio A',
    'Cardio B',
    'Cardio C',
    'Cardio Pediatric',
    'Cardio-Rea',
    'Emergency',
    'Gyn',
    'Hepatogastroenterology',
    'Maternité',
    'Medicine A',
    'Medicine A4',
    'Medicine A5',
    'Medicine A6',
    'Medicine A7',
    'Medicine B',
    'Neuro-surgery',
    'Neurology',
    'Rea A',
    'Rea B',
    'Rea C',
    'Rea-neuro',
    'Surgery A',
    'Surgery A2',
    'Surgery B',
  ],
  sample: [
    'Biopsie',
    'Blood',
    'Fecal sample',
    'Genital sample',
    'Hepatogastro sample',
    'LCR',
    'Osteo-articulaire ',
    'Other',
    'Pericadic sample',
    'Pus sample',
    'Respiratoy sample',
    'Urine',
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
    'Choc Septique ',
    'Complications infectieuses des Accidents vasculaire cérébrales',
    'Fracture osseuse',
    'Infection Respiratoire',
    'Infection and HTA, Coeur , Vasculaire ',
    'Infection and Trouble metabolique(Diabetes…)',
    'Infection digestive ',
    'Infection du tissu mou et ostéo-articulaire ',
    'Infection en onco-hématologie ',
    'Infection system nerveux central ',
    'Infection urinaire ',
    'Infections genitales',
    'Les infections maternelles ',
    'Melioidosis',
    'ORL , EYES and ENT',
    'Other infection',
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
      allowedGender: ['Male', 'Female'],
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
          {
            value: 'Pseudomonas',
            options: ['Pseudomonas aeruginosa', 'Pseudomonas putida'],
          },
          {
            value: 'Stenotrophomonas',
            options: ['Stenotrophomonas maltophilia'],
          },
        ],
      },
      {
        value: 'Bacille Gram Neg non specifie',
        options: [
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
          {
            value: 'Cronobacter',
            options: ['Cronobacter malonaticus'],
          },
          {
            value: 'Edwardsiella',
            options: ['Edwardsiella tarda'],
          },
          {
            value: 'Enterobacter',
            options: ['Enterobacter cloacae complex', 'Cronobacter sakazakii'],
          },
          {
            value: 'Escherichia',
            options: ['Escherichia coli'],
          },
          {
            value: 'Klebsiella',
            options: [
              'Klebsiella pneumoniae',
              'Klebsiella ozaenae',
              'Klebsiella aerogenes',
              'Klebsiella ornithinolytica',
              'Klebsiella oxytoca',
              'Klebsiella terrigena',
            ],
          },
          {
            value: 'Morganella',
            options: ['Morganella morganii'],
          },
          {
            value: 'Pantoea',
            options: ['Pantoea agglomerans'],
          },
          {
            value: 'Plesiomonas',
            options: ['Plesiomonas shigelloides'],
          },
          {
            value: 'Proteus',
            options: ['Proteus mirabilis', 'Proteus vulgaris'],
          },
          {
            value: 'Providencia',
            options: ['Providencia stuartii', 'Providencia rettgeri'],
          },
          {
            value: 'Salmonella',
            options: [
              'Salmonella Typhi',
              'Salmonella Paratyphi',
              'Salmonella sp.',
              'Salmonella enterica',
            ],
          },
          {
            value: 'Serratia',
            options: ['Serratia marcescens', 'Serratia liquefaciens'],
          },
          {
            value: 'Shigella',
            options: ['Shigella sonnei'],
          },
        ],
      },
    ],
  },
  {
    value: 'Bacille Gram Pos',
    options: [
      {
        value: 'Bacille Gram Pos',
        options: [
          {
            value: 'Listeria',
            options: ['Listeria monocytogenes'],
          },
        ],
      },
    ],
  },
  {
    value: 'Cocci Gram Pos',
    options: [
      {
        value: 'Cocci Gram Pos non specifie',
        options: [
          {
            value: 'Aerococcus',
            options: ['Aerococcus viridans'],
          },
          {
            value: 'Gemella',
            options: ['Gemella morbillorum'],
          },
          {
            value: 'Lactococcus',
            options: ['Lactococcus garvieae'],
          },
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
              'Staphylococcus saprophyticus',
              'Staphylococcus hominis',
              'Staphylococcus epidermidis',
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
              'Streptococcus equinus(bovis)/gallolyticus(caprinus)/infantarius/lutetiensis/alactolyticus/pasteurianus/D(hors enterococoques)',
              'Streptococcus uberis',
              'Streptococcus agalactiae/B',
              'Streptococcus mitis/australis/cristatus/infantis/massiliensis/oligofermentans/oralis/peroris/pseudopneumoniae/sinensis',
              'Streptococcus acidominimus',
              'Streptococcus sanguinis/parasanguinis/gordonii',
              'Streptococcus dysgalactiae/equi/equisimilis/C/canis/G',
              'Streptococcus sp.',
              'Streptococcus suis',
              'Streptococcus pyogenes/A',
              'Streptococcus pneumoniae',
              'Streptococcus salivarius/thermophilus/vestibularis',
              'Streptococcus porcinus',
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'Levure',
    options: [
      {
        value: 'Levure',
        options: [
          {
            value: 'Candida',
            options: [
              'Candida albicans',
              'Candida glabrata',
              'Candida tropicalis',
              'Candida krusei',
              'Candida sp.',
              'Candida parapsilosis',
              'Candida melibiosica',
              'Candida pelliculosa',
              'Candida dubliniensis',
            ],
          },
          {
            value: 'Cryptococcus',
            options: ['Cryptococcus neoformans'],
          },
        ],
      },
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
