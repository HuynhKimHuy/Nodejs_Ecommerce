import _ from "lodash"

const getDataShop = ({ fields = [], object = {} }) => _.pick(object, fields)

const getSelectFields = ({ fields = [] }) => {
    return Object.fromEntries(fields.map((field) => [field, 1]))
}

const getUnSelectFields = ({ fields = [] }) => {
    return Object.fromEntries(fields.map((field) => [field, 0]))
}

export  {
    getDataShop,
    getSelectFields,
    getUnSelectFields
}
