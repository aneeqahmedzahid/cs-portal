/**
 * One-time faculty seed script.
 * Run from project root: node backend/seedFaculty.cjs
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const { Faculty } = require('./models.cjs');

const BASE = 'https://www.cuiatd.edu.pk/wp-content/uploads/faculty_members/';
const SAMPLE = 'https://www.cuiatd.edu.pk/wp-content/uploads/2020/10/sample_profile.png';

const facultyList = [
  { name: 'Dr Zia-ur-Rehman', designation: 'Tenured Associate Professor', interests: 'Cloud Service Management', image_url: BASE + 'drzia-ur-rehman_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-zia-ur-rehman/', hecApproved: true },
  { name: 'Dr Imran Ali Khan', designation: 'Associate Professor', interests: 'Wireless Networks', image_url: BASE + 'drimranalikhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-imran-ali-khan/', hecApproved: true },
  { name: 'Dr Mazhar Ali', designation: 'Associate Professor', interests: 'Information Security and Cloud Computing', image_url: BASE + 'drmazharali_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-mazhar-ali/', hecApproved: true },
  { name: 'Dr Kashif Bilal', designation: 'Associate Professor', interests: 'Cloud Computing, Data Center Networks, Software Defined Networks, Internet of Things, Distributed Systems, and Expert Systems.', image_url: BASE + 'drkashifbilal_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-kashif-bilal/', hecApproved: true },
  { name: 'Dr Abdul Nasir Khan', designation: 'Tenured Associate Professor', interests: 'Network Security', image_url: BASE + 'drabdulnasirkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-abdul-nasir-khan/', hecApproved: true },
  { name: 'Dr Fiaz Gul Khan', designation: 'Tenured Associate Professor', interests: 'Machine learning, Data Mining, Data sciences, GPGPU, Parallel and Distributed Computing', image_url: BASE + 'drfiazgulkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-fiaz-gul-khan/', hecApproved: true },
  { name: 'Dr Waqas Jadoon', designation: 'Associate Professor(Tenured)', interests: 'Machine Learning, Image Processing', image_url: BASE + 'drwaqasjadoon_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-waqas-jadoon/', hecApproved: true },
  { name: 'Dr Ahmad Khan', designation: 'Tenured Associate Professor', interests: 'Computer Vision', image_url: BASE + 'drahmadkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-ahmad-khan/', hecApproved: false },
  { name: 'Dr Osman Khalid', designation: 'Tenured Associate Professor', interests: 'Delay Tolerant Networks, Trust and Reputation Systems, Opportunistic Networks, Recommendation Systems, and Disaster Response Systems.', image_url: BASE + 'drosmankhalid_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-osman-khalid/', hecApproved: true },
  { name: 'Dr Faisal Rehman', designation: 'Associate Professor', interests: 'Recommendation Systems, Green Computing, and Computer Networks.', image_url: BASE + 'drfaisalrehman_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-faisal-rehman/', hecApproved: true },
  { name: 'Dr Rab Nawaz Jadoon', designation: 'Assistant Professor', interests: 'Wireless Sensor Networks, Adhoc Networks, Cloud Computing, Future Mobile Communication Networks', image_url: BASE + 'drrabnawazjadoon_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/dr-rab-nawaz-jadoon/', hecApproved: false },
  { name: 'Dr. Nuhman ul Haq', designation: 'Assistant Professor', interests: 'Image processing, Computer vision, NMR signal analysis, Artificial Intelligence', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/dr-nuhman-ul-haq/', hecApproved: true },
  { name: 'Dr. Javid Ali', designation: 'Assistant Professor', interests: 'Computer Networks', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/dr-javid-ali/', hecApproved: false },
  { name: 'Muhammad Ali Faisal', designation: 'Assistant Professor', interests: '', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/muhammad-ali-faisal/', hecApproved: false },
  { name: 'Mohammad Tariq Baloch', designation: 'Assistant Professor', interests: 'Data Structures and Programming', image_url: BASE + 'mohammadtariqbaloch_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/mohammad-tariq-baloch/', hecApproved: false },
  { name: 'Malik Adnan Jaleel', designation: 'Assistant Professor', interests: 'ERP Implementations', image_url: BASE + 'malikadnanjaleel_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/malik-adnan-jaleel/', hecApproved: false },
  { name: 'Muhammad Ahmed Mustafa', designation: 'Assistant Professor', interests: 'IP Core and MPLS Core Networks (Telecommunications Core Network Engineering)', image_url: BASE + 'muhammadahmedmustafa_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/muhammad-ahmed-mustafa/', hecApproved: false },
  { name: 'Sumair Khan', designation: 'Assistant Professor', interests: 'Wireless Networks', image_url: BASE + 'sumairkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/sumair-khan/', hecApproved: false },
  { name: 'Dr. Ahmed Saeed Khattak', designation: 'Senior Engineer', interests: 'Data Science and Machine Learning', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/dr-ahmed-saeed-khattak/', hecApproved: false },
  { name: 'Dr. Sardar Khaliq uz Zaman', designation: 'Lecturer', interests: 'Mobile Edge Networks, Cloud Computing', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/dr-sardar-khaliq-uz-zaman-2/', hecApproved: false },
  { name: 'Muhammad Ibtisam Gul', designation: 'Lecturer', interests: 'Parallel and Distributed Computing', image_url: BASE + 'muhammadibtisamgul_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/muhammad-ibtisam-gul/', hecApproved: false },
  { name: 'Mukhtiar Zamin', designation: 'Lecturer', interests: 'Software Engineering', image_url: BASE + 'mukhtiarzamin_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/mukhtiar-zamin/', hecApproved: false },
  { name: 'Quratulain', designation: 'Lecturer', interests: 'Networking, Fog Computing, Web development', image_url: BASE + 'quratulain_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/quratulain/', hecApproved: false },
  { name: 'Waqar Khurshid', designation: 'Lecturer', interests: 'Computer Networks, Data Center Networks (DCNs), Data Center Ethernets (DCEs), and Cloud Security.', image_url: BASE + 'waqarkhurshid_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/waqar-khurshid/', hecApproved: false },
  { name: 'Fuzel Jamil', designation: 'Lecturer', interests: '', image_url: BASE + 'fuzeljamil_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/fuzel-jamil/', hecApproved: false },
  { name: 'Humaira Jabeen', designation: 'Lecturer', interests: 'Wireless Mesh Networks', image_url: BASE + 'humairajabeen_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/humaira-jabeen/', hecApproved: false },
  { name: 'Bushra Mushtaq', designation: 'Lecturer', interests: 'Computer Science', image_url: BASE + 'bushramushtaq_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/bushra-mushtaq/', hecApproved: false },
  { name: 'Faryal Jahangir', designation: 'Lecturer', interests: 'Natural Language Processing', image_url: BASE + 'faryaljahangir_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/faryal-jahangir/', hecApproved: false },
  { name: 'Hifza Ali', designation: 'Lecturer', interests: '', image_url: BASE + 'hifzaali_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/hifza-ali/', hecApproved: false },
  { name: 'Muhammad Ali Khan', designation: 'Lecturer', interests: '', image_url: BASE + 'muhammadalikhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/muhammad-ali-khan/', hecApproved: false },
  { name: 'Ehzaz Mustafa', designation: 'Lecturer', interests: '', image_url: BASE + 'ehzazmustafa_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/ehzaz-mustafa/', hecApproved: false },
  { name: 'Muhammad Yasir', designation: 'Lecturer', interests: '', image_url: BASE + 'muhammadyasir_computersciences-scaled.png', link: 'https://www.cuiatd.edu.pk/faculty/muhammad-yasir/', hecApproved: false },
  { name: 'Farman Ullah', designation: 'Lecturer', interests: 'Cryptography', image_url: BASE + 'farmanullah_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/farman-ullah/', hecApproved: false },
  { name: 'Fizza Semab Nazli', designation: 'Lecturer', interests: 'Software Engineering', image_url: BASE + 'fizzasemabnazli_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/fizza-semab-nazli/', hecApproved: false },
  { name: 'Mazhar Bukhari', designation: 'Lecturer', interests: 'Computer Vision', image_url: BASE + 'mazharbukhari_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/mazhar-bukhari/', hecApproved: false },
  { name: 'Neeli Khan', designation: 'Lecturer', interests: 'Cyber Security', image_url: BASE + 'neelikhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/neeli-khan/', hecApproved: false },
  { name: 'Sara Shafique', designation: 'Lecturer', interests: 'Machine Learning, Natural Language Processing, Computer Vision, Deep Learning', image_url: BASE + 'sarashafique_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/sara-shafique/', hecApproved: false },
  { name: 'Jawad Khan', designation: 'Lecturer', interests: 'Software Engineering, Feature oriented software development, IoT', image_url: BASE + 'jawadkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/jawad-khan/', hecApproved: false },
  { name: 'Zaib Un Nisa', designation: 'Lecturer', interests: 'Machine Learning', image_url: BASE + 'zaibunnisa_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/zaib-un-nisa/', hecApproved: false },
  { name: 'Ayesha Irshad', designation: 'Lecturer', interests: 'Trust in IoT devices', image_url: BASE + 'ayeshairshad_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/ayesha-irshad/', hecApproved: false },
  { name: 'Ahsan Riaz', designation: 'Lecturer', interests: 'Artificial Intelligence (Deep Learning)', image_url: BASE + 'ahsanriaz_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/ahsan-riaz/', hecApproved: false },
  { name: 'Jazib-e-Nazar', designation: 'Lecturer', interests: 'Machine Learning', image_url: BASE + 'jazib-e-nazar_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/jazib-e-nazar/', hecApproved: false },
  { name: 'Maleeha Khalid Khan', designation: 'Lecturer', interests: 'Software Engineering', image_url: BASE + 'maleehakhalidkhan_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/maleeha-khalid-khan/', hecApproved: false },
  { name: 'Mehwish Sabir', designation: 'Lecturer', interests: 'Data Mining', image_url: BASE + 'mehwishsabir_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/mehwish-sabir/', hecApproved: false },
  { name: 'Muhammad Javed Raza', designation: 'Lecturer', interests: 'Machine Learning, Natural Language Processing (NLP), Text to speech System.', image_url: BASE + 'muhammadjavedraza_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/muhammad-javed-raza/', hecApproved: false },
  { name: 'Sana Malik', designation: 'Lecturer', interests: 'Computer Networks', image_url: BASE + 'sanamalik_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/sanamalik/', hecApproved: false },
  { name: 'Syed Shahab Zarin', designation: 'Lecturer', interests: '', image_url: BASE + 'syedshahabzarin_computersciences.png', link: 'https://www.cuiatd.edu.pk/faculty/syed-shahab-zarin/', hecApproved: false },
  { name: 'Zeenat Zulfiqar', designation: 'Lecturer', interests: 'Artificial Intelligence', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/zeenat-zulfiqar/', hecApproved: false },
  { name: 'Ahsan Khan', designation: 'Lecturer', interests: 'Cyber Security', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/ahsan-khan/', hecApproved: false },
  { name: 'Muhammad Adil Khan', designation: 'Lecturer', interests: 'Internet of Things (IoT) and Edge Computing', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/muhammad-adil-khan/', hecApproved: false },
  { name: 'Faiza Hameed', designation: 'Lecturer', interests: 'Machine Learning', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/faiza-hameed/', hecApproved: false },
  { name: 'Sadaf Riaz', designation: 'Lecturer', interests: 'Blockchain', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/sadaf-riaz/', hecApproved: false },
  { name: 'Umair Mujtaba', designation: 'Lecturer', interests: 'Machine Learning, Deep Learning, Image Processing, Web Application, Mobile Application', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/umair-mujtaba/', hecApproved: false },
  { name: 'Wajahat Ghaffar Mir', designation: 'Lecturer', interests: 'Software Project Management, Software Requirements Engineering, Software Quality Assurance', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/wajahat-ghaffar-mir/', hecApproved: false },
  { name: 'Aisha', designation: 'Lecturer', interests: 'Artificial Intelligence', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/aisha/', hecApproved: false },
  { name: 'Areej Bashir', designation: 'Lecturer', interests: 'Machine Learning, Software Engineering', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/areej-bashir/', hecApproved: false },
  { name: 'Ehtisham Ul Haque', designation: 'Lecturer', interests: 'IoT, Blockchain and Cybersecurity', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/ehtisham-ul-haque/', hecApproved: false },
  { name: 'Ghanwa Batool', designation: 'Lecturer', interests: 'Artificial Intelligence', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/ghanwa-batool/', hecApproved: false },
  { name: 'Gul-e-Laraib', designation: 'Lecturer', interests: 'Computer Networks', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/gul-e-laraib/', hecApproved: false },
  { name: 'Muhammad Rafay Hannan', designation: 'Lecturer', interests: 'Deep Learning, Computer Vision', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/muhammad-rafay-hannan/', hecApproved: false },
  { name: 'Nauman Khan', designation: 'Lecturer', interests: 'Computer Networks', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/nauman-khan/', hecApproved: false },
  { name: 'Sundas Shireen Awan', designation: 'Lecturer', interests: 'Deep Learning', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/sundas-shireen-awan/', hecApproved: false },
  { name: 'Yasar Khan', designation: 'Lecturer', interests: 'Computer Networks', image_url: SAMPLE, link: 'https://www.cuiatd.edu.pk/faculty/yasar-khan/', hecApproved: false },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected.');

  const existing = await Faculty.countDocuments();
  if (existing > 0) {
    console.log(`Database already has ${existing} faculty records.`);
    const answer = process.argv[2];
    if (answer !== '--force') {
      console.log('Use --force to overwrite. Exiting.');
      process.exit(0);
    }
    console.log('--force flag detected. Clearing existing faculty...');
    await Faculty.deleteMany({});
  }

  console.log(`Seeding ${facultyList.length} faculty members...`);
  let success = 0;
  for (const f of facultyList) {
    try {
      await Faculty.create(f);
      console.log(`  ✓ ${f.name}`);
      success++;
    } catch (e) {
      console.error(`  ✗ ${f.name}: ${e.message}`);
    }
  }

  console.log(`\nDone! Seeded ${success}/${facultyList.length} faculty members.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
