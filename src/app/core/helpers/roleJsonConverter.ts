interface OriginalObject {
	id: number;
	name: string;
	category: string;
	categoryId: number;
	createdOn: string;
}

interface TransformedObject {
	categoryId: number;
	category: string;
	subLabels: { id: number; name: string }[];
}

export function transformUserPermissions(
	originalData: OriginalObject[]
): TransformedObject[] {
	const transformedData: TransformedObject[] = [];

	const groupedData = originalData.reduce((result: any, item) => {
		(result[item.categoryId] = result[item.categoryId] || []).push(item);
		return result;
	}, {});

	for (const categoryId in groupedData) {
		if (groupedData.hasOwnProperty(categoryId)) {
			const items = groupedData[categoryId];
			const transformedItem: TransformedObject = {
				categoryId: parseInt(categoryId),
				category: items[0].category,
				subLabels: items.map(({ id, name }: any) => ({ id, name })),
			};
			transformedData.push(transformedItem);
		}
	}

	return transformedData;
}
