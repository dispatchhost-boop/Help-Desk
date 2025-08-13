const calculateVolumetricWeight = async (boxData, volumetricFactor) => {
  let totalVolumetricWeight = 0;
  console.log("in the volumteric weight calculation in aggrigator", boxData, volumetricFactor);

  for (const item of boxData) {
    const unit = (item.dimension_unit || 'cm').toLowerCase();

    let length = Number(item.length);
    let breadth = Number(item.breadth);
    let height = Number(item.height);

    console.log("Original dimensions:", { length, breadth, height, unit });

    const conversionFactors = {
      inches: 2.54,
      feet: 30.48,
      cm: 1
    };

    if (unit in conversionFactors) {
      length *= conversionFactors[unit];
      breadth *= conversionFactors[unit];
      height *= conversionFactors[unit];
    } else {
      console.error(`Unrecognized unit "${unit}". Assuming dimensions are in cm.`);
    }

    console.log("Converted dimensions (in cm):", { length, breadth, height });

    if (!isNaN(length) && !isNaN(breadth) && !isNaN(height)) {
      let volumetricWeight = (length * breadth * height * volumetricFactor) / 27000;
      console.log(`Volumetric Weight for box: ${volumetricWeight}`);
      totalVolumetricWeight += volumetricWeight;
    } else {
      console.error(`Invalid dimensions after conversion:`, { length, breadth, height });
    }
  }

  if (totalVolumetricWeight === 0) {
    return 1;
  }

  console.log("Total Volumetric Weight:", totalVolumetricWeight);
  return totalVolumetricWeight;
};

module.exports = calculateVolumetricWeight