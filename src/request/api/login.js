import { post } from '../http'
const login = {
  apiPostUserLogin: p => post('/v1/userLogin', p)
}

export default login
