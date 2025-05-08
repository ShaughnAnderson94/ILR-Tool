const xmllint = require("xmllint");
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell,
} = require("electron");
const path = require("node:path");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const currentDate = new Date(Date());
const isoWithoutMsOrZ = currentDate.toISOString().split(".")[0];
const dateOnlyString = isoWithoutMsOrZ.replace(/T.*/, "");
const { Worker } = require("worker_threads");
const os = require("os");

const tempDir = path.join(os.tmpdir(), `electron-ilr_file_creator-xmls`);
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
let XMLfilePath = "";
let versionForExport = "";
const formatDateTime = (date) => {
  const yyyymmdd = date.toISOString().split("T")[0].replace(/-/g, "");
  const hhmmss = date.toTimeString().split(" ")[0].replace(/:/g, "");
  return `${yyyymmdd}-${hhmmss}`;
};
function convertAcademicYear(yearString) {
  // Validate input
  if (!/^\d{4}$/.test(yearString)) {
    throw new Error("Invalid input. Please provide a 4-digit year string.");
  }

  // Extract first two and last two digits
  const firstTwoDigits = yearString.slice(0, 2);
  const lastTwoDigits = yearString.slice(2);

  // Convert to formatted academic year
  return `20${firstTwoDigits}-${lastTwoDigits}`;
}
let xmlBase = {
  Header: {
    CollectionDetails: {
      Collection: "ILR",
      Year: "2324",

      FilePreparationDate: dateOnlyString,
    },
    Source: {
      ProtectiveMarking: "OFFICIAL-SENSITIVE-Personal",
      UKPRN: 'Placeholder',
      SoftwareSupplier: "Education & Skills Funding Agency",
      SoftwarePackage: "ILR Learner Entry",
      Release: "2324.1.92.0",
      SerialNo: "01",
      DateTime: isoWithoutMsOrZ,
    },
  },
  LearningProvider: {
    UKPRN: "placeholder",
  },
  Learner: [],
};

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
      // these are bad practice and I should change if time can set isolation to true and set a file allowing only the apis I know I want to use
    },
  });

  win.loadFile("index.html");

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    win.webContents.toggleDevTools();
  });
}

