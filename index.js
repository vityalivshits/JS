/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */
function query(collection) {
    let copiedCollection = JSON.parse(JSON.stringify(collection));
    if(arguments[1] === undefined) {
        return copiedCollection;
    }

    //get commands
    let commands = [].slice.call(arguments, 1);
    let selectArgs = ['name', 'gender','email', 'favoriteFruit'];
    let filter = {};

    for(let i = 0; i < commands.length; i++) {
        let command = commands[i][0]; // [->'select', ['arg1', 'arg2', 'argN']] или [->'filter', 'fieldName', ['arg1', 'arg2', 'argN']]
        let commandArgs = [];
        
        switch(command) {
            case 'select':
                commandArgs = commands[i][1];
                let intersection = selectArgs.filter(x => commandArgs.includes(x));
                selectArgs = intersection;
                break;

            case 'filter':
                let filterFieldName = commands[i][1];
                commandArgs = commands[i][2];

                if(!filter.hasOwnProperty(filterFieldName)) {
                    filter[filterFieldName] = commandArgs;
                } else {
                    let intersection = filter[filterFieldName].filter(x => commandArgs.includes(x));
                    filter[filterFieldName] = intersection;
                }
                break;
        }
    }
    
    copiedCollection = copiedCollection.filter(function(person) {
        let personAllow = true;
        Object.keys(filter).forEach(function(field) {
            if(!filter[field].includes(person[field])) {
                personAllow = false;
            }
        })
        return personAllow;
    });

    copiedCollection = copiedCollection.map(function(person) {
        let newPerson = {};
        selectArgs.forEach(function(field) {
            newPerson[field] = person[field];
        })
        return newPerson;
    });

    return copiedCollection;
}   

/**
 * @params {String[]}
 */
function select() {
    return ['select', [].slice.call(arguments)];
}

/**
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Массив разрешённых значений
 */
function filterIn(property, values) {
    return ['filter', property, values];
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};
