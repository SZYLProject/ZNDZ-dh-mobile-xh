import { get, post } from '../http'
const guidance = {
  apiAddress: p => get('/testing/restful', p),

  apiGetGruidenceDataSelect: p => post('/v1/gruidenceDataSelect', p),
  getNumberGruidence: p => post('/v1/getNumberGruidence', p)
}

export default guidance
