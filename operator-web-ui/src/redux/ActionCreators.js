import * as ActionTypes from './ActionTypes'
import { REST_ADDRESS, REST_AUTH_HEADER, REST_CERT } from '../shared/Rest'
import { Agent } from 'https'

// operators

const myAgent = new Agent({
    ca: [REST_CERT]
})

export const fetchOperators = () => (dispatch) => {
    dispatch(operatorsLoading(true))

    return fetch(REST_ADDRESS + 'operator', {
        method: 'GET',
        headers: new Headers({
            "Accept": "application/json",
            "Authorization": REST_AUTH_HEADER
        }),
        agent: myAgent,
        credentials: "same-origin"
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
