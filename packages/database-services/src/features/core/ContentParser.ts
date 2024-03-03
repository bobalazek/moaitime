export class ContentParser {
  parse(
    content: string,
    variables: Record<string, unknown>,
    objectsMap: Map<string, Record<string, unknown>>
  ) {
    let parsedContent = content;

    const flatVariables = Object.entries(variables).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if ('__entityType' in value && 'id' in value) {
          const entityType = value.__entityType as string;
          const entityId = value.id as string;

          value = {
            ...value,
            ...objectsMap.get(`${entityType}:${entityId}`),
          };
        }

        return {
          ...acc,
          ...Object.entries(value as Record<string, unknown>).reduce((acc2, [key2, value2]) => {
            return {
              ...acc2,
              [`${key}.${key2}`]: value2,
            };
          }, {}),
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});

    for (const [key, value] of Object.entries(flatVariables)) {
      parsedContent = parsedContent.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    }

    parsedContent = parsedContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    return parsedContent;
  }
}

export const contentParser = new ContentParser();
