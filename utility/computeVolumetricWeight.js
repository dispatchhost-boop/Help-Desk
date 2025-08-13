const computeVolumetricWeight = async (boxData, volumetricFactor) => {
  let totalVolumetricWeight = 0;

  for (const item of boxData) {
    const dimensionString = item.DIMENSION;
    const dimensions = dimensionString.match(/(\d+)x(\d+)x(\d+)\s?(cm|inches|feet)?/i);

    if (dimensions) {
      let length = Number(dimensions[1]);
      let width = Number(dimensions[2]);
      let height = Number(dimensions[3]);
      const unit = dimensions[4] ? dimensions[4].toLowerCase() : 'cm'; // Default to 'cm' if no unit is provided

      console.log("Original dimensions:", { length, width, height, unit });

      // Convert dimensions to centimeters if necessary
      const conversionFactors = {
        inches: 2.54, // 1 inch = 2.54 cm
        feet: 30.48,  // 1 foot = 30.48 cm
        cm: 1         // 1 cm = 1 cm
      };

      if (unit in conversionFactors) {
        length *= conversionFactors[unit];
        width *= conversionFactors[unit];
        height *= conversionFactors[unit];
      } else {
        console.error(`Unrecognized unit "${unit}" for PO No ${item.po_no}. Assuming dimensions are in cm.`);
      }

      console.log("Converted dimensions (in cm):", { length, width, height });

      if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
        const volumetricWeight = Math.round((length * width * height * volumetricFactor) / 27000);
        console.log(`Volumetric Weight for PO No ${item.po_no}: ${volumetricWeight}`);
        totalVolumetricWeight += volumetricWeight; // Multiply by number of boxes
      } else {
        console.error(`Invalid dimensions after conversion for PO No ${item.po_no}:`, { length, width, height });
      }
    } else {
      console.error(`Invalid dimension format for PO No ${item.po_no}`);
    }
  }

  console.log("Total Volumetric Weight:", totalVolumetricWeight);
  return totalVolumetricWeight;
};

module.exports= computeVolumetricWeight