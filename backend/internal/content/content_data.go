package content

var Pages = []Page{
	{
		Title:  "home",
		Groups: []Group{},
	},
	{
		Title: "community-hall",

		Groups: []Group{
			{
				Name: "Board",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740321202/width_800_20_2810_29_raehff.webp"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740321205/width_800_20_2811_29_bhs3bj.webp"},
				},
			},
			{
				Name: "Popup",
				Contents: []Content{
					{Type: "vdo", Value: ""},
				},
			},
		},
	},
	{
		Title: "social-capital",

		Groups: []Group{
			{
				Name: "ทุนทางสังคม 6 ระดับ",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740323067/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_883_zfdeqi.png"},
					{Type: "vdo", Value: ""},
				},
			},
			{
				Name: "Recap",
				Contents: []Content{
					{Type: "vdo", Value: ""},
				},
			},
		},
	},
	{
		Title: "community-potential",

		Groups: []Group{
			{
				Name: "TCNAP",
				Contents: []Content{
					{Type: "vdo", Value: ""},
				},
			},
		},
	},
	{
		Title: "learning-options",

		Groups: []Group{
			{
				Name: "การวิเคราะห์ข้อมูลและการนำเสนอข้อมูล",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740336334/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_889_nkxpr5.png"},
					{Type: "vdo", Value: ""},
				},
			},
			{
				Name: "การระบุปัญหาและความต้องการของชุมชน",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740336394/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_8810_i5kyqg.png"},
					{Type: "vdo", Value: ""},
				},
			},
			{
				Name: "การจัดลำดับปัญหาและความต้องการ",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740336366/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_8811_cttavm.png"},
					{Type: "vdo", Value: ""},
				},
			},
		},
	},

	// health
	{
		Title: "health-forum",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "vdo", Value: "", TitleRef: []string{"เอกสาร 1", "เอกสาร 2"}, Ref: []string{"https://example.com/doc1", "https://example.com/doc2"}, RefType: "link"},
				},
			},
		},
	},
	{
		Title: "health-tool",

		Groups: []Group{
			{
				Name: "Primary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลจากแบบสอบถาม"},
					{Type: "text", Value: "ข้อมูลจากการสนทนากลุ่ม"},
					{Type: "text", Value: "ข้อมูลจากการสัมภาษณ์บุคคล"},
				},
			},
			{
				Name: "Secondary Data",
				Contents: []Content{
					{Type: "text", Value: "ฐานข้อมูลสุขภาพของ รพ.สต."},
					{Type: "text", Value: "ข้อมูลรายงานสุขภาพชุมชนของ อสม."},
					{Type: "text", Value: "ข้อมูลจากแฟ้มครอบครัว"},
					{Type: "text", Value: "ข้อมูลรายงานการประชุมอสม. กลุ่มทางสังคม"},
				},
			},
		},
	},
	{
		Title: "health-assessment-tool",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740323728/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_884_ybkgb0.png"},
				},
			},
		},
	},
	{
		Title: "health-data-visualization",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "จากภาพตาราง แสดงข้อมูลผู้ป่วยโรคเรื้อรังที่ใช้บริการสุขภาพที่รพ.สต.แสนสุข หมู่ 1 จังหวัดขอนแก่น ที่กำหนดให้ ควรเลือกใช้การนำเสนอข้อมูล แบบใด"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740324060/7.1.5_E0_B8_AA_E0_B8_B8_E0_B8_82_E0_B8_A0_E0_B8_B2_E0_B8_9E_lu2nle.png"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "img", Value: "/images/bar.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pie.png", Ref: []string{"true"}, RefType: "label"},
					{Type: "img", Value: "/images/line.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pyramid.png", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "health-quiz",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลในข้อใด ไม่ปรากฏในศักยภาพชุมชน ด้านสุขภาพ ?"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "text", Value: "แหล่งบริการด้านสุขภาพในชุมชน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "รายได้เฉลี่ยต่อเดือนของแต่ละครัวเรือน", Ref: []string{"true"}, RefType: "label"},
					{Type: "text", Value: "การเข้าถึงบริการและความพึงพอใจของผู้รับบริการ", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "อัตราการเจ็บป่วยด้วยโรคเรื้อรังในชุมชน", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},

	// society
	{
		Title: "society-forum",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "vdo", Value: "", TitleRef: []string{"เอกสาร 1", "เอกสาร 2"}, Ref: []string{"https://example.com/doc1", "https://example.com/doc2"}, RefType: "link"},
				},
			},
		},
	},
	{
		Title: "society-tool",

		Groups: []Group{
			{
				Name: "Primary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลจากแบบสอบถาม"},
					{Type: "text", Value: "ข้อมูลจากการสนทนากลุ่ม"},
					{Type: "text", Value: "ข้อมูลจากการสังเกต"},
				},
			},
			{
				Name: "Secondary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลทะเบียนราษฎร์"},
					{Type: "text", Value: "ข้อมูลบันทึกการประชุมรายงานการจัดงานประเพณีของหน่วยงานท้องถิ่น"},
					{Type: "text", Value: "ข้อมูลบันทึกกองทุนสวัสดิการ"},
					{Type: "text", Value: "ข้อมูลบันทึกประวัติชุมชน/ หมู่บ้าน"},
				},
			},
		},
	},
	{
		Title: "society-assessment-tool",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740334390/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_885_o44pze.png"},
				},
			},
		},
	},
	{
		Title: "society-data-visualization",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "จากภาพตาราง แสดงข้อมูลประชากรจำแนกตามช่วงวัย ของบ้านแสนสุข หมู่ที่ 1 จังหวัดขอนแก่น ที่กำหนดให้ ควรเลือกใช้การนำเสนอข้อมูลแบบใด"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740334832/7.2.5_E0_B8_AA_E0_B8_B1_E0_B8_87_E0_B8_84_E0_B8_A1_E0_B9_81_E0_B8_A5_E0_B8_B0_E0_B8_A7_E0_B8_B1_E0_B8_92_E0_B8_99_E0_B8_98_E0_B8_A3_E0_B8_A3_E0_B8_A1_vlf2rr.png"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "img", Value: "/images/bar.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pie.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/line.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pyramid.png", Ref: []string{"true"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "society-quiz",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลใด แสดงถึงความหมายของอัตราการพึ่งพิงรวม ?"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลที่แสดงถึงจำนวนประชากรที่ต้องการความช่วยเหลือจากภาครัฐ", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "ข้อมูลที่แสดงถึงการพึ่งพาทรัพยากรธรรมชาติภายในชุมชน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "ข้อมูลทื่แสดงถึงประชากรที่มีการว่างงาน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "อัตราส่วนจำนวนประชากรวัยเด็ก (0-14ปี) และจำนวนประชากรวัย ผู้สูงอายุ (60 ปีขึ้นไป) ต่อจำนวนประชากรวัยแรงงาน (15-59 ปี)", Ref: []string{"true"}, RefType: "label"},
				},
			},
		},
	},

	// environment
	{
		Title: "environment-forum",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "vdo", Value: "", TitleRef: []string{"เอกสาร 1", "เอกสาร 2"}, Ref: []string{"https://example.com/doc1", "https://example.com/doc2"}, RefType: "link"},
				},
			},
		},
	},
	{
		Title: "environment-tool",

		Groups: []Group{
			{
				Name: "Primary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลจากการสังเกตสิ่งแวดล้อม"},
					{Type: "text", Value: "ข้อมูลจากการสัมภาษณ์แกนนำกลุ่มทางสังคม"},
					{Type: "text", Value: "ข้อมูลจากแบบสอบถาม"},
					{Type: "text", Value: "ข้อมูลจากการสนทนากลุ่ม"},
				},
			},
			{
				Name: "Secondary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลสุขภาพของ รพ.สต."},
					{Type: "text", Value: "ข้อมูลรายงานสุขภาพชุมชนของ อสม."},
					{Type: "text", Value: "ข้อมูลจากแฟ้มครอบครัว"},
					{Type: "text", Value: "ข้อมูลรายงานการประชุม อสม. กลุ่มทางสังคม"},
				},
			},
		},
	},
	{
		Title: "environment-assessment-tool",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740335538/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_886.2_aorj7k.png"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740335512/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_886.1_mhfhyf.png"},
				},
			},
		},
	},
	{
		Title: "environment-data-visualization",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "จากภาพตาราง แสดงจำนวนและร้อยละการจัดการน้ำอุปโภคของครัวเรือน ของบ้านแสนสุข หมู่ที่ 1 จังหวัดขอนแก่นที่กำหนดให้ ควรเลือกใช้การนำเสนอข้อมูล แบบใด "},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740335587/7.3.5_E0_B8_AA_E0_B8_B4_E0_B9_88_E0_B8_87_E0_B9_81_E0_B8_A7_E0_B8_94_E0_B8_A5_E0_B9_89_E0_B8_AD_E0_B8_A1_tmuazl.png"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "img", Value: "/images/bar.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pie.png", Ref: []string{"true"}, RefType: "label"},
					{Type: "img", Value: "/images/line.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pyramid.png", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "environment-quiz",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลในข้อใด ไม่ปรากฏในศักยภาพชุมชน ด้านสิ่งแวดล้อม ?"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "text", Value: "การจัดการขยะของครัวเรือน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "การจัดการน้ำอุปโภค บริโภคของครัวเรือน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "พื้นที่เสี่ยงต่อการเกิดปัญหาอาชญากรรม", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "จำนวนผู้ที่มีสิทธิเลือกตั้งในหมู่บ้าน", Ref: []string{"true"}, RefType: "label"},
				},
			},
		},
	},

	// economy
	{
		Title: "economy-forum",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "vdo", Value: "", TitleRef: []string{"เอกสาร 1", "เอกสาร 2"}, Ref: []string{"https://example.com/doc1", "https://example.com/doc2"}, RefType: "link"},
				},
			},
		},
	},
	{
		Title: "economy-tool",

		Groups: []Group{
			{
				Name: "Primary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลจากแบบสอบถาม"},
					{Type: "text", Value: "ข้อมูลจากการสัมภาษณ์กลุ่มอาชีพ"},
					{Type: "text", Value: "ข้อมูลจากการสังเกต"},
				},
			},
			{
				Name: "Secondary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลบันทึกการออมทรัพย์ชุมชน"},
					{Type: "text", Value: "ข้อมูลบันทึกการประชุมกลุ่มอาชีพ"},
					{Type: "text", Value: "ข้อมูลบันทึกการประชุมของกลุ่มกองทุนวิสาหกิจ"},
				},
			},
		},
	},
	{
		Title: "economy-assessment-tool",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740335909/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_887_mjhgn7.png"},
				},
			},
		},
	},
	{
		Title: "economy-data-visualization",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "จากภาพตาราง แสดงจำนวนและร้อยละการประกอบอาชีพหลัก ของบ้านแสนสุข หมู่ที่ 1 จังหวัดขอนแก่น ที่กำหนดให้ ควรเลือกใช้การนำเสนอข้อมูล แบบใด"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740335999/7.4.5_E0_B9_80_E0_B8_A8_E0_B8_A3_E0_B8_A9_E0_B8_90_E0_B8_81_E0_B8_B4_E0_B8_88_rax0ba.png"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "img", Value: "/images/bar.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pie.png", Ref: []string{"true"}, RefType: "label"},
					{Type: "img", Value: "/images/line.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pyramid.png", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "economy-quiz",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "หากต้องการทราบปัญหาด้านเศรษฐกิจในชุมชน ควรใช้เครื่องมือการเก็บข้อมูลแบบใด ?"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "text", Value: "การสัมภาษณ์เชิงลึกและข้อมูลมือสอง", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "การสังเกตกิจกรรมของกลุ่มอาชีพ", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "การรวบรวมจากแบบสอบถาม", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "ถูกทุกข้อ", Ref: []string{"true"}, RefType: "label"},
				},
			},
		},
	},

	// politics
	{
		Title: "politics-forum",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "vdo", Value: "", TitleRef: []string{"เอกสาร 1", "เอกสาร 2"}, Ref: []string{"https://example.com/doc1", "https://example.com/doc2"}, RefType: "link"},
				},
			},
		},
	},
	{
		Title: "politics-tool",

		Groups: []Group{
			{
				Name: "Primary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลจากการสัมภาษณ์ผู้นำชุมชน"},
					{Type: "text", Value: "ข้อมูลจากการสนทนากลุ่ม"},
				},
			},
			{
				Name: "Secondary Data",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลบันทึกการประชุมผู้นำชุมชน"},
					{Type: "text", Value: "ข้อมูลกติกาชุมชน"},
					{Type: "text", Value: "ข้อมูลจำนวนผู้เข้าร่วมการประชุม เลือกตั้ง"},
					{Type: "text", Value: "ข้อมูลการเกิด การตาย"},
				},
			},
		},
	},
	{
		Title: "politics-assessment-tool",

		Groups: []Group{
			{
				Name: "",
				Contents: []Content{
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740336226/E0_B8_A3_E0_B8_B9_E0_B8_9B_E0_B8_97_E0_B8_B5_E0_B9_888_vjnewl.png"},
				},
			},
		},
	},
	{
		Title: "politics-data-visualization",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "จากภาพตาราง แสดงจำนวนและร้อยละการใช้สิทธิเลือกตั้งของประชาชนในชุมชน ของบ้านแสนสุข หมู่ที่ 1 จังหวัดขอนแก่น ที่กำหนดให้ ควรเลือกใช้การนำเสนอข้อมูล แบบใด"},
					{Type: "img", Value: "https://res.cloudinary.com/dccngq1hm/image/upload/v1740336262/E0_B8_B67.5.5_E0_B8_81_E0_B8_B2_E0_B8_A3_E0_B9_80_E0_B8_A1_E0_B8_B7_E0_B8_AD_E0_B8_87_x5njkk.png"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "img", Value: "/images/bar.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pie.png", Ref: []string{"true"}, RefType: "label"},
					{Type: "img", Value: "/images/line.png", Ref: []string{"false"}, RefType: "label"},
					{Type: "img", Value: "/images/pyramid.png", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "politics-quiz",

		Groups: []Group{
			{
				Name: "โจทย์",
				Contents: []Content{
					{Type: "text", Value: "ข้อมูลในข้อใด ไม่ปรากฏในศักยภาพชุมชน ด้านสุขภาพ ?"},
				},
			},
			{
				Name: "คำตอบ",
				Contents: []Content{
					{Type: "text", Value: "แหล่งบริการด้านสุขภาพในชุมชน", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "รายได้เฉลี่ยต่อเดือนของแต่ละครัวเรือน", Ref: []string{"true"}, RefType: "label"},
					{Type: "text", Value: "การเข้าถึงบริการและความพึงพอใจของผู้รับบริการ", Ref: []string{"false"}, RefType: "label"},
					{Type: "text", Value: "อัตราการเจ็บป่วยด้วยโรคเรื้อรังในชุมชน", Ref: []string{"false"}, RefType: "label"},
				},
			},
		},
	},
	{
		Title: "satisfaction-survey",

		Groups: []Group{
			{
				Name: "ลิงค์แบบประเมิน",
				Contents: []Content{
					{Type: "text", Value: "https://docs.google.com/forms/d/e/1FAIpQLSeJnVSPq0-MUXt7CH8h8LXS8kfVSyOJgzajkYjMksVliu1Wdw/viewform?usp=dialog"},
				},
			},
		},
	},
}
