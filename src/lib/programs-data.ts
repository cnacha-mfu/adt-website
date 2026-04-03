export interface ProgramData {
  id: string;
  level: 'undergrad' | 'grad';
  degree: string;
  degreeFullEN: string;
  degreeFullTH: string;
  years: number;
  credits: number;
  name: string;
  nameTH: string;
  color: string;
  description: string;
  descriptionTH: string;
  careers: { en: string; th: string }[];
  curriculumStructure: { label: string; labelTH: string; credits: number }[];
  features: string[];
  fees: string;
  feesPerSemester: string;
  officialUrl: string;
}

export const programs: ProgramData[] = [
  {
    id: 'digital-engineering',
    level: 'undergrad',
    degree: 'B.Eng.',
    degreeFullEN: 'Bachelor of Engineering (Digital and Communication Engineering)',
    degreeFullTH: 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมดิจิทัลและการสื่อสาร) วศ.บ.',
    years: 4,
    credits: 132,
    name: 'Digital Engineering & Communications',
    nameTH: 'วิศวกรรมดิจิทัลและการสื่อสาร',
    color: '#0CC8D4',
    description:
      'Knowledge in digital engineering and communications is essential to industrial operations under rapid IT change — covering IoT, information processing, information security, and cybersecurity. The program produces graduates with pragmatic, internationally competitive skills who can design, build, maintain, and extend modern digital systems. The focus is on integrating multiple technologies to support modern information services with professional ethics.',
    descriptionTH:
      'ความรู้ด้านวิศวกรรมดิจิทัลและการสื่อสารเป็นสิ่งจำเป็นสำหรับการดำเนินงานในยุค IT ที่เปลี่ยนแปลงอย่างรวดเร็ว ครอบคลุม IoT การประมวลผลสารสนเทศ ความปลอดภัยของสารสนเทศ และไซเบอร์ซีเคียวริตี้ หลักสูตรนี้ผลิตบัณฑิตที่มีทักษะเชิงปฏิบัติและสามารถแข่งขันในระดับสากล สามารถออกแบบ สร้าง บำรุงรักษา และพัฒนาระบบดิจิทัลสมัยใหม่',
    careers: [
      { en: 'Information & Communications Systems Engineer', th: 'วิศวกรระบบสารสนเทศและการสื่อสาร' },
      { en: 'Digital Technology Systems Engineer', th: 'วิศวกรระบบเทคโนโลยีดิจิทัล' },
      { en: 'Electronics & IoT Engineer', th: 'วิศวกรอิเล็คทรอนิกส์และไอโอที' },
      { en: 'Cybersecurity Engineer', th: 'วิศวกรระบบความปลอดภัยไซเบอร์' },
      { en: 'Network Infrastructure Engineer', th: 'วิศวกรโครงสร้างพื้นฐานเครือข่าย' },
      { en: 'Digital Systems Consultant', th: 'ที่ปรึกษาระบบดิจิทัล' },
    ],
    curriculumStructure: [
      { label: 'General Education', labelTH: 'วิชาศึกษาทั่วไป', credits: 30 },
      { label: 'Core Professional Foundation', labelTH: 'วิชาพื้นฐานวิชาชีพ', credits: 30 },
      { label: 'Compulsory Major', labelTH: 'วิชาเอกบังคับ', credits: 54 },
      { label: 'Elective Major', labelTH: 'วิชาเอกเลือก', credits: 6 },
      { label: 'Free Electives', labelTH: 'วิชาเลือกเสรี', credits: 6 },
    ],
    features: [
      'Integrates IoT, cybersecurity, and information security in one program',
      'Pragmatism-focused: graduates are genuinely capable and internationally competitive',
      'Covers information processing, data communications, and network security',
      'Professional ethics embedded throughout the curriculum',
      'Updated 2022 curriculum aligned with industry needs',
    ],
    fees: '224,000 THB',
    feesPerSemester: '28,000 THB',
    officialUrl:
      'https://adt.mfu.ac.th/it-course/it-bachelor/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%88%E0%B8%B4%E0%B8%97%E0%B8%B1%E0%B8%A5%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%B2%E0%B8%A3-new.html',
  },
  {
    id: 'computer-engineering-beng',
    level: 'undergrad',
    degree: 'B.Eng.',
    degreeFullEN: 'Bachelor of Engineering (Computer Engineering)',
    degreeFullTH: 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์) วศ.บ.',
    years: 4,
    credits: 132,
    name: 'Computer Engineering',
    nameTH: 'วิศวกรรมคอมพิวเตอร์',
    color: '#22EBF8',
    description:
      'Produces graduates with theoretical and practical knowledge in computer engineering at an international level. Specialises in designing and planning applications of new technologies for innovation — covering hardware, software, embedded systems, AI, and networking. Features three specialisation tracks: Hardware & Intelligent Control Systems, Data Science & Artificial Intelligence, and Data Communications & Networks.',
    descriptionTH:
      'ผลิตบัณฑิตที่มีความรู้ทั้งภาคทฤษฎีและปฏิบัติด้านวิศวกรรมคอมพิวเตอร์ในระดับสากล เชี่ยวชาญในการออกแบบและวางแผนการประยุกต์เทคโนโลยีใหม่เพื่อนวัตกรรม ครอบคลุมฮาร์ดแวร์ ซอฟต์แวร์ ระบบฝังตัว AI และเครือข่าย มี 3 แทร็กเฉพาะทาง',
    careers: [
      { en: 'Computer Engineer', th: 'วิศวกรคอมพิวเตอร์' },
      { en: 'Electronics Control Engineer', th: 'วิศวกรควบคุมอุปกรณ์อิเล็กทรอนิก' },
      { en: 'Data & AI Engineer', th: 'วิศวกรข้อมูลและปัญญาประดิษฐ์' },
      { en: 'Software Developer / Programmer', th: 'นักพัฒนาโปรแกรม' },
      { en: 'Network Engineer', th: 'วิศวกรเครือข่ายคอมพิวเตอร์' },
      { en: 'Telecommunications Engineer', th: 'วิศวกรโทรคมนาคม' },
      { en: 'Innovation Entrepreneur', th: 'ผู้ประกอบการผลิตนวัตกรรม' },
    ],
    curriculumStructure: [
      { label: 'General Education', labelTH: 'วิชาศึกษาทั่วไป', credits: 30 },
      { label: 'Professional Foundation', labelTH: 'วิชาพื้นฐานวิชาชีพ', credits: 30 },
      { label: 'Compulsory Major', labelTH: 'วิชาเอกบังคับ', credits: 36 },
      { label: 'Elective Major', labelTH: 'วิชาเอกเลือก', credits: 21 },
      { label: 'Field Experience', labelTH: 'การฝึกประสบการณ์', credits: 9 },
      { label: 'Free Electives', labelTH: 'วิชาเลือกเสรี', credits: 6 },
    ],
    features: [
      'English-medium instruction — increases global employment opportunities',
      'Three specialisation tracks: Hardware/Embedded, Data Comms/Networks, Data Science/AI',
      'Outcome-Based Education (OBE) curriculum design',
      'Internship partnerships with Huawei, Palo Alto Networks, Cisco Thailand',
      'International exchange programs available',
      '1st prize Huawei ICT Competition Thailand 2024–25',
    ],
    fees: '224,000 THB',
    feesPerSemester: '28,000 THB',
    officialUrl:
      'https://adt.mfu.ac.th/it-course/it-bachelor/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C.html',
  },
  {
    id: 'digital-business',
    level: 'undergrad',
    degree: 'B.Sc.',
    degreeFullEN: 'Bachelor of Science (Digital Technology for Business Innovation)',
    degreeFullTH: 'วิทยาศาสตรบัณฑิต (เทคโนโลยีดิจิทัลเพื่อนวัตกรรมทางธุรกิจ) วท.บ.',
    years: 4,
    credits: 120,
    name: 'Digital Technology for Business Innovation',
    nameTH: 'เทคโนโลยีดิจิทัลเพื่อนวัตกรรมทางธุรกิจ',
    color: '#F5A623',
    description:
      'Born from a vision of digital technology\'s rapid transformation of business. The program creates a new breed of entrepreneur who bridges producers and consumers using digital technology — from e-commerce and data analytics to digital marketing. Students start their own digital business from Year 1, with three elective specialisation tracks: Digital Leveraged Entrepreneur, Business Data Analyst, and Digital Driven Marketing.',
    descriptionTH:
      'หลักสูตรที่เกิดจากวิสัยทัศน์ที่เห็นว่าเทคโนโลยีดิจิทัลกำลังเปลี่ยนแปลงโลกธุรกิจอย่างรวดเร็ว สร้างนักประกอบการรุ่นใหม่ที่เชื่อมโยงผู้ผลิตและผู้บริโภคด้วยเทคโนโลยีดิจิทัล ตั้งแต่ e-commerce การวิเคราะห์ข้อมูล ไปจนถึงการตลาดดิจิทัล นักศึกษาเริ่มธุรกิจดิจิทัลของตัวเองตั้งแต่ปี 1',
    careers: [
      { en: 'Digital Technology Business Professional', th: 'นักเทคโนโลยีสารสนเทศที่ใช้ดิจิทัลประกอบธุรกิจ' },
      { en: 'Digital Leveraged Entrepreneur', th: 'ผู้ประกอบการที่ยกระดับธุรกิจด้วยดิจิทัล' },
      { en: 'Business Data Analyst', th: 'นักวิเคราะห์ข้อมูลทางธุรกิจ' },
      { en: 'Digital System Analyst & Designer', th: 'นักวิเคราะห์และออกแบบระบบสารสนเทศดิจิทัล' },
      { en: 'Digital Driven Marketer', th: 'นักการตลาดโดยใช้ดิจิทัลเป็นตัวขับเคลื่อน' },
    ],
    curriculumStructure: [
      { label: 'General Education', labelTH: 'วิชาศึกษาทั่วไป', credits: 30 },
      { label: 'Professional Foundation', labelTH: 'วิชาพื้นฐานวิชาชีพ', credits: 15 },
      { label: 'Compulsory Major', labelTH: 'วิชาเอกบังคับ', credits: 45 },
      { label: 'Elective Major', labelTH: 'วิชาเอกเลือก', credits: 15 },
      { label: 'Co-operative Education', labelTH: 'สหกิจศึกษา', credits: 9 },
      { label: 'Free Electives', labelTH: 'วิชาเลือกเสรี', credits: 6 },
    ],
    features: [
      'Students start a real digital business from Year 1',
      'Three specialisation tracks: Entrepreneur, Data Analyst, Digital Marketing',
      'Unique integrated (non-silo) teaching approach',
      'Chinese language component for ASEAN/China market readiness',
      'Co-operative education semester with industry',
      'Project-based learning with Startup methodology',
    ],
    fees: '224,000 THB',
    feesPerSemester: '28,000 THB',
    officialUrl:
      'https://adt.mfu.ac.th/it-course/it-bachelor/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B8%94%E0%B8%B4%E0%B8%88%E0%B8%B4%E0%B8%97%E0%B8%B1%E0%B8%A5%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%98%E0%B8%B8%E0%B8%A3%E0%B8%81%E0%B8%B4%E0%B8%88.html',
  },
  {
    id: 'software-engineering',
    level: 'undergrad',
    degree: 'B.Eng.',
    degreeFullEN: 'Bachelor of Engineering (Software Engineering)',
    degreeFullTH: 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมซอฟต์แวร์) วศ.บ.',
    years: 4,
    credits: 126,
    name: 'Software Engineering',
    nameTH: 'วิศวกรรมซอฟต์แวร์',
    color: '#F5A623',
    description:
      'A commercially-focused program designed to produce job-ready engineers who can earn real income while studying. Year 1 graduates can take freelance work; Year 2 students publish mobile apps; Year 3 students lead small project teams; Year 4 graduates lead enterprise-scale projects. Covers the full software development lifecycle with modern tools: web, mobile, DevOps, Cloud, AI/ML, and emerging technologies.',
    descriptionTH:
      'หลักสูตรที่มุ่งเน้นเชิงพาณิชย์ ออกแบบมาเพื่อผลิตวิศวกรที่พร้อมทำงานและสามารถสร้างรายได้จริงตั้งแต่ยังเรียนอยู่ นักศึกษาปี 1 รับงาน freelance ได้ ปี 2 ปล่อยแอปมือถือ ปี 3 นำทีมโปรเจกต์ ปี 4 บริหารโปรเจกต์ระดับองค์กร ครอบคลุมวงจรชีวิตการพัฒนาซอฟต์แวร์เต็มรูปแบบ',
    careers: [
      { en: 'Software Engineer / Developer', th: 'วิศวกรซอฟต์แวร์ / นักพัฒนาระบบ' },
      { en: 'Software Analyst / Business Analyst', th: 'นักวิเคราะห์ระบบ / นักวิเคราะห์ธุรกิจ' },
      { en: 'Software Architect', th: 'นักออกแบบสถาปัตยกรรมระบบ' },
      { en: 'Full-Stack / Mobile / Web Developer', th: 'นักพัฒนา Full-Stack / มือถือ / เว็บ' },
      { en: 'DevOps / Cloud Engineer', th: 'วิศวกร DevOps / คลาวด์' },
      { en: 'Project Manager', th: 'ผู้จัดการโครงการซอฟต์แวร์' },
      { en: 'UX/UI Designer', th: 'นักออกแบบ UX/UI' },
      { en: 'Tech Startup Founder / CEO', th: 'เจ้าของกิจการซอฟต์แวร์ / CEO Startup' },
    ],
    curriculumStructure: [
      { label: 'General Education', labelTH: 'วิชาศึกษาทั่วไป', credits: 30 },
      { label: 'Professional Foundation', labelTH: 'วิชาพื้นฐานวิชาชีพ', credits: 9 },
      { label: 'Compulsory Major', labelTH: 'วิชาเอกบังคับ', credits: 63 },
      { label: 'Elective Major', labelTH: 'วิชาเอกเลือก', credits: 9 },
      { label: 'Field Experience', labelTH: 'การฝึกประสบการณ์', credits: 9 },
      { label: 'Free Electives', labelTH: 'วิชาเลือกเสรี', credits: 6 },
    ],
    features: [
      'Students earn real income during studies — from freelancing to leading large teams',
      'Mobile apps must be published to App Store / Google Play',
      'Modern tech stack: React, Vue, Angular, Spring Boot, Docker, Kubernetes, Node.js',
      'Emerging tech electives: Big Data, IoT, AI/ML, Blockchain, SAP ERP',
      'Code Camp (Y1), Hackathon (Y2), BarCamp with industry (Y3–4)',
      '12+ graduating cohorts with active alumni network',
    ],
    fees: '240,000 THB',
    feesPerSemester: '30,000 THB',
    officialUrl:
      'https://adt.mfu.ac.th/it-course/it-bachelor/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8B%E0%B8%AD%E0%B8%9F%E0%B8%95%E0%B9%8C%E0%B9%81%E0%B8%A7%E0%B8%A3%E0%B9%8C.html',
  },
  {
    id: 'multimedia',
    level: 'undergrad',
    degree: 'B.Sc.',
    degreeFullEN: 'Bachelor of Science (Multimedia Technology and Animation)',
    degreeFullTH: 'วิทยาศาสตรบัณฑิต (เทคโนโลยีมัลติมีเดียและการสร้างภาพเคลื่อนไหว) วท.บ.',
    years: 4,
    credits: 126,
    name: 'Multimedia Technology & Animation',
    nameTH: 'เทคโนโลยีมัลติมีเดียและการสร้างภาพเคลื่อนไหว',
    color: '#F87171',
    description:
      'Produces internationally-quality graduates with comprehensive knowledge of multimedia technology and animation — modern media creation, online media design, video, film, and 2D/3D animation. Targets two graduate profiles: Online Content Creators and Virtual/Augmented/Mixed Reality (VR/AR/MR) creators. Combines artistic creativity with technical digital skills, grounded in Design Thinking and Cognitive Theory.',
    descriptionTH:
      'ผลิตบัณฑิตคุณภาพระดับสากลที่มีความรู้รอบด้านด้านเทคโนโลยีมัลติมีเดียและแอนิเมชัน การสร้างสื่อยุคใหม่ การออกแบบสื่อออนไลน์ วิดีโอ ภาพยนตร์ และแอนิเมชัน 2D/3D มุ่งสร้างบัณฑิต 2 กลุ่ม คือ Online Content Creator และนักสร้าง VR/AR/MR',
    careers: [
      { en: 'Graphic Designer', th: 'นักออกแบบกราฟิกส์' },
      { en: '2D/3D Animator / Modeler', th: 'นักสร้างภาพเคลื่อนไหว 2D/3D' },
      { en: 'Visual Effects (VFX) Artist', th: 'นักสร้างภาพเหนือจริง' },
      { en: 'Game Designer / Developer', th: 'นักออกแบบเกม' },
      { en: 'Web Designer / Developer', th: 'นักออกแบบและพัฒนาเว็บไซต์' },
      { en: 'TV / Advertising / Film Producer', th: 'ผู้ผลิตรายการทีวี โฆษณา หรือภาพยนตร์' },
      { en: 'Online Content Creator', th: 'ผู้สร้างคอนเทนต์ออนไลน์' },
    ],
    curriculumStructure: [
      { label: 'General Education', labelTH: 'วิชาศึกษาทั่วไป', credits: 30 },
      { label: 'Professional Foundation', labelTH: 'วิชาพื้นฐานวิชาชีพ', credits: 33 },
      { label: 'Compulsory Major', labelTH: 'วิชาเอกบังคับ', credits: 39 },
      { label: 'Elective Major', labelTH: 'วิชาเอกเลือก', credits: 18 },
      { label: 'Free Electives', labelTH: 'วิชาเลือกเสรี', credits: 6 },
    ],
    features: [
      'Two graduate profiles: Online Content Creator & VR/AR/MR Creator',
      'Design Thinking as a core teaching framework',
      'Combines artistic creativity with technical digital production',
      'Covers 2D/3D animation, VR/AR/MR, game design, film/video production',
      'Specialist lab equipment for professional-grade media production',
      'Targets the Digital Disruption era creative industry',
    ],
    fees: '256,000 THB',
    feesPerSemester: '32,000 THB',
    officialUrl:
      'https://adt.mfu.ac.th/it-course/it-bachelor/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%A1%E0%B8%B5%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A7.html',
  },
  {
    id: 'digital-transformation-msc',
    level: 'grad',
    degree: 'M.Sc.',
    degreeFullEN: 'Master of Science (Digital Transformation Technology)',
    degreeFullTH: 'วิทยาศาสตรมหาบัณฑิต (เทคโนโลยีการแปลงเป็นดิจิทัล) วท.ม.',
    years: 2,
    credits: 36,
    name: 'Digital Transformation Technology',
    nameTH: 'เทคโนโลยีการแปลงเป็นดิจิทัล',
    color: '#0CC8D4',
    description:
      'An advanced graduate program focused on enterprise digital transformation, cloud ecosystems, AI integration, and data-driven decision making. Features a special Digital Healthcare Technology stream as part of the international Erasmus+ DigiHealth-Asia project. Accepts both Thai and international applicants with two study plans available.',
    descriptionTH:
      'หลักสูตรบัณฑิตศึกษาขั้นสูงที่มุ่งเน้นการแปลงองค์กรสู่ดิจิทัล ระบบคลาวด์ การบูรณาการ AI และการตัดสินใจเชิงข้อมูล มีแทร็กพิเศษ Digital Healthcare Technology ซึ่งเป็นส่วนหนึ่งของโครงการ Erasmus+ DigiHealth-Asia ระดับนานาชาติ รับนักศึกษาทั้งไทยและต่างชาติ',
    careers: [
      { en: 'Digital Transformation Consultant', th: 'ที่ปรึกษาการแปลงองค์กรสู่ดิจิทัล' },
      { en: 'Chief Digital Officer (CDO)', th: 'ผู้บริหารด้านดิจิทัล' },
      { en: 'Cloud Solutions Architect', th: 'สถาปนิกระบบคลาวด์' },
      { en: 'AI/ML Systems Specialist', th: 'ผู้เชี่ยวชาญระบบ AI/ML' },
      { en: 'Digital Healthcare Technology Specialist', th: 'ผู้เชี่ยวชาญเทคโนโลยีสุขภาพดิจิทัล' },
      { en: 'Data-Driven Business Strategist', th: 'นักกลยุทธ์ธุรกิจเชิงข้อมูล' },
    ],
    curriculumStructure: [
      { label: 'Compulsory Courses', labelTH: 'วิชาบังคับ', credits: 18 },
      { label: 'Elective Courses', labelTH: 'วิชาเลือก', credits: 9 },
      { label: 'Thesis / Independent Study', labelTH: 'วิทยานิพนธ์ / การค้นคว้าอิสระ', credits: 9 },
    ],
    features: [
      'International collaboration via Erasmus+ DigiHealth-Asia project',
      'Special Digital Healthcare Technology stream',
      'Two study plans: Plan A2 (research) and Plan B (coursework)',
      'Open to international applicants with dedicated application process',
      'Focuses on enterprise AI, cloud, and digital strategy',
    ],
    fees: 'Contact school for current rates',
    feesPerSemester: 'Contact school for details',
    officialUrl: 'https://adt.mfu.ac.th/it-course/it-mastersdegree/msc-digital-transformation-technology.html',
  },
  {
    id: 'computer-engineering-meng',
    level: 'grad',
    degree: 'M.Eng.',
    degreeFullEN: 'Master of Engineering (Computer Engineering)',
    degreeFullTH: 'วิศวกรรมศาสตรมหาบัณฑิต (วิศวกรรมคอมพิวเตอร์) วศ.ม.',
    years: 2,
    credits: 36,
    name: 'Computer Engineering',
    nameTH: 'วิศวกรรมคอมพิวเตอร์',
    color: '#22EBF8',
    description:
      'A research-driven graduate program that produces graduates with competitive research capability, a positive attitude toward technological disruption, and the ability to create innovations that address real-world problems. Uses Constructivist Theory and Problem-Based Learning, with a focus on Disruptive Technologies: Edge Computing, Ubiquitous Artificial Intelligence, and Modern Communication Platforms.',
    descriptionTH:
      'หลักสูตรบัณฑิตศึกษาที่เน้นการวิจัย ผลิตบัณฑิตที่มีขีดความสามารถทางวิจัยสูง มีทัศนคติเชิงบวกต่อการเปลี่ยนแปลงทางเทคโนโลยี และสามารถสร้างนวัตกรรมที่แก้ปัญหาในโลกจริงได้ ใช้ทฤษฎีการสร้างความรู้ (Constructivist) และการเรียนรู้โดยใช้ปัญหาเป็นฐาน มุ่งเน้น Disruptive Technologies',
    careers: [
      { en: 'Academic / Research Scholar', th: 'นักวิชาการทางวิศวกรรมคอมพิวเตอร์' },
      { en: 'Research & Innovation Developer', th: 'นักวิจัยและพัฒนานวัตกรรม' },
      { en: 'Engineer & Technology Consultant', th: 'วิศวกรและที่ปรึกษาเทคโนโลยี' },
      { en: 'Tech Entrepreneur', th: 'ผู้ประกอบการด้านเทคโนโลยี' },
    ],
    curriculumStructure: [
      { label: 'Compulsory Courses (Plan ก2)', labelTH: 'วิชาบังคับ (แผน ก2)', credits: 15 },
      { label: 'Elective Courses', labelTH: 'วิชาเลือก', credits: 6 },
      { label: 'Thesis', labelTH: 'วิทยานิพนธ์', credits: 18 },
    ],
    features: [
      'Two study plans: Plan ก1 (pure thesis, 36 credits) and Plan ก2 (coursework + thesis)',
      'Research focus on Disruptive Technologies: Edge Computing, AI, Modern Comms',
      'Personalised research direction — students co-define their research area',
      'Problem-Based Learning as core pedagogy',
      'Supports continuation to Ph.D. program',
    ],
    fees: '140,000–160,000 THB total',
    feesPerSemester: '35,000–40,000 THB',
    officialUrl: 'https://adt.mfu.ac.th/it-course/it-mastersdegree/msc-computer-engineering.html',
  },
  {
    id: 'computer-engineering-phd',
    level: 'grad',
    degree: 'Ph.D.',
    degreeFullEN: 'Doctor of Philosophy (Computer Engineering)',
    degreeFullTH: 'ปรัชญาดุษฎีบัณฑิต (วิศวกรรมคอมพิวเตอร์) ปร.ด.',
    years: 3,
    credits: 48,
    name: 'Computer Engineering',
    nameTH: 'วิศวกรรมคอมพิวเตอร์',
    color: '#F5A623',
    description:
      'A fully personalised doctoral program where students freely define their own research topic and learning path, supported by an advisory team. Uses Constructivist Theory with competency-based progression. Research focus areas include Artificial Intelligence, Communication System Platforms, Edge Computing, and Autonomous Systems. Three entry paths for M.Eng. holders and direct B.Eng. entry.',
    descriptionTH:
      'หลักสูตรปริญญาเอกแบบ Personalised Learning อย่างสมบูรณ์ นักศึกษากำหนดหัวข้อวิจัยและเส้นทางการเรียนรู้ของตัวเองอย่างอิสระ ภายใต้การสนับสนุนของทีมที่ปรึกษา ใช้วิธีการประเมินแบบ Competency-Based มุ่งเน้นงานวิจัยด้าน AI การสื่อสาร Edge Computing และระบบอัตโนมัติ',
    careers: [
      { en: 'University Lecturer / Professor', th: 'อาจารย์มหาวิทยาลัย' },
      { en: 'Research Scientist', th: 'นักวิทยาศาสตร์วิจัย' },
      { en: 'Chief Research Officer', th: 'ผู้บริหารงานวิจัย' },
      { en: 'Innovation Developer', th: 'นักพัฒนานวัตกรรม' },
      { en: 'Technology Entrepreneur', th: 'ผู้ประกอบการด้านเทคโนโลยี' },
    ],
    curriculumStructure: [
      { label: 'Dissertation (Plan 1.1 / M.Eng. entry)', labelTH: 'ดุษฎีนิพนธ์ (แผน 1.1)', credits: 48 },
      { label: 'Compulsory + Thesis (Plan 2.1)', labelTH: 'วิชาบังคับ + ดุษฎีนิพนธ์ (แผน 2.1)', credits: 48 },
      { label: 'Full coursework + Thesis (Plan 2.2 / B.Eng. direct)', labelTH: 'วิชาเรียนครบ + ดุษฎีนิพนธ์ (แผน 2.2)', credits: 72 },
    ],
    features: [
      'Three entry paths: pure dissertation, coursework+dissertation (M.Eng.), extended (B.Eng. direct)',
      'Fully Personalised Learning — students define their own research goals',
      'Competency-based (not purely time-based) progression',
      'Research areas: AI, Edge Computing, Communication Platforms, Autonomous Systems',
      'Strong research ethics framework embedded in PLOs',
      'Targets commercially transferable innovations disseminated internationally',
    ],
    fees: '270,000–450,000 THB total',
    feesPerSemester: '45,000 THB',
    officialUrl: 'https://adt.mfu.ac.th/it-course/it-phd/phd-computer-engineering.html',
  },
];

export const programsById = Object.fromEntries(programs.map(p => [p.id, p]));
