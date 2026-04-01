import _ from "lodash"

const getDataShop = ({ fields = [], object = {} }) => _.pick(object, fields)

const getSelectFields = ({ fields = [] }) => {
    return Object.fromEntries(fields.map((field) => [field, 1]))
}
export  {
    getDataShop,
    getSelectFields
}
