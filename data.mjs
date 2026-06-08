export const regions = [
  { id: 1, fill: "#C2A575", points: [[42, 52], [166, 38], [204, 118], [154, 191], [55, 178], [24, 104]] },
  { id: 2, fill: "#9C7E54", points: [[166, 38], [314, 47], [318, 148], [240, 188], [204, 118]] },
  { id: 3, fill: "#B8926B", points: [[314, 47], [472, 35], [506, 121], [448, 176], [318, 148]] },
  { id: 4, fill: "#7D6843", points: [[472, 35], [632, 54], [654, 142], [574, 191], [506, 121]] },
  { id: 5, fill: "#C2A575", points: [[632, 54], [750, 82], [778, 182], [687, 220], [654, 142]] },
  { id: 6, fill: "#B8926B", points: [[55, 178], [154, 191], [185, 289], [116, 355], [38, 309], [25, 232]] },
  { id: 7, fill: "#7D6843", points: [[154, 191], [240, 188], [300, 262], [264, 361], [185, 289]] },
  { id: 8, fill: "#C2A575", points: [[240, 188], [318, 148], [448, 176], [438, 294], [349, 335], [300, 262]] },
  { id: 9, fill: "#9C7E54", points: [[448, 176], [574, 191], [601, 292], [523, 363], [438, 294]] },
  { id: 10, fill: "#B8926B", points: [[574, 191], [687, 220], [719, 333], [632, 405], [601, 292]] },
  { id: 11, fill: "#7D6843", points: [[687, 220], [778, 182], [780, 338], [719, 333]] },
  { id: 12, fill: "#C2A575", points: [[38, 309], [116, 355], [150, 475], [92, 555], [28, 502], [16, 397]] },
  { id: 13, fill: "#9C7E54", points: [[116, 355], [264, 361], [284, 499], [150, 475]] },
  { id: 14, fill: "#B8926B", points: [[264, 361], [349, 335], [438, 294], [486, 430], [412, 552], [284, 499]] },
  { id: 15, fill: "#7D6843", points: [[486, 430], [523, 363], [601, 292], [632, 405], [610, 548], [412, 552]] },
  { id: 16, fill: "#C2A575", points: [[632, 405], [719, 333], [780, 338], [772, 520], [610, 548]] }
];

export const tribalBoundary = [[38, 62], [312, 26], [600, 42], [766, 104], [786, 340], [762, 520], [610, 568], [284, 536], [92, 568], [18, 504], [14, 228]];

export const cases = [
  {
    regionId: 2,
    title: "Case 1: Highway Coverage Claim",
    claim: "Official map: cable broadband available.",
    provider: "Cable provider",
    evidence: "Residents inside the tribal boundary cannot order service; the line stops at the highway outside the homes.",
    question: "Should this provider claim be challenged?",
    correctAction: "challenge",
    successColor: "#A55D5D",
    feedback: "Correct. This is a false availability claim because infrastructure nearby is being treated as service to homes that cannot actually order it."
  },
  {
    regionId: 3,
    title: "Case 2: Confirmed Fiber Install",
    claim: "Official map: fiber broadband available.",
    provider: "Fiber provider",
    evidence: "The tribal office and sampled homes have completed installations and working speed tests.",
    question: "Should this claim stay on the map?",
    correctAction: "verify",
    successColor: "#6B8E5E",
    feedback: "Correct. The evidence supports the provider claim, so this region should be verified as covered."
  },
  {
    regionId: 4,
    title: "Case 3: Wireless Blocked By Terrain",
    claim: "Official map: fixed wireless broadband available.",
    provider: "Fixed wireless provider",
    evidence: "A ridge blocks line-of-sight. Field tests at homes show unusable signal.",
    question: "Should this provider claim be challenged?",
    correctAction: "challenge",
    successColor: "#A55D5D",
    feedback: "Correct. Reported wireless coverage does not equal actual service if terrain prevents homes from receiving it."
  },
  {
    regionId: 6,
    title: "Case 4: Old DSL, Still Working",
    claim: "Official map: DSL broadband available.",
    provider: "DSL provider",
    evidence: "The copper network is old, but sampled homes can open accounts and meet the reported service level.",
    question: "Is this an availability challenge?",
    correctAction: "verify",
    successColor: "#6B8E5E",
    feedback: "Correct. Weak infrastructure may still be a policy problem, but this evidence does not prove the availability claim is false."
  },
  {
    regionId: 8,
    title: "Case 5: Missing Address Records",
    claim: "Official map: fiber broadband available.",
    provider: "Fiber provider",
    evidence: "Some home locations are missing from the location database, but no provider denial has been collected yet.",
    question: "What is the strongest decision?",
    correctAction: "evidence",
    successColor: "#B98535",
    feedback: "Correct. This needs more evidence or a location-record challenge before an availability challenge would be strong."
  },
  {
    regionId: 10,
    title: "Case 6: Community Center Service",
    claim: "Official map: broadband available.",
    provider: "Fiber provider",
    evidence: "The community center and nearby sampled homes have active service and standard installation.",
    question: "Should this claim be challenged?",
    correctAction: "verify",
    successColor: "#6B8E5E",
    feedback: "Correct. This case has enough field evidence to verify the official coverage claim."
  },
  {
    regionId: 12,
    title: "Case 7: Boundary Blur",
    claim: "Official map: cable broadband available.",
    provider: "Cable provider",
    evidence: "Coverage exists in a nearby non-tribal subdivision, but homes inside the dashed tribal boundary cannot order service.",
    question: "Should this provider claim be challenged?",
    correctAction: "challenge",
    successColor: "#A55D5D",
    feedback: "Correct. This is the map-erasure problem: coverage outside the boundary is being allowed to hide lack of access inside it."
  },
  {
    regionId: 13,
    title: "Case 8: Fiber Passes Through",
    claim: "Official map: fiber broadband available.",
    provider: "Fiber provider",
    evidence: "Fiber passes through the area and, in this case, drops to homes are confirmed.",
    question: "Should this be treated as false coverage?",
    correctAction: "verify",
    successColor: "#6B8E5E",
    feedback: "Correct. Fiber merely passing through would be suspicious, but confirmed home drops make this claim valid."
  },
  {
    regionId: 14,
    title: "Case 9: Parking-Lot Wi-Fi",
    claim: "Official map: home broadband available.",
    provider: "Listed broadband provider",
    evidence: "Residents rely on school parking-lot Wi-Fi because home orders are unavailable.",
    question: "Should this provider claim be challenged?",
    correctAction: "challenge",
    successColor: "#A55D5D",
    feedback: "Correct. Public Wi-Fi dependence is evidence that the home broadband availability claim is false."
  },
  {
    regionId: 16,
    title: "Case 10: Affordability Problem",
    claim: "Official map: fixed broadband available.",
    provider: "Fixed broadband provider",
    evidence: "Service is technically installable at sampled homes, but the monthly price is too high for many families.",
    question: "Is this an availability challenge?",
    correctAction: "evidence",
    successColor: "#B98535",
    feedback: "Correct. Affordability matters, but this specific map challenge process is about whether service is available. More or different evidence is needed."
  }
];