ipcMain.on("log-message", (event, message) => {
  console.log("Renderer:", message);
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("upload-csv", (event, dataArray, version, ukprn) => {
  try {
    versionForExport = version;
    xmlBase.Header.Source.Release = version;
    xmlBase.Header.CollectionDetails.Year = version.split(".")[0];
    xmlBase.Header.Source.UKPRN = ukprn;
    xmlBase.LearningProvider.UKPRN = ukprn;
    let refNumber = 0;

    const CheckBoxPattern = /0 checked out/;
    for (let I = 1; I < dataArray.length; I++) {
      for (let i = 0; i < dataArray[I].length; i++) {
        if (CheckBoxPattern.test(dataArray[I][i])) {
          dataArray[I][i] = "";
        }
      }
    }
    for (let i = 1; i < dataArray.length; i++) {
      refNumber = i.toString().padStart(4, "0");
      xmlBase.Learner.push({
        LearnRefNumber: refNumber,
        ULN: dataArray[i][2],
        FamilyName: dataArray[i][4],
        GivenNames: dataArray[i][3],
        DateOfBirth: dataArray[i][6],
        Ethnicity: dataArray[i][8],
        Sex: dataArray[i][5],
        LLDDHealthProb: dataArray[i][12],
        NINumber: dataArray[i][7].replace(/\s+/g, "").trim(),
        PlanLearnHours: dataArray[i][16] || undefined,
        PostcodePrior: dataArray[i][9],
        Postcode: dataArray[i][10],
        AddLine1: dataArray[i][11]
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .substring(0, 50),
        TelNo: dataArray[i][12] || undefined,
        LLDDHealthProb: dataArray[i][13] != "99" ? 1 : 9,
        PriorAttain: {
          PriorLevel: dataArray[i][15],
          DateLevelApp: dataArray[i][14],
        },

        LLDDandHealthProblem:
          dataArray[i][13] != "99"
            ? [{ LLDDCat: dataArray[i][13], PrimaryLLDD: 1 }]
            : undefined,
        LearnerEmploymentStatus: [
          ...(dataArray[i][18]
            ? [
                {
                  EmpStat: dataArray[i][18],
                  DateEmpStatApp: dataArray[i][17],
                  EmpId: dataArray[i][19] || undefined,
                  EmploymentStatusMonitoring: [
                    ...(dataArray[i][23]
                      ? [
                          {
                            ESMType: "LOE",
                            ESMCode: dataArray[i][23],
                          },
                        ]
                      : []),
                    ...(dataArray[i][24]
                      ? [
                          {
                            ESMType: "EII",
                            ESMCode: dataArray[i][24],
                          },
                        ]
                      : []),
                    ...(dataArray[i][25]
                      ? [
                          {
                            ESMType: "LOU",
                            ESMCode: dataArray[i][25],
                          },
                        ]
                      : []),
                    ...(dataArray[i][21]
                      ? [
                          {
                            ESMType: "SEI",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                    ...(dataArray[i][20]
                      ? [
                          {
                            ESMType: "SEM",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                    ...(dataArray[i][22]
                      ? [
                          {
                            ESMType: "OET",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),
          ...(dataArray[i][27]
            ? [
                {
                  EmpStat: dataArray[i][27],
                  DateEmpStatApp: dataArray[i][26],
                  EmpId: dataArray[i][28] || undefined,
                  EmploymentStatusMonitoring: [
                    ...(dataArray[i][29]
                      ? [
                          {
                            ESMType: "EII",
                            ESMCode: dataArray[i][29],
                          },
                        ]
                      : []),
                    ...(dataArray[i][33]
                      ? [
                          {
                            ESMType: "LOE",
                            ESMCode: dataArray[i][33],
                          },
                        ]
                      : []),
                    ...(dataArray[i][31]
                      ? [
                          {
                            ESMType: "SEI",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                    ...(dataArray[i][32]
                      ? [
                          {
                            ESMType: "SEM",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                    ...(dataArray[i][30]
                      ? [
                          {
                            ESMType: "OET",
                            ESMCode: "1",
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),
        ],
        LearningDelivery: [
          // First aim - only include if required fields are present
          ...(dataArray[i][34]
            ? [
                {
                  // Aim type (programme aim 1)
                  LearnAimRef: dataArray[i][35].trim(), // Programme aim 1 Learning ref
                  AimType: dataArray[i][34], // Aim type (programme aim 1)
                  AimSeqNumber: "1",
                  LearnStartDate: dataArray[i][36], // Start date (aim 1)
                  LearnPlanEndDate: dataArray[i][37], // Planned end date (aim 1)
                  FundModel: dataArray[i][38], // Funding module (aim 1)
                  PHours: dataArray[i][42] || undefined, // Planned hours (aim 1)
                  OTJActHours: dataArray[i][43] || undefined, // Actual hours (aim 1)
                  ProgType: dataArray[i][39], // Programme type (aim 1)
                  StdCode: dataArray[i][40] || undefined, // Apprentice standard (aim 1)
                  DelLocPostCode: dataArray[i][41], // Delivery postcode (aim 1)
                  EPAOrgID: dataArray[i][45] || undefined, // EPAO ID (aim 1)
                  ConRefNumber: dataArray[i][44] || undefined, // Contract Ref (aim 1)
                  CompStatus: dataArray[i][60] || undefined, // Completion status (aim 1)
                  LearnActEndDate: dataArray[i][61] || undefined, // Actual end date (aim 1)
                  WithdrawReason: dataArray[i][64] || undefined, // Withdrawal reason (aim 1)
                  Outcome: dataArray[i][63] || undefined, // Outcome (aim 1)
                  AchDate: dataArray[i][62] || undefined, // Achievement date (aim 1)
                  OutGrade: dataArray[i][65] || undefined, // Outcome grade (aim 1)
                  SWSupAimId: crypto.randomUUID(),
                  LearningDeliveryFAM: [
                    ...(dataArray[i][50]
                      ? [
                          {
                            // Funding indicator (aim 1)
                            LearnDelFAMType: "FFI",
                            LearnDelFAMCode: dataArray[i][50],
                          },
                        ]
                      : []),
                    ...(dataArray[i][51]
                      ? [
                          {
                            // Source of funding (aim 1)
                            LearnDelFAMType: "SOF",
                            LearnDelFAMCode: dataArray[i][51],
                          },
                        ]
                      : []),
                    ...(dataArray[i][46]
                      ? [
                          {
                            // Contract type (aim 1)
                            LearnDelFAMType: dataArray[i][46],
                            LearnDelFAMCode: dataArray[i][47],
                            LearnDelFAMDateFrom: dataArray[i][48] || undefined, // Date applies from (aim 1)
                            LearnDelFAMDateTo: dataArray[i][49] || undefined, // Date applies to (aim 1)
                          },
                        ]
                      : []),
                  ],
                  AppFinRecord: [
                    ...(dataArray[i][52]
                      ? [
                          {
                            // Financial type 1 (aim 1)
                            AFinType: dataArray[i][52],
                            AFinCode: dataArray[i][53] || undefined, // Financial code 1 (aim 1)
                            AFinDate: dataArray[i][54] || undefined, // Financial start date 1 (aim 1)
                            AFinAmount: dataArray[i][55] || undefined, // Training price (aim 1)
                          },
                        ]
                      : []),
                    ...(dataArray[i][56]
                      ? [
                          {
                            // Financial type 2 (aim 1)
                            AFinType: dataArray[i][56],
                            AFinCode: dataArray[i][57] || undefined, // Financial code 2 (aim 1)
                            AFinDate: dataArray[i][58] || undefined, // Financial start date 2 (aim 1)
                            AFinAmount: dataArray[i][59] || undefined, // Total assessment price (aim 1)
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),

          // Second aim - only include if required fields are present
          ...(dataArray[i][66]
            ? [
                {
                  LearnAimRef: dataArray[i][67].trim(), // Programme aim 2 Learning ref
                  AimType: dataArray[i][66], // Aim type (programme aim 2)
                  AimSeqNumber: "2",
                  LearnStartDate: dataArray[i][68], // Start date (aim 2)
                  LearnPlanEndDate: dataArray[i][69], // Planned end date (aim 2)
                  FundModel: dataArray[i][70], // Funding module (aim 2)
                  PHours: dataArray[i][74] || undefined, // Planned hours (aim 2)
                  ProgType: dataArray[i][71], // Programme type (aim 2)
                  StdCode: dataArray[i][72] || undefined, // Apprentice standard (aim 2)
                  DelLocPostCode: dataArray[i][73], // Delivery postcode (aim 2)
                  OTJActHours: dataArray[i][75] || undefined, // Actual hours (aim 2)
                  EPAOrgID: dataArray[i][77] || undefined, // EPAO ID (aim 2)
                  ConRefNumber: dataArray[i][76] || undefined, // Contract Ref (aim 2)
                  CompStatus: dataArray[i][92] || undefined, // Completion status (aim 2)
                  LearnActEndDate: dataArray[i][93] || undefined, // Actual end date (aim 2)
                  WithdrawReason: dataArray[i][96] || undefined, // Withdrawal reason (aim 2)
                  Outcome: dataArray[i][95] || undefined, // Outcome (aim 2)
                  AchDate: dataArray[i][94] || undefined, // Achievement date (aim 2)
                  OutGrade: dataArray[i][97] || undefined, // Outcome grade (aim 2)
                  SWSupAimId: crypto.randomUUID(),
                  LearningDeliveryFAM: [
                    ...(dataArray[i][82]
                      ? [
                          {
                            // Funding indicator (aim 2)
                            LearnDelFAMType: "FFI",
                            LearnDelFAMCode: dataArray[i][82],
                          },
                        ]
                      : []),
                    ...(dataArray[i][83]
                      ? [
                          {
                            // Source of funding (aim 2)
                            LearnDelFAMType: "SOF",
                            LearnDelFAMCode: dataArray[i][83],
                          },
                        ]
                      : []),
                    ...(dataArray[i][78]
                      ? [
                          {
                            // Contract type (aim 2)
                            LearnDelFAMType: dataArray[i][78],
                            LearnDelFAMCode: dataArray[i][79],
                            LearnDelFAMDateFrom: dataArray[i][80] || undefined, // Date applies from (aim 2)
                            LearnDelFAMDateTo: dataArray[i][81] || undefined, // Date applies to (aim 2)
                          },
                        ]
                      : []),
                  ],
                  AppFinRecord: [
                    ...(dataArray[i][84]
                      ? [
                          {
                            // Financial type 1 (aim 2)
                            AFinType: dataArray[i][84],
                            AFinCode: dataArray[i][85] || undefined, // Financial code 1 (aim 2)
                            AFinDate: dataArray[i][86] || undefined, // Financial start date 1 (aim 2)
                            AFinAmount: dataArray[i][87] || undefined, // Training price (aim 2)
                          },
                        ]
                      : []),
                    ...(dataArray[i][88]
                      ? [
                          {
                            // Financial type 2 (aim 2)
                            AFinType: dataArray[i][88],
                            AFinCode: dataArray[i][89] || undefined, // Financial code 2 (aim 2)
                            AFinDate: dataArray[i][90] || undefined, // Financial start date 2 (aim 2)
                            AFinAmount: dataArray[i][91] || undefined, // Total assessment price (aim 2)
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),

          // Third aim - only include if required fields are present
          ...(dataArray[i][98]
            ? [
                {
                  // Aim type (programme aim 3)
                  LearnAimRef: dataArray[i][99].trim(), // Programme aim 3 Learning ref
                  AimType: dataArray[i][98], // Aim type (programme aim 3)
                  AimSeqNumber: "3",
                  LearnStartDate: dataArray[i][100], // Start date (aim 3)
                  LearnPlanEndDate: dataArray[i][101], // Planned end date (aim 3)
                  FundModel: dataArray[i][102], // Funding module (aim 3)
                  ProgType: dataArray[i][103], // Programme type (aim 3)
                  StdCode: dataArray[i][104] || undefined, // Apprentice standard (aim 3)
                  DelLocPostCode: dataArray[i][105], // Delivery postcode (aim 3)
                  PHours: dataArray[i][106] || undefined, // Planned hours (aim 3)
                  OTJActHours: dataArray[i][107] || undefined, // Actual hours (aim 3)
                  EPAOrgID: dataArray[i][109] || undefined, // EPAO ID (aim 3)
                  ConRefNumber: dataArray[i][108] || undefined, // Contract Ref (aim 3)
                  CompStatus: dataArray[i][124] || undefined, // Completion status (aim 3)
                  LearnActEndDate: dataArray[i][125] || undefined, // Actual end date (aim 3)
                  WithdrawReason: dataArray[i][127] || undefined, // Withdrawal reason (aim 3)
                  Outcome: dataArray[i][128] || undefined, // Outcome (aim 3)
                  AchDate: dataArray[i][126] || undefined, // Achievement date (aim 3)
                  OutGrade: dataArray[i][129] || undefined, // Outcome grade (aim 3)
                  SWSupAimId: crypto.randomUUID(),
                  LearningDeliveryFAM: [
                    ...(dataArray[i][114]
                      ? [
                          {
                            // Funding indicator (aim 3)
                            LearnDelFAMType: "FFI",
                            LearnDelFAMCode: dataArray[i][114],
                          },
                        ]
                      : []),
                    ...(dataArray[i][115]
                      ? [
                          {
                            // Source of funding (aim 3)
                            LearnDelFAMType: "SOF",
                            LearnDelFAMCode: dataArray[i][115],
                          },
                        ]
                      : []),
                    ...(dataArray[i][110]
                      ? [
                          {
                            // Contract type (aim 3)
                            LearnDelFAMType: dataArray[i][110],
                            LearnDelFAMCode: dataArray[i][111],
                            LearnDelFAMDateFrom: dataArray[i][112] || undefined, // Date applies from (aim 3)
                            LearnDelFAMDateTo: dataArray[i][113] || undefined, // Date applies to (aim 3)
                          },
                        ]
                      : []),
                  ],
                  AppFinRecord: [
                    ...(dataArray[i][116]
                      ? [
                          {
                            // Financial type 1 (aim 3)
                            AFinType: dataArray[i][116],
                            AFinCode: dataArray[i][117] || undefined, // Financial code 1 (aim 3)
                            AFinDate: dataArray[i][118] || undefined, // Financial start date 1 (aim 3)
                            AFinAmount: dataArray[i][119] || undefined, // Training price (aim 3)
                          },
                        ]
                      : []),
                    ...(dataArray[i][120]
                      ? [
                          {
                            // Financial type 2 (aim 3)
                            AFinType: dataArray[i][120],
                            AFinCode: dataArray[i][121] || undefined, // Financial code 2 (aim 3)
                            AFinDate: dataArray[i][122] || undefined, // Financial start date 2 (aim 3)
                            AFinAmount: dataArray[i][123] || undefined, // Total assessment price (aim 3)
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),

          // Fourth aim - only include if required fields are present
          ...(dataArray[i][130]
            ? [
                {
                  // Aim type (programme aim 4)
                  LearnAimRef: dataArray[i][131].trim(), // Programme aim 4 Learning ref
                  AimType: dataArray[i][130], // Aim type (programme aim 4)
                  AimSeqNumber: "4",
                  LearnStartDate: dataArray[i][132], // Start date (aim 4)
                  LearnPlanEndDate: dataArray[i][133], // Planned end date (aim 4)
                  FundModel: dataArray[i][134], // Funding module (aim 4)
                  PHours: dataArray[i][138] || undefined, // Planned hours (aim 4)
                  ProgType: dataArray[i][135], // Programme type (aim 4)
                  StdCode: dataArray[i][136] || undefined, // Apprentice standard (aim 4)
                  DelLocPostCode: dataArray[i][137], // Delivery postcode (aim 4)
                  OTJActHours: dataArray[i][139] || undefined, // Actual hours (aim 4)
                  EPAOrgID: dataArray[i][141] || undefined, // EPAO ID (aim 4)
                  ConRefNumber: dataArray[i][140] || undefined, // Contract Ref (aim 4)
                  CompStatus: dataArray[i][156] || undefined, // Completion status (aim 4)
                  LearnActEndDate: dataArray[i][157] || undefined, // Actual end date (aim 4)
                  WithdrawReason: dataArray[i][159] || undefined, // Withdrawal reason (aim 4)
                  Outcome: dataArray[i][160] || undefined, // Outcome (aim 4)
                  AchDate: dataArray[i][158] || undefined, // Achievement date (aim 4)
                  OutGrade: dataArray[i][161] || undefined, // Outcome grade (aim 4)
                  SWSupAimId: crypto.randomUUID(),
                  LearningDeliveryFAM: [
                    ...(dataArray[i][146]
                      ? [
                          {
                            // Funding indicator (aim 4)
                            LearnDelFAMType: "FFI",
                            LearnDelFAMCode: dataArray[i][146],
                          },
                        ]
                      : []),
                    ...(dataArray[i][147]
                      ? [
                          {
                            // Source of funding (aim 4)
                            LearnDelFAMType: "SOF",
                            LearnDelFAMCode: dataArray[i][147],
                          },
                        ]
                      : []),
                    ...(dataArray[i][142]
                      ? [
                          {
                            // Contract type (aim 4)
                            LearnDelFAMType: dataArray[i][142],
                            LearnDelFAMCode: dataArray[i][143],
                            LearnDelFAMDateFrom: dataArray[i][144] || undefined, // Date applies from (aim 4)
                            LearnDelFAMDateTo: dataArray[i][145] || undefined, // Date applies to (aim 4)
                          },
                        ]
                      : []),
                  ],
                  AppFinRecord: [
                    ...(dataArray[i][148]
                      ? [
                          {
                            // Financial type 1 (aim 4)
                            AFinType: dataArray[i][148],
                            AFinCode: dataArray[i][149] || undefined, // Financial code 1 (aim 4)
                            AFinDate: dataArray[i][150] || undefined, // Financial start date 1 (aim 4)
                            AFinAmount: dataArray[i][151] || undefined, // Training price (aim 4)
                          },
                        ]
                      : []),
                    ...(dataArray[i][152]
                      ? [
                          {
                            // Financial type 2 (aim 4)
                            AFinType: dataArray[i][152],
                            AFinCode: dataArray[i][153] || undefined, // Financial code 2 (aim 4)
                            AFinDate: dataArray[i][154] || undefined, // Financial start date 2 (aim 4)
                            AFinAmount: dataArray[i][155] || undefined, // Total assessment price (aim 4)
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),

          // Fifth aim - only include if required fields are present
          ...(dataArray[i][162]
            ? [
                {
                  // Aim type (programme aim 5)
                  LearnAimRef: dataArray[i][163].trim(), // Programme aim 5 Learning ref
                  AimType: dataArray[i][162], // Aim type (programme aim 5)
                  AimSeqNumber: "5",
                  LearnStartDate: dataArray[i][164], // Start date (aim 5)
                  LearnPlanEndDate: dataArray[i][165], // Planned end date (aim 5)
                  FundModel: dataArray[i][166], // Funding module (aim 5)
                  ProgType: dataArray[i][167], // Programme type (aim 5)
                  StdCode: dataArray[i][168] || undefined, // Apprentice standard (aim 5)
                  DelLocPostCode: dataArray[i][169], // Delivery postcode (aim 5)
                  PHours: dataArray[i][170] || undefined, // Planned hours (aim 5)
                  OTJActHours: dataArray[i][171] || undefined, // Actual hours (aim 5)
                  EPAOrgID: dataArray[i][173] || undefined, // EPAO ID (aim 5)
                  ConRefNumber: dataArray[i][172] || undefined, // Contract Ref (aim 5)
                  CompStatus: dataArray[i][188] || undefined, // Completion status (aim 5)
                  LearnActEndDate: dataArray[i][189] || undefined, // Actual end date (aim 5)
                  WithdrawReason: dataArray[i][192] || undefined, // Withdrawal reason (aim 5)
                  Outcome: dataArray[i][191] || undefined, // Outcome (aim 5)
                  AchDate: dataArray[i][190] || undefined, // Achievement date (aim 5)
                  OutGrade: dataArray[i][193] || undefined, // Outcome grade (aim 5)
                  SWSupAimId: crypto.randomUUID(),
                  LearningDeliveryFAM: [
                    ...(dataArray[i][178]
                      ? [
                          {
                            // Funding indicator (aim 5)
                            LearnDelFAMType: "FFI",
                            LearnDelFAMCode: dataArray[i][178],
                          },
                        ]
                      : []),
                    ...(dataArray[i][179]
                      ? [
                          {
                            // Source of funding (aim 5)
                            LearnDelFAMType: "SOF",
                            LearnDelFAMCode: dataArray[i][179],
                          },
                        ]
                      : []),
                    ...(dataArray[i][174]
                      ? [
                          {
                            // Contract type (aim 5)
                            LearnDelFAMType: dataArray[i][174],
                            LearnDelFAMCode: dataArray[i][175],
                            LearnDelFAMDateFrom: dataArray[i][176] || undefined, // Date applies from (aim 5)
                            LearnDelFAMDateTo: dataArray[i][177] || undefined, // Date applies to (aim 5)
                          },
                        ]
                      : []),
                  ],
                  AppFinRecord: [
                    ...(dataArray[i][180]
                      ? [
                          {
                            // Financial type 1 (aim 5)
                            AFinType: dataArray[i][180],
                            AFinCode: dataArray[i][181] || undefined, // Financial code 1 (aim 5)
                            AFinDate: dataArray[i][182] || undefined, // Financial start date 1 (aim 5)
                            AFinAmount: dataArray[i][183] || undefined, // Training price (aim 5)
                          },
                        ]
                      : []),
                    ...(dataArray[i][184]
                      ? [
                          {
                            // Financial type 2 (aim 5)
                            AFinType: dataArray[i][184],
                            AFinCode: dataArray[i][185] || undefined, // Financial code 2 (aim 5)
                            AFinDate: dataArray[i][186] || undefined, // Financial start date 2 (aim 5)
                            AFinAmount: dataArray[i][187] || undefined, // Training price (aim 5)
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),
        ],
      });
    }
    let xml = xmlbuilder
      .create(
        {
          Message: xmlBase,
        },
        {
          encoding: "utf-8",
        }
      )

      .att("xmlns", `ESFA/ILR/${convertAcademicYear(version.split(".")[0])}`)
      .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
      .end({ pretty: true });

    XMLfilePath = path.join(
      tempDir,
      `ILR-10085696-${version.split(".")[0]}-${formatDateTime(
        currentDate
      )}-01.xml`
    );

    fs.writeFile(XMLfilePath, xml, (err) => {
      if (err) {
        event.reply("xml-creation-failed", err.message);
      } else {
        event.reply(
          "xml-created",
          `ILR-10085696-${version.split(".")[0]}-${formatDateTime(
            currentDate
          )}-01.xml`
        );
      }
    });
    let xsd = fs.readFileSync(path.join(__dirname, "schemafile.xsd"), "utf-8");

    // This worker is required because the library used is old and busted and causes a memory leak.
    //The worker can validate the xml before the memory leak causes it to crash but if we
    // used the library in the main process the crash would shut down the app
    // We can check if there is a better library for validating xmls against schemas created in the future
    // but at the time of creation there was not (seems to work better outside the developer environment anyway)
    const worker = new Worker(path.join(__dirname, "xmlValidator.js"), {
      workerData: { xml, xsd },
    });

    worker.on("message", (result) => {
      // this currently never happens because the way the DFE formated their XMLs always generates two warnings but if they
      // fix that in future versions its worth thinking about.
      if (result.valid) {
        // event.reply('xml-validation-success', result);
      } else {
        event.reply("xml-validation-errors", result);
      }
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      event.reply("xml-validation-errors", [error.message]);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  } catch (error) {
    console.error("An error occurred during XML validation:", error);
  }
});

ipcMain.on("openSave", (event) => {
  async function saveDialouge() {
    try {
      const result = await dialog.showSaveDialog({
        title: "Export XML File",
        defaultPath: path.join(
          app.getPath("documents"),
          `ILR-10085696-${versionForExport.split(".")[0]}-${formatDateTime(
            currentDate
          )}-01.xml`
        ),
        filters: [{ name: "XML Files", extensions: ["xml"] }],
      });
      console.log(
        "result.cancled",
        result.canceled,
        " result filepath ",
        result.filePath
      );
      if (!result.canceled && result.filePath) {
        console.log("copy file from ", XMLfilePath, " to ", result.filePath);
        await fs.promises.copyFile(XMLfilePath, result.filePath);
      } else {
        console.log("result canceled or has no file path");
      }
    } catch (error) {
      console.error("Error exporting temporary XML:", error);
      throw error;
    }
  }
  saveDialouge();
});

app.on("window-all-closed", () => {
  app.quit();
});
