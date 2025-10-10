export interface SortDirection {
    [key: string]: 'ASC' | 'DESC';
}

export const parseSortParam = (sortParam: string): SortDirection => {
    const sort: SortDirection = {};
    
    const sortFields = sortParam.split(',');
    
    sortFields.forEach(field => {
        const trimmedField = field.trim();
        
         if (trimmedField.endsWith('-')) {
            const fieldName = trimmedField.slice(0, -1);
            sort[fieldName] = 'DESC';
        } else {
            sort[trimmedField] = 'ASC';
        }
    });

    
    return sort;
}; 