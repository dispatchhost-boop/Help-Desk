const calculateVolumetricWeightLTL = async (boxData, volumetricFactor) => {
  let totalVolumetricWeight = 0;
// console.log("in the volumteric weight calculation in ",boxData,volumetricFactor);

  for (const item of boxData) {
    const dimensionString = item.DIMENSION; // Fetch dimension data
    const unit = item.unit.toLowerCase();  // Get the unit (feet, cm, etc.)

    // Regular expression to capture dimension values (e.g., 5x5x5)
    const dimensions = dimensionString.match(/(\d+)x(\d+)x(\d+)/i);

    if (dimensions) {
      let length = Number(dimensions[1]);
      let width = Number(dimensions[2]);
      let height = Number(dimensions[3]);

      // console.log("Original dimensions:", { length, width, height, unit });

      // Conversion factors to convert all dimensions to centimeters
      const conversionFactors = {
        inches: 2.54, // 1 inch = 2.54 cm
        feet: 30.48,  // 1 foot = 30.48 cm
        cm: 1         // 1 cm = 1 cm
      };

      // Convert dimensions to centimeters if the unit is not already cm
      if (unit in conversionFactors) {
        length *= conversionFactors[unit];
        width *= conversionFactors[unit];
        height *= conversionFactors[unit];
      } else {
        console.error(`Unrecognized unit "${unit}" for PO No ${item.po_no}. Assuming dimensions are in cm.`);
      }

      // console.log("Converted dimensions (in cm):", { length, width, height });

      // Ensure the dimensions are valid numbers
      if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
        // Calculate volumetric weight using the formula
        let volumetricWeight = Math.ceil((length * width * height * volumetricFactor) / 27000);
        console.log(`Volumetric Weight for PO No ${item.po_no}: ${volumetricWeight}`);
        volumetricWeight = volumetricWeight*Number(item.boxes)
        console.log("updated volumetrci",volumetricWeight)

        // Add the calculated volumetric weight to the total
        totalVolumetricWeight += volumetricWeight;
      } else {
        console.error(`Invalid dimensions after conversion for PO No ${item.po_no}:`, { length, width, height });
      }
    } else {
      console.error(`Invalid dimension format for PO No ${item.po_no}`);
    }
  }
  if (totalVolumetricWeight==0){
    let total=1
   return total;
  }
  console.log("Total Volumetric Weight:", totalVolumetricWeight);
  return totalVolumetricWeight;
};
module.exports = calculateVolumetricWeightLTL