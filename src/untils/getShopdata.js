import _ from "lodash"
import { ObjectId } from "mongodb"

const getDataShop = ({ fields = [], object = {} }) => _.pick(object, fields)

const getSelectFields = ({ fields = [] }) => {
    return Object.fromEntries(fields.map((field) => [field, 1]))
}

const getUnSelectFields = ({ fields = [] }) => {
    return Object.fromEntries(fields.map((field) => [field, 0]))
}

const removeEmptyFields = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const result = {}

    // Kiểm tra null/undefined
    if (!obj || typeof obj !== 'object') {
        return result
    }

    Object.keys(obj).forEach(key => {
        // Bỏ qua các field có giá trị null/undefined
        if (obj[key] === null || obj[key] === undefined) {
            return
        }

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const nestedObject = updateNestedObjectParser(obj[key])
            Object.keys(nestedObject).forEach(nestedKey => {
                result[`${key}.${nestedKey}`] = nestedObject[nestedKey]
            })
        } else {
            result[key] = obj[key]
        }
    })

    return result
}

export {
    getDataShop,
    getSelectFields,
    getUnSelectFields,
    removeEmptyFields,
    updateNestedObjectParser
}
