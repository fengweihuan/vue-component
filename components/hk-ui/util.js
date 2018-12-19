import { Notification } from 'element-ui'
import dayjs from 'dayjs'

export const notify = ({title, msg, type = 'info'}) => {
  Notification({
    title: title,
    message: msg,
    type: type
  })
}

export const formatDate = (value, format = 'YYYY-MM-DD HH:mm') => {
  if (value) {
    return dayjs(+value).format(format)
  }
}
