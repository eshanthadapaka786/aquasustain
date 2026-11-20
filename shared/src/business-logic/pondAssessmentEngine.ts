import { AssessmentInput, AssessmentResult } from '../types';
import { WATER_QUALITY_GUIDELINES } from '../constants/designTokens';

export const ENGINE_VERSION = 'v1.2.0-field-prototype';

export function evaluatePondConditions(
  input: AssessmentInput,
  pondName: string = 'Current Pond'
): AssessmentResult {
  const limitingFactors: string[] = [];
  const recommendations: AssessmentResult['recommendations'] = [];
  const followUps: string[] = [];
  const missingParameters: string[] = [];

  // 1. Evaluate Dissolved Oxygen (weight: 25%)
  let doScore = 100;
  let doStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
  let doMsg = 'Dissolved oxygen is within the safe respiration threshold for shrimp and carps.';

  if (input.dissolvedOxygenMgL < WATER_QUALITY_GUIDELINES.dissolvedOxygen.criticalLow) {
    doScore = 15;
    doStatus = 'Hazardous';
    doMsg = `Critical hypoxia detected (${input.dissolvedOxygenMgL} mg/L). Immediate asphyxiation risk!`;
    limitingFactors.push(`Critical Dissolved Oxygen (${input.dissolvedOxygenMgL} mg/L)`);
    recommendations.push({
      id: 'rec-do-emergency',
      priority: 'High',
      category: 'Aeration',
      title: 'Deploy Full Emergency Aeration',
      description: 'Turn on all available paddlewheel aerators and venture injectors immediately.',
      whyThisMatters: 'Dissolved oxygen below 3.0 mg/L leads to acute respiratory distress and rapid mortality within hours.',
      actionableSteps: [
        'Turn on 100% of pond aerators immediately and run continuously through noon.',
        'Apply emergency chemical oxygenators (Sodium Percarbonate granules at 2-3 kg/acre).',
        'Temporarily suspend feeding for the current meal to prevent further oxygen depletion.',
      ],
    });
  } else if (input.dissolvedOxygenMgL < WATER_QUALITY_GUIDELINES.dissolvedOxygen.warningLow) {
    doScore = 55;
    doStatus = 'Warning';
    doMsg = `Sub-optimal oxygen level (${input.dissolvedOxygenMgL} mg/L). Potential sub-lethal stress.`;
    limitingFactors.push(`Low Dissolved Oxygen (${input.dissolvedOxygenMgL} mg/L)`);
    recommendations.push({
      id: 'rec-do-boost',
      priority: 'Medium',
      category: 'Aeration',
      title: 'Increase Nighttime and Predawn Aeration Hours',
      description: 'Extend aerator operation by 2-3 hours during the 01:00 to 07:00 window.',
      whyThisMatters: 'Algal respiration consumes DO during dark hours, driving early morning pond oxygen to dangerously low levels.',
      actionableSteps: [
        'Extend aerator operation by at least 2.5 hours before dawn.',
        'Check motor amperages to ensure impellers are spinning at rated RPM.',
      ],
    });
  }

  // 2. Evaluate pH (weight: 20%)
  let phScore = 100;
  let phStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
  let phMsg = `pH is well balanced at ${input.ph}.`;

  if (input.ph < WATER_QUALITY_GUIDELINES.ph.warningMin) {
    phScore = 40;
    phStatus = 'Warning';
    phMsg = `Water is acidic (${input.ph}). Calcium carbonate reserves are depleted.`;
    limitingFactors.push(`Acidic water pH (${input.ph})`);
    recommendations.push({
      id: 'rec-ph-acidic',
      priority: 'Medium',
      category: 'Water Quality',
      title: 'Buffer Pond Water with Agricultural Lime',
      description: 'Broadcast agricultural limestone (CaCO3) or dolomite to raise alkalinity and stabilize pH.',
      whyThisMatters: 'Acidic water softens shrimp carapaces, impairs gill ion-exchange, and dissolves mineral reserves.',
      actionableSteps: [
        'Apply high-grade agricultural limestone (CaCO3) at 50-75 kg/acre.',
        'Re-test pH in afternoon to verify morning-to-afternoon swing does not exceed 0.5 units.',
      ],
    });
  } else if (input.ph > WATER_QUALITY_GUIDELINES.ph.warningMax) {
    phScore = 35;
    phStatus = 'Hazardous';
    phMsg = `High alkaline water (${input.ph}). Toxic unionized ammonia (NH3) equilibrium shifts drastically upward.`;
    limitingFactors.push(`Elevated water pH (${input.ph})`);
    recommendations.push({
      id: 'rec-ph-alkaline',
      priority: 'High',
      category: 'Water Quality',
      title: 'Mitigate Heavy Algal Bloom & Apply Fermented Carbon Source',
      description: 'Apply fermented jaggery/molasses with rice bran to cultivate heterotrophic bacteria and reduce free hydroxide ions.',
      whyThisMatters: 'High pH (>9.0) transforms harmless ammonium ions (NH4+) into lethal free unionized ammonia gas (NH3).',
      actionableSteps: [
        'Apply fermented jaggery or molasses mixture (10-15 kg/acre) across pond edges in early morning.',
        'Skim surface blue-green scum or flush 5-10% water if freshwater reservoir is available.',
      ],
    });
  }

  // 3. Evaluate Temperature (weight: 15%)
  let tempScore = 100;
  let tempStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
  let tempMsg = `Water temperature (${input.waterTemperatureC}°C) is in optimal physiological range.`;

  if (input.waterTemperatureC < WATER_QUALITY_GUIDELINES.temperature.warningMin) {
    tempScore = 60;
    tempStatus = 'Warning';
    tempMsg = `Cool water (${input.waterTemperatureC}°C) decelerates aquatic digestion.`;
    recommendations.push({
      id: 'rec-temp-cool',
      priority: 'Medium',
      category: 'Feeding',
      title: 'Adjust Feed Quantity for Lower Water Temperature',
      description: 'Reduce daily ration by 15-25% to avoid feed rotting in cold bottom water.',
      whyThisMatters: 'Cold-blooded shrimp digest food 30% slower when temperature falls below 24°C.',
      actionableSteps: [
        'Verify check trays after 2 hours rather than 1.5 hours.',
        'Reduce morning feeding allocation by 20%.',
      ],
    });
  } else if (input.waterTemperatureC > WATER_QUALITY_GUIDELINES.temperature.warningMax) {
    tempScore = 50;
    tempStatus = 'Warning';
    tempMsg = `High water temperature (${input.waterTemperatureC}°C) reduces oxygen solubility.`;
    limitingFactors.push(`High Water Temperature (${input.waterTemperatureC}°C)`);
  }

  // 4. Evaluate Transparency (weight: 15%)
  let transScore = 100;
  let transStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
  let transMsg = `Transparency of ${input.transparencyCm} cm indicates healthy natural plankton blooms.`;

  if (input.transparencyCm < WATER_QUALITY_GUIDELINES.transparency.warningMin) {
    transScore = 45;
    transStatus = 'Warning';
    transMsg = `Dense phytoplankton bloom (transparency ${input.transparencyCm} cm). Risk of sudden bloom collapse / crash.`;
    limitingFactors.push(`Dense Algal Bloom (${input.transparencyCm} cm)`);
    recommendations.push({
      id: 'rec-trans-bloom',
      priority: 'Medium',
      category: 'Water Quality',
      title: 'Manage Algal Bloom Density and Monitor Dawn DO',
      description: 'Inoculate pond with beneficial probiotics to compete with phytoplankton for dissolved nutrients.',
      whyThisMatters: 'Dense microalgal blooms collapse rapidly during sudden overcast days, depleting all DO within hours.',
      actionableSteps: [
        'Apply nitrifying & Bacillus probio-cultures at 500g/acre.',
        'Exchange bottom water gradually if drainage sluice permits.',
      ],
    });
  } else if (input.transparencyCm > WATER_QUALITY_GUIDELINES.transparency.warningMax) {
    transScore = 55;
    transStatus = 'Warning';
    transMsg = `Water is overly transparent (${input.transparencyCm} cm). Benthic filamentous algae (lab-lab) may emerge.`;
    recommendations.push({
      id: 'rec-trans-clear',
      priority: 'Low',
      category: 'Water Quality',
      title: 'Nurture Healthy Diatom Bloom',
      description: 'Fertilize water with mild organic minerals to shade pond bottom and prevent benthic filamentous weeds.',
      whyThisMatters: 'Clear water allows sunlight to strike the pond bottom, causing noxious toxic benthic algae mats to flourish.',
      actionableSteps: [
        'Apply fermented organic starter mix to encourage golden-brown diatom bloom.',
        'Maintain minimum 1.2m water column depth.',
      ],
    });
  }

  // 5. Ammonia evaluation (if measured)
  let ammoniaResult = undefined;
  if (input.ammoniaPpm !== undefined) {
    let amScore = 100;
    let amStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
    let amMsg = `Total Ammonia Nitrogen is within safe limits (${input.ammoniaPpm} ppm).`;

    if (input.ammoniaPpm > WATER_QUALITY_GUIDELINES.ammonia.criticalMax) {
      amScore = 10;
      amStatus = 'Hazardous';
      amMsg = `Dangerous Ammonia Spike (${input.ammoniaPpm} ppm). Acute shrimp gill damage imminent.`;
      limitingFactors.push(`Critical Ammonia (${input.ammoniaPpm} ppm)`);
      recommendations.push({
        id: 'rec-ammonia-spike',
        priority: 'High',
        category: 'Water Quality',
        title: 'Emergency Ammonia Detoxification & Carbon Dosing',
        description: 'Immediately broadcast zeolites/yucca extract and apply molasses to spike C:N ratio above 12:1.',
        whyThisMatters: 'Ammonia inhibits oxygen affinity of shrimp hemocyanin, causing black gill syndrome and systemic mortality.',
        actionableSteps: [
          'Dose zeolite at 40-50 kg/acre to bind free ammonium ions.',
          'Broad-spread 20 kg/acre cane molasses or jaggery solution.',
          'Cut feed ration by 50% for next 48 hours.',
        ],
      });
    } else if (input.ammoniaPpm > WATER_QUALITY_GUIDELINES.ammonia.warningMax) {
      amScore = 50;
      amStatus = 'Warning';
      amMsg = `Elevated Ammonia (${input.ammoniaPpm} ppm). Requires bioremediation.`;
      limitingFactors.push(`Elevated Ammonia (${input.ammoniaPpm} ppm)`);
    }

    ammoniaResult = {
      value: input.ammoniaPpm,
      unit: 'ppm',
      score: amScore,
      status: amStatus,
      message: amMsg,
    };
  } else {
    missingParameters.push('Ammonia (TAN) not tested. Periodic TAN testing is strongly advised.');
  }

  // 6. Biological Health & Behaviour (weight: 25%)
  let bioScore = 100;
  let bioStatus: 'Optimal' | 'Warning' | 'Hazardous' = 'Optimal';
  const bioIssues: string[] = [];

  if (input.stockBehaviour === 'Surfacing at Dawn / Gaspy') {
    bioScore -= 35;
    bioIssues.push('Stock observed surfacing at dawn (indicative of acute hypoxemia or gill fouling).');
    limitingFactors.push('Dawn surfacing behaviour');
  } else if (input.stockBehaviour === 'Lethargic along Edges') {
    bioScore -= 25;
    bioIssues.push('Lethargy along pond dikes indicates physiological stress or infectious pressure.');
    limitingFactors.push('Dike lethargy');
  }

  if (input.feedIntakeCondition === 'Severely Reduced (-40%)' || input.feedIntakeCondition === 'Refusing Feed') {
    bioScore -= 30;
    bioIssues.push('Significant drop in feed appetite reflects bottom soil deterioration or viral onset.');
    limitingFactors.push('Severe Feed Refusal');
  }

  if (input.mortalityObservations === 'Moderate (5-25 observed)' || input.mortalityObservations === 'Significant (>25 observed)') {
    bioScore -= 45;
    bioIssues.push(`Observed mortality (${input.mortalityObservations}). Requires veterinary / lab check.`);
    limitingFactors.push('Recorded Mortality in Pond');
    recommendations.push({
      id: 'rec-mortality-inspection',
      priority: 'High',
      category: 'Veterinary',
      title: 'Conduct PCR or Microbiological Lab Sampling',
      description: 'Collect 10 moribund specimens on ice and send to state aqua diagnostic lab.',
      whyThisMatters: 'Early diagnosis of WSSV, EHP, or Vibrio parahaemolyticus prevents catastrophic whole-pond crop losses.',
      actionableSteps: [
        'Collect 5-10 live symptomatic specimens in sterile oxygenated bags.',
        'Inspect gut fullness, hepatopancreas color (brown vs pale yellow/whitish), and soft shell signs.',
        'Submit specimens to nearest MPEDA / State Fisheries lab.',
      ],
    });
  }

  if (input.wasteSludgeStatus === 'Heavy black sludge / H2S odor') {
    bioScore -= 20;
    bioIssues.push('Bottom sludge accumulation releasing toxic hydrogen sulfide (H2S).');
    recommendations.push({
      id: 'rec-sludge-treatment',
      priority: 'Medium',
      category: 'Sanitation',
      title: 'Apply Bottom Soil Probiotics & Syphon Sludge Pit',
      description: 'Apply Thiobacillus and Paracoccus consortium to oxidize noxious hydrogen sulfide.',
      whyThisMatters: 'H2S gas is 100x more lethal than ammonia at the sediment-water interface where shrimp rest.',
      actionableSteps: [
        'Syphon central sludge drain if pond is fitted with central toilet drain system.',
        'Apply specialized bottom soil remediating bacterial pellets.',
      ],
    });
  }

  bioScore = Math.max(10, bioScore);
  if (bioScore < 50) bioStatus = 'Hazardous';
  else if (bioScore < 75) bioStatus = 'Warning';

  // Calculate Weighted Overall Score (0 - 100)
  const ammoniaWeight = ammoniaResult ? 0.15 : 0;
  const normalizedDoWeight = ammoniaResult ? 0.25 : 0.30;
  const normalizedPhWeight = ammoniaResult ? 0.20 : 0.25;
  const normalizedTempWeight = 0.15;
  const normalizedTransWeight = 0.15;
  const normalizedBioWeight = ammoniaResult ? 0.25 : 0.30;

  const totalScoreRaw =
    doScore * normalizedDoWeight +
    phScore * normalizedPhWeight +
    tempScore * normalizedTempWeight +
    transScore * normalizedTransWeight +
    (ammoniaResult ? ammoniaResult.score * ammoniaWeight : 0) +
    bioScore * normalizedBioWeight;

  const overallScore = Math.round(Math.min(100, Math.max(12, totalScoreRaw)));

  let status: AssessmentResult['status'] = 'Optimal';
  if (overallScore < 50) status = 'Critical';
  else if (overallScore < 70) status = 'Moderate';
  else if (overallScore < 85) status = 'Good';

  // Generate follow-ups
  followUps.push('Repeat water parameter testing in 24 hours at 06:00 AM (predawn DO trough).');
  followUps.push('Inspect feeding check trays 2 hours post afternoon feeding.');
  if (limitingFactors.length > 0) {
    followUps.push(`Re-evaluate limiting parameters: ${limitingFactors.slice(0, 2).join(', ')}.`);
  }

  return {
    id: `asmt-${Date.now()}`,
    pondId: input.pondId,
    pondName,
    timestamp: new Date().toISOString(),
    ruleVersion: ENGINE_VERSION,
    overallScore,
    status,
    parameterEvaluations: {
      dissolvedOxygen: {
        value: input.dissolvedOxygenMgL,
        unit: 'mg/L',
        score: doScore,
        status: doStatus,
        message: doMsg,
      },
      ph: {
        value: input.ph,
        unit: 'pH',
        score: phScore,
        status: phStatus,
        message: phMsg,
      },
      temperature: {
        value: input.waterTemperatureC,
        unit: '°C',
        score: tempScore,
        status: tempStatus,
        message: tempMsg,
      },
      transparency: {
        value: input.transparencyCm,
        unit: 'cm',
        score: transScore,
        status: transStatus,
        message: transMsg,
      },
      ammonia: ammoniaResult,
      biologicalHealth: {
        score: bioScore,
        status: bioStatus,
        observations: bioIssues.length > 0 ? bioIssues.join(' ') : 'Stock activity, feeding response and survival appear healthy.',
      },
    },
    limitingFactors: limitingFactors.length > 0 ? limitingFactors : ['None identified. Pond parameters are well synchronized.'],
    recommendations,
    suggestedFollowUps: followUps,
    missingParameters,
    disclaimer:
      'NOTICE: AquaSustain Field Assessment Engine v1.2 uses calibrated demonstration decision rules based on standard aquaculture best practices. It does not replace certified veterinary disease diagnosis or laboratory pathology assays.',
  };
}
