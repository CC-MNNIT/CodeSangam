interface TeamMember {
    name: string;
    github: string;
    twitter: string;
    linkedin: string;
    image: string;
    year: string;
  }
  
  interface TeamData {
    [key: string]: TeamMember[];
  }
  
  export const TeamMember: { year: TeamData[] } = {
    year: [
      {
        '24-25': [
          {
            name: 'Sumit Verma',
            github: 'https://github.com/smt96700',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com/in/sumit-verma-smt/',
            image: 'https://github.com/smt96700.png',
            year: 'third year',
          },
          {
            name: 'Tanishka Singh',
            github: 'https://github.com/tan-inv',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com/in/tanishka-thakur-915893250/',
            image: 'https://github.com/tan-inv.png',
            year: 'third year',
          },
        ],
      },
      {
        '23-24': [
          {
            name: 'Aditya Srivastava',
            github: 'https://github.com/adityaa22',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com/in/adityasrivastava1407/',
            image: 'https://github.com/adityaa22.png',
            year: 'third year',
          },
          {
            name: 'Subrat Pandey',
            github: 'https://github.com/32bitdev',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com/in/subrat2839/',
            image: 'https://github.com/32bitdev.png',
            year: 'third year',
          },
          {
            name: 'Abhishek Patel',
            github: 'https://github.com/meisabhishekpatel',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com/in/meabhishekpatel/',
            image: 'https://github.com/meisabhishekpatel.png',
            year: 'third year',
          },
        ],
      },
      {
        '22-23': [
          {
            name: 'Shashank Verma',
            github: 'https://github.com/shank03',
            twitter: 'https://twitter.com/shank_03',
            linkedin: 'https://www.linkedin.com/in/shank03',
            image: 'https://github.com/shank03.png',
            year: 'final year',
          },
          {
            name: 'Sanskar Omar',
            github: 'https://github.com/sanskaromar',
            twitter: 'https://twitter.com/SanskarOmar_',
            linkedin: 'https://www.linkedin.com/in/sanskaromar-/',
            image: 'https://github.com/sanskaromar.png',
            year: 'final year',
          },
          {
            name: 'Priyav K Kaneria',
            github: 'https://github.com/PriyavKaneria',
            twitter: 'https://twitter.com/priyav_kaneria',
            linkedin: 'https://www.linkedin.com/in/priyavkaneria/',
            image: 'https://github.com/PriyavKaneria.png',
            year: 'final year',
          },
        ],
      },
    ],
  };

  export const Year= [
    '24-25',
    '23-24',
    '22-23'
  ]
  