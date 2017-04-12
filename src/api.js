import axios from 'axios'

let isProd = process.env.NODE_ENV === 'production'
const service = axios.create({
  baseURL: isProd ? 'https://api-prod.wallstreetcn.com/apiv1/' : 'https://api-sit.wallstreetcn.com/apiv1/'
})
export default {
  getArticle(id, params = { extract: 1}) {
    return service.get(`content/articles/${id}`, { params }).then(res => res.data)
  }
}
