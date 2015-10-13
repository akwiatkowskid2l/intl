import formatDecimal from '../number/format-decimal';
import validateFormatValue from '../number/validate-format-value';

function getFileSizeUnits(localeData) {
	const fileSizeUnits = Object.freeze([
		{unit: localeData.fileSize.units.gigabyte, num: Math.pow(1024, 3)},
		{unit: localeData.fileSize.units.megabyte, num: Math.pow(1024, 2)},
		{unit: localeData.fileSize.units.kilobyte, num: 1024},
		{unit: localeData.fileSize.units.bytes, num: 1}
	]);

	return fileSizeUnits;
}

export default function(numBytes, localeData, options) {
	numBytes = validateFormatValue(numBytes);

	const fileSizeUnits = getFileSizeUnits(localeData);

	let formatUnit,
		size,
		maximumFractionDigits = isNaN(options.maximumFractionDigits)? 2 : options.maximumFractionDigits;

	if(numBytes === 0) {
		formatUnit = localeData.fileSize.units.bytes;
		size = 0;
	} else {
		for (var unitSize of fileSizeUnits) {
			if (Math.abs(numBytes) >= unitSize.num) {
				formatUnit = unitSize.unit;
				size = formatDecimal(numBytes/unitSize.num, localeData.number, { maximumFractionDigits: maximumFractionDigits });
				break;
			}
		}
	}

	let ret = localeData.fileSize.patterns.fileSizePattern;
	ret = ret.replace('{number}', size).replace('{unit}', formatUnit);

	return ret;
}
