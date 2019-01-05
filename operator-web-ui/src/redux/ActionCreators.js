import * as ActionTypes from './ActionTypes'
import { REST_ADDRESS, REST_AUTH_HEADER, REST_CERT } from '../shared/Rest'
import https from 'https'

// operators

const myAgent = new https.Agent({
    cert: REST_CERT,
    ca: [REST_CERT],
    rejectUnauthorized: false
})

export const fetchOperators = () => (dispatch) => {
    dispatch(operatorsLoading(true))

    return fetch(REST_ADDRESS + 'operator', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Authorization': REST_AUTH_HEADER,
            'Accept': 'application/json'
        },
        cert: REST_CERT,
        agent: myAgent,
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                return response
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        }, error => {
            var errmess = new Error(error.message)
            throw errmess
        })
        .then(response => response.json())
        .then(operators => dispatch(addOperators(operators)))
        .catch(error => dispatch(operatorsFailed(error.message)))
}

export const operatorsLoading = () => ({
    type: ActionTypes.OPERATORS_LOADING
})

export const operatorsFailed = (errmess) => ({
    type: ActionTypes.OPERATORS_FAILED,
    payload: errmess
})

export const addOperators = (operators) => ({
    type: ActionTypes.ADD_OPERATORS,
    payload: operators
})
